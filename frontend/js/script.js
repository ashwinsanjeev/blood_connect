function showSection(sectionId) {
    const sections = document.querySelectorAll('main section'); 
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
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
        const response = await fetch('https://localhost:5000/api/auth/signup', {
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
        const response = await fetch('https://localhost:5000/api/auth/login', {
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



async function registerDonor() {
    // Collect form data
    const donorData = {
        name: document.getElementById('name').value,
        bloodgroup: document.getElementById('blood-group').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value,
        city: document.getElementById('location').value,
    };

    function validateForm(data) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/; // Assuming a 10-digit phone number
    
        if (!data.name.trim()) return 'Name is required.';
        if (!emailPattern.test(data.email)) return 'Invalid email address.';
        if (!phonePattern.test(data.contact)) return 'Contact number must be 10 digits.';
        if (!data.bloodgroup) return 'Blood group is required.';
        if (!data.city) return 'City is required.';
        return null;
    }

    const errorMessage = validateForm(donorData);
    if (errorMessage) {
        showMessage(errorMessage);
        return;
    }
    try {
        // Send data to the backend
        const response = await fetch('https://localhost:5000/api/donors', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donorData),
        });

        if (response.ok) {
            showMessage('Donor registered successfully!','success');
            // Optionally clear the form
            document.getElementById('donor-form').reset();
            //window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(`Failed to register donor: ${error.message}`);
        }
    } catch (error) {
        console.error('Error registering donor:', error);
        showMessage('An error occurred. Please try again later.');
    }
}



async function bloodRequest() {
    // Collect form data
    const requestData = {
        name: document.getElementById('receiver-name').value.trim(),
        bloodgroup: document.getElementById('receiver-blood-group').value.trim(),
        email: document.getElementById('receiver-email').value.trim(),
        contact: document.getElementById('receiver-contact').value.trim(),
        city: document.getElementById('receiver-location').value.trim(),  
    };

    const requestButton = document.querySelector('#receiver-form button');
    const originalText = requestButton.textContent;

    console.log("Sending request data:", requestData); // Debugging log

    if (!requestData.name || !requestData.email) {
        showMessage("Name and Email are required!");
        return;
    }

    // Validate input
    function validateRequest(data) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/; // Assuming a 10-digit phone number
    
        if (!data.name.trim()) return 'Name is required.';
        if (!emailPattern.test(data.email)) return 'Invalid email address.';
        if (!phonePattern.test(data.contact)) return 'Contact number must be 10 digits.';
        if (!data.bloodgroup) return 'Blood group is required.';
        if (!data.city) return 'City is required.';
        return null;
    }

    const errorMessage = validateRequest(requestData);
    if (errorMessage) {
        showMessage(errorMessage);
        return;
    }

    try {
        // Show loading
        requestButton.disabled = true;
        requestButton.textContent = 'Requesting...';
        // Send data to backend
        const response = await fetch('https://localhost:5000/api/request-blood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            showMessage('Blood request submitted successfully!','success');
            // Optionally clear the form
            document.getElementById('receiver-form').reset();
            //window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(`Failed to request blood: ${error.message}`);
        }

    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.');
    }
    finally {
        // Restore button
        requestButton.disabled = false;
        requestButton.textContent = originalText;
    }
}


async function campRequest() {
    // Collect form data
    const campData = {
        campname: document.getElementById('event-name').value.trim(),
        date: document.getElementById('date').value.trim(),
        city: document.getElementById('location').value.trim(),  
    };
    console.log("Sending request data:", campData); // Debugging log

    if (!campData.campname) {
        showMessage("Please select a date for the camp.");
        return;
    }
    if (!campData.date) {
        showMessage('Please select a date for the camp.');
        return;
    }
    if (!campData.city) {
        showMessage('Please select a city.');
        return;
    }

    try {
        const response = await fetch('https://api-bloodconnect.duckdns.org/api/organize-camp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campData),
        });

        if (response.ok) {
            showMessage('Camp request submitted and donors will be notified!','success');
            // Optionally clear the form
            document.getElementById('organize-form').reset();
            //window.location.href = 'index.html';
        } else {
            const error = await response.json();
            showMessage(`Failed to organize camp: ${error.message}`);
        }

    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.');
    }
}


async function searchDonors() {
    const bloodgroup =encodeURIComponent(document.getElementById('blood-group-1').value.trim());
    const city =encodeURIComponent(document.getElementById('location-1').value.trim());
    
    if (!bloodgroup || !city) {
        showMessage('please select both blood group and city to search.');
        return;
    }
    

    try {
        // Send query to backend
        const response = await fetch(`https://localhost:5000/api/donors?bloodgroup=${bloodgroup}&city=${city}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch donor data');
        }

        const donors = await response.json();

        // Render results
        const donorResults = document.getElementById('donor-results');
        if (donors.length > 0) {
            let tableHTML = `
                <table border="1" cellspacing="0" cellpadding="50">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Blood Group</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            donors.forEach(donor => {
                tableHTML += `
                    <tr>
                        <td>${donor.name}</td>
                        <td>${donor.bloodgroup}</td>
                        <td>${donor.email}</td>
                        <td>${donor.contact}</td>
                        <td>${donor.city}</td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table>`;
            donorResults.innerHTML = tableHTML;
        } else {
            donorResults.innerHTML = `<p>No donors found for the selected criteria.</p>`;
        }
    } catch (error) {
        console.error('Error fetching donors:', error);
        document.getElementById('donor-results').innerHTML = `<p>Error fetching donor data. Please try again later.</p>`;
    }
}

// Call this on every page load to toggle visibility
function checkAuth() {
  const token = localStorage.getItem('token');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.querySelector('a[href="login.html"]');
  const signupLink = document.querySelector('a[href="signup.html"]');

  if (token) {
    // User is logged in
    logoutBtn?.classList.remove('hidden');
    loginLink?.classList.add('hidden');
    signupLink?.classList.add('hidden');
  } else {
    // User is not logged in
    logoutBtn?.classList.add('hidden');
    loginLink?.classList.remove('hidden');
    signupLink?.classList.remove('hidden');
  }
}

// Clears token and redirects to home/login
function handleLogout() {
    console.log('Logout clicked');
    localStorage.removeItem('token');
    showMessage('Logged out successfully', 'success');
    setTimeout(() => {
        // You can choose to redirect to login or home
        window.location.href = 'login.html';
    }, 1000);
}

// Run on initial page load
document.addEventListener('DOMContentLoaded', checkAuth);
