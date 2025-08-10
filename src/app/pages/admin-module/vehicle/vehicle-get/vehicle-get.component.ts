import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';

@Component({
  selector: 'app-vehicle-get',
  templateUrl: './vehicle-get.component.html',
  styleUrl: './vehicle-get.component.css'
})
export class VehicleGetComponent {

  constructor(private vehicleService: VehicleService, private router: Router) { }

  navigateToAddVehicle() {
    this.router.navigate(['/admin/add-vehicle']); // absolute navigation
  }

  vehicles: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchVehicles(this.currentPage, this.pageSize);
  }

  fetchVehicles(page: number, size: number): void {
    this.vehicleService.getVehicles(page, size).subscribe(response => {
      console.log(response);
      this.vehicles = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchVehicles(this.currentPage, this.pageSize);
  }

  editVehicle(vehicleId: number) {
    this.router.navigate(['/admin/edit-vehicle', vehicleId]); // pass ID in URL
  }

  deleteVehicle(vehicleId: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      console.log('Deleting vehicle with ID:', vehicleId);
      // TODO: call delete API
      // this.vehicleModelService.deleteVehicleModels(vehicleId).subscribe(response => {
      //   console.log(response);
      //   this.reloadCurrentComponent();
      // });
    }
  }
  reloadCurrentComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
