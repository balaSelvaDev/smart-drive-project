import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { BookingAddRequestDTO } from '../../../../core/models/classes/booking-module/booking-add-request-dto';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styleUrl: './booking-add.component.css'
})
export class BookingAddComponent {

  bookingForm!: FormGroup;

  userNameSearchControl = new FormControl('');
  userNameFilteredOptions: any[] = [];

  vehicleNameSearchControl = new FormControl('');
  vehicleNameFilteredOptions: any[] = [];

  vehicleNameObj: any[] = [];

  clientLocation: any[] = [];
  isClientLocationRequired = false;
  distanceValue: number = 0;

  // google map variables
  map!: google.maps.Map;
  startMarker!: google.maps.Marker;
  endMarker!: google.maps.Marker;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  geocoder = new google.maps.Geocoder();

  startLocation: google.maps.LatLng | null = null;
  endLocation: google.maps.LatLng | null = null;

  @ViewChild('myInput') myInputRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
    this.initMapClick();
  }

  constructor(private vehicleService: VehicleService, private bookingService: BookingService, private router: Router, private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.bookingForm = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      vehicleId: new FormControl('', [Validators.required]),
      drivingLicenseNumber: new FormControl(''),

      startDate: new FormControl(''),
      endDate: new FormControl(''),
      pickupLocation: new FormControl(''),
      dropLocation: new FormControl(''),
      paymentMode: new FormControl('UPI', [Validators.required]),
      brandName: new FormControl(''),
      vehicleModelName: new FormControl(''),

      paymentStatus: new FormControl('PENDING'),
      paymentReference: new FormControl(''),
      totalAmount: new FormControl(''),
      discountAmount: new FormControl(''),

      finalAmount: new FormControl(''),
      clientLocationId: new FormControl(null, Validators.required),
      isClientLocationRequired: new FormControl(false),
    });

    //
    this.userNameSearchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000), // 1 second debounce
        distinctUntilChanged(),
        switchMap((value) => {
          const safeValue = value ?? ''; // if null, fallback to empty string
          return this.bookingService.searchUserName(safeValue).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results) => {
        this.userNameFilteredOptions = results.slice(0, 6); // limit to 6
        console.log('Filtered options:', this.userNameFilteredOptions);
      });

    this.vehicleNameSearchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000), // 1 second debounce
        distinctUntilChanged(),
        switchMap((value) => {
          const safeValue = value ?? ''; // if null, fallback to empty string
          return this.bookingService.searchVehicleName(safeValue).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results) => {
        this.vehicleNameFilteredOptions = results.slice(0, 6); // limit to 6
        console.log('Filtered options:', this.vehicleNameFilteredOptions);
      });
    //
    let districtId = 13;
    this.vehicleService.getClientLocation(districtId).subscribe({
      next: (res) => {
        console.log('Client location data:', res);
        console.log("asdfasd: " + res[0].clientLocationId);
        this.bookingForm.controls['clientLocationId'].setValue(res[0].clientLocationId);
        this.clientLocation = res;
      },
      error: (err) => {
        console.error('Failed to get client location', err);
      },
    });
  }

  setUserIdInForm(item: any) {
    this.bookingForm.get('userId')?.setValue(item.userId);
    // this.displayUserName = item.userName;
    this.userNameSearchControl.setValue(item.userName, { emitEvent: false });  // Prevent triggering valueChanges
    this.userNameFilteredOptions = []; // Clear the options after selection
    console.log('Selected user:', item.userName);
    this.bookingForm.controls['drivingLicenseNumber'].setValue(item.drivingLicense);
  }

  setVehicleIdInForm(item: any) {
    this.bookingForm.get('vehicleId')?.setValue(item.vehicleId);
    console.log('Selected vehicle:', item.vehicleId);
    // this.displayUserName = item.userName;
    this.vehicleNameSearchControl.setValue(item.vehicleName, { emitEvent: false });  // Prevent triggering valueChanges
    this.vehicleNameFilteredOptions = []; // Clear the options after selection
    this.vehicleNameObj.push(item);
    console.log('Selected vehicle:', item.vehicleName);
    this.bookingForm.controls['brandName'].setValue(item.brandName);
    this.bookingForm.controls['vehicleModelName'].setValue(item.vehicleModelName);
  }


  onSubmit(): void {
    const payload = this.bookingForm.value;
    console.log('Form submitted with payload:', payload);
    if (this.bookingForm.valid) {
      console.log('Form submitted with payload:', payload);
      const bookingAddRequest: BookingAddRequestDTO = {
        ...payload,
        startDate: new Date(payload.startDate).toISOString(),
        endDate: new Date(payload.endDate).toISOString()
      };
      console.log('Booking Add Request DTO:', bookingAddRequest);
      // this.bookingService.addBooking(payload).subscribe({
      //   next: (res) => {
      //     console.log('Booking added successfully', res);
      //     this.router.navigate(['/get-booking']); // Navigate to the booking list page
      //   },
      //   error: (err) => {
      //     console.error('Failed to add brand', err);
      //   },
      // });
    } else {
      this.bookingForm.markAllAsTouched(); // Highlight all errors
    }
  }

  // map initialization and methods
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
          const parsed = parseFloat(distance.replace(/[^0-9.]/g, ''));
          this.distanceValue = isNaN(parsed) ? 0 : parsed;
          console.log('Distance in km:', this.distanceValue);
        } else {
          alert('Directions request failed: ' + status);
        }
      }
    );
  }

  blurMethod() {
    // let abc = this.bookingForm.get('vehicleNameSearchControl')?.value;
    const vehicleId = this.bookingForm.get('vehicleId')?.value;
    console.log('Vehicle ID:', vehicleId);
    let abc = this.vehicleNameObj.filter(item => item.vehicleId === vehicleId);
    if (abc.length > 0) {
      const vehicle = abc[0];
      let convenienceFee = vehicle.convenienceFee;
      let pricePerKm = vehicle.pricePerKm;
      let refundableAmt = vehicle.refundableAmt;
      console.log('Convenience Fee:', convenienceFee);
      console.log('Price Per Km:', pricePerKm);
      console.log('Refundable Amount:', refundableAmt);
      let totalAmount = (this.distanceValue * pricePerKm) + convenienceFee + refundableAmt;
      console.log('Total Amount:', totalAmount);
    } else {

    }
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

  onClientLocationChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = Number(target.value);
    console.log(selectedId);
    const selectedLocation = this.clientLocation.find(
      loc => {
        console.log(loc);
        return Number(loc.clientLocationId) === selectedId;
      }
    );
    console.log(selectedLocation);
    if (selectedLocation) {
      // Do something with selectedLocation
      console.log('Selected location:', selectedLocation);
    }
    this.bookingForm.controls['pickupLocation'].setValue(selectedLocation.locationName);
    this.myInputRef.nativeElement.click();
    this.myInputRef.nativeElement.focus();
  }

}