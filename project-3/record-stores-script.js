// Record Store Map Application

let map;
let placesService;
let markers = [];
let currentInfoWindow = null;
const infoPanel = document.getElementById('info-panel');
const resultsList = document.getElementById('results-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const nearbyButton = document.getElementById('nearby-button');
const closePanel = document.getElementById('close-panel');

// Default center location (Times Square, NYC)
const defaultCenter = { lat: 40.7580, lng: -73.9855 };
const defaultZoom = 13;

// Initialize map on page load
$(document).ready(function() {
  initializeMap();
  setupEventListeners();
});

function initializeMap() {
  const mapOptions = {
    zoom: defaultZoom,
    center: defaultCenter,
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true,
    mapTypeId: 'roadmap'
  };

  map = new google.maps.Map(document.getElementById('map-container'), mapOptions);
  placesService = new google.maps.places.PlacesService(map);

  // Attempt to center on user location if permitted
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
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

  // Geocode the search term to get location
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: searchTerm }, function(results, status) {
    if (status === 'OK' && results.length > 0) {
      const location = results[0].geometry.location;
      map.setCenter(location);
      searchRecordStoresAtLocation(location);
    } else {
      alert('Location not found. Please try a different search term.');
    }
  });
}

function searchNearby() {
  const center = map.getCenter();
  searchRecordStoresAtLocation(center);
}

function searchRecordStoresAtLocation(location) {
  clearMarkers();
  showLoadingState();

  const request = {
    location: location,
    radius: 5000, // 5km radius
    keyword: 'record store',
    type: 'store'
  };

  placesService.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayResults(results, location);
      openInfoPanel(results.length);
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      resultsList.innerHTML = '<p class="empty-message">No record stores found in this area. Try a different location.</p>';
      openInfoPanel(0);
    } else {
      resultsList.innerHTML = '<p class="empty-message">Error searching for record stores. Please try again.</p>';
    }
  });
}

function displayResults(results, centerLocation) {
  resultsList.innerHTML = '';

  results.forEach(function(place, index) {
    // Add marker to map
    addMarker(place, centerLocation);

    // Add to results list
    const distance = calculateDistance(centerLocation, place.geometry.location);
    const storeCard = createStoreCard(place, distance);
    resultsList.appendChild(storeCard);
  });

  // Update results title
  const resultsTitle = document.getElementById('results-title');
  resultsTitle.textContent = `Found ${results.length} Record Store${results.length !== 1 ? 's' : ''}`;
}

function createStoreCard(place, distance) {
  const card = document.createElement('div');
  card.className = 'store-card';

  const name = document.createElement('h3');
  name.className = 'store-name';
  name.textContent = place.name;

  const address = document.createElement('p');
  address.className = 'store-address';
  address.textContent = place.vicinity;

  const meta = document.createElement('div');
  meta.className = 'store-meta';

  const rating = document.createElement('div');
  rating.className = 'store-rating';
  if (place.rating) {
    rating.innerHTML = `<span>★ ${place.rating.toFixed(1)}</span> (${place.user_ratings_total || 0})`;
  } else {
    rating.textContent = 'No ratings';
  }

  const distanceSpan = document.createElement('span');
  distanceSpan.className = 'store-distance';
  distanceSpan.textContent = `${distance.toFixed(1)} km`;

  meta.appendChild(rating);
  meta.appendChild(distanceSpan);

  const viewBtn = document.createElement('button');
  viewBtn.className = 'view-btn';
  viewBtn.textContent = 'View on Map';
  viewBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    panToMarker(place.geometry.location);
  });

  card.appendChild(name);
  card.appendChild(address);
  card.appendChild(meta);
  card.appendChild(viewBtn);

  card.addEventListener('click', function() {
    panToMarker(place.geometry.location);
  });

  return card;
}

function addMarker(place, centerLocation) {
  const marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name,
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  });

  const infoWindowContent = `
    <div class="info-window-content">
      <h3 class="info-window-title">${place.name}</h3>
      <p class="info-window-address">${place.vicinity}</p>
      ${place.rating ? `<p class="info-window-rating">★ ${place.rating.toFixed(1)}</p>` : ''}
    </div>
  `;

  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
  });

  marker.addListener('click', function() {
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }
    infoWindow.open(map, marker);
    currentInfoWindow = infoWindow;
  });

  markers.push(marker);
}

function panToMarker(location) {
  map.setCenter(location);
  map.setZoom(16);
}

function clearMarkers() {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

function calculateDistance(loc1, loc2) {
  // Haversine formula for calculating distance between two coordinates
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat() - loc1.lat()) * Math.PI / 180;
  const dLng = (loc2.lng() - loc1.lng()) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat() * Math.PI / 180) * Math.cos(loc2.lat() * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function openInfoPanel(resultCount) {
  infoPanel.classList.add('open');
}

function closeInfoPanel() {
  infoPanel.classList.remove('open');
}

function showLoadingState() {
  resultsList.innerHTML = '<div class="loading">Loading results</div>';
}
