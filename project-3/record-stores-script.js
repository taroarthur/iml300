// Record Store Map Application — Mapbox Implementation

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGFyb2FydGh1ciIsImEiOiJjbW9pdDN3YWowMHg0MnlxNDBueXM5cjNwIn0._zK1jVYamrXwCTArxYnb4Q';
const MAPBOX_STYLE = 'mapbox://styles/taroarthur/cmoitisuz009s01r44liheu9b';

let map;
let markers = [];
let currentPopup = null;
const infoPanel = document.getElementById('info-panel');
const resultsList = document.getElementById('results-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const nearbyButton = document.getElementById('nearby-button');
const closePanel = document.getElementById('close-panel');

const defaultCenter = { lng: -73.9855, lat: 40.7580 };
const defaultZoom = 13;

$(document).ready(function() {
  initializeMap();
  setupEventListeners();
});

function initializeMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    container: 'map-container',
    style: MAPBOX_STYLE,
    center: [defaultCenter.lng, defaultCenter.lat],
    zoom: defaultZoom
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        map.setCenter([position.coords.longitude, position.coords.latitude]);
      },
      function() {
        console.log('Geolocation not available, using default location');
      }
    );
  }
}

function setupEventListeners() {
  searchButton.addEventListener('click', performSearch);
  nearbyButton.addEventListener('click', searchNearby);
  closePanel.addEventListener('click', closeInfoPanel);

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

function performSearch() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    alert('Please enter a location to search');
    return;
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.setCenter([lng, lat]);
        searchRecordStoresAtLocation({ lat, lng });
      } else {
        alert('Location not found. Please try a different search term.');
      }
    })
    .catch(() => {
      alert('Error geocoding location. Please try again.');
    });
}

function searchNearby() {
  const center = map.getCenter();
  searchRecordStoresAtLocation({ lat: center.lat, lng: center.lng });
}

function searchRecordStoresAtLocation(location) {
  clearMarkers();
  showLoadingState();

  const { lat, lng } = location;
  const radius = 5000;
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="music"](around:${radius},${lat},${lng});
      node["shop"="records"](around:${radius},${lat},${lng});
      way["shop"="music"](around:${radius},${lat},${lng});
      way["shop"="records"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  })
    .then(res => res.json())
    .then(data => {
      const results = data.elements.filter(el => el.tags && el.tags.name && el.lat && el.lon);
      if (results.length > 0) {
        displayResults(results, location);
        openInfoPanel(results.length);
      } else {
        resultsList.innerHTML = '<p class="empty-message">No record stores found in this area. Try a different location.</p>';
        openInfoPanel(0);
      }
    })
    .catch(() => {
      resultsList.innerHTML = '<p class="empty-message">Error searching for record stores. Please try again.</p>';
    });
}

function displayResults(results, centerLocation) {
  resultsList.innerHTML = '';

  results.forEach(function(place) {
    const placeLoc = { lat: place.lat, lng: place.lon };
    addMarker(place, placeLoc);
    const distance = calculateDistance(centerLocation, placeLoc);
    const storeCard = createStoreCard(place, placeLoc, distance);
    resultsList.appendChild(storeCard);
  });

  document.getElementById('results-title').textContent =
    `Found ${results.length} Record Store${results.length !== 1 ? 's' : ''}`;
}

function formatAddress(tags) {
  const parts = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  return parts.length > 0 ? parts.join(', ') : tags['addr:full'] || 'Address not available';
}

function createStoreCard(place, location, distance) {
  const card = document.createElement('div');
  card.className = 'store-card';

  const name = document.createElement('h3');
  name.className = 'store-name';
  name.textContent = place.tags.name;

  const address = document.createElement('p');
  address.className = 'store-address';
  address.textContent = formatAddress(place.tags);

  const meta = document.createElement('div');
  meta.className = 'store-meta';

  const distanceSpan = document.createElement('span');
  distanceSpan.className = 'store-distance';
  distanceSpan.textContent = `${distance.toFixed(1)} km`;

  meta.appendChild(distanceSpan);

  const viewBtn = document.createElement('button');
  viewBtn.className = 'view-btn';
  viewBtn.textContent = 'View on Map';
  viewBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    panToMarker(location);
  });

  card.appendChild(name);
  card.appendChild(address);
  card.appendChild(meta);
  card.appendChild(viewBtn);

  card.addEventListener('click', function() {
    panToMarker(location);
  });

  return card;
}

function addMarker(place, location) {
  const el = document.createElement('div');
  el.style.cssText = 'width:20px;height:20px;background:#e74c3c;border-radius:50%;border:2px solid #fff;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.4);';

  const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(`
    <div class="info-window-content">
      <h3 class="info-window-title">${place.tags.name}</h3>
      <p class="info-window-address">${formatAddress(place.tags)}</p>
    </div>
  `);

  const marker = new mapboxgl.Marker(el)
    .setLngLat([location.lng, location.lat])
    .setPopup(popup)
    .addTo(map);

  el.addEventListener('click', function() {
    if (currentPopup && currentPopup !== popup) {
      currentPopup.remove();
    }
    currentPopup = popup;
  });

  markers.push(marker);
}

function panToMarker(location) {
  map.flyTo({ center: [location.lng, location.lat], zoom: 16 });
}

function clearMarkers() {
  markers.forEach(function(marker) {
    marker.remove();
  });
  markers = [];
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }
}

function calculateDistance(loc1, loc2) {
  const R = 6371;
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function openInfoPanel() {
  infoPanel.classList.add('open');
}

function closeInfoPanel() {
  infoPanel.classList.remove('open');
}

function showLoadingState() {
  resultsList.innerHTML = '<div class="loading">Loading results</div>';
}
