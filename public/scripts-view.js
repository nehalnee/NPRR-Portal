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

    fetch('/api/trainees')
        .then(response => response.json())
        .then(data => {
            const traineesTableBody = document.querySelector('#traineesTable tbody');
            data.forEach(trainee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trainee.fullName}</td>
                    <td>${trainee.age}</td>
                    <td>${trainee.gender}</td>
                    <td>${trainee.placeOfBirth}</td>
                    <td>${trainee.affiliationNumber}</td>
                    <td>${trainee.number}</td>
                    <td><img src="/uploads/${trainee.cardPic}" alt="${trainee.fullName}'s card" style="max-width: 100px; cursor: pointer;" onclick="openImageInNewTab('/uploads/${trainee.cardPic}')"></td>
                    <td>
                        <button onclick="editTrainee(${trainee.id})" class="action-btn">Edit</button>
                        <button onclick="showConfirmDeleteModal(${trainee.id})" class="action-btn">Delete</button>
                    </td>
                `;
                traineesTableBody.appendChild(row);
            });
        });

    document.getElementById('editTraineeForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('/trainees/edit', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('successfully')) {
                showModal('editSuccessModal');
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

let traineeIdToDelete = null;

function editTrainee(id) {
    fetch(`/api/trainees/${id}`)
        .then(response => response.json())
        .then(trainee => {
            document.getElementById('editTraineeId').value = trainee.id;
            document.getElementById('editFullName').value = trainee.fullName;
            document.getElementById('editAge').value = trainee.age;
            document.getElementById('editGender').value = trainee.gender;
            document.getElementById('editPlaceOfBirth').value = trainee.placeOfBirth;
            document.getElementById('editAffiliationNumber').value = trainee.affiliationNumber;
            document.getElementById('editNumber').value = trainee.number;

            document.getElementById('editModal').style.display = 'block';
        });
}

function showConfirmDeleteModal(id) {
    traineeIdToDelete = id;
    document.getElementById('confirmDeleteModal').style.display = 'block';
}

function closeConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
    traineeIdToDelete = null;
}

function confirmDelete() {
    if (traineeIdToDelete !== null) {
        fetch('/trainees/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: traineeIdToDelete })
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('successfully')) {
                showModal('deleteSuccessModal');
            } else {
                showModal('errorModal');
            }
            closeConfirmDeleteModal();
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('errorModal');
            closeConfirmDeleteModal();
        });
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
        location.reload();
    }, 2000);
}

function openImageInNewTab(src) {
    window.open(src, '_blank');
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
            editSuccessMessage: 'Modified Successfully',
            errorMessage: 'Error occurred',
            confirmDeleteMessage: 'Are you sure you want to delete this trainee?'
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
            editSuccessMessage: 'تم التعديل بنجاح',
            errorMessage: 'حدث خطأ',
            confirmDeleteMessage: 'هل أنت متأكد أنك تريد حذف هذا المتدرب؟'
        }
    };

    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        element.textContent = translations[lang][key];
    });
}
