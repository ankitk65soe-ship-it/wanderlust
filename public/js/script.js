// Bootstrap Form Validation
// This script handles client-side form validation for Bootstrap forms
// It checks if forms are valid before allowing submission
// Forms with the 'needs-validation' class will be validated

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission if form is invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Check if form is valid using HTML5 validation API
      if (!form.checkValidity()) {
        // Prevent form submission and stop event propagation
        event.preventDefault()
        event.stopPropagation()
      }

      // Add Bootstrap class to show validation feedback messages
      form.classList.add('was-validated')
    }, false)
  })
})()