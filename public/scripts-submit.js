document.addEventListener('DOMContentLoaded', function() {
    const enButton = document.getElementById('en');
    const arButton = document.getElementById('ar');

    enButton.addEventListener('click', () => {
        document.documentElement.lang = 'en';
        translate('en');
    });

    arButton.addEventListener('click', () => {
        document.documentElement.lang = 'ar';
        translate('ar');
    });

    document.getElementById('submitForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('/api/trainees/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showModal('successModal');
            } else {
                showModal('errorModal');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('errorModal');
        });
    });
});

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);
}

function translate(lang) {
    const elements = document.querySelectorAll('[data-lang]');
    const translations = {
        en: {
            submitTitle: 'Submit Trainee Information',
            fullNameLabel: 'Full Name',
            ageLabel: 'Age',
            genderLabel: 'Gender',
            placeOfBirthLabel: 'Place of Birth',
            affiliationNumberLabel: 'Affiliation Number',
            contactNumberLabel: 'Contact Number',
            cardPicLabel: 'Card Picture or PDF',
            submitButton: 'Submit',
            submitSuccessMessage: 'Submitted Successfully',
            errorMessage: 'Error occurred'
        },
        ar: {
            submitTitle: 'تقديم معلومات المتدرب',
            fullNameLabel: 'الاسم الكامل',
            ageLabel: 'العمر',
            genderLabel: 'الجنس',
            placeOfBirthLabel: 'مكان الولادة',
            affiliationNumberLabel: 'رقم الانتساب',
            contactNumberLabel: 'رقم الاتصال',
            cardPicLabel: 'صورة البطاقة أو PDF',
            submitButton: 'إرسال',
            submitSuccessMessage: 'تم الإرسال بنجاح',
            errorMessage: 'حدث خطأ'
        }
    };

    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        element.textContent = translations[lang][key];
    });
}
