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

    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please log in to request for blood.', 'error');
        return;
    }

    try {
        // Show loading
        requestButton.disabled = true;
        requestButton.textContent = 'Requesting...';
        // Send data to backend
        const response = await fetch('https://api-bloodconnect.duckdns.org/api/request-blood', {
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