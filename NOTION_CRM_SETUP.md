# IWON- Contact Form -> Notion CRM Setup Guide

This project connects the IWON- contact form (`src/components/Contact.tsx`) to a Notion CRM database via a Supabase Edge Function (`supabase/functions/submit-contact/index.ts`).

**Architecture:**
`Browser Contact Form -> Supabase Edge Function (submit-contact) -> Notion API`

The Notion integration token is stored strictly in Supabase Edge Function secrets and is never exposed to the browser.

---

## 1. Notion Integration & Database Sharing

1. Target Notion CRM database ID: `4219d202bdc08061a018f501694ab974` (`Avinash's Space`).
2. Create or open your internal integration in Notion (`https://www.notion.so/my-integrations`) and copy the **Internal Integration Secret** (`NOTION_TOKEN`).
3. Open the CRM database in Notion -> click **`•••`** (top right) -> **Connections** -> **Connect to** -> select your integration so it has permission to read the schema and insert pages.

### Recommended Notion Database Columns

The Edge Function automatically inspects `GET /v1/databases/{id}` (`Notion-Version: 2022-06-28`) and maps fields to your database's existing column names/types:

| Inquiry Field | Recommended Notion Property Name | Supported Notion Property Types |
| --- | --- | --- |
| Customer's full name | `Name` or `Full Name` | `title` (required by Notion) |
| Email | `Email` | `email` or `rich_text` |
| Company | `Company` | `rich_text` or `select` |
| Service required | `Service required` | `select` or `rich_text` |
| Company size | `Company size` | `select` or `rich_text` |
| Location | `Location` | `select` or `rich_text` |
| Message | `Message` | `rich_text` |
| Status (`New`) | `Status` | `status` (with a `New` option) or `select` |
| Submission date/time | `Submission date` | `date` (or `created_time`, handled automatically) |

---

## 2. Configure Supabase Secrets

Link your local workspace to your Supabase project (if not already linked):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Set the required server-side secrets (never commit or put these in `VITE_*` variables):

```bash
supabase secrets set \
  NOTION_TOKEN="ntn_your_real_notion_integration_secret" \
  NOTION_DATABASE_ID="4219d202bdc08061a018f501694ab974" \
  ALLOWED_ORIGINS="https://your-production-domain.com,https://www.your-production-domain.com"
```

---

## 3. Deploy the Supabase Edge Function

Deploy `submit-contact` (CORS, validation, honeypot, and rate limiting are handled inside `index.ts`):

```bash
supabase functions deploy submit-contact
```

---

## 4. Configure Frontend Environment Variables

In your `.env` (local) and hosting provider environment settings, set only the public Supabase client variables:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

Optional override for local Supabase CLI emulation (`supabase functions serve submit-contact`):

```env
VITE_CONTACT_ENDPOINT="http://127.0.0.1:54321/functions/v1/submit-contact"
```

---

## 5. Test & Confirm Submissions

1. Submit the `#contact` form on the site with valid details.
2. Confirm the response returns HTTP `201` with `{ ok: true, referenceId, notionPageId }` and that the form resets after success.
3. Open your Notion database (`4219d202bdc08061a018f501694ab974`) and confirm the new row appears with `Status = New` and all mapped fields populated.
