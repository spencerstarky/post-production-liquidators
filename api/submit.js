import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.TO_EMAIL || 'your-email@example.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const data = req.body;

  try {
    const emailAttachments = (data.attachments || []).map(file => ({
      filename: file.filename,
      content: file.content
    }));

    const { data: emailData, error } = await resend.emails.send({
      from: 'Liquidators App <onboarding@resend.dev>',
      to: [TO_EMAIL],
      subject: `New Lead: ${data['Production Name'] || 'Quote Request'}`,
      html: `
        <h1>New Quote Request</h1>
        <p>A new buyout request has been submitted through the form.</p>
        <h2>Lead Details</h2>
        <ul>
          ${Object.entries(data)
            .filter(([key]) => key !== 'attachments')
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value || 'N/A'}</li>`)
            .join('')}
        </ul>
        <p><em>Any uploaded images have been attached directly to this email.</em></p>
      `,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined
    });

    if (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ success: true, emailData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
