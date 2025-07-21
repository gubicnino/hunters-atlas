document.addEventListener('DOMContentLoaded', function () {
    addGreatOne();
});

function createPins() {
    const greatOneMap = document.getElementById('greatOneMap');
    const mapContainer = document.getElementById('mapContainer');
    const countModal = new bootstrap.Modal(document.getElementById('countModal'));
    const animalCountInputMale = document.getElementById('animalCountInputMale');
    const animalCountInputFemale = document.getElementById('animalCountInputFemale');
    const countForm = document.getElementById('countForm');
    const countModalLabel = document.getElementById('countModalLabel');
    const deleteZoneButton = document.getElementById('deleteZone');


    let clickX = 0, clickY = 0;
    let editingPin = null;

    if (greatOneMap) {
        greatOneMap.addEventListener('click', function (e) {
            const rect = greatOneMap.getBoundingClientRect();
            const xOffset = e.clientX - rect.left;
            const yOffset = e.clientY - rect.top;

            clickX = (xOffset / rect.width) * 100;
            clickY = (yOffset / rect.height) * 100;

            editingPin = null; // this is a new pin
            animalCountInputMale.value = ''; // clear previous value
            animalCountInputFemale.value = ''; // clear previous value
            countModal.show();
        });
    }

    deleteZoneButton.addEventListener('click', function () {
        if (editingPin) {
            editingPin.remove();
            countModal.hide();
            editingPin = null;
        }
    });

    countForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const maleCount = animalCountInputMale.value;
        const femaleCount = animalCountInputFemale.value
        const count = parseInt(maleCount) + parseInt(femaleCount);

        if (!count) return;

        if (editingPin) {
            // update existing pin
            editingPin.querySelector('.animal-count').textContent = parseInt(maleCount) + parseInt(femaleCount);
            editingPin.dataset.male = maleCount;
            editingPin.dataset.female = femaleCount;
        } else {
            // create new pin
            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.left = `${clickX}%`;
            pin.style.top = `${clickY}%`;
            pin.innerHTML = `<p class="animal-count">${count}</p>`;
            pin.dataset.male = maleCount;
            pin.dataset.female = femaleCount;

            // Enable double-click editing
            pin.addEventListener('dblclick', () => {
                editingPin = pin;
                animalCountInputMale.value = pin.dataset.male || '';
                animalCountInputFemale.value = pin.dataset.female || '';
                countModalLabel.textContent = 'Current Animal Count';
                countModal.show();
            });

            mapContainer.appendChild(pin);
        }

        countModal.hide();
    });
}

function killCounter() {
    const killCountInput = document.getElementById('killCountModal');
    const killCount = document.getElementById('kill-count');
    const countModalKill = new bootstrap.Modal(document.getElementById('countModalKill'));

    const killPlus = document.getElementById('killPlus');
    const killMinus = document.getElementById('killMinus');

    killPlus.addEventListener('click', function () {
        let currentCount = parseInt(killCount.textContent);
        killCount.textContent = currentCount + 1;
    });
    killMinus.addEventListener('click', function () {
        let currentCount = parseInt(killCount.textContent);
        if (currentCount > 0) {
            killCount.textContent = currentCount - 1;
        }
    });
    killCount.addEventListener('dblclick', function () {
        killCountInput.value = killCount.textContent;
        countModalKill.show();
    });
    const killCountForm = document.getElementById('killCountForm');
    killCountForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const newCount = killCountInput.value;
        if (newCount !== '') {
            killCount.textContent = newCount;
        }
        countModalKill.hide();
        killCountInput.value = ''; // Clear input after submission
    });

}

function calculator() {
    const modalCalculator = new bootstrap.Modal(document.getElementById('modalCalculator'));
    const openCalculatorButton = document.getElementById('openCalculator');
    const calculatorForm = document.getElementById('modalCalculatorForm');
    openCalculatorButton.addEventListener('click', function () {
        modalCalculator.show();
    });
    calculatorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const beforeCount = parseInt(document.getElementById('beforeCount').value) || 0;
        const afterCount = parseInt(document.getElementById('afterCount').value) || 0;
        const totalCount = afterCount - beforeCount;
        const killCount = document.getElementById('kill-count');
        const currentCount = parseInt(killCount.textContent) || 0;
        const finalCount = currentCount + totalCount;
        killCount.textContent = finalCount;
        modalCalculator.hide();
        showKillCountToast(totalCount, finalCount);
        document.getElementById('beforeCount').value = '';
        document.getElementById('afterCount').value = '';
    });
}

