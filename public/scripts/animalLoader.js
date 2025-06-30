document.addEventListener('DOMContentLoaded', function () {
    // Load the animal data from the server
    fetch('/animals')
        .then(response => response.json())
        .then(data => {
            console.log('Animal data loaded:', data);
            displayAnimals(data);
        })
        .catch(error => {
            console.error('Error loading animal data:', error);
        });
});

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
                    <div class="zones-table">
                        <div class="zone-row">
                            <span class="zone-type feed">Feed</span>
                            <span class="zone-time">09:00-12:00, 16:00-19:00</span>
                        </div>
                        <div class="zone-row">
                            <span class="zone-type drink">Drink</span>
                            <span class="zone-time">05:00-08:00, 20:00-21:00</span>
                        </div>
                        <div class="zone-row">
                            <span class="zone-type rest">Rest</span>
                            <span class="zone-time">22:00-04:00</span>
                        </div>
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
function createFurVariants(furVariants) {

    if (!furVariants || furVariants.length === 0) {
        return '<span class="fur-   item common">No fur variants available</span>';
    }

    // Return HTML string instead of DOM element
    return furVariants.map(variant => 
        variant.rarity === 'very rare' 
            ? `<span class="fur-item very-rare">${variant.variant}</span>`
            : `<span class="fur-item ${variant.rarity.toLowerCase()}">${variant.variant}</span>`
    ).join('');
}