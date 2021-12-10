var map = L.map('map').setView([39.0119, -98.4842], 4.5, zoomSnap = 0.1, zoomDelta = 0.1);
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var info = L.control();