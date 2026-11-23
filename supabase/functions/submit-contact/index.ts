// deno-lint-ignore-file no-control-regex
// Supabase Edge Function: submit-contact
// Securely validates IWON- website inquiries and creates pages in the Notion CRM database.
// Secrets required (set via `supabase secrets set`):
//   NOTION_TOKEN       - Notion internal integration secret
//   NOTION_DATABASE_ID - Target Notion CRM database ID (4219d202bdc08061a018f501694ab974)
//   ALLOWED_ORIGINS    - Comma-separated allowlist of website origins (e.g. https://iwon.studio,https://www.iwon.studio)

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const SCHEMA_CACHE_TTL_MS = 5 * 60 * 1000;

interface ContactRequestPayload {
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  company?: unknown;
  service_required?: unknown;
  company_size?: unknown;
  location?: unknown;
  message?: unknown;
  website?: unknown;
}

interface ValidatedContactData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  company: string;
  serviceRequired: string;
  companySize: string;
  location: string;
  message: string;
  submittedAt: string;
}

interface NotionPropertySchema {
  id: string;
  name: string;
  type: string;
  select?: { options?: Array<{ name: string }> };
  status?: { options?: Array<{ name: string }> };
}

interface CachedSchema {
  databaseId: string;
  fetchedAt: number;
  properties: Record<string, NotionPropertySchema>;
}

const ipHits = new Map<string, number[]>();
const recentSignatures = new Map<string, number>();
let cachedSchema: CachedSchema | null = null;

