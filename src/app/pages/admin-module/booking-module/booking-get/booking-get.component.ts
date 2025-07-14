import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-get',
  templateUrl: './booking-get.component.html',
  styleUrl: './booking-get.component.css'
})
export class BookingGetComponent {

  constructor(private router: Router) { }

  navigateToAddBooking() {
    this.router.navigate(['/admin/add-booking']); // absolute navigation
  }

}
