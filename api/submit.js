import { Resend } from 'resend';

// Vercel handles standard environment variables. You will set RESEND_API_KEY in the Vercel Dashboard.
const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.TO_EMAIL || 'your-email@example.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const data = req.body;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Liquidators App <onboarding@resend.dev>', // Keep this as onboarding@resend.dev unless you verify a domain in Resend
      to: [TO_EMAIL],
      subject: `New Lead: ${data['Production Name'] || 'Quote Request'}`,
      html: `
        <h1>New Quote Request</h1>
        <p>A new buyout request has been submitted through the form.</p>
        <h2>Lead Details</h2>
        <ul>
          ${Object.entries(data)
            .filter(([key]) => key !== 'images')
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value || 'N/A'}</li>`)
            .join('')}
        </ul>
        <h2>Uploaded Images</h2>
        ${
          data.images && data.images.length > 0
            ? data.images.map((url) => `<div style="margin-bottom: 20px;"><a href="${url}">${url}</a><br><img src="${url}" style="max-width: 400px; max-height: 400px; margin-top: 10px;" /></div>`).join('')
            : '<p>No images uploaded.</p>'
        }
      `,
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
