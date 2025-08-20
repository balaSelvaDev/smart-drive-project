import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  stats = {
    users: 120,
    preBookings: 35,
    vehicles: 50,
    activeBookings: 12
  };

  recentBookings = [
    { userName: 'John Doe', pickupLocation: 'Chennai', dropLocation: 'Bangalore', kilometer: 350, paymentStatus: 'Paid', userType: 'Regular' },
    { userName: 'Jane Smith', pickupLocation: 'Delhi', dropLocation: 'Agra', kilometer: 210, paymentStatus: 'Pending', userType: 'Premium' },
    { userName: 'Rahul Kumar', pickupLocation: 'Mumbai', dropLocation: 'Pune', kilometer: 150, paymentStatus: 'Paid', userType: 'Regular' }
  ];

  

}
