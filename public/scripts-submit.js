document.addEventListener('DOMContentLoaded', function() {
    const languageSwitch = document.getElementById('language-switch');
    const enButton = document.getElementById('en');
    const arButton = document.getElementById('ar');

    enButton.addEventListener('click', () => {
        document.documentElement.lang = 'en';
        // Translate text content to English
    });

    arButton.addEventListener('click', () => {
        document.documentElement.lang = 'ar';
        // Translate text content to Arabic
    });

    const form = document.getElementById('traineeForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        fetch('/api/trainees/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display success message
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        });
    });
});
