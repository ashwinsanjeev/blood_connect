async function loadPendingCamps() {
  const res = await fetch('https://api-bloodconnect.duckdns.org/api/admin/camp-requests');
  const camps = await res.json();
  const tbody = document.querySelector('#pending-camps tbody');
  tbody.innerHTML = camps.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.campname}</td>
      <td>${c.date}</td>
      <td>${c.city}</td>
      <td>
        <button onclick="approve(${c.id})">Approve</button>
        <button onclick="remove(${c.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function approve(id) {
  const res = await fetch(`https://api-bloodconnect.duckdns.org/api/admin/camp-requests/${id}/approve`, { method: 'POST' });
  const data = await res.json();
  showMessage(data.message, res.ok ? 'success' : 'error');
  loadPendingCamps();
}

async function remove(id) {
  const res = await fetch(`https://api-bloodconnect.duckdns.org/api/admin/camp-requests/${id}`, { method: 'DELETE' });
  const data = await res.json();
  showMessage(data.message, res.ok ? 'success' : 'error');
  loadPendingCamps();
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();      // only show if admin
  loadPendingCamps();
});
