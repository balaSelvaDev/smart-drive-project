import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styleUrl: './booking-add.component.css'
})
export class BookingAddComponent {

  bookingForm!: FormGroup;

  constructor(private userService: UserService, private router: Router, private http: HttpClient
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

}
