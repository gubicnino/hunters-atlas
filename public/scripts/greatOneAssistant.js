document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Great One Assistant DOM loaded');

    // Initialize UI elements that don't need Supabase
    addGreatOne();

    setupGlobalPinHandler();

    // Wait for Supabase to be ready before loading user data
    if (window.supabase) {
        console.log('✅ Supabase already available, loading user Great Ones');
        loadUserGreatOnes();
    } else {
        console.log('⏳ Waiting for Supabase to load...');
        window.addEventListener('supabaseReady', function () {
            console.log('🎉 Supabase ready event received, loading user Great Ones');
            loadUserGreatOnes();
        });
    }
});

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
// Update the createGreatOneTab function to include auto-save setup
async function createGreatOneTab(species, map, label) {
    const sideMenu = document.getElementById('sideMenu');
    const greatOneContainer = document.getElementById('greatOneContainer');
    const cleanSpecies = species.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cleanMap = map.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let newGreatOneId;
    try {
        if (!window.supabase) {
            console.error('❌ Supabase not available');
            return;
        }

        const { data: { user } } = await window.supabase.auth.getUser();
        if (!user) {
            console.error('❌ No user logged in');
            return;
        }

        const greatOneData = {
            user_id: user.id,
            species: species,
            reserve: map,
            kill_count: 0,
            zones: [],
            label: label
        };

        console.log('💾 Creating database record with data:', greatOneData);

        const { data, error } = await window.supabase
            .from('user_great_ones')
            .insert(greatOneData)
            .select();

        if (error) {
            console.error('❌ Database error:', error);
            throw error;
        }

        if (!data || !data[0]) {
            console.error('❌ No data returned from database');
            throw new Error('No data returned from database');
        }

        newGreatOneId = data[0].id;
        console.log('✅ Database record created with ID:', newGreatOneId);

    } catch (error) {
        console.error('❌ Error creating Great One in database:', error);
    }
    const newGreatOneLink = ' <li class="nav-item" role="presentation"><button class="nav-link sidebar-nav-link active" data-bs-toggle="tab" data-bs-target="#greatOne' + newGreatOneId + '" type="button" role="tab" aria-controls="greatOne' + newGreatOneId + '" aria-selected="true">' + label + '</button></li>';
    fetch(`/reserves/map/${map}`)
        .then(response => response.json())
        .then(data => {
            const newData = data[0];
            const mapUrl = newData.map_url;
            const newGreatOneCard = `
                <div class="great-one-card tab-pane active show" id="greatOne${newGreatOneId}" role="tabpanel" aria-labelledby="greatOne${newGreatOneId}-tab" data-great-one-id="${newGreatOneId}">
                    <div class="content-card">
                        <div class="card-header">
                            <h5 class="card-subheader">${label}</h5>
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
                        <img src="${mapUrl}" alt="Map of ${map}" class="img-fluid" id="greatOneMap-${newGreatOneId}">
                    </div>
                </div>
            `;
            removeShowActiveTab();
            sideMenu.insertAdjacentHTML('beforeend', newGreatOneLink);
            greatOneContainer.insertAdjacentHTML('beforeend', newGreatOneCard);

            // Initialize functionality for this specific card
            initializeCardFunctionality(newGreatOneId);

            // Setup auto-save for this new card
            setupAutoSave(`greatOne${newGreatOneId}`);
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
}

function createGreatOneTabFromData(greatOneData) {
    const sideMenu = document.getElementById('sideMenu');
    const greatOneContainer = document.getElementById('greatOneContainer');
    const cleanSpecies = greatOneData.species.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cleanMap = greatOneData.reserve.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newGreatOneId = greatOneData.id;
    const label = greatOneData.label;
    const newGreatOneLink = `<li class="nav-item" role="presentation"><button class="nav-link sidebar-nav-link" data-bs-toggle="tab" data-bs-target="#greatOne${newGreatOneId}" type="button" role="tab" aria-controls="greatOne${newGreatOneId}" aria-selected="false">${label}</button></li>`;

    fetch(`/reserves/map/${greatOneData.reserve}`)
        .then(response => response.json())
        .then(data => {
            const newData = data[0];
            const mapUrl = newData.map_url;
            const newGreatOneCard = `
                <div class="great-one-card tab-pane" id="greatOne${newGreatOneId}" role="tabpanel" aria-labelledby="greatOne${newGreatOneId}-tab" data-great-one-id="${greatOneData.id}">
                    <div class="content-card">
                        <div class="card-header">
                            <h5 class="card-subheader">${label}</h5>
                            <h3>${cleanSpecies}</h3>
                            <div class="card-kills">
                                <p class="kill-counter">Current Kills: <span id="kill-count-${newGreatOneId}">${greatOneData.kill_count}</span></p>
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
                        <img src="${mapUrl}" alt="Map of ${greatOneData.reserve}" class="img-fluid" id="greatOneMap-${newGreatOneId}">
                    </div>
                </div>
            `;

            sideMenu.insertAdjacentHTML('beforeend', newGreatOneLink);
            greatOneContainer.insertAdjacentHTML('beforeend', newGreatOneCard);

            // Initialize functionality for this specific card
            initializeCardFunctionality(newGreatOneId);

            // Recreate pins from saved zones data
            if (greatOneData.zones && greatOneData.zones.length > 0) {
                const mapContainer = document.getElementById(`mapContainer-${newGreatOneId}`);
                greatOneData.zones.forEach(zone => {
                    const pin = document.createElement('div');
                    pin.classList.add('pin');
                    pin.style.left = `${zone.x}%`;
                    pin.style.top = `${zone.y}%`;
                    pin.innerHTML = `<p class="animal-count">${zone.male + zone.female}</p>`;
                    pin.dataset.male = zone.male;
                    pin.dataset.female = zone.female;

                    // Add double-click functionality to loaded pins
                    pin.addEventListener('dblclick', () => {
                        const countModal = new bootstrap.Modal(document.getElementById('countModal'));
                        const animalCountInputMale = document.getElementById('animalCountInputMale');
                        const animalCountInputFemale = document.getElementById('animalCountInputFemale');
                        const countModalLabel = document.getElementById('countModalLabel');

                        // Set up editing
                        window.editingPin = pin;
                        animalCountInputMale.value = pin.dataset.male || '';
                        animalCountInputFemale.value = pin.dataset.female || '';
                        countModalLabel.textContent = 'Current Animal Count';
                        countModal.show();
                    });

                    mapContainer.appendChild(pin);
                });
            }

            // Setup auto-save for this card
            setupAutoSave(`greatOne${newGreatOneId}`);
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
}

function initializePinFunctionality(cardId, greatOneMap, mapContainer) {
    const animalCountInputMale = document.getElementById('animalCountInputMale');
    const animalCountInputFemale = document.getElementById('animalCountInputFemale');
    const countModalLabel = document.getElementById('countModalLabel');

    let clickX = 0, clickY = 0;
    if (greatOneMap) {
        greatOneMap.addEventListener('click', function (e) {
            const rect = greatOneMap.getBoundingClientRect();
            const xOffset = e.clientX - rect.left;
            const yOffset = e.clientY - rect.top;

            clickX = (xOffset / rect.width) * 100;
            clickY = (yOffset / rect.height) * 100;

            // ✅ Set global context for new pin creation
            window.currentCardId = cardId;
            window.editingPin = null;
            window.clickX = clickX;
            window.clickY = clickY;

            animalCountInputMale.value = '';
            animalCountInputFemale.value = '';
            countModalLabel.textContent = 'Add Animal Count';

            const countModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('countModal'));
            countModal.show();
        });
    }

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


async function saveGreatOneProgress(cardId, species, reserve, killCount, zones) {
    if (!window.supabase) return;

    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        if (!user) return;

        const greatOneData = {
            user_id: user.id,
            species: species,
            reserve: reserve,
            kill_count: killCount,
            zones: zones
        };

        // Check if this Great One already exists
        const existingId = document.getElementById(cardId).dataset.greatOneId;
        console.log('Saving Great One data:', greatOneData, 'Existing ID:', existingId);

        if (existingId) {
            // Update existing
            console.log('Updating existing Great One with ID:', existingId);
            const { error } = await window.supabase
                .from('user_great_ones')
                .update(greatOneData)
                .eq('id', existingId);

            if (error) throw error;
        } else {
            console.log('No existing ID');
        }

        console.log('Great One progress saved');
    } catch (error) {
        console.error('Error saving Great One progress:', error);
    }
}

async function loadUserGreatOnes() {
    console.log('Loading user Great Ones...');
    if (!window.supabase) return;

    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await window.supabase
            .from('user_great_ones')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        // Recreate Great One tabs from saved data
        data.forEach(greatOne => {
            console.log('Loading Great One:', greatOne);
            createGreatOneTabFromData(greatOne);
        });

    } catch (error) {
        console.error('Error loading Great Ones:', error);
    }
}

// Auto-save functionality
function setupAutoSave(cardId) {
    const card = document.getElementById(cardId);
    let saveTimeout;

    // Auto-save when kill count changes
    const killCountElement = card.querySelector(`#kill-count-${cardId.replace('greatOne', '')}`);
    const observer = new MutationObserver(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveCurrentGreatOne(cardId);
        }, 1000); // Save 1 second after last change
    });

    if (killCountElement) {
        observer.observe(killCountElement, { childList: true, subtree: true });
    }
}

