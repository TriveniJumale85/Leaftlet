import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private marker: any;

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const L = await import('leaflet'); // ✅ dynamic import

      // Amravati coordinates
      const amravatiLat = 20.9333;
      const amravatiLng = 77.75;

      // Initialize map
      this.map = L.map('map').setView([amravatiLat, amravatiLng], 13);

      // --- Base Layers ---
      const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      });

      const satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenTopoMap contributors'
      });

      street.addTo(this.map); // default

      // --- Amravati Marker ---
      const cityIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      this.marker = L.marker([amravatiLat, amravatiLng], { icon: cityIcon })
        .addTo(this.map)
        .bindPopup('📍 Amravati City');

      // --- Circle (5 km) ---
      L.circle([amravatiLat, amravatiLng], {
        radius: 5000,
        color: 'blue',
        fillColor: 'lightblue',
        fillOpacity: 0.3
      }).addTo(this.map).bindPopup("5 km radius around Amravati");

      // --- Polygon ---
      L.polygon([
        [20.94, 77.73],
        [20.92, 77.76],
        [20.91, 77.74]
      ], {
        color: 'red',
        fillColor: 'pink',
        fillOpacity: 0.5
      }).addTo(this.map).bindPopup("Custom Area");

      // --- Polyline (Route) ---
      L.polyline([
        [20.9333, 77.75], // Amravati
        [21.1458, 79.0882] // Nagpur
      ], { color: 'green' }).addTo(this.map).bindPopup("Route Amravati → Nagpur");

      // --- Multiple Markers ---
      const places = [
        { name: "🍴 Restaurant", lat: 20.935, lng: 77.751 },
        { name: "🏥 Hospital", lat: 20.94, lng: 77.755 },
        { name: "🏬 Mall", lat: 20.93, lng: 77.76 }
      ];

      places.forEach(place => {
        L.marker([place.lat, place.lng]).addTo(this.map)
          .bindPopup(`📍 ${place.name}`);
      });

      // --- Layer Control ---
      L.control.layers({
        "Street Map": street,
        "Satellite Map": satellite
      }).addTo(this.map);

      // --- Live Location (ENABLE later when backend ready) ---
      /*
      const liveIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (!this.liveMarker) {
            this.liveMarker = L.marker([lat, lng], { icon: liveIcon }).addTo(this.map)
              .bindPopup('🚶 You are here!');
          } else {
            this.liveMarker.setLatLng([lat, lng]);
          }

          this.map.setView([lat, lng], 15);
        });
      }
      */
    }
  }
}
