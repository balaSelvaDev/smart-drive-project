import { DatePipe } from '@angular/common';
import { Component, inject, NgZone, TemplateRef } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerMethodService } from '../../../../shared/resuable service/date-picker-method.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private ngZone: NgZone, private modalService: NgbModal,
    private datePipe: DatePipe, private datePickerMethod: DatePickerMethodService,
    private route: ActivatedRoute
  ) {
    this.setDefaultRange(); // sets fromDate, toDate, fromTime, toTime
    this.updateSelectedRange(); // <-- ensure UI has value on page load
  }

  ngOnInit(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    this.startDate = this.toDateTimeLocalString(now);
    this.endDate = this.toDateTimeLocalString(tomorrow);

    // this.calculateDistances();
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('jwt', token);
        // Optionally remove token from URL
        window.history.replaceState({}, '', '/home');
      }
    });
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
    if (this.fromDate && this.toDate) {
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

}
