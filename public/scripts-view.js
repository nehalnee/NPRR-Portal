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

    fetch('/api/trainees')
        .then(response => response.json())
        .then(data => {
            const traineesTableBody = document.getElementById('traineesTableBody');
            data.forEach(trainee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trainee.fullName}</td>
                    <td>${trainee.age}</td>
                    <td>${trainee.gender}</td>
                    <td>${trainee.placeOfBirth}</td>
                    <td>${trainee.affiliationNumber}</td>
                    <td>${trainee.number}</td>
                    <td><a href="/uploads/${trainee.cardPic}" target="_blank">View</a></td>
                    <td>
                        <button onclick="editTrainee(${trainee.id})">Edit</button>
                        <button onclick="deleteTrainee(${trainee.id})">Delete</button>
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
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display success message
            location.reload(); // Reload the page
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the trainee info.');
        });
    });
});

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

            document.getElementById('editTraineeModal').style.display = 'block';
        });
}

function deleteTrainee(id) {
    if (confirm('Are you sure you want to delete this trainee?')) {
        fetch('/trainees/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display success message
            location.reload(); // Reload the page
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the trainee info.');
        });
    }
}

function closeEditModal() {
    document.getElementById('editTraineeModal').style.display = 'none';
}
