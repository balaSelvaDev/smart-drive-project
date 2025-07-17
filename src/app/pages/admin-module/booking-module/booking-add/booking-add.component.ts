import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';

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

  constructor(private bookingService: BookingService, private router: Router, private http: HttpClient
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

      paymentStatus: new FormControl(''),
      paymentReference: new FormControl(''),
      totalAmount: new FormControl(''),
      discountAmount: new FormControl(''),

      finalAmount: new FormControl('')
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
    console.log('Selected vehicle:', item.vehicleName);
    this.bookingForm.controls['brandName'].setValue(item.brandName);
    this.bookingForm.controls['vehicleModelName'].setValue(item.vehicleModelName);
  }



}
