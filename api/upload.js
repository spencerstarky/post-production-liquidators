import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate the user here if you need to restrict uploads.
        // For a public contact form, returning an object grants the token.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/avif'],
          // Vercel Blob defaults to a 4.5MB limit, but client uploads can exceed it depending on your tier.
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Run logic after upload finishes (e.g., store URL in database)
        console.log('Blob upload completed:', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