function parseAllowedOrigins(): string[] {
  const raw = Deno.env.get('ALLOWED_ORIGINS') ?? '';
  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

function isLocalDevOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isPreviewOrigin(origin: string): boolean {
  return /^https:\/\/[a-z0-9-]+\.run\.app$/i.test(origin);
}

function resolveCorsOrigin(requestOrigin: string | null): {
  allowed: boolean;
  allowOriginHeader: string | null;
} {
  if (!requestOrigin) {
    // Non-browser health check or direct server invocation without Origin header
    return { allowed: true, allowOriginHeader: null };
  }

  const normalizedOrigin = requestOrigin.trim().replace(/\/+$/, '');
  const configuredOrigins = parseAllowedOrigins();

  if (configuredOrigins.length > 0) {
    if (configuredOrigins.includes(normalizedOrigin)) {
      return { allowed: true, allowOriginHeader: normalizedOrigin };
    }
    const allowLocal = (Deno.env.get('ALLOW_LOCAL_DEV_ORIGINS') ?? 'true').toLowerCase() !== 'false';
    if (allowLocal && isLocalDevOrigin(normalizedOrigin)) {
      return { allowed: true, allowOriginHeader: normalizedOrigin };
    }
    return { allowed: false, allowOriginHeader: null };
  }

  // Fallback before ALLOWED_ORIGINS is explicitly set: permit local dev & Cloud Run preview origins only
  if (isLocalDevOrigin(normalizedOrigin) || isPreviewOrigin(normalizedOrigin)) {
    return { allowed: true, allowOriginHeader: normalizedOrigin };
  }

  return { allowed: false, allowOriginHeader: null };
}

function buildCorsHeaders(allowOriginHeader: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  };

  if (allowOriginHeader) {
    headers['Access-Control-Allow-Origin'] = allowOriginHeader;
  }

  return headers;
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  corsHeaders: Record<string, string>,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

const CONTROL_CHARS_PRESERVE_NEWLINES = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');
const CONTROL_CHARS_ALL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

function sanitizeText(value: unknown, preserveNewlines = false): string {
  if (typeof value !== 'string') return '';
  const regex = preserveNewlines ? CONTROL_CHARS_PRESERVE_NEWLINES : CONTROL_CHARS_ALL;
  return value.replace(regex, ' ').trim();
}

function validatePayload(raw: ContactRequestPayload): {
  data?: ValidatedContactData;
  fieldErrors?: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const firstName = sanitizeText(raw.first_name);
  const lastName = sanitizeText(raw.last_name);
  const email = sanitizeText(raw.email).toLowerCase();
  const company = sanitizeText(raw.company);
  const serviceRequired = sanitizeText(raw.service_required);
  const companySize = sanitizeText(raw.company_size);
  const location = sanitizeText(raw.location);
  const message = sanitizeText(raw.message, true);

  if (!firstName) {
    fieldErrors.first_name = 'First name is required.';
  } else if (firstName.length > 80) {
    fieldErrors.first_name = 'First name must be 80 characters or fewer.';
  }

  if (!lastName) {
    fieldErrors.last_name = 'Last name is required.';
  } else if (lastName.length > 80) {
    fieldErrors.last_name = 'Last name must be 80 characters or fewer.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email) {
    fieldErrors.email = 'Email address is required.';
  } else if (email.length > 160 || !emailRegex.test(email)) {
    fieldErrors.email = 'Please provide a valid email address.';
  }

  if (!company) {
    fieldErrors.company = 'Company name is required.';
  } else if (company.length > 120) {
    fieldErrors.company = 'Company name must be 120 characters or fewer.';
  }

  if (!serviceRequired) {
    fieldErrors.service_required = 'Service required is mandatory.';
  } else if (serviceRequired.length > 100) {
    fieldErrors.service_required = 'Service selection exceeds maximum length.';
  }

  if (!companySize) {
    fieldErrors.company_size = 'Company size is required.';
  } else if (companySize.length > 60) {
    fieldErrors.company_size = 'Company size exceeds maximum length.';
  }

  if (!location) {
    fieldErrors.location = 'Location is required.';
  } else if (location.length > 100) {
    fieldErrors.location = 'Location exceeds maximum length.';
  }

  if (!message) {
    fieldErrors.message = 'Project message is required.';
  } else if (message.length < 10) {
    fieldErrors.message = 'Project message must be at least 10 characters.';
  } else if (message.length > 500) {
    fieldErrors.message = 'Project message must be 500 characters or fewer.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return {
    data: {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      company,
      serviceRequired,
      companySize,
      location,
      message,
      submittedAt: new Date().toISOString(),
    },
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(clientIp: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (ipHits.get(clientIp) ?? []).filter((ts) => ts > cutoff);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    ipHits.set(clientIp, recent);
    return { limited: true, retryAfterSec };
  }

  recent.push(now);
  ipHits.set(clientIp, recent);

  // Opportunistic cleanup for expired IP buckets
  if (ipHits.size > 500) {
    for (const [ip, hits] of ipHits.entries()) {
      const valid = hits.filter((ts) => ts > cutoff);
      if (valid.length === 0) ipHits.delete(ip);
      else ipHits.set(ip, valid);
    }
  }

  return { limited: false, retryAfterSec: 0 };
}

async function computeSubmissionHash(data: ValidatedContactData): Promise<string> {
  const raw = [
    data.email,
    data.company.toLowerCase(),
    data.serviceRequired.toLowerCase(),
    data.message.toLowerCase(),
  ].join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isDuplicateSubmission(hash: string): boolean {
  const now = Date.now();
  const cutoff = now - DUPLICATE_WINDOW_MS;

  for (const [key, ts] of recentSignatures.entries()) {
    if (ts <= cutoff) recentSignatures.delete(key);
  }

  const existing = recentSignatures.get(hash);
  return typeof existing === 'number' && existing > cutoff;
}

function recordSubmissionHash(hash: string): void {
  recentSignatures.set(hash, Date.now());
}

function normalizePropertyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findMatchingProperty(
  properties: Record<string, NotionPropertySchema>,
  aliases: string[],
  preferredTypes?: string[]
): NotionPropertySchema | undefined {
  const entries = Object.entries(properties).map(([key, schema]) => ({
    ...schema,
    name: schema.name || key,
    normalized: normalizePropertyName(schema.name || key),
  }));

  for (const alias of aliases) {
    const exact = entries.find((entry) => entry.normalized === alias);
    if (exact) return exact;
  }

  for (const alias of aliases) {
    const partial = entries.find((entry) => entry.normalized.includes(alias));
    if (partial) return partial;
  }

  if (preferredTypes && preferredTypes.length > 0) {
    return entries.find((entry) => preferredTypes.includes(entry.type));
  }

  return undefined;
}

function toNotionRichText(content: string) {
  return {
    rich_text: [
      {
        type: 'text',
        text: { content: content.slice(0, 2000) },
      },
    ],
  };
}

function buildPropertyValue(
  schema: NotionPropertySchema,
  value: string,
  kind: 'title' | 'email' | 'text' | 'select' | 'status' | 'date'
): Record<string, unknown> | null {
  switch (schema.type) {
    case 'title':
      return {
        title: [
          {
            type: 'text',
            text: { content: value.slice(0, 200) },
          },
        ],
      };
    case 'email':
      return { email: value };
    case 'rich_text':
      return toNotionRichText(value);
    case 'select': {
      // Notion API rejects commas in select option names
      const safeOption = value.replace(/,/g, '').trim().slice(0, 100);
      return { select: { name: safeOption } };
    }
    case 'status': {
      const options = schema.status?.options ?? [];
      const exactOption = options.find(
        (opt) => opt.name.toLowerCase() === value.toLowerCase()
      );
      return { status: { name: exactOption ? exactOption.name : value } };
    }
    case 'date':
      return { date: { start: value } };
    case 'multi_select': {
      const safeOption = value.replace(/,/g, '').trim().slice(0, 100);
      return { multi_select: [{ name: safeOption }] };
    }
    case 'created_time':
      // Notion populates created_time automatically and rejects writes to it
      return null;
    default:
      if (kind === 'title') {
        return {
          title: [{ type: 'text', text: { content: value.slice(0, 200) } }],
        };
      }
      return toNotionRichText(value);
  }
}

async function fetchDatabaseSchema(
  notionToken: string,
  databaseId: string
): Promise<Record<string, NotionPropertySchema>> {
  const now = Date.now();
  if (
    cachedSchema &&
    cachedSchema.databaseId === databaseId &&
    now - cachedSchema.fetchedAt < SCHEMA_CACHE_TTL_MS
  ) {
    return cachedSchema.properties;
  }

  const res = await fetch(`${NOTION_API_BASE}/databases/${encodeURIComponent(databaseId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': NOTION_VERSION,
    },
  });

  if (!res.ok) {
    const errorPayload = await res.json().catch(() => ({}));
    const notionCode = typeof errorPayload?.code === 'string' ? errorPayload.code : undefined;
    throw {
      status: res.status,
      notionCode,
      message:
        typeof errorPayload?.message === 'string'
          ? errorPayload.message
          : `Notion database inspection failed (${res.status}).`,
      retryAfter: res.headers.get('retry-after'),
    };
  }

  const db = await res.json();
  const rawProps = (db?.properties ?? {}) as Record<string, NotionPropertySchema>;
  const properties: Record<string, NotionPropertySchema> = {};

  for (const [propName, propVal] of Object.entries(rawProps)) {
    properties[propName] = {
      ...propVal,
      name: propName,
    };
  }

  cachedSchema = {
    databaseId,
    fetchedAt: now,
    properties,
  };

  return properties;
}

function buildNotionPageProperties(
  schema: Record<string, NotionPropertySchema>,
  data: ValidatedContactData
): Record<string, unknown> {
  const properties: Record<string, unknown> = {};

  const assign = (
    matched: NotionPropertySchema | undefined,
    fallbackName: string,
    fallbackType: NotionPropertySchema['type'],
    value: string,
    kind: 'title' | 'email' | 'text' | 'select' | 'status' | 'date'
  ) => {
    const target = matched ?? { id: fallbackName, name: fallbackName, type: fallbackType };
    const built = buildPropertyValue(target, value, kind);
    if (built) {
      properties[target.name] = built;
    }
  };

  // 1. Customer's full name (matches title column or Name / Full Name / Customer Name)
  const nameProp = findMatchingProperty(
    schema,
    ['full name', 'customer name', 'contact name', 'client name', 'name'],
    ['title']
  );
  assign(nameProp, 'Name', 'title', data.fullName, 'title');

  // 2. Email
  const emailProp = findMatchingProperty(
    schema,
    ['email', 'email address', 'work email', 'contact email'],
    ['email']
  );
  assign(emailProp, 'Email', 'email', data.email, 'email');

  // 3. Company
  const companyProp = findMatchingProperty(schema, [
    'company',
    'company name',
    'organization',
    'account',
    'brand',
  ]);
  assign(companyProp, 'Company', 'rich_text', data.company, 'text');

  // 4. Service required
  const serviceProp = findMatchingProperty(schema, [
    'service required',
    'service',
    'services',
    'capability',
  ]);
  assign(serviceProp, 'Service required', 'select', data.serviceRequired, 'select');

  // 5. Company size
  const companySizeProp = findMatchingProperty(schema, [
    'company size',
    'team size',
    'size',
    'headcount',
  ]);
  assign(companySizeProp, 'Company size', 'select', data.companySize, 'select');

  // 6. Location
  const locationProp = findMatchingProperty(schema, [
    'location',
    'region',
    'country',
    'territory',
  ]);
  assign(locationProp, 'Location', 'select', data.location, 'select');

  // 7. Message
  const messageProp = findMatchingProperty(schema, [
    'message',
    'project message',
    'project details',
    'inquiry',
    'brief',
    'notes',
    'description',
  ]);
  assign(messageProp, 'Message', 'rich_text', data.message, 'text');

  // 8. Status = New
  const statusProp = findMatchingProperty(schema, ['status', 'stage', 'lead status'], ['status']);
  assign(statusProp, 'Status', 'status', 'New', 'status');

  // 9. Submission date/time
  const dateProp = findMatchingProperty(
    schema,
    ['submission date', 'submitted at', 'submission time', 'date submitted', 'date'],
    ['date']
  );
  assign(dateProp, 'Submission date', 'date', data.submittedAt, 'date');

  return properties;
}

function mapNotionErrorResponse(
  err: { status?: number; notionCode?: string; message?: string; retryAfter?: string | null },
  corsHeaders: Record<string, string>
): Response {
  const status = err.status ?? 500;

  if (status === 401 || status === 403 || err.notionCode === 'unauthorized' || err.notionCode === 'restricted_resource') {
    return jsonResponse(
      502,
      {
        ok: false,
        code: 'NOTION_PERMISSION_ERROR',
        error:
          'Notion rejected the request due to permissions. Confirm the integration token is valid and the CRM database is shared with the integration.',
      },
      corsHeaders
    );
  }

  if (status === 404 || err.notionCode === 'object_not_found') {
    return jsonResponse(
      502,
      {
        ok: false,
        code: 'NOTION_DATABASE_NOT_FOUND',
        error:
          'Target Notion CRM database was not found. Confirm NOTION_DATABASE_ID is correct and shared with your integration.',
      },
      corsHeaders
    );
  }

  if (status === 429 || err.notionCode === 'rate_limited') {
    const retryAfter = err.retryAfter ?? '30';
    return jsonResponse(
      429,
      {
        ok: false,
        code: 'NOTION_RATE_LIMIT',
        error: 'Too many requests are being processed right now. Please wait a moment and try again.',
      },
      corsHeaders,
      { 'Retry-After': retryAfter }
    );
  }

  if (status === 400 || err.notionCode === 'validation_error') {
    cachedSchema = null;
    return jsonResponse(
      502,
      {
        ok: false,
        code: 'NOTION_SCHEMA_ERROR',
        error:
          'Unable to map inquiry fields to the Notion CRM database schema. Please verify the database columns.',
      },
      corsHeaders
    );
  }

  return jsonResponse(
    502,
    {
      ok: false,
      code: 'NOTION_API_ERROR',
      error: 'The CRM service encountered a temporary upstream error. Please try again shortly.',
    },
    corsHeaders
  );
}

Deno.serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const cors = resolveCorsOrigin(origin);
  const corsHeaders = buildCorsHeaders(cors.allowOriginHeader);

  if (!cors.allowed) {
    return jsonResponse(
      403,
      {
        ok: false,
        code: 'CORS_FORBIDDEN',
        error: 'Requests from this origin are not permitted.',
      },
      corsHeaders
    );
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(
      405,
      {
        ok: false,
        code: 'METHOD_NOT_ALLOWED',
        error: 'Only POST requests are accepted.',
      },
      corsHeaders,
      { Allow: 'POST, OPTIONS' }
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse(
      415,
      {
        ok: false,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        error: 'Content-Type must be application/json.',
      },
      corsHeaders
    );
  }

  let rawBodyText = '';
  try {
    rawBodyText = await req.text();
  } catch {
    return jsonResponse(
      400,
      { ok: false, code: 'INVALID_BODY', error: 'Unable to read request body.' },
      corsHeaders
    );
  }

  const bodyBytes = new TextEncoder().encode(rawBodyText).length;
  if (bodyBytes > MAX_BODY_BYTES) {
    return jsonResponse(
      413,
      {
        ok: false,
        code: 'PAYLOAD_TOO_LARGE',
        error: 'Request payload exceeds the maximum allowed size.',
      },
      corsHeaders
    );
  }

  let parsedBody: ContactRequestPayload;
  try {
    parsedBody = JSON.parse(rawBodyText) as ContactRequestPayload;
  } catch {
    return jsonResponse(
      400,
      { ok: false, code: 'INVALID_JSON', error: 'Request body must be valid JSON.' },
      corsHeaders
    );
  }

  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
    return jsonResponse(
      400,
      { ok: false, code: 'INVALID_JSON', error: 'Request body must be a JSON object.' },
      corsHeaders
    );
  }

  // Honeypot check: silently acknowledge bot submissions without writing to Notion
  if (typeof parsedBody.website === 'string' && parsedBody.website.trim().length > 0) {
    const referenceId = `IWON-${Date.now().toString(36).toUpperCase()}`;
    return jsonResponse(
      200,
      {
        ok: true,
        referenceId,
        message: 'Inquiry received.',
      },
      corsHeaders
    );
  }

  const clientIp = getClientIp(req);
  const rateCheck = checkRateLimit(clientIp);
  if (rateCheck.limited) {
    return jsonResponse(
      429,
      {
        ok: false,
        code: 'RATE_LIMITED',
        error: 'You have submitted several inquiries recently. Please wait a few minutes before trying again.',
      },
      corsHeaders,
      { 'Retry-After': String(rateCheck.retryAfterSec) }
    );
  }

  const { data, fieldErrors } = validatePayload(parsedBody);
  if (!data || fieldErrors) {
    return jsonResponse(
      400,
      {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: 'Please check the highlighted fields and try again.',
        fieldErrors,
      },
      corsHeaders
    );
  }

  const submissionHash = await computeSubmissionHash(data);
  if (isDuplicateSubmission(submissionHash)) {
    return jsonResponse(
      409,
      {
        ok: false,
        code: 'DUPLICATE_SUBMISSION',
        error: 'This inquiry was already submitted recently. Please wait before sending it again.',
      },
      corsHeaders
    );
  }

  const notionToken = Deno.env.get('NOTION_TOKEN')?.trim();
  const databaseId = Deno.env.get('NOTION_DATABASE_ID')?.trim() || '4219d202bdc08061a018f501694ab974';

  if (!notionToken) {
    console.error('submit-contact configuration error: missing NOTION_TOKEN secret.');
    return jsonResponse(
      500,
      {
        ok: false,
        code: 'SERVER_CONFIG_ERROR',
        error: 'Contact service is not configured yet (missing NOTION_TOKEN). Please contact the site administrator.',
      },
      corsHeaders
    );
  }

  try {
    const schema = await fetchDatabaseSchema(notionToken, databaseId);
    const properties = buildNotionPageProperties(schema, data);

    const createRes = await fetch(`${NOTION_API_BASE}/pages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });

    if (!createRes.ok) {
      const errorPayload = await createRes.json().catch(() => ({}));
      const notionCode = typeof errorPayload?.code === 'string' ? errorPayload.code : undefined;
      console.error('Notion page creation failed', {
        status: createRes.status,
        notionCode,
      });
      return mapNotionErrorResponse(
        {
          status: createRes.status,
          notionCode,
          message: typeof errorPayload?.message === 'string' ? errorPayload.message : undefined,
          retryAfter: createRes.headers.get('retry-after'),
        },
        corsHeaders
      );
    }

    const createdPage = await createRes.json();
    recordSubmissionHash(submissionHash);

    const referenceId = `IWON-${Date.now().toString(36).toUpperCase()}`;
    return jsonResponse(
      201,
      {
        ok: true,
        referenceId,
        notionPageId: typeof createdPage?.id === 'string' ? createdPage.id : undefined,
        submittedAt: data.submittedAt,
        message: 'Thank you. Your inquiry has been received and logged with our team.',
      },
      corsHeaders
    );
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const typedErr = err as {
        status?: number;
        notionCode?: string;
        message?: string;
        retryAfter?: string | null;
      };
      console.error('Notion schema lookup failed', {
        status: typedErr.status,
        notionCode: typedErr.notionCode,
      });
      return mapNotionErrorResponse(typedErr, corsHeaders);
    }

    console.error('Unexpected submit-contact error');
    return jsonResponse(
      500,
      {
        ok: false,
        code: 'INTERNAL_SERVER_ERROR',
        error: 'Unable to submit your inquiry due to a server error. Please try again shortly.',
      },
      corsHeaders
    );
  }
});
