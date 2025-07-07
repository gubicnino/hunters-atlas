document.addEventListener('DOMContentLoaded', function () {
    fetch('/reserves')
        .then(response => response.json())
        .then(data => {
            console.log('Reserve data loaded:', data);
            const reserveFilter = document.getElementById('reserve-filter'); // Reset options
            data.forEach(reserve => {
                const option = document.createElement('option');
                option.value = reserve.name;
                option.textContent = reserve.name;
                reserveFilter.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading animal data:', error);
        });
});