document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/trainees')
        .then(response => response.json())
        .then(data => {
            const trainees = data.trainees;
            const traineesTableBody = document.getElementById('traineesTableBody');
            trainees.forEach(trainee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trainee.fullName}</td>
                    <td>${trainee.age}</td>
                    <td>${trainee.gender}</td>
                    <td>${trainee.placeOfBirth}</td>
                    <td>${trainee.affiliationNumber}</td>
                    <td>${trainee.number}</td>
                    <td><a href="${trainee.cardPic}" target="_blank">View</a></td>
                    <td>
                        <button onclick="editTrainee(${trainee.id})">Edit</button>
                        <button onclick="deleteTrainee(${trainee.id})">Delete</button>
                    </td>
                `;
                traineesTableBody.appendChild(row);
            });
        });

    // Function to edit a trainee
    window.editTrainee = function(id) {
        fetch(`/api/trainees`)
            .then(response => response.json())
            .then(data => {
                const trainee = data.trainees.find(t => t.id == id);
                document.getElementById('editTraineeId').value = trainee.id;
                document.getElementById('editFullName').value = trainee.fullName;
                document.getElementById('editAge').value = trainee.age;
                document.getElementById('editGender').value = trainee.gender;
                document.getElementById('editPlaceOfBirth').value = trainee.placeOfBirth;
                document.getElementById('editAffiliationNumber').value = trainee.affiliationNumber;
                document.getElementById('editNumber').value = trainee.number;
                document.getElementById('editCardPic').value = '';
                document.getElementById('editTraineeModal').style.display = 'block';
            });
    };

    // Function to delete a trainee
    window.deleteTrainee = function(id) {
        if (confirm('Are you sure you want to delete this trainee?')) {
            fetch(`/delete-trainee/${id}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'success') {
                        location.reload();
                    } else {
                        alert('An error occurred while deleting the trainee.');
                    }
                });
        }
    };

    // Close edit modal
    window.closeEditModal = function() {
        document.getElementById('editTraineeModal').style.display = 'none';
    };

    // Handle form submission for editing a trainee
    document.getElementById('editTraineeForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch(`/edit-trainee/${formData.get('id')}`, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('An error occurred while updating the trainee.');
            }
        });
    });

    // Language switch buttons
    document.getElementById('en').addEventListener('click', () => {
        window.location.search = '?lang=en';
    });

    document.getElementById('ar').addEventListener('click', () => {
        window.location.search = '?lang=ar';
    });
});
