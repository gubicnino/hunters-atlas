//https://steamcommunity.com/sharedfiles/filedetails/?id=3131561249
document.addEventListener('DOMContentLoaded', () => {
    const animalReserveList = document.getElementById('animal-list-reserve');
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