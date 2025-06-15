// Variáveis para armazenar os dados
let currentUserId = null;

function openEditModal(userId, username, password, isAdmin) {
    currentUserId = userId;

    document.getElementById('edit-password').value = password;
    document.getElementById('isAdmin').value = isAdmin ? 'true' : 'false';

    document.getElementById('editModal').style.display = 'block';
}

document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('edit-form').onsubmit = async function(event) {
    event.preventDefault();

    const password = document.getElementById('edit-password').value;
    const isAdmin = document.getElementById('isAdmin').value === 'true';

    const response = await fetch(`/editUser/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, isAdmin })
    });

    const result = await response.json();

    if (result.success) {
        alert('Usuário atualizado com sucesso!');
        location.reload();
    } else {
        alert('Erro ao atualizar usuário!');
    }

    document.getElementById('editModal').style.display = 'none';
}

async function loadUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <h3>${user.username}</h3>
            <p class="password">Senha: ${user.password}</p>
            <p class="admin">${user.isAdmin ? 'Admin' : 'Usuário Normal'}</p>
            <div class="button-container">
                <button onclick="openEditModal('${user._id}', '${user.username}', '${user.password}', ${user.isAdmin})">Editar</button>
                <button onclick="deleteUser('${user._id}')">Excluir</button>
            </div>
        `;
        userList.appendChild(userCard);
    });
}

async function deleteUser(userId) {
    const response = await fetch(`/deleteUser/${userId}`, { method: 'DELETE' });
    const result = await response.json();

    if (result.success) {
        alert('Usuário excluído com sucesso!');
        loadUsers();
    } else {
        alert('Erro ao excluir usuário!');
    }
}

window.onload = loadUsers;