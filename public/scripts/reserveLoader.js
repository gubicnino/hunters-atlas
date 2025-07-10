let reserveData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load the reserve data from the server
    fetch('/reserves')
        .then(response => response.json())
        .then(data => {
            console.log('Reserve data loaded:', data);
            reserveData = data;
            displayReserves(data);
            setupFilters();
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
});

function displayReserves(reserves) {
    const reserveContainer = document.getElementById('reserves-row');
    reserveContainer.innerHTML = reserves.map(reserve => `
        <div class="col-12 col-lg-4 col-md-6 d-flex flex-column h-100">
            <div class="reserve-card">
                <div class="reserve-header">
                    <h3>${reserve.reserve_name}</h3>
                    <span class="reserve-location">${reserve.location}</span>
                </div>
                <img src="${reserve.map_url}" class="reserve-map" alt="" width="100%">
                <div class="reserve-content">
                    <h4>Animals in Reserve</h4>
                    <ul class="animals-list">${reserve.animals_in_reserve}</ul>
                    <button class="btn btn-primary mt-3" onclick="window.location.href='specific_reserve.html?reserveID=${reserve.reserve_id}'">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    // Search functionality
    searchInput?.addEventListener('input', () => {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

        const filteredReserves = reserveData.filter(reserve => {
            // Search by name
            const matchesSearch = reserve.reserve_name.toLowerCase().includes(searchTerm);
            return matchesSearch;
        });

        displayReserves(filteredReserves);
    });
}