function showKillCountToast(addedKills, totalKills) {
    const toastHtml = `
        <div class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>+${addedKills}</strong> kills added! Total: <strong>${totalKills}</strong>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    // Add toast to container
    toastContainer.innerHTML = toastHtml;
    const toastElement = toastContainer.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}

function addGreatOne() {
    const newGreatOneBtn = document.getElementById('addButton');
    newGreatOneBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const modalNewGreatOne = new bootstrap.Modal(document.getElementById('modalNewGreatOne'));
        modalNewGreatOne.show();
        const newGreatOneForm = document.getElementById('modalNewGreatOneForm');
        newGreatOneForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newGreatOneSpecies = document.getElementById('newGreatOneSpecies').value;
            const newGreatOneMap = document.getElementById('newGreatOneMap').value;
            const newGreatOneLabel = document.getElementById('newGreatOneLabel').value;
            createGreatOneTab(newGreatOneSpecies, newGreatOneMap, newGreatOneLabel);
            modalNewGreatOne.hide();
            newGreatOneForm.reset();
        });
    });
}
function createGreatOneTab(species, map, label) {
    const sideMenu = document.getElementById('sideMenu');
    const greatOneContainer = document.getElementById('greatOneContainer');
    const currentGreatOneCount = sideMenu.children.length;
    const cleanSpecies = species.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cleanMap = map.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newGreatOneId = currentGreatOneCount + 1;
    const newGreatOneLink = ' <li class="nav-item" role="presentation"><button class="nav-link sidebar-nav-link active" data-bs-toggle="tab" data-bs-target="#greatOne' + newGreatOneId + '" type="button" role="tab" aria-controls="greatOne' + newGreatOneId + '" aria-selected="true">' + label + '</button></li>';
    fetch(`/reserves/map/${map}`)
        .then(response => response.json())
        .then(data => {
            const newData = data[0];
            const mapUrl = newData.map_url || 'images/maps/default-map.jpg';
            const newGreatOneCard = `
                <div class="great-one-card tab-pane active show" id="greatOne${newGreatOneId}" role="tabpanel" aria-labelledby="greatOne${newGreatOneId}-tab">
                    <div class="content-card">
                        <div class="card-header">
                            <h5 class="card-subheader">Great One Number: ${newGreatOneId}</h5>
                            <h3>${cleanSpecies}</h3>
                            <div class="card-kills">
                                <p class="kill-counter">Current Kills: <span id="kill-count-${newGreatOneId}">0</span></p>
                                <i class="fa-solid fa-plus calculatorIcons" id="killPlus-${newGreatOneId}"></i>
                                <i class="fa-solid fa-minus calculatorIcons" id="killMinus-${newGreatOneId}"></i>
                            </div>
                        </div>
                        <div class="divider-white"></div>
                        <div class="card-body">
                            <button class="btn-secondary" id="openCalculator-${newGreatOneId}">Open Calculator</button>
                        </div>
                    </div>
                    <h3 class="mt-3">Mark Your Zones</h3>
                    <div class="card-image" id="mapContainer-${newGreatOneId}">
                        <img src="${mapUrl}" alt="" class="img-fluid" id="greatOneMap-${newGreatOneId}">
                    </div>
                </div>
            `;
            removeShowActiveTab();
            sideMenu.insertAdjacentHTML('beforeend', newGreatOneLink);
            greatOneContainer.insertAdjacentHTML('beforeend', newGreatOneCard);
            
            // Initialize functionality for this specific card
            initializeCardFunctionality(newGreatOneId);
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
}

function initializePinFunctionality(cardId, greatOneMap, mapContainer) {
    const countModal = new bootstrap.Modal(document.getElementById('countModal'));
    const animalCountInputMale = document.getElementById('animalCountInputMale');
    const animalCountInputFemale = document.getElementById('animalCountInputFemale');
    const countForm = document.getElementById('countForm');
    const countModalLabel = document.getElementById('countModalLabel');
    const deleteZoneButton = document.getElementById('deleteZone');

    let clickX = 0, clickY = 0;
    let editingPin = null;

    if (greatOneMap) {
        greatOneMap.addEventListener('click', function (e) {
            const rect = greatOneMap.getBoundingClientRect();
            const xOffset = e.clientX - rect.left;
            const yOffset = e.clientY - rect.top;

            clickX = (xOffset / rect.width) * 100;
            clickY = (yOffset / rect.height) * 100;

            editingPin = null;
            animalCountInputMale.value = '';
            animalCountInputFemale.value = '';
            countModal.show();
        });
    }

    deleteZoneButton.onclick = function () {
        if (editingPin) {
            editingPin.remove();
            countModal.hide();
            editingPin = null;
        }
    };

    countForm.onsubmit = function (e) {
        e.preventDefault();
        const maleCount = animalCountInputMale.value;
        const femaleCount = animalCountInputFemale.value;
        const count = parseInt(maleCount) + parseInt(femaleCount);

        if (!count) return;

        if (editingPin) {
            editingPin.querySelector('.animal-count').textContent = parseInt(maleCount) + parseInt(femaleCount);
            editingPin.dataset.male = maleCount;
            editingPin.dataset.female = femaleCount;
        } else {
            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.left = `${clickX}%`;
            pin.style.top = `${clickY}%`;
            pin.innerHTML = `<p class="animal-count">${count}</p>`;
            pin.dataset.male = maleCount;
            pin.dataset.female = femaleCount;

            pin.addEventListener('dblclick', () => {
                editingPin = pin;
                animalCountInputMale.value = pin.dataset.male || '';
                animalCountInputFemale.value = pin.dataset.female || '';
                countModalLabel.textContent = 'Current Animal Count';
                countModal.show();
            });

            mapContainer.appendChild(pin);
        }

        countModal.hide();
    };

}
function initializeCardFunctionality(cardId) {
    const killCount = document.getElementById(`kill-count-${cardId}`);
    const killPlus = document.getElementById(`killPlus-${cardId}`);
    const killMinus = document.getElementById(`killMinus-${cardId}`);
    const openCalculator = document.getElementById(`openCalculator-${cardId}`);
    const greatOneMap = document.getElementById(`greatOneMap-${cardId}`);
    const mapContainer = document.getElementById(`mapContainer-${cardId}`);
    
    // Kill counter functionality
    killPlus.addEventListener('click', function () {
        let currentCount = parseInt(killCount.textContent);
        killCount.textContent = currentCount + 1;
    });
    
    killMinus.addEventListener('click', function () {
        let currentCount = parseInt(killCount.textContent);
        if (currentCount > 0) {
            killCount.textContent = currentCount - 1;
        }
    });
    
    // Double-click to edit kill count
    killCount.addEventListener('dblclick', function () {
        const killCountInput = document.getElementById('killCountModal');
        const countModalKill = new bootstrap.Modal(document.getElementById('countModalKill'));
        killCountInput.value = killCount.textContent;
        countModalKill.show();
        
        // Update the form submission to target this specific kill count
        const killCountForm = document.getElementById('killCountForm');
        killCountForm.onsubmit = function (e) {
            e.preventDefault();
            const newCount = killCountInput.value;
            if (newCount !== '') {
                killCount.textContent = newCount;
            }
            countModalKill.hide();
            killCountInput.value = '';
        };
    });
    
    // Calculator functionality
    openCalculator.addEventListener('click', function () {
        const modalCalculator = new bootstrap.Modal(document.getElementById('modalCalculator'));
        modalCalculator.show();
        
        // Update calculator form to target this specific card
        const calculatorForm = document.getElementById('modalCalculatorForm');
        calculatorForm.onsubmit = function (e) {
            e.preventDefault();
            const beforeCount = parseInt(document.getElementById('beforeCount').value) || 0;
            const afterCount = parseInt(document.getElementById('afterCount').value) || 0;
            const totalCount = afterCount - beforeCount;
            const currentCount = parseInt(killCount.textContent) || 0;
            const finalCount = currentCount + totalCount;
            killCount.textContent = finalCount;
            modalCalculator.hide();
            showKillCountToast(totalCount, finalCount);
            document.getElementById('beforeCount').value = '';
            document.getElementById('afterCount').value = '';
        };
    });
    
    // Pin creation functionality
    initializePinFunctionality(cardId, greatOneMap, mapContainer);
}

function removeShowActiveTab() {
    const activeTab = document.querySelector('.tab-pane.active.show');
    if (activeTab) {
        activeTab.classList.remove('active', 'show');
    }
    const activeLink = document.querySelector('.sidebar-nav-link.active');
    if (activeLink) {
        activeLink.classList.remove('active');
    }
}