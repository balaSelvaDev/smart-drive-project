import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-booking-get',
  templateUrl: './booking-get.component.html',
  styleUrl: './booking-get.component.css'
})
export class BookingGetComponent {

  constructor(private router: Router, private http: HttpClient) { }

  navigateToAddBooking() {
    this.router.navigate(['/admin/add-booking']); // absolute navigation
  }

  locationControl = new FormControl();
  suggestions$: Observable<string[]>;


  ngOnInit(): void {
    this.suggestions$ = this.locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.getSuggestions(query))
    );
  }

  getSuggestions(query: string): Observable<string[]> {
    if (!query || query.length < 2) return new Observable<string[]>((observer) => observer.next([]));

    const headers = new HttpHeaders({
      'Authorization': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAwNjhiNDlhYTI5YjRiNDQ5ZTgyMWQ1YTlmOTZjNTFlIiwiaCI6Im11cm11cjY0In0='  // 🔑 Replace with your ORS key
    });

    const params = new HttpParams()
      .set('text', query)
      .set('size', '5');

    return this.http
      .get<any>(`https://api.openrouteservice.org/geocode/autocomplete?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAwNjhiNDlhYTI5YjRiNDQ5ZTgyMWQ1YTlmOTZjNTFlIiwiaCI6Im11cm11cjY0In0=&text=${query}&size=5`)
      .pipe(
        map((res) =>
          res.features?.map((f: any) => f.properties.label) || []
        )
      );
  }

  onOptionSelected(selected: string): void {
    console.log('Selected:', selected);
    // Optional: Do something with the selected location
  }

  isClientLocation = false;
  pickupAddress = '';
  dropAddress = '';
  clientLocations = [
    { name: 'SM-1[ Madurai Junction Railway Station ]', address: 'Madurai Junction Railway Station, Tamil Nadu' },
  ];

  map: any;
  directionsService: any;
  directionsRenderer: any;
  showMap = false;
  selectedType: 'pickup' | 'drop' = 'pickup';
  distance = '';
  duration = '';

  ngAfterViewInit() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  onClientToggle() {
    this.pickupAddress = '';
    this.dropAddress = '';
  }

  onClientLocationChange() {
    setTimeout(() => this.initMap(), 0);
  }

  openMapPopup(type: 'pickup' | 'drop') {
    this.selectedType = type;
    this.showMap = true;
    setTimeout(() => this.initMap(), 0);
  }

  closeMapPopup() {
    this.showMap = false;
  }

  resetAll() {
    this.pickupAddress = '';
    this.dropAddress = '';
    this.isClientLocation = false;
    this.map = null;
    this.showMap = false;
    this.distance = '';
    this.duration = '';
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const center = { lat: 9.9252, lng: 78.1198 };
      this.map = new google.maps.Map(mapElement, {
        center,
        zoom: 13,
      });
    } else {
      console.error('Map element not found!');
    }

    this.directionsRenderer.setMap(this.map);

    this.map.addListener('click', (event: any) => {
      const latlng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          if (this.selectedType === 'pickup') {
            this.pickupAddress = address;
          } else {
            this.dropAddress = address;
          }
          new google.maps.Marker({ position: latlng, map: this.map });
          this.drawRoute();
        }
      });
    });

    // Autocomplete logic (for drop only if needed)
    const dropInput = document.querySelector('input[placeholder="Drop Location"]') as HTMLInputElement;
    if (dropInput) {
      const autocomplete = new google.maps.places.Autocomplete(dropInput);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.dropAddress = place?.formatted_address ?? '';
          const marker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location
          });
          this.drawRoute();
        }
      });
    }
  }

  drawRoute() {
    if (!this.pickupAddress || !this.dropAddress) return;

    this.directionsService.route(
      {
        origin: this.pickupAddress,
        destination: this.dropAddress,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(result);
          const leg = result.routes[0].legs[0];
          this.distance = leg.distance.text;
          this.duration = leg.duration.text;
        }
      }
    );
  }

}
