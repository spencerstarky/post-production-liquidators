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
        alert('Your submission has been sent. A team member will review your form and be in touch shortly. Thank you!');
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

  // Clapboard Scroll Animation & Text Fade
  const topStick = document.querySelector('.top-stick');
  const textWrapper = document.querySelector('.hero-text-wrapper');
  
  window.addEventListener('scroll', () => {
    // Arm closing
    if (topStick) {
      if (window.scrollY > 50) {
        topStick.classList.add('closed');
      } else {
        topStick.classList.remove('closed');
      }
    }
    
    // Text fade on mobile
    if (textWrapper) {
      if (window.innerWidth <= 768) {
        // Fade out between 100px and 220px of scroll
        let opacity = 1 - ((window.scrollY - 100) / 120);
        // Clamp between 0 and 1
        opacity = Math.max(0, Math.min(1, opacity));
        textWrapper.style.opacity = opacity;
      } else {
        textWrapper.style.opacity = 1;
      }
    }
  });

});
