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
      const L = await import('leaflet');

      // Default → Amravati
      const amravatiLat = 20.9333;
      const amravatiLng = 77.75;

      this.map = L.map('map').setView([amravatiLat, amravatiLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // --- Auto-complete Search ---
      const searchBox = document.getElementById('searchBox') as HTMLInputElement;
      const suggestions = document.getElementById('suggestions') as HTMLUListElement;

      let typingTimer: any;

      searchBox.addEventListener('input', () => {
        clearTimeout(typingTimer);
        const query = searchBox.value.trim();
        if (query.length < 3) {
          suggestions.style.display = 'none';
          return;
        }

        typingTimer = setTimeout(async () => {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
          const results = await response.json();

          suggestions.innerHTML = '';
          if (results.length > 0) {
            results.forEach((place: any) => {
              const li = document.createElement('li');
              li.textContent = place.display_name;
              li.style.padding = "8px";
              li.style.cursor = "pointer";

              li.addEventListener('click', () => {
                searchBox.value = place.display_name;
                suggestions.style.display = 'none';

                const lat = parseFloat(place.lat);
                const lon = parseFloat(place.lon);

                if (this.marker) {
                  this.map.removeLayer(this.marker);
                }

                this.marker = L.marker([lat, lon]).addTo(this.map)
                  .bindPopup(`📍 ${place.display_name}`)
                  .openPopup();

                this.map.setView([lat, lon], 14);
              });

              suggestions.appendChild(li);
            });
            suggestions.style.display = 'block';
          } else {
            suggestions.style.display = 'none';
          }
        }, 400); // debounce (wait 0.4s after typing)
      });
    }
  }
}
