document.addEventListener('DOMContentLoaded', function() {
    // Load the animal data from the server
    fetch('/animals')
        .then(response => response.json())
        .then(data => {
            console.log('Animal data loaded:', data);
            // display the card
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
            <div class="animal-header">
                <h3>${animal.name}</h3>
                <span class="animal-class">Class ${animal.class}</span>
            </div>
            
            <div class="animal-stats">
                <div class="stat-group">
                    <h4>Basic Info</h4>
                    <p><strong>Max Difficulty:</strong> ${animal.max_difficulty || 'Unknown'}</p>
                    <p><strong>Max Weight:</strong> ${animal.max_weight ? animal.max_weight + 'kg' : 'Unknown'}</p>
                </div>
            </div>
        </div>
    `).join('');
}