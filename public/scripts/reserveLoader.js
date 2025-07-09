document.addEventListener('DOMContentLoaded', () => {
    // Load the reserve data from the server
    fetch('/reserves')
        .then(response => response.json())
        .then(data => {
            console.log('Reserve data loaded:', data);
            displayReserves(data);
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
});

function displayReserves(reserves) {
    const reserveContainer = document.getElementById('reserves-row');
    reserveContainer.innerHTML = reserves.map(reserve => `
        <div class="col-12 col-lg-4 col-md-6">
            <div class="reserve-card">
                <div class="reserve-header">
                    <h3>${reserve.reserve_name}</h3>
                    <span class="reserve-location">${reserve.location}</span>
                </div>
                <img src="${reserve.map_url}" class="reserve-map" alt="" width="100%">
                <div class="reserve-content">
                    <h4>Animals in Reserve</h4>
                    <ul class="animals-list">${reserve.animals_in_reserve}</ul>
                    <button class="btn btn-primary" onclick="window.location.href='specific_reserve.html?reserveID=${reserve.id}'">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}
function createAnimalList(animals) {
    const animalArray = animals.split(', ').map(animal => animal.trim()).filter(animal => animal);
    if (animalArray.length === 0) {
        return '<li>No animals in this reserve</li>';
    }
    return animalArray.map(animal => `<li>${animal}</li>`).join('');
}