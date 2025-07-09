//https://steamcommunity.com/sharedfiles/filedetails/?id=3131561249
document.addEventListener('DOMContentLoaded', () => {
    loadReserveData();
});


function setHotspotMap(animal) {
    const mapImg = document.getElementById('map-image');
    const mapUrl = `/images/maps/te-awaroa/${animal}.png`;
    mapImg.src = mapUrl;
    mapImg.alt = `Hotspot map for ${animal}`;
}
function loadReserveName(reserveName) {

    // Update the reserve name in the description
    const reserveNameElement = document.getElementById('reserve-name-placeholder');
    if (reserveNameElement) {
        reserveNameElement.textContent = reserveName;
    }

    // Also update the page title
    const mainTitle = document.getElementById('reserve-name');
    if (mainTitle) {
        mainTitle.textContent = reserveName;
    }
}

function loadReserveData() {
    const urlParams = new URLSearchParams(window.location.search);
    const reserveID = urlParams.get('reserveID') || '1'; // Default to 1 if not provided

    fetch(`/reserves/${reserveID}`)
        .then(response => response.json())
        .then(data => {
            console.log('Reserve data loaded:', data);
            displayReserveDetails(data);
        })
        .catch(error => {
            console.error('Error loading reserve data:', error);
        });
}
function displayReserveDetails(reserves) {
    reserves.forEach((reserve) => {
        console.log('Displaying reserve:', reserve);
        loadReserveName(reserve.reserve_name);
        const reserveDescriptionElement = document.getElementById('reserve-ingame-description');
        const animalListElement = document.getElementById('animal-list-reserve');
        const reserveImgElement = document.getElementById('reserve-image');

        reserveDescriptionElement.textContent = reserve.description || 'No description available for this reserve.';

        reserveImgElement.src = reserve.map_url || '';
        reserveImgElement.alt = `Map of ${reserve.reserve_name}`;

        // Populate the animal list
        if (reserve.animals_in_reserve) {
            const animalArray = reserve.animals_in_reserve.split(',').map(animal => animal.trim());
            animalListElement.innerHTML = animalArray.map(animal => `<li id="${animal.trim().replace(" ", "-").toLowerCase()}">${animal}</li>`).join('');
        } else {
            animalListElement.innerHTML = '<li>No animals found in this reserve.</li>';
        }
        enableHotspotLoading();
    });

}
function enableHotspotLoading() {
    const animalReserveList = document.getElementById('animal-list-reserve');
    const mapImg = document.getElementById('map-image');
    mapImg.src = `/images/maps/te-awaroa/${animalReserveList.querySelector("li").textContent.trim().replace(" ", "-").toLowerCase()}.png`;
    animalReserveList.querySelectorAll("li").forEach((item) => {
        const text = item.textContent.trim().replace(" ", "-").toLowerCase();
        console.log('Hotspot map set for:', text);
        item.addEventListener('click', () => {
            setHotspotMap(text);
        });
    });
}