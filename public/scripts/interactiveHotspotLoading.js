//https://steamcommunity.com/sharedfiles/filedetails/?id=3131561249
document.addEventListener('DOMContentLoaded', () => {
    loadReserveName();
    const animalReserveList = document.getElementById('animal-list-reserve');
    const mapImg =  document.getElementById('map-image');
    mapImg.src = `/images/maps/te-awaroa/${animalReserveList.querySelector("li").textContent.trim().replace(" ", "-").toLowerCase()}.png`;
    animalReserveList.querySelectorAll("li").forEach((item) => {
        const text = item.textContent.trim().replace(" ", "-").toLowerCase();
        console.log('Hotspot map set for:', text);
        item.addEventListener('click', () => {
            setHotspotMap(text);
        });
    });
});


function setHotspotMap(animal) {
    const mapImg = document.getElementById('map-image');
    const mapUrl = `/images/maps/te-awaroa/${animal}.png`;
    mapImg.src = mapUrl;
    mapImg.alt = `Hotspot map for ${animal}`;
}
function loadReserveName() {
    const urlParams = new URLSearchParams(window.location.search);
    const reserveName = urlParams.get('reserve') || 'Te Awaroa'; 
    
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