function saveCurrentGreatOne(cardId) {
    const card = document.getElementById(cardId);
    const species = card.querySelector('h3').textContent;
    const reserve = card.querySelector('.card-image img').alt.replace('Map of ', '');
    const killCount = parseInt(card.querySelector(`#kill-count-${cardId.replace('greatOne', '')}`).textContent);

    // Collect zones data
    const zones = [];
    card.querySelectorAll('.pin').forEach(pin => {
        zones.push({
            x: parseFloat(pin.style.left),
            y: parseFloat(pin.style.top),
            male: parseInt(pin.dataset.male || 0),
            female: parseInt(pin.dataset.female || 0)
        });
    });

    saveGreatOneProgress(cardId, species, reserve, killCount, zones);
}

function setupGlobalPinHandler() {
    const countForm = document.getElementById('countForm');
    const deleteZoneButton = document.getElementById('deleteZone');
    if (!countForm) return;

    if (deleteZoneButton) {
        deleteZoneButton.addEventListener('click', function () {
            console.log('🗑️ Delete zone button clicked');
            console.log('🎯 Current editing pin:', window.editingPin);

            if (window.editingPin) {
                // Remove the pin from the DOM
                window.editingPin.remove();

                // Hide the modal
                const countModal = bootstrap.Modal.getInstance(document.getElementById('countModal'));
                countModal.hide();

                // Clear the editing state
                window.editingPin = null;

                // Auto-save after pin deletion
                if (window.currentCardId) {
                    console.log('💾 Auto-saving after pin deletion');
                    saveCurrentGreatOne(`greatOne${window.currentCardId}`);
                }

                console.log('✅ Pin deleted successfully');
            } else {
                console.warn('⚠️ No pin selected for deletion');
            }
        });
    }

    // Remove any existing handlers
    countForm.onsubmit = null;

    countForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('📌 Pin form submitted');
        console.log('🎯 Current card:', window.currentCardId);
        console.log('✏️ Editing pin:', window.editingPin);

        if (!window.currentCardId) {
            console.error('❌ No current card ID');
            return;
        }

        const animalCountInputMale = document.getElementById('animalCountInputMale');
        const animalCountInputFemale = document.getElementById('animalCountInputFemale');
        const countModal = bootstrap.Modal.getInstance(document.getElementById('countModal'));

        const maleCount = parseInt(animalCountInputMale.value) || 0;
        const femaleCount = parseInt(animalCountInputFemale.value) || 0;
        const count = maleCount + femaleCount;

        if (!count) return;

        if (window.editingPin) {
            // ✅ Update existing pin
            console.log('✏️ Updating existing pin');
            window.editingPin.querySelector('.animal-count').textContent = count;
            window.editingPin.dataset.male = maleCount;
            window.editingPin.dataset.female = femaleCount;
        } else {
            // ✅ Create new pin
            console.log('➕ Creating new pin');
            const mapContainer = document.getElementById(`mapContainer-${window.currentCardId}`);

            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.left = `${window.clickX}%`;
            pin.style.top = `${window.clickY}%`;
            pin.innerHTML = `<p class="animal-count">${count}</p>`;
            pin.dataset.male = maleCount;
            pin.dataset.female = femaleCount;

            // ✅ Add double-click handler with global context
            pin.addEventListener('dblclick', () => {
                console.log('🖱️ Pin double-clicked');
                window.editingPin = pin;
                window.currentCardId = window.currentCardId; // Keep current context

                const animalCountInputMale = document.getElementById('animalCountInputMale');
                const animalCountInputFemale = document.getElementById('animalCountInputFemale');
                const countModalLabel = document.getElementById('countModalLabel');

                animalCountInputMale.value = pin.dataset.male || '';
                animalCountInputFemale.value = pin.dataset.female || '';
                countModalLabel.textContent = 'Edit Animal Count';

                const modal = new bootstrap.Modal(document.getElementById('countModal'));
                modal.show();
            });

            mapContainer.appendChild(pin);
        }

        countModal.hide();

        // Clear editing state
        window.editingPin = null;

        // Auto-save after pin change
        saveCurrentGreatOne(`greatOne${window.currentCardId}`);
    });
}