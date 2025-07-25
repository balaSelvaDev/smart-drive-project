import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-google-map2',
  templateUrl: './google-map2.component.html',
  styleUrl: './google-map2.component.css'
})
export class GoogleMap2Component implements AfterViewInit {

  map!: google.maps.Map;
  startMarker!: google.maps.Marker;
  endMarker!: google.maps.Marker;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  geocoder = new google.maps.Geocoder();

  startLocation: google.maps.LatLng | null = null;
  endLocation: google.maps.LatLng | null = null;

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
    this.initMapClick();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 13.0827, lng: 80.2707 },
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
      this.setStartLocation(place.geometry.location);
    });

    endAutocomplete.addListener('place_changed', () => {
      const place = endAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      this.setEndLocation(place.geometry.location);
    });
  }

  initMapClick() {
    this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const clickedLocation = e.latLng!;
      if (!this.startLocation) {
        this.setStartLocation(clickedLocation);
        this.reverseGeocode(clickedLocation, 'start');
      } else if (!this.endLocation) {
        this.setEndLocation(clickedLocation);
        this.reverseGeocode(clickedLocation, 'end');
      }
    });
  }

  reverseGeocode(latLng: google.maps.LatLng, type: 'start' | 'end') {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const address = results[0].formatted_address;
        const input = document.getElementById(type) as HTMLInputElement;
        input.value = address;
      }
    });
  }

  setStartLocation(location: google.maps.LatLng) {
    if (this.startMarker) this.startMarker.setMap(null);
    this.startLocation = location;
    this.startMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      label: 'A',
    });
    this.map.panTo(location);
    this.tryDrawRoute();
  }

  setEndLocation(location: google.maps.LatLng) {
    if (this.endMarker) this.endMarker.setMap(null);
    this.endLocation = location;
    this.endMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      label: 'B',
    });
    this.map.panTo(location);
    this.tryDrawRoute();
  }

  tryDrawRoute() {
    if (!this.startLocation || !this.endLocation) return;

    this.directionsService.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (
          status === google.maps.DirectionsStatus.OK &&
          result &&
          result.routes &&
          result.routes.length > 0 &&
          result.routes[0].legs &&
          result.routes[0].legs.length > 0
        ) {
          this.directionsRenderer.setDirections(result);

          const leg = result.routes[0].legs[0];

          const distance = leg.distance?.text ?? 'N/A';
          const duration = leg.duration?.text ?? 'N/A';

          alert(`Distance: ${distance}, Duration: ${duration}`);
        } else {
          alert('Directions request failed: ' + status);
        }
      }
    );
  }

  resetMap() {
    // Clear input fields
    (document.getElementById('start') as HTMLInputElement).value = '';
    (document.getElementById('end') as HTMLInputElement).value = '';

    // Remove markers from map
    if (this.startMarker) {
      this.startMarker.setMap(null);
      this.startMarker = undefined!;
    }
    if (this.endMarker) {
      this.endMarker.setMap(null);
      this.endMarker = undefined!;
    }

    // Clear route
    this.directionsRenderer.set('directions', null);

    // Clear stored locations
    this.startLocation = null;
    this.endLocation = null;
  }

}
