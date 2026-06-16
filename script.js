document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Sending Request... Please wait.';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      
      // Combine wardrobe types into a single string for the email
      const wardrobeTypes = [];
      form.querySelectorAll('input[name="wardrobe-type"]:checked').forEach(cb => {
        wardrobeTypes.push(cb.value);
      });
      formData.set('Wardrobe Type', wardrobeTypes.join(', '));

      // Submit directly to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });



      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Failed to send request. Server returned status: " + response.status);
      }

      if (data.success) {
        alert('Your buyout quote request has been sent successfully! We will get back to you within 2 hours.');
        form.reset();
      } else {
        throw new Error(data.message || 'Failed to send request.');
      }

    } catch (err) {
      console.error(err);
      alert('Error from Web3Forms: ' + err.message);
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });

});
