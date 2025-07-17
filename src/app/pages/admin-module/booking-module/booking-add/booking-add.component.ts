import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styleUrl: './booking-add.component.css'
})
export class BookingAddComponent {

  bookingForm!: FormGroup;

  userNameSearchControl = new FormControl('');
  userNameFilteredOptions: any[] = [];

  constructor(private bookingService: BookingService, private router: Router, private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.bookingForm = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      vehicleId: new FormControl('', [Validators.required]),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      pickupLocation: new FormControl(''),
      dropLocation: new FormControl(''),
      paymentMode: new FormControl('UPI', [Validators.required]),

      paymentStatus: new FormControl(''),
      paymentReference: new FormControl(''),
      totalAmount: new FormControl(''),
      discountAmount: new FormControl(''),

      finalAmount: new FormControl('')
    });
  }

  setValue(item: any) {
    this.bookingForm.get('userId')?.setValue(item.userId);
    // this.displayUserName = item.userName;
    this.userNameSearchControl.setValue(item.userName, { emitEvent: false });  // Prevent triggering valueChanges
    this.userNameFilteredOptions = []; // Clear the options after selection
    console.log('Selected user:', item.userName);
  }

  

}
