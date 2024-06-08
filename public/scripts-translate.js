document.addEventListener('DOMContentLoaded', () => {
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
            errorMessage: 'Error occurred',
            traineesTitle: 'Trainees Database',
            fullNameHeader: 'Full Name',
            ageHeader: 'Age',
            genderHeader: 'Gender',
            placeOfBirthHeader: 'Place of Birth',
            affiliationNumberHeader: 'Affiliation Number',
            contactNumberHeader: 'Contact Number',
            cardPicHeader: 'Card Picture',
            actionsHeader: 'Actions',
            editTraineeTitle: 'Edit Trainee',
            saveChangesButton: 'Save Changes',
            deleteSuccessMessage: 'Deleted Successfully',
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
            errorMessage: 'حدث خطأ',
            traineesTitle: 'قاعدة بيانات المتدربين',
            fullNameHeader: 'الاسم الكامل',
            ageHeader: 'العمر',
            genderHeader: 'الجنس',
            placeOfBirthHeader: 'مكان الولادة',
            affiliationNumberHeader: 'رقم الانتساب',
            contactNumberHeader: 'رقم الاتصال',
            cardPicHeader: 'صورة البطاقة',
            actionsHeader: 'الإجراءات',
            editTraineeTitle: 'تعديل المتدرب',
            saveChangesButton: 'حفظ التغييرات',
            deleteSuccessMessage: 'تم الحذف بنجاح',
            errorMessage: 'حدث خطأ'
        }
    };

    document.getElementById('en').addEventListener('click', () => {
        translate('en');
    });

    document.getElementById('ar').addEventListener('click', () => {
        translate('ar');
    });

    function translate(lang) {
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = translations[lang][key];
        });
    }
});
