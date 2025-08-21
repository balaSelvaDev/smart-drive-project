import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { BookingAddRequestDTO } from '../../../../core/models/classes/booking-module/booking-add-request-dto';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewVehicleDetailsComponent } from '../view-vehicle-details/view-vehicle-details.component';
import { NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ViewUserDeatilsComponent } from '../view-user-deatils/view-user-deatils.component';

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
  vehicleDetailsObj: any = {};

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
  isVehicleDetailsVisible: boolean = false;
  isUserDetailsVisible: boolean = false;

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
    this.initMapClick();
  }

  constructor(
    private vehicleService: VehicleService, private bookingService: BookingService,
    private router: Router, private http: HttpClient,
    private dialog: MatDialog, private datePipe: DatePipe,
    private modalService: NgbModal, private userService: UserService
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

      bookingType: new FormControl("ONE_WAY"),

      distanceKm: new FormControl(''),
      tripAmt: new FormControl(''),
      convenienceAmt: new FormControl(''),
      refundableAmt: new FormControl(''),

      brandName: new FormControl(''),
      vehicleModelName: new FormControl(''),

      paymentStatus: new FormControl('PENDING'),
      paymentReference: new FormControl(''),
      totalAmount: new FormControl(''),
      discountAmount: new FormControl(''),

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
    this.setDefaultRange(); // sets fromDate, toDate, fromTime, toTime
    this.updateSelectedRange(); // <-- ensure UI has value on page load
  }

  setUserIdInForm(item: any) {
    this.bookingForm.get('userId')?.setValue(item.userId);
    // this.displayUserName = item.userName;
    this.userNameSearchControl.setValue(item.userName, { emitEvent: false });  // Prevent triggering valueChanges
    this.userNameFilteredOptions = []; // Clear the options after selection
    console.log('Selected user:', item.userName);
    this.bookingForm.controls['drivingLicenseNumber'].setValue(item.drivingLicense);
    this.isUserDetailsVisible = true;
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
    this.isVehicleDetailsVisible = true;
    this.getVehicleDetailsById(item.vehicleId);
  }

  onInputChangeVehicle(value: string) {
    console.log('Current Input Value:', value);
    if (value === "") {
      console.log("empty");
      this.isVehicleDetailsVisible = false;
    }
  }

  onInputChangeUser(value: string) {
    console.log('Current Input Value:', value);
    if (value === "") {
      console.log("empty");
      this.isUserDetailsVisible = false;
    }
  }


  onSubmit(): void {
    const payload = this.bookingForm.value;
    console.log('Form submitted with payload:', payload);
    if (this.bookingForm.valid) {
      console.log('Form submitted with payload:', payload);
      const bookingAddRequest: BookingAddRequestDTO = {
        ...payload,
        startDate: this.convertToLocalDateTimeFormat(payload.startDate),
        endDate: this.convertToLocalDateTimeFormat(payload.endDate),
      };
      console.log('Booking Add Request DTO:', bookingAddRequest);
      // this.bookingService.addBooking(bookingAddRequest).subscribe({
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

      // Push formatted address to form
      if (place.formatted_address) {
        this.bookingForm.controls['pickupLocation'].setValue(place.formatted_address);
      }
    });

    endAutocomplete.addListener('place_changed', () => {
      const place = endAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      this.setEndLocation(place.geometry.location);

      // Push formatted address to form
      if (place.formatted_address) {
        this.bookingForm.controls['dropLocation'].setValue(place.formatted_address);
      }
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

        // Update the visible input field
        const input = document.getElementById(type) as HTMLInputElement;
        input.value = address;

        // Update the reactive form
        if (type === 'start') {
          this.bookingForm.controls['pickupLocation'].setValue(address);
        } else {
          this.bookingForm.controls['dropLocation'].setValue(address);
        }
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

          // alert(`Distance: ${distance}, Duration: ${duration}`);
          const parsed = parseFloat(distance.replace(/[^0-9.]/g, ''));
          this.distanceValue = isNaN(parsed) ? 0 : parsed;
          console.log('Distance in km:', this.distanceValue);
          this.blurMethod();
        } else {
          alert('Directions request failed: ' + status);
        }
      }
    );
  }

  blurMethod() {
    // let abc = this.bookingForm.get('vehicleNameSearchControl')?.value;
    const origin = this.bookingForm.get('pickupLocation')?.value;
    const destination = this.bookingForm.get('dropLocation')?.value;
    if (origin && destination) {
      this.getDistance(origin, destination);
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
    this.clearFinalAmtFields();
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

  isClientLocation() {
    this.isClientLocationRequired = !this.isClientLocationRequired;
    if (this.isClientLocationRequired) {
      if (this.clientLocation.length > 0) {
        this.bookingForm.controls['pickupLocation'].setValue(this.clientLocation[0].locationName);
      }
    } else {
      this.bookingForm.controls['pickupLocation'].setValue("");
    }

  }

  getVehicleDetailsById(vehicleId: number) {
    // const vehicleId = this.bookingForm.get('vehicleId')?.value;
    console.log('Vehicle ID for dialog:', vehicleId);
    this.vehicleService.getIndividualVehicleDetails(vehicleId).subscribe({
      next: (res) => {
        console.log('Client location data:', res);
        this.vehicleDetailsObj = res;
      },
      error: (err) => {
        console.error('Failed to get client location', err);
      },
    });
  }

  openVehicleDialog() {
    if (this.vehicleDetailsObj) {
      this.dialog.open(ViewVehicleDetailsComponent, {
        width: '1200px',
        height: '560px',
        data: this.vehicleDetailsObj, // pass response directly
        panelClass: 'custom-dialog-container'
        // ,disableClose: true
      });
    }
  }

  openUserDialog() {
    const vehicleId = this.bookingForm.get('userId')?.value;
    console.log('Vehicle ID for dialog:', vehicleId);
    this.userService.getUsersById(vehicleId).subscribe({
      next: (res) => {
        console.log('Client location data:', res);
        this.dialog.open(ViewUserDeatilsComponent, {
          width: '1200px',
          height: '560px',
          data: res, // pass response directly
          panelClass: 'custom-dialog-container'
          // ,disableClose: true
        });
      },
      error: (err) => {
        console.error('Failed to get client location', err);
      },
    });
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // datepicker function code
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  hoveredDate: NgbDateStruct | null = null;

  fromTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 17, minute: 0, second: 0 };

  today = new Date();
  selectedRange: string = '';
  validationError: string = '';

  selectedFromFormattedRange: string = '';
  selectedToFormattedRange: string = '';

  openPicker(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isFrom(date: NgbDateStruct) {
    return this.fromDate && this.equals(date, this.fromDate);
  }

  isTo(date: NgbDateStruct) {
    return this.toDate && this.equals(date, this.toDate);
  }

  isInside(date: NgbDateStruct) {
    return this.toDate && this.fromDate && this.after(date, this.fromDate) && this.before(date, this.toDate);
  }

  isRange(date: NgbDateStruct) {
    return this.isFrom(date) || this.isTo(date) || this.isInside(date);
  }

  equals(one: NgbDateStruct, two: NgbDateStruct) {
    return one.year === two.year && one.month === two.month && one.day === two.day;
  }

  before(one: NgbDateStruct, two: NgbDateStruct) {
    if (one.year === two.year) {
      if (one.month === two.month) {
        return one.day < two.day;
      }
      return one.month < two.month;
    }
    return one.year < two.year;
  }

  after(one: NgbDateStruct, two: NgbDateStruct) {
    if (one.year === two.year) {
      if (one.month === two.month) {
        return one.day > two.day;
      }
      return one.month > two.month;
    }
    return one.year > two.year;
  }

  isDisabled = (date: NgbDateStruct) => {
    // Optional: disable past dates
    const today = new Date();
    const check = new Date(date.year, date.month - 1, date.day);
    return check < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  applySelection(modal: any) {
    this.validationError = '';
    if (this.fromDate && this.toDate) {
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      if (toDateTime < fromDateTime) {
        this.validationError = 'End date & time cannot be earlier than start date & time.';
        return;
      }

      this.updateSelectedRange();
      modal.close();
    }
  }

  updateSelectedRange() {
    console.log("updateSelectedRange method..");
    if (this.fromDate && this.toDate) {
      console.log("updateSelectedRange method 1 ..");
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      const fromFormatted = this.datePipe.transform(fromDateTime, 'dd/MM/yyyy hh:mm a', 'IST');
      const toFormatted = this.datePipe.transform(toDateTime, 'dd/MM/yyyy hh:mm a', 'IST');

      this.selectedRange = `[ ${fromFormatted} ] → [ ${toFormatted} ]`;
      this.selectedFromFormattedRange = fromFormatted || '';
      this.selectedToFormattedRange = toFormatted || '';
      this.bookingForm.controls['startDate'].setValue(this.selectedFromFormattedRange);
      this.bookingForm.controls['endDate'].setValue(this.selectedToFormattedRange);

    }
  }

  isInvalid(date: NgbDateStruct): boolean {
    if (this.fromDate && this.toDate) {
      // highlight everything if invalid
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );
      return toDateTime < fromDateTime;
    }
    return false;
  }
  setDefaultRange() {
    const now = new Date();

    // fromDate = today
    this.fromDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.fromTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // toDate = tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.toDate = { year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1, day: tomorrow.getDate() };
    this.toTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // ✅ update UI text right away
    // this.updateSelectedRange();
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  distanceKm: number = 0;
  fuelEstimate: number = 0;

  distance: string = '';
  duration: string = '';

  tripAmt: number = 0;
  convenienceAmt: number = 0;
  refundableAmt: number = 0;
  totalAmount: number = 0;

  distanceLoaded: boolean = false;

  getDistance(origin1: string, destination1: string): void {
    const origin = origin1;
    const destination = destination1;

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (
          status === 'OK' &&
          response &&
          response.rows?.[0]?.elements?.[0]
        ) {
          const element = response.rows[0].elements[0];
          this.distance = element.distance?.text || 'N/A';
          this.duration = element.duration?.text || 'N/A';

          // Extract numeric distance from "2.3 km"
          const km = parseFloat(element.distance?.text.replace(' km', '') || '0');
          this.distanceKm = km;


          if (this.vehicleDetailsObj) {
            console.log("entering...", this.vehicleDetailsObj)


            // Assume mileage 15 km/l, fuel ₹105 per litre
            // this.fuelEstimate = Math.round((km / this.vehicleDetailsObj.mileagePerLitre) * 105);
            // console.log('Distance:', this.distance, 'Duration:', this.duration, 'mileage per litre: ', this.vehicleDetailsObj.mileagePerLitre, 'Fuel Estimate:', this.fuelEstimate);

            //
            console.log('Calculating trip amount, convenience fee, and refundable amount');
            console.log('Price per km:', this.vehicleDetailsObj.pricePerKm, 'Distance in km:', this.distanceValue);
            this.tripAmt = this.vehicleDetailsObj.pricePerKm * this.distanceValue;
            this.convenienceAmt = this.vehicleDetailsObj.convenienceFee;
            this.refundableAmt = this.vehicleDetailsObj.refundableAmt;
            console.log('Trip Amount:', this.tripAmt, 'Convenience Fee:', this.convenienceAmt, 'Refundable Amount:', this.refundableAmt);
            this.totalAmount = this.tripAmt + this.convenienceAmt + this.refundableAmt;
            // ✅ Set loaded flag after fetching distance
            this.distanceLoaded = true;
            this.clearFinalAmtFields();
            this.bookingForm.controls['distanceKm'].setValue(this.distanceValue + " Km");
            this.bookingForm.controls['tripAmt'].setValue(this.tripAmt);
            this.bookingForm.controls['convenienceAmt'].setValue(this.convenienceAmt);
            this.bookingForm.controls['refundableAmt'].setValue(this.refundableAmt);
            this.bookingForm.controls['totalAmount'].setValue(this.totalAmount);
          }
        } else {
          this.distance = 'Error fetching distance';
          this.duration = 'N/A';
        }

        // ✅ Set loaded flag after completion
        this.distanceLoaded = true;
      }
    );
  }

  clearFinalAmtFields() {
    this.bookingForm.controls['distanceKm'].setValue("");
    this.bookingForm.controls['tripAmt'].setValue("");
    this.bookingForm.controls['convenienceAmt'].setValue("");
    this.bookingForm.controls['refundableAmt'].setValue("");
    this.bookingForm.controls['totalAmount'].setValue("");
  }

  checkBookingAvaiabilityById(vehicleId: string, content: TemplateRef<any>) {
    let vehicleId1 = this.bookingForm.controls['vehicleId'].value;
    let startDate = this.bookingForm.controls['startDate'].value;
    let endDate = this.bookingForm.controls['endDate'].value;
    startDate = "2025-07-31T10:00:00";
    endDate = "2025-07-01T10:00:00";
    console.log(vehicleId1);
    if (vehicleId1) {
      this.vehicleService.getIndividualVehicleDetailsForSearchResultForAdmin(startDate, endDate, Number(vehicleId1)).subscribe({
        next: (res) => {
          console.log('Client location data:', res);
          if (res.availabilityStatus === "BOOKED") {
            this.modalService.open(content, { size: 'lg', centered: true });
          }
        },
        error: (err) => {
          console.error('Failed to get client location', err);
        },
      });
    }
  }

  clearAmtFields() {
    let pickupLocation = this.bookingForm.controls['pickupLocation'].value;
    let dropLocation = this.bookingForm.controls['dropLocation'].value;
    if (pickupLocation === "" || dropLocation === "") {
      this.clearFinalAmtFields();
    }
  }

  // date format ( 31/07/2025 05:57 PM to "2025-07-31T17:57:00" )
  convertToLocalDateTimeFormat(dateStr: string): string {
    // Example input: "31/07/2025 05:57 PM"
    const [datePart, timePart, meridian] = dateStr.split(/[\s:]+/);
    const [day, month, year] = datePart.split('/').map(Number);
    let hour = parseInt(timePart, 10);
    const minute = parseInt(dateStr.split(':')[1], 10);

    // Convert hour based on AM/PM
    if (meridian === 'PM' && hour !== 12) {
      hour += 12;
    } else if (meridian === 'AM' && hour === 12) {
      hour = 0;
    }

    // Create LocalDateTime-like ISO string
    const isoString = `${year}-${this.pad(month)}-${this.pad(day)}T${this.pad(hour)}:${this.pad(minute)}:00`;
    return isoString;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

}