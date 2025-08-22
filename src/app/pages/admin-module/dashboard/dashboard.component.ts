import { Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/admin-service/booking-module/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  stats: any;

  // recentBookings = [
  //   { userName: 'John Doe', pickupLocation: 'Chennai', dropLocation: 'Bangalore', kilometer: 350, paymentStatus: 'Paid', userType: 'Regular' },
  //   { userName: 'Jane Smith', pickupLocation: 'Delhi', dropLocation: 'Agra', kilometer: 210, paymentStatus: 'Pending', userType: 'Premium' },
  //   { userName: 'Rahul Kumar', pickupLocation: 'Mumbai', dropLocation: 'Pune', kilometer: 150, paymentStatus: 'Paid', userType: 'Regular' }
  // ];
  recentBookings: any[] = [];

  constructor(private bookingService: BookingService, private router: Router

  ) { }

  ngOnInit(): void {
    this.bookingService.getCountsDetails().subscribe(response => {
      console.log(response);
      this.stats = {
        users: response.userCount,
        preBookings: 0,
        vehicles: response.vehicleCount,
        activeBookings: 0
      };
      console.log("stats:: " ,this.stats);
    });
    this.bookingService.getBookingDetails().subscribe(response => {
      console.log(response);
      this.recentBookings = response;
    });
  }


}
