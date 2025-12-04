// map.js - HAR LISTING KA EXACT LOCATION WITH MARKER
var map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var locationMarker = null;

// BEAUTIFUL EXACT LOCATION MARKER
function showExactLocationWithMarker(lat, lng, locationName) {
    console.log(`🎯 Showing exact location: ${lat}, ${lng} - ${locationName}`);

    if (locationMarker) map.removeLayer(locationMarker);

    map.setView([lat, lng], 13);

    const redMarkerIcon = L.divIcon({
        className: 'exact-location-marker',
        html: `
            <div style="
                background: #e74c3c;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 2px 15px rgba(231, 76, 60, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse 1.5s infinite;
            ">
                <div style="color: white; font-size: 16px;">📍</div>
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            </style>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    locationMarker = L.marker([lat, lng], { icon: redMarkerIcon }).addTo(map);

    L.circle([lat, lng], {
        color: '#e74c3c',
        fillColor: '#e74c3c',
        fillOpacity: 0.1,
        radius: 500
    }).addTo(map);

    const popupHtml = `
        <div style="text-align: center;">
            <div style="background: #f64a37ff; color: white; padding: 6px; border-radius: 8px 8px 8px 8px; font-weight: bold;">
                📍 ${locationName}
            </div>
            <div style="background: white;"></div> 
        </div>
    `;

    locationMarker.openPopup().bindPopup(popupHtml);

    console.log('Marker displayed');
}

// HANDLING NOT FOUND CASE
function showLocationNotFound(locationText, countryText) {
    console.log('Location not found:', locationText, countryText);

    if (locationMarker) map.removeLayer(locationMarker);

    map.setView([20, 0], 2);

    const notFoundIcon = L.divIcon({
        html: `
            <div style="
                background: #95a5a6;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                border: 4px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
            ">❌</div>
        `,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
    });

    locationMarker = L.marker([20, 0], { icon: notFoundIcon }).addTo(map);

    const popupHtml = `
        <div style="min-width: 250px; text-align: center;">
            <div style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">
                Location Not Found
            </div>
            <div style="background: #fff3cd; padding: 10px; border-radius: 5px;">
                "${locationText}, ${countryText}"
            </div>
        </div>
    `;

    locationMarker.openPopup().bindPopup(popupHtml);
}

// UPDATED LIVE GEOCODING FUNCTION - WITH USER AGENT
async function geocodeLive(location, country) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(location + ', ' + country)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Airbnb-Clone-Map/1.0 (your-email@example.com)"
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                name: data[0].display_name
            };
        }
        return null;

    } catch (err) {
        console.error('Live geocoding error:', err);
        return null;
    }
}

// PAGE LOAD
document.addEventListener('DOMContentLoaded', async function () {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const latStr = mapElement.dataset.lat;
    const lngStr = mapElement.dataset.lng;
    const address = mapElement.dataset.address;

    console.log('📍 Map Data From Server:', latStr, lngStr, address);

    // EXACT COORDINATES AVAILABLE → DIRECTLY SHOW
    if (latStr && lngStr && !isNaN(latStr) && !isNaN(lngStr)) {
        showExactLocationWithMarker(parseFloat(latStr), parseFloat(lngStr), address);
        return;
    }

    // FALLBACK — GET LOCATION TEXT FROM PAGE
    let pageLocation = '';
    let pageCountry = '';

    document.querySelectorAll('.card-text').forEach(el => {
        const t = el.textContent.trim();
        if (t.startsWith('Location:')) pageLocation = t.replace('Location:', '').trim();
        if (t.startsWith('Country:')) pageCountry = t.replace('Country:', '').trim();
    });

    if (pageLocation && pageCountry) {
        console.log(`🔍 Trying live geocoding: ${pageLocation}, ${pageCountry}`);

        const liveData = await geocodeLive(pageLocation, pageCountry);

        if (liveData) {
            showExactLocationWithMarker(liveData.lat, liveData.lng, liveData.name);
        } else {
            showLocationNotFound(pageLocation, pageCountry);
        }
    } else {
        showLocationNotFound('Unknown', 'Location');
    }
});
