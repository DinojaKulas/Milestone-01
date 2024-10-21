function displayAvailableBikes() {
    const bikes = JSON.parse(localStorage.getItem('bikes')) || [];
    const tableBody = document.getElementById('availableBikesTableBody');
    tableBody.innerHTML = '';

    bikes.forEach(bike => {
        if (bike.status !== 'rented') {
            const row = document.createElement('tr');

            Object.keys(bike).forEach(key => {
                if (key !== 'status') { // Exclude status from display
                    const cell = document.createElement('td');
                    cell.textContent = bike[key];
                    row.appendChild(cell);
                }
            });

            // Action cell with a rent button
            const actionCell = document.createElement('td');
            const rentButton = document.createElement('button');
            rentButton.textContent = 'Rent';
            rentButton.onclick = () => rentBike(bike.registrationNumber);
            actionCell.appendChild(rentButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        }
    });
}

// Renting a bike
function rentBike(registrationNumber) {
    let bikes = JSON.parse(localStorage.getItem('bikes')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rentDate = new Date().toISOString();
    const username = 'Customer1'; // Replace with actual customer identifier if available

    bikes = bikes.map(bike => {
        if (bike.registrationNumber === registrationNumber) {
            bike.status = 'rented';
            // Add the rental details
            rentals.push({
                username: username,
                regNumber: bike.registrationNumber,
                brand: bike.brand,
                model: bike.model,
                rentDate: rentDate
            });
        }
        return bike;
    });

    localStorage.setItem('bikes', JSON.stringify(bikes));
    localStorage.setItem('rentals', JSON.stringify(rentals));
    displayAvailableBikes();
    alert(`Bike with registration number ${registrationNumber} has been rented.`);
}

// Initialize customer page
document.addEventListener('DOMContentLoaded', displayAvailableBikes);



