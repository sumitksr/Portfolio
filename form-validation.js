document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const submitBtn = document.getElementById('submit-btn');
  const formfields = document.querySelectorAll('.formfield');
  let currentPosition = 0; // Track the current position in the sequence
  let notificationTimeout;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'form-notification';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.style.transform = 'translateY(100px)';
  notification.style.transition = 'transform 0.3s ease';
  notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  document.body.appendChild(notification);
  
  // Check if all fields are filled
  function areAllFieldsFilled() {
    let allFilled = true;
    let emptyFields = [];
    
    formfields.forEach(field => {
      if (!field.value.trim()) {
        allFilled = false;
        emptyFields.push(field.placeholder.replace('Enter your ', ''));
      }
    });
    
    if (!allFilled) {
      showNotification(`Please fill in: ${emptyFields.join(', ')}`);
    }
    
    return allFilled;
  }
  
  // Show notification
  function showNotification(message) {
    clearTimeout(notificationTimeout);
    notification.textContent = message;
    notification.style.transform = 'translateY(0)';
    
    notificationTimeout = setTimeout(() => {
      notification.style.transform = 'translateY(100px)';
    }, 3000);
  }
  
  // Define the movement sequence - 200px in each direction
  const moveSequence = [
    { x: 0, y: -200 },     // Up
    { x: 200, y: 0 },      // Right
    { x: 0, y: 200 },      // Down
    { x: -200, y: 0 }      // Left
  ];
  
  // Get the next position in sequence
  function getNextPosition() {
    // Move to the next position in the sequence
    currentPosition = (currentPosition + 1) % moveSequence.length;
    return moveSequence[currentPosition];
  }
  
  // Store the button's original position
  let originalPosition = { x: 0, y: 0 };
  let buttonElement = null;
  
  // Handle hover on submit button
  submitBtn.addEventListener('mouseenter', function(e) {
    if (!areAllFieldsFilled()) {
      // Get the button element if we don't have it yet
      if (!buttonElement) {
        buttonElement = e.target;
      }
      
      // Get the next position in the sequence
      const nextPosition = getNextPosition();
      
      // Move the button to the next position
      submitBtn.style.transform = `translate(${nextPosition.x}px, ${nextPosition.y}px)`;
    } else {
      // Reset position if the form is filled
      submitBtn.style.transform = 'translate(0, 0)';
    }
  });
  
  // Reset the button position when mouse leaves
  submitBtn.addEventListener('mouseleave', function() {
    if (areAllFieldsFilled()) {
      submitBtn.style.transform = 'translate(0, 0)';
    }
  });
  
  // Listen for input in any form field
  formfields.forEach(field => {
    field.addEventListener('input', function() {
      if (areAllFieldsFilled()) {
        submitBtn.style.transform = 'translate(0, 0)';
        currentPosition = 0; // Reset position sequence
      }
    });
  });
  
  // Handle form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      if (!areAllFieldsFilled()) {
        e.preventDefault();
        showNotification('Please fill in all fields before submitting!');
      } else {
        // No need for backend - just redirect to thank-you page
        e.preventDefault();
        
        // Show a brief sending message
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate a brief delay to show the sending state (500ms)
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 500);
      }
    });
  }
}); 