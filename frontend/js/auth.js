document.addEventListener('DOMContentLoaded', checkAuth);

async function handleSignup() {
    const userData = {
        username: document.getElementById('signup-username').value.trim(),
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value,
        confirmPassword: document.getElementById('signup-confirm-password').value,
    };

    function validateSignup(data) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.username) return 'Username is required.';
        if (!emailPattern.test(data.email)) return 'Invalid email address.';
        if (data.password.length < 6) return 'Password must be at least 6 characters.';
        if (data.password !== data.confirmPassword) return 'Passwords do not match.';
        return null;
    }

    const error = validateSignup(userData);
    if (error) {
        showMessage(error);
        return;
    }

    try {
        const response = await fetch('https://api-bloodconnect.duckdns.org/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('signupForm').reset();
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            showMessage(result.message || 'Signup failed');
        }
    } catch (err) {
        console.error('Signup error:', err);
        showMessage('An error occurred. Please try again.');
    }
}



async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    function validateLogin(email, password) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) return 'Invalid email address.';
        if (!password) return 'Password is required.';
        return null;
    }

    const error = validateLogin(email, password);
    if (error) {
        showMessage(error);
        return;
    }

    try {
        const response = await fetch('https://api-bloodconnect.duckdns.org/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            localStorage.setItem('token', result.token);
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showMessage(result.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        showMessage('An error occurred. Please try again.');
    }
}


function parseJwt(token) {
  if(!token)return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

const user = parseJwt(localStorage.getItem('token'));
console.log(user);

function checkAuth() {
  const token = localStorage.getItem('token');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');
  const organizeLink = document.getElementById('organizeCampLink'); // Add id to your nav link/button

  if (token) {
    const user = parseJwt(token);
    // User is logged in
    logoutBtn?.classList.remove('hidden');
    loginLink?.classList.add('hidden');
    signupLink?.classList.add('hidden');

    if (user?.isAdmin) {
      if (organizeLink) organizeLink.href = 'adminCampOrganize.html';
    } else {
      if (organizeLink) organizeLink.href = 'organize.html';
    }

  } else {
    // User is not logged in
    logoutBtn?.classList.add('hidden');
    loginLink?.classList.remove('hidden');
    signupLink?.classList.remove('hidden');

    if (organizeLink) organizeLink.href = 'organize.html';

  }
}

function toggleProfileMenu() {
  document.getElementById('profileMenu').classList.toggle('hidden');
}

function updateProfileMenu() {
  const token = localStorage.getItem('token');
  const profileMenu = document.getElementById('profileMenu');

  if(!profileMenu)
  {
    console.warn("profileMenu element not found on this page");
    return;
  }

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    profileMenu.innerHTML = `
      <p>${payload.name || payload.email}</p>
      <button onclick="handleLogout()">Logout</button>
    `;
  } else {
    profileMenu.innerHTML = `
      <button onclick="location.href='login.html'">Login</button>
    `;
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileMenu();
    const organizeLink = document.getElementById('organizeCampLink');
    if (organizeLink && isAdminUser()) {
        organizeLink.textContent = 'Admin Camp Manager';
        organizeLink.href = 'adminCampOrganize.html'; // redirect admin to admin-specific page
    }
});


// Run on initial page load
