document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Processing images... Please wait.';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const wardrobeTypes = [];
      form.querySelectorAll('input[name="wardrobe-type"]:checked').forEach(cb => {
        wardrobeTypes.push(cb.value);
      });
      data['Wardrobe Type'] = wardrobeTypes.join(', ');

      const fileInput = document.getElementById('photos');
      const files = fileInput.files;
      const attachments = [];

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          submitBtn.innerText = `Attaching image ${i + 1} of ${files.length}...`;
          
          // Convert file to Base64 to attach directly to email
          const base64String = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
          });

          attachments.push({
            filename: file.name,
            content: base64String
          });
        }
      }

      data.attachments = attachments;

      submitBtn.innerText = 'Sending Request...';

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send request.');
      }

      alert('Your buyout quote request has been sent successfully! We will get back to you within 2 hours.');
      form.reset();

    } catch (err) {
      console.error(err);
      alert('There was an error submitting the form. Please make sure you have added your Resend API Key in Vercel Settings.');
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
});
