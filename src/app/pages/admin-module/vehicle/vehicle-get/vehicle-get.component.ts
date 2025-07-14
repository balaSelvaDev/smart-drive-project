import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-get',
  templateUrl: './vehicle-get.component.html',
  styleUrl: './vehicle-get.component.css'
})
export class VehicleGetComponent {

  constructor(private router: Router) { }

  navigateToAddVehicle() {
    this.router.navigate(['/admin/add-vehicle']); // absolute navigation
  }

}
