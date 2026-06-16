import { upload } from 'https://esm.sh/@vercel/blob/client';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button to prevent double-submit
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Uploading images... Please wait.';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Handle multiple checkboxes for wardrobe type properly
      const wardrobeTypes = [];
      form.querySelectorAll('input[name="wardrobe-type"]:checked').forEach(cb => {
        wardrobeTypes.push(cb.value);
      });
      data['Wardrobe Type'] = wardrobeTypes.join(', ');

      // Handle file uploads to Vercel Blob
      const fileInput = document.getElementById('photos');
      const files = fileInput.files;
      const uploadedUrls = [];

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          submitBtn.innerText = `Uploading image ${i + 1} of ${files.length}...`;
          
          // Use client upload to securely bypass serverless payload limits
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
          
          uploadedUrls.push(newBlob.url);
        }
      }

      data.images = uploadedUrls;

      // Submit the final payload to our email handler
      submitBtn.innerText = 'Sending Request...';

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send request.');
      }

      // Success
      alert('Your buyout quote request has been sent successfully! We will review the images and get back to you within 2 hours.');
      form.reset();

    } catch (err) {
      console.error(err);
      alert('There was an error submitting the form. Please try again or contact us directly.');
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
});
