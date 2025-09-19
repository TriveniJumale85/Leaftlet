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

      // Default map location → Amravati
      const amravatiLat = 20.9333;
      const amravatiLng = 77.75;

      this.map = L.map('map').setView([amravatiLat, amravatiLng], 13);

      // Base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // --- Search Functionality ---
      const searchBox = document.getElementById('searchBox') as HTMLInputElement;
      const searchBtn = document.getElementById('searchBtn');

      if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
          const query = searchBox.value.trim();
          if (!query) return;

          // Call Nominatim API
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
          const results = await response.json();

          if (results.length > 0) {
            const lat = results[0].lat;
            const lon = results[0].lon;

            // Remove old marker if exists
            if (this.marker) {
              this.map.removeLayer(this.marker);
            }

            // Add new marker
            this.marker = L.marker([lat, lon]).addTo(this.map)
              .bindPopup(`📍 ${results[0].display_name}`)
              .openPopup();

            // Move map view
            this.map.setView([lat, lon], 14);
          } else {
            alert('❌ Location not found!');
          }
        });
      }
    }
  }
}
