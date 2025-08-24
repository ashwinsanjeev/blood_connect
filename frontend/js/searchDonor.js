async function searchDonors() {
    const bloodgroup =encodeURIComponent(document.getElementById('blood-group-1').value.trim());
    const city =encodeURIComponent(document.getElementById('location-1').value.trim());
    
    if (!bloodgroup || !city) {
        showMessage('please select both blood group and city to search.');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please log in to Search Donors.', 'error');
        return;
    }

    try {
        // Send query to backend
        const response = await fetch(`https://api-bloodconnect.duckdns.org/api/donors?bloodgroup=${bloodgroup}&city=${city}`);
        
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