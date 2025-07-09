let allAnimals = []; // Store all animals globally


document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/specific_reserve.html') {
        const url = new URL(window.location.href);
        const reserveID = url.searchParams.get('reserveID');
        fetchAnimalData(`/animals?reserveID=${reserveID}`); // ✅ Changed this line
    }
    else fetchAnimalData();
});
function fetchAnimalData(reqUrl = '/animals') {
    fetch(reqUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Animal data loaded:', data);
            allAnimals = data;
            displayAnimals(data);
            setupFilters();
        })
        .catch(error => {
            console.error('Error loading animal data:', error);
        });
}
function displayAnimals(animals) {
    const animalContainer = document.getElementById('animal-grid');
    animalContainer.innerHTML = animals.map(animal => `
        <div class="animal-card">
            <!-- Keep the existing header with green gradient -->
            <div class="animal-header">
                <h3>${animal.name}</h3>
                <span class="animal-class">Class ${animal.class}</span>
            </div>
            
            <div class="animal-content">
                <!-- Compact Basic Stats -->
                <div class="stats-row">
                    <div class="stat-compact">
                        <span class="stat-label">Max Difficulty</span>
                        <span class="stat-value">${animal.max_difficulty || '5'}</span>
                    </div>
                    <div class="stat-compact">
                        <span class="stat-label">Max Weight</span>
                        <span class="stat-value">${animal.max_weight ? animal.max_weight + 'kg' : '250kg'}</span>
                    </div>
                </div>

                <!-- Compact Trophy Scores -->
                <div class="trophy-section">
                    <h4>Trophy Scores</h4>
                    <div class="trophy-row">
                        <div class="trophy-compact silver">
                            <span class="trophy-label">Silver</span>
                            <span class="trophy-score">${animal.silver || 'error'}</span>
                        </div>
                        <div class="trophy-compact gold">
                            <span class="trophy-label">Gold</span>
                            <span class="trophy-score">${animal.gold || 'error'}</span>
                        </div>
                        <div class="trophy-compact diamond">
                            <span class="trophy-label">Diamond</span>
                            <span class="trophy-score">${animal.diamond || 'error'}</span>
                        </div>
                    </div>
                </div>

                <!-- Simple Need Zones Table -->
                <div class="need-zones-section">
                    <h4>Need Zones</h4>
                    <div class="need-zones-table">
                        <ul class="nav nav-tabs"  role="tablist">${createTabMenu(animal.reserves_with_need_zones, animal.name)}</ul>
                        <div class="zones-table tab-content">${createNeedZoneTab(animal.reserves_with_need_zones, animal.name)}</div>
                    </div>
                </div>

                <!-- Compact Fur Types -->
                <div class="fur-section">
                    <h4>Fur Types</h4>
                        <div class="fur-compact">
                            ${createFurVariants(animal.fur_variants)}
                        </div>
                </div>

                <!-- Compact Reserves -->
                <div class="reserves-section">
                    <h4>Reserves</h4>
                    <div class="reserves-compact">
                        <span class="reserve-tag">Layton Lake</span>
                        <span class="reserve-tag">Hirschfelden</span>
                        <span class="reserve-tag">Medved-Taiga</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const classFilter = document.getElementById('class-filter');
    const reserveFilter = document.getElementById('reserve-filter');

    // Search functionality
    searchInput?.addEventListener('input', filterAnimals);
    classFilter?.addEventListener('change', filterAnimals);
    reserveFilter?.addEventListener('change', filterAnimals);
}

function filterAnimals() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedClass = document.getElementById('class-filter')?.value || '';
    const selectedReserve = document.getElementById('reserve-filter')?.value || '';

    const filteredAnimals = allAnimals.filter(animal => {
        // Search by name
        const matchesSearch = animal.name.toLowerCase().includes(searchTerm);

        // Filter by class
        const matchesClass = !selectedClass || animal.class.toString() === selectedClass;

        // Filter by reserve
        const matchesReserve = !selectedReserve ||
            (animal.reserves_with_need_zones &&
                animal.reserves_with_need_zones.some(reserve =>
                    reserve.reserve_name === selectedReserve
                ));

        return matchesSearch && matchesClass && matchesReserve;
    });

    displayAnimals(filteredAnimals);
}

function createFurVariants(furVariants) {

    if (!furVariants || furVariants.length === 0) {
        return '<span class="fur-item common">No fur variants available</span>';
    }

    // Return HTML string instead of DOM element
    return furVariants.map(variant =>
        variant.rarity === 'very rare'
            ? `<span class="fur-item very-rare">${variant.variant}</span>`
            : `<span class="fur-item ${variant.rarity.toLowerCase()}">${variant.variant}</span>`
    ).join('');
}


function createNeedZoneTab(reserves, animalName) {
    if (!reserves || reserves.length === 0) {
        return '<p>No need zones available</p>';
    }
    const safeAnimalName = animalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    return reserves.map((reserve, index) => {
        const safeReserveName = reserve.reserve_name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        return `
        <div class="tab-pane fade ${index == 0 ? 'show active' : ''}" id="${safeAnimalName}-${safeReserveName}-tab-pane" role="tabpanel">
            <div class="zone-row">
                <span class="zone-type feed">Feed</span>
                <span class="zone-time">${reserve.need_zones.feed || 'N/A'}</span>
            </div>
            <div class="zone-row">
                <span class="zone-type drink">Drink</span>
                <span class="zone-time">${reserve.need_zones.drink || 'N/A'}</span>
            </div>
            <div class="zone-row">
                <span class="zone-type rest">Rest</span>
                <span class="zone-time">${reserve.need_zones.rest || 'N/A'}</span>
            </div>
        </div>
    `}).join('');
}
function createTabMenu(reserves, animalName) {
    if (!reserves || reserves.length === 0) {
        return '<li class="nav-item"><span class="nav-link active">No reserves available</span></li>';
    }
    const safeAnimalName = animalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    return reserves.map((reserve, index) => {
        const safeReserveName = reserve.reserve_name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

        return `
        <li class="nav-item">
            <a class="nav-link ${index === 0 ? 'active' : ''}" 
               id="${safeAnimalName}-${safeReserveName}-tab" 
               data-bs-toggle="tab" 
               data-bs-target="#${safeAnimalName}-${safeReserveName}-tab-pane" 
               role="tab" 
               aria-controls="${safeReserveName}-tab-pane"
               aria-selected="${index === 0 ? 'true' : 'false'}">
                ${reserve.reserve_name}
            </a>
        </li>
    `}).join('');
}


