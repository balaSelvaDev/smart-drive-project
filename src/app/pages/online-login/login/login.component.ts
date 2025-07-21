import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Init autocomplete
    const autocomplete = new google.maps.places.Autocomplete(this.searchBox.nativeElement, {
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;

      this.setMap(location);
    });

    // Init map (center India)
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
    });
  }

  setMap(location: google.maps.LatLng) {
    this.map.setCenter(location);
    this.map.setZoom(14);

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
  }

}
