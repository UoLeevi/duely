import axios from 'axios';

const emailServiceBaseUrl = new URL('http://duely-email-service:8080/');

export type SendEmailOptions = {
  from?: string;
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
};

export async function sendEmail({
  template,
  context,
  ...options
}: SendEmailOptions): Promise<{ success: true; id: string }> {
  template = encodeURIComponent(template);
  const url = new URL(`send/${template}`, emailServiceBaseUrl);
  const res = await axios.post(url.href, { context, ...options });
  return res.data;
}

export type PreviewEmailOptions = {
  template: string;
  context?: Record<string, any>;
};

export async function previewEmail({
  template,
  context,
  ...options
}: PreviewEmailOptions): Promise<{ success: true; id: string }> {
  template = encodeURIComponent(template);
  const url = new URL(`preview/${template}`, emailServiceBaseUrl);
  const res = await axios.post(url.href, { ...context, ...options });
  return res.data;
}
