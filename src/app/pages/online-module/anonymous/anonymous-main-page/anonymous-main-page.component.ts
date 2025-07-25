import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-anonymous-main-page',
  templateUrl: './anonymous-main-page.component.html',
  styleUrl: './anonymous-main-page.component.css'
})
export class AnonymousMainPageComponent {
  startDate: string = '';
  endDate: string = '';
  autocomplete: google.maps.places.Autocomplete;

  // 
  origin = 'Thiruparankundram';
  destinations = [
    'Madurai Junction Railway Station',
    'Meenakshi Amman Temple',
    'Mattuthavani Bus Stand',
    'Periyar Bus Stand',
    'Madurai Airport',
    'Thirumalai Nayakkar Mahal',
  ];

  distanceResults: {
    destination: string;
    distance: string;
    duration: string;
  }[] = [];

  currentLocationName: string = '';
  private geocoder: any;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    this.startDate = this.toDateTimeLocalString(now);
    this.endDate = this.toDateTimeLocalString(tomorrow);

    // this.calculateDistances();
  }

  ngAfterViewInit(): void {
    const input = document.getElementById('locationInput') as HTMLInputElement;

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'], // You can use 'address', 'establishment', etc.
      componentRestrictions: { country: 'IN' }, // Optional: restrict to India
    });

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();

        if (!place || !place.geometry || !place.geometry.location) {
          console.warn('No geometry found for selected place');
          return;
        }

        const address = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        console.log('Selected:', address, lat, lng);
      });
    });
  }

  private toDateTimeLocalString(date: Date): string {
    // Converts to yyyy-MM-ddTHH:mm (required format for datetime-local)
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

  calculateDistances1(): void {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [this.origin],
        destinations: this.destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status !== 'OK') {
          console.error('DistanceMatrix failed:', status);
          return;
        }

        const results = response.rows[0].elements;
        console.log('Distance Matrix Response:', response);
        console.log('response.rows[0].elements:', response.rows[0].elements);
        console.log('Distance Matrix Results:', results);
        this.destinations.forEach((dest, index) => {
          const distanceText = results[index].distance?.text || 'N/A';
          const durationText = results[index].duration?.text || 'N/A';

          console.log(
            `From ${this.origin} to ${dest}: ${distanceText}, ${durationText}`
          );
        });
        console.log('Distance Matrix calculation completed successfully.');
      }
    );
  }

  // This function is triggered when the user clicks the "Use Current Location" button

  onUseCurrentLocation(): void {
    this.getCurrentLocation()
      .then((location) => {
        this.getAddressFromLatLng(location);     // ✅ Get human-readable address
        this.calculateDistances(location);       // ✅ Calculate distances
      })
      .catch((err) => {
        alert('Failed to get location: ' + err);
      });
  }

  getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject('Permission denied or unavailable');
          }
        );
      }
    });
  }

  getAddressFromLatLng(location: google.maps.LatLngLiteral): void {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }

    this.geocoder.geocode({ location }, (results: any, status: string) => {
      if (status === 'OK' && results[0]) {
        this.ngZone.run(() => {
          this.currentLocationName = results[0].formatted_address;
        });
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }

  calculateDistances(origin: google.maps.LatLngLiteral): void {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: this.destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status !== 'OK') {
          console.error('DistanceMatrix failed:', status);
          return;
        }

        const results = response.rows[0].elements;
        this.distanceResults = this.destinations.map((dest, index) => ({
          destination: dest,
          distance: results[index].distance?.text || 'N/A',
          duration: results[index].duration?.text || 'N/A',
        }));
      }
    );
  }

}
