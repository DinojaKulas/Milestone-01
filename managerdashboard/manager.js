function Adminshow() {
    document.getElementById('Admincontainer').style.display = 'block';
    document.getElementById('customerscontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('rentcontainer').style.display = 'none';
    document.getElementById('returnedcontainer').style.display = 'none';
    document.getElementById('Reportscontainer').style.display = 'none';
}

function customershow() {
    document.getElementById('Admincontainer').style.display = 'none';
    document.getElementById('customerscontainer').style.display = 'block';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('rentcontainer').style.display = 'none';
    document.getElementById('returnedcontainer').style.display = 'none';
    document.getElementById('Reportscontainer').style.display = 'none';
}

function overdueshow() {
    document.getElementById('Admincontainer').style.display = 'none';
    document.getElementById('customerscontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'block';
    document.getElementById('rentcontainer').style.display = 'none';
    document.getElementById('returnedcontainer').style.display = 'none';
    document.getElementById('Reportscontainer').style.display = 'none';
   
}

function rentshow() {
    document.getElementById('Admincontainer').style.display = 'none';
    document.getElementById('customerscontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('rentcontainer').style.display = 'block';
    document.getElementById('returnedcontainer').style.display = 'none';
    document.getElementById('Reportscontainer').style.display = 'none';
    updateCustomerRentals();
}

function returnedshow() {
    document.getElementById('Admincontainer').style.display = 'none';
    document.getElementById('customerscontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('rentcontainer').style.display = 'none';
    document.getElementById('returnedcontainer').style.display = 'block';
    document.getElementById('Reportscontainer').style.display = 'none';
}

function reportshow() {
    document.getElementById('Admincontainer').style.display = 'none';
    document.getElementById('customerscontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('rentcontainer').style.display = 'none';
    document.getElementById('returnedcontainer').style.display = 'none';
    document.getElementById('Reportscontainer').style.display = 'block';
}

// Get current user function
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser')); // Get and parse current user from session storage
}

// bike add funtion
document.addEventListener("DOMContentLoaded", () => {
    const bikeForm = document.getElementById('bikeForm');
    const bikesTable = document.getElementById('bikesTable').querySelector('tbody');
    const overdueList = document.getElementById('overdue-list');
    const customerRentalsTableBody = document.getElementById('customerRentalsTableBody');
    let bikes = JSON.parse(localStorage.getItem('bikes')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    bikes.forEach(bike => addBikeToTable(bike.registrationNumber, bike.brand, bike.model, bike.category, bike.status));
    updateCustomerRentals();

    bikeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const registrationNumber = document.getElementById('registrationNumber').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const category = document.getElementById('category').value;

        const bike = { registrationNumber, brand, model, category, status: 'available' };
        bikes.push(bike);
        localStorage.setItem('bikes', JSON.stringify(bikes));

        addBikeToTable(registrationNumber, brand, model, category, 'available');
        bikeForm.reset();
    });

    function addBikeToTable(registrationNumber, brand, model, category, status) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${registrationNumber}</td>
            <td>${brand}</td>
            <td>${model}</td>
            <td>${category}</td>
            <td>${status}</td>
            <td class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;

        row.querySelector('.edit').addEventListener('click', () => editBike(row, registrationNumber, brand, model, category));
        row.querySelector('.delete').addEventListener('click', () => deleteBike(row, registrationNumber));

        bikesTable.appendChild(row);
    }

    function editBike(row, registrationNumber, brand, model, category) {
        document.getElementById('registrationNumber').value = registrationNumber;
        document.getElementById('brand').value = brand;
        document.getElementById('model').value = model;
        document.getElementById('category').value = category;

        deleteBike(row, registrationNumber);
    }

    function deleteBike(row, registrationNumber) {
        row.remove();
        bikes = bikes.filter(bike => bike.registrationNumber !== registrationNumber);
        localStorage.setItem('bikes', JSON.stringify(bikes));
    }

    function updateCustomerRentals() {
        const customerRentalsTableBody = document.getElementById('customerRentalsTableBody');
        const rentals = JSON.parse(localStorage.getItem('rentals')) || [];

        customerRentalsTableBody.innerHTML = '';

        rentals.forEach((rental) => {
            const row = document.createElement('tr');
            const rentDate = new Date(rental.rentDate);
            const currentDate = new Date();
            const hoursDiff = (currentDate - rentDate) / (1000 * 60* 60);

            let statusClass = hoursDiff > 24 ? 'table-danger' : 'table-success';
            let statusText = hoursDiff > 24 ? 'Overdue' : 'Active';
            let returnButton = `<button class="return-button" data-reg-number="${rental.regNumber}" data-username="${rental.username}">Return</button>`;

            row.className = statusClass;
            row.innerHTML = `
                
                <td>${rental.regNumber}</td>
                <td>${rental.brand}</td>
                <td>${rental.model}</td>
                <td>${rentDate.toLocaleString()}</td>
                <td>${statusText} ${returnButton}</td>
            `;

            customerRentalsTableBody.appendChild(row);
        });

        document.querySelectorAll('.return-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const regNumber = e.target.getAttribute('data-reg-number');
                const username = e.target.getAttribute('data-username');
                returnMotorbike(username, regNumber);
            });
        });

        checkOverdueRentals();
    }

    function checkOverdueRentals() {
        const currentDate = new Date();
        const overdueList = document.getElementById('overdue-list');
        overdueList.innerHTML = '';
        const overdueRentals = rentals.filter(rental => {
            const rentDate = new Date(rental.rentDate);
            const hoursDiff = (currentDate - rentDate) / (1000 * 60 * 60);
            return hoursDiff > 24;
        });

        overdueRentals.forEach(rental => {
            const row = document.createElement('tr');
            let returnButton = `<button class="return-button" data-reg-number="${rental.regNumber}" data-username="${rental.username}">Return</button>`;

            row.innerHTML = `
                
                <td>${rental.regNumber}</td>
                <td>${rental.brand}</td>
                <td>${rental.model}</td>
                <td>${new Date(rental.rentDate).toLocaleString()}</td>
                <td>Overdue ${returnButton}</td>
            `;

            overdueList.appendChild(row);
        });

        document.querySelectorAll('.return-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const regNumber = e.target.getAttribute('data-reg-number');
                const username = e.target.getAttribute('data-username');
                returnMotorbike(username, regNumber);
            });
        });

        if (overdueRentals.length > 0) {
            alert(`There are ${overdueRentals.length} overdue rentals!`);
        }
    }

    function returnMotorbike(username, regNumber) {
        rentals = rentals.filter(rental => !(rental.username === username && rental.regNumber === regNumber));
        localStorage.setItem('rentals', JSON.stringify(rentals));

        const bikeIndex = bikes.findIndex(bike => bike.registrationNumber === regNumber);
        if (bikeIndex !== -1) {
            bikes[bikeIndex].status = 'available';
            localStorage.setItem('bikes', JSON.stringify(bikes));
        }

        updateCustomerRentals();
    }

    updateCustomerRentals();
});





