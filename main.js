function showTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function toggleSettings() {
  document.getElementById('settings').classList.toggle('hidden');
}

function toggleNotifications() {
  document.getElementById('notifications').classList.toggle('hidden');
}

function toggleAuth() {
  document.getElementById('auth').classList.toggle('hidden');
}
