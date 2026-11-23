export interface ContactSubmissionPayload {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  companySize: string;
  location: string;
  message: string;
  acceptedPrivacy: boolean;
  submittedAt: string;
}

export interface ContactSubmissionResult {
  ok: boolean;
  mode: 'live' | 'demo';
  referenceId: string;
  notice: string;
}

/**
 * Clean backend-ready contact submission handler.
 * Set VITE_CONTACT_ENDPOINT (e.g. a Supabase Edge Function URL) in your environment
 * to route inquiries to a live backend. When unconfigured, runs transparently in demo mode.
 */
export async function submitContactInquiry(
  payload: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
  const referenceId = `IWON-${Date.now().toString(36).toUpperCase()}`;

  if (endpoint && endpoint.trim().length > 0) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, referenceId }),
    });

    if (!response.ok) {
      throw new Error(`Submission failed (${response.status}). Please try again.`);
    }

    return {
      ok: true,
      mode: 'live',
      referenceId,
      notice: 'Your inquiry has been received by the IWON- team.',
    };
  }

  // Simulated async latency for demo mode without claiming real email delivery
  await new Promise((resolve) => window.setTimeout(resolve, 450));

  return {
    ok: true,
    mode: 'demo',
    referenceId,
    notice:
      'Demo mode active: no backend endpoint is configured, so your inquiry was validated locally and no real email was sent. Configure VITE_CONTACT_ENDPOINT to connect Supabase or your API.',
  };
}
