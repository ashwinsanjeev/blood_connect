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

    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please log in to Register as a Donor.', 'error');
        return;
    }
    try {
        // Send data to the backend
        const response = await fetch('https://api-bloodconnect.duckdns.org/api/donors', {
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