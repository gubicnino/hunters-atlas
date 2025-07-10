//https://steamcommunity.com/sharedfiles/filedetails/?id=3131561249
document.addEventListener('DOMContentLoaded', () => {
    loadReserveData();
});



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

        reserveDescriptionElement.textContent = '"' + reserve.description + '" - In-game description'  || 'No description available for this reserve.' ;

        reserveImgElement.src = reserve.map_url || '';
        reserveImgElement.alt = `Map of ${reserve.reserve_name}`;

        // Populate the animal list
        if (reserve.animals_in_reserve) {
            const animalArray = reserve.animals_in_reserve.split(',').map(animal => animal.trim());
            animalListElement.innerHTML = animalArray.map(animal => `<li id="${animal.trim().replace(" ", "-").toLowerCase()}">${animal}</li>`).join('');
        } else {
            animalListElement.innerHTML = '<li>No animals found in this reserve.</li>';
        }
        enableHotspotLoading(reserve.reserve_name);
    });

}
function enableHotspotLoading(reserve_name) {
    const animalReserveList = document.getElementById('animal-list-reserve');
    const mapImg = document.getElementById('map-image');
    const editedReserveName = reserve_name.trim().replace(" ", "-").toLowerCase();

    const firstAnimal = animalReserveList.querySelector("li")?.textContent.trim().replace(" ", "-").toLowerCase();
    if (firstAnimal) {
        setHotspotMap(firstAnimal, editedReserveName);
    }
    
    animalReserveList.querySelectorAll("li").forEach((item) => {
        const text = item.textContent.trim().replace(" ", "-").toLowerCase();
        console.log('Hotspot map set for:', text);
        item.addEventListener('click', () => {
            setHotspotMap(text, editedReserveName);
        });
    });
}
function setHotspotMap(animal, reserveName) {
    const mapImg = document.getElementById('map-image');
    const basePath = `/images/maps/${reserveName}/${animal}`;
    
    // Try different formats in order of preference
    const formats = ['png', 'webp', 'jpg', 'jpeg'];
    
    tryImageFormat(mapImg, basePath, formats, 0, animal);
}

function tryImageFormat(imgElement, basePath, formats, index, animal) {
    if (index >= formats.length) {
        console.error(`No image found for ${animal}`);
        return;
    }
    
    const testImg = new Image();
    testImg.onload = function() {
        imgElement.src = `${basePath}.${formats[index]}`;
        imgElement.alt = `Hotspot map for ${animal}`;
    };
    testImg.onerror = function() {
        tryImageFormat(imgElement, basePath, formats, index + 1, animal);
    };
    testImg.src = `${basePath}.${formats[index]}`;
}