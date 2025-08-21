import { Component, Inject } from '@angular/core';
import { TransactionService } from '../../../../core/services/admin-service/transaction/transaction.service';
import { PaymentPopupComponent } from '../../../admin-module/transaction/payment-popup/payment-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-booking-popup',
  templateUrl: './confirm-booking-popup.component.html',
  styleUrl: './confirm-booking-popup.component.css'
})
export class ConfirmBookingPopupComponent {

  booking = {
    "distanceKm": "88.9 km",
    "tripAmt": 5334,
    "convenienceAmt": 99,
    "refundableAmt": 1000,
    "totalAmount": 6433,
    "userId": 118,
    "vehicleId": 1,
    "drivingLicenseNumber": "asdfSDF",
    "startDate": this.convertToLocalDateTimeFormat("21/08/2025 04:57 PM"),
    "endDate": this.convertToLocalDateTimeFormat("22/08/2025 04:57 PM"),
    "pickupLocation": "chennai",
    "dropLocation": "madurai",
    "paymentMode": "UPI",
    "bookingType": "ROUND_TRIP",
    "paymentStatus": "PENDING",
    "clientLocationId": 1,
    "paymentReference": "",
    "isClientLocationRequired": false,
    "brandName": "Maruti Suzuki",
    "vehicleModelName": "Swift"
  };

  constructor(
    private dialogRef: MatDialogRef<PaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private transactionService: TransactionService, // passed booking data from table
    private bookingService: BookingService, private router: Router, private http: HttpClient
  ) {
    console.log('Confirm Booking Data:', data);
  }
  ngOnInit(): void {
    // Initialize any required data or state here
    console.log(this.data);
  }

  confirmBooking(): void {
    // Call the booking confirmation API or service here
    this.bookingService.addBooking(this.booking).subscribe({
      next: (res) => {
        console.log('Booking added successfully', res);
        alert("success");
        // this.router.navigate(['/get-booking']); // Navigate to the booking list page
      },
      error: (err) => {
        console.error('Failed to add brand', err);
      },
    });
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
