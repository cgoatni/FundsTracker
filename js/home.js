document.addEventListener('DOMContentLoaded', function() {
    fetchRecentActivity();
    fetchMembers();
    updateTotalGold();
    updateTotalMembers();
});

function fetchRecentActivity() {
    fetch('/recentActivity')
        .then(response => response.json())
        .then(data => {
            populateRecentActivity(data);
        })
        .catch(error => {
            console.error('Error fetching recent activity:', error);
        });
}

function fetchMembers() {
    fetch('/members')
        .then(response => response.json())
        .then(data => {
            populateMembers(data);
        })
        .catch(error => {
            console.error('Error fetching members:', error);
        });
}

function populateRecentActivity(recentActivity) {
    let recentActivitySTR = document.getElementById('recentActivity');
    recentActivitySTR.innerHTML = '';
    for (let i = 0; i < recentActivity.length; i++) {
        recentActivitySTR.innerHTML += `
            <tr>
                <td scope="row">${recentActivity[i].name}</td>
                <td>${recentActivity[i].activity}</td>
                <td>${recentActivity[i].category}</td>
                <td>${recentActivity[i].amount.toLocaleString()}</td>
                <td>${recentActivity[i].date}</td>
            </tr>
        `;
    }
}

function populateMembers(members) {
    let membersSTR = document.getElementById('members');
    membersSTR.innerHTML = '';
    for (let i = 0; i < members.length; i++) {
        membersSTR.innerHTML += `
            <tr>
                <td scope="row">${members[i].name}</td>
                <td>${members[i].class}</td>
                <td>${members[i].type}</td>
                <td>${members[i].level}</td>
                <td>
                    <button class="btn btn-primary" onclick="editMember('${members[i]._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="confirmDeleteMember('${members[i]._id}')">Delete</button>
                </td>
            </tr>
        `;
    }
    updateTotalMembers();
}

document.getElementById('logSearch').addEventListener('input', function() {
    var searchValue = this.value.toLowerCase();
    var rows = document.querySelectorAll('#recentActivity tr');

    rows.forEach(function(row) {
        var cells = row.querySelectorAll('td');
        var rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');

        if (rowText.indexOf(searchValue) > -1) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
});

document.getElementById('memberSearch').addEventListener('input', function() {
    var searchValue = this.value.toLowerCase();
    var rows = document.querySelectorAll('#members tr');

    rows.forEach(function(row) {
        var cells = row.querySelectorAll('td');
        var rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');

        if (rowText.indexOf(searchValue) > -1) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });
});

// Open modal using JavaScript
document.getElementById('openModalBtn').addEventListener('click', function() {
    // Get the modal element by ID
    var modal = new bootstrap.Modal(document.getElementById('addMemberModal'));
    // Show the modal
    modal.show();
});

// Handle form submission for adding a new member
document.getElementById('addMemberForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const member = {
        name: document.getElementById('memberName').value,
        class: document.getElementById('memberClass').value,
        type: document.getElementById('memberType').value,
        level: document.getElementById('memberLevel').value
    };

    fetch('/addMember', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close the modal
            var modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
            modal.hide();
            // Refresh the members list
            fetchMembers();
            // Update total gold
            updateTotalGold();
        } else {
            alert('Error adding member: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error adding member:', error);
        alert('An error occurred. Please try again.');
    });
});

// Handle form submission for updating a member
document.getElementById('updateMemberForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const memberId = document.getElementById('memberId').value;
    const member = {
        name: document.getElementById('updateMemberName').value,
        class: document.getElementById('updateMemberClass').value,
        type: document.getElementById('updateMemberType').value,
        level: document.getElementById('updateMemberLevel').value
    };

    fetch(`/updateMember/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close the modal
            var modal = bootstrap.Modal.getInstance(document.getElementById('updateMemberModal'));
            modal.hide();
            // Refresh the members list
            fetchMembers();
        } else {
            alert('Error updating member: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating member:', error);
        alert('An error occurred. Please try again.');
    });
});

function editMember(memberId) {
    fetch(`/members/${memberId}`)
        .then(response => response.json())
        .then(member => {
            document.getElementById('memberId').value = member._id;
            document.getElementById('updateMemberName').value = member.name;
            document.getElementById('updateMemberClass').value = member.class;
            document.getElementById('updateMemberType').value = member.type;
            document.getElementById('updateMemberLevel').value = member.level;

            // Open the update modal
            var modal = new bootstrap.Modal(document.getElementById('updateMemberModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching member:', error);
            alert('An error occurred. Please try again.');
        });
}

function confirmDeleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        deleteMember(memberId);
    }
}

function deleteMember(memberId) {
    fetch(`/deleteMember/${memberId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refresh the members list
            fetchMembers();
            // Update total gold
            updateTotalGold();
        } else {
            alert('Error deleting member: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting member:', error);
        alert('An error occurred. Please try again.');
    });
}

async function fetchTotalGold() {
    try {
        const response = await fetch('/totalGold');
        const data = await response.json();
        return data.totalGold;
    } catch (error) {
        console.error('Error fetching total gold:', error);
        return 0;
    }
}

async function updateTotalGold() {
    const totalGold = await fetchTotalGold();
    const totalGoldElement = document.getElementById('totalGold');
    totalGoldElement.textContent = totalGold.toLocaleString();
}

async function fetchTotalMembers() {
    try {
        const response = await fetch('/members');
        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error('Error fetching total members:', error);
        return 0;
    }
}

async function updateTotalMembers() {
    const totalMembers = await fetchTotalMembers();
    const totalMembersElement = document.getElementById('totalMembers');
    totalMembersElement.textContent = totalMembers;
}