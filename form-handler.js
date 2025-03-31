document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Only proceed if all fields are filled - the validation.js script should handle this check
      const formData = new FormData(contactForm);
      const formEntries = Object.fromEntries(formData.entries());
      
      // Display loading state
      const submitBtn = document.getElementById('submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      // Send the data to the server
      fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formEntries)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // If redirect URL is provided, navigate to it
          if (data.redirect) {
            window.location.href = data.redirect;
            return;
          }
          
          // Otherwise show success message and reset form
          showFormMessage(true, data.message);
          contactForm.reset();
        } else {
          // Show error message
          showFormMessage(false, data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showFormMessage(false, 'There was an error sending your message. Please try again later.');
      })
      .finally(() => {
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
    });
  }
  
  // Function to show success/error messages
  function showFormMessage(isSuccess, message) {
    // Create or get message element
    let messageElement = document.getElementById('form-message');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.id = 'form-message';
      messageElement.style.padding = '15px';
      messageElement.style.marginTop = '20px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.fontWeight = '500';
      messageElement.style.textAlign = 'center';
      
      // Insert after the form
      contactForm.after(messageElement);
    }
    
    // Set message style based on success/error
    messageElement.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
    messageElement.style.color = isSuccess ? '#155724' : '#721c24';
    messageElement.style.border = isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    
    // Set message content
    messageElement.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageElement.style.opacity = '0';
      messageElement.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        messageElement.remove();
      }, 500);
    }, 5000);
  }
}); 