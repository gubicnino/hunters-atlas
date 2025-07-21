document.addEventListener('DOMContentLoaded', function () {
    createPins();
    killCounter();
    calculator();
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

    deleteZoneButton.addEventListener('click', function() {
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
        const totalCount =  afterCount - beforeCount;
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