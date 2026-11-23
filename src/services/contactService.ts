export interface ContactSubmissionPayload {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  service_required: string;
  company_size: string;
  location: string;
  message: string;
  website?: string;
}

export interface ContactSubmissionResult {
  ok: true;
  referenceId: string;
  submittedAt: string;
  notice: string;
}

export class ContactSubmissionError extends Error {
  code: string;
  status?: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    code = 'SUBMISSION_ERROR',
    status?: number,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ContactSubmissionError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface EdgeFunctionSuccessBody {
  ok?: boolean;
  referenceId?: string;
  submittedAt?: string;
  message?: string;
  error?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

const REQUEST_TIMEOUT_MS = 15000;

function resolveContactEndpoint(): string | null {
  const customEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim();
  if (customEndpoint) {
    return customEndpoint;
  }

  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/+$/, '')}/functions/v1/submit-contact`;
  }

  return null;
}

/**
 * Submits the IWON- contact inquiry to the Supabase `submit-contact` Edge Function,
 * which validates input and writes the lead into the Notion CRM database server-side.
 */
export async function submitContactInquiry(
  payload: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  const endpoint = resolveContactEndpoint();

  if (!endpoint) {
    throw new ContactSubmissionError(
      'Contact service is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_CONTACT_ENDPOINT) to connect the Supabase Edge Function.',
      'NOT_CONFIGURED'
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    window.clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ContactSubmissionError(
        'The request timed out while reaching our server. Please check your connection and try again.',
        'TIMEOUT_ERROR'
      );
    }
    throw new ContactSubmissionError(
      'Network error while sending your message. Please check your internet connection and try again.',
      'NETWORK_ERROR'
    );
  }

  window.clearTimeout(timeoutId);

  let data: EdgeFunctionSuccessBody = {};
  try {
    data = (await response.json()) as EdgeFunctionSuccessBody;
  } catch {
    data = {};
  }

  if (!response.ok || data.ok !== true) {
    const code = data.code ?? `HTTP_${response.status}`;
    const fallbackMessage =
      response.status === 429
        ? 'Too many inquiries were sent recently. Please wait a few minutes and try again.'
        : response.status >= 500
          ? 'Our CRM service encountered a server error. Please try again shortly.'
          : `Unable to submit your inquiry (${response.status}). Please review your entries and try again.`;

    throw new ContactSubmissionError(
      data.error && data.error.trim().length > 0 ? data.error : fallbackMessage,
      code,
      response.status,
      data.fieldErrors
    );
  }

  return {
    ok: true,
    referenceId: data.referenceId ?? `IWON-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: data.submittedAt ?? new Date().toISOString(),
    notice:
      data.message ??
      'Thank you. Your project inquiry has been logged and our team will respond within 24 hours.',
  };
}
