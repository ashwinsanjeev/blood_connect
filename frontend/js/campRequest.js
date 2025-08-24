async function campRequest() {
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

  const token = localStorage.getItem('token');
  if (!token) {
    showMessage('Please log in to request a camp.', 'error');
    return;
  }

  try {
    const response = await fetch('https://api-bloodconnect.duckdns.org/api/organize-camp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(campData)
    });

    const data = await response.json();
    if (response.ok) {
      showMessage('Camp request sent to admin.', 'success');
      document.getElementById('organize-form').reset();
    } else {
      showMessage(data.message || 'Request failed.', 'error');
    }
  } catch (err) {
    console.error(err);
    showMessage('Something went wrong.', 'error');
  }
}