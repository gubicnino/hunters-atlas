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
    openCalculatorButton.addEventListener('click', function () {
        modalCalculator.show();
    });
}