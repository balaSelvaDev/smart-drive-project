import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.css'
})
export class GoogleMapComponent implements AfterViewInit {

  map!: google.maps.Map;
  startMarker!: google.maps.Marker;
  endMarker!: google.maps.Marker;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 13.0827, lng: 80.2707 }, // Chennai
      zoom: 7,
    });

    this.directionsRenderer.setMap(this.map);
  }

  initAutocomplete() {
    const startInput = document.getElementById('start') as HTMLInputElement;
    const endInput = document.getElementById('end') as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    startAutocomplete.addListener('place_changed', () => {
      const place = startAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      if (this.startMarker) this.startMarker.setMap(null);

      this.startMarker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.map,
        label: 'A',
      });

      this.map.panTo(place.geometry.location);
      this.tryDrawRoute();
    });

    endAutocomplete.addListener('place_changed', () => {
      const place = endAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      if (this.endMarker) this.endMarker.setMap(null);

      this.endMarker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.map,
        label: 'B',
      });

      this.map.panTo(place.geometry.location);
      this.tryDrawRoute();
    });
  }

  tryDrawRoute() {
    if (!this.startMarker || !this.endMarker) return;

    this.directionsService.route(
      {
        origin: this.startMarker.getPosition()!,
        destination: this.endMarker.getPosition()!,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          alert('Directions request failed due to ' + status);
        }
      }
    );
  }

}
