function showSection(sectionId) {
    const sections = document.querySelectorAll('main section'); 
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}


function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    menu.classList.toggle('show');
  }

function showMessage(message, type = 'error') {
  const box = document.getElementById('message-box');
  box.textContent = message;

  // Default to red styling
  box.className = 'message-box';

  // Add success class only if success
  if (type === 'success') {
    box.classList.add('success');
  }

  // Animate
  setTimeout(() => box.classList.add('show'), 10);

  // Auto-hide
  setTimeout(() => {
    box.classList.remove('show');
  }, 5000);
}
