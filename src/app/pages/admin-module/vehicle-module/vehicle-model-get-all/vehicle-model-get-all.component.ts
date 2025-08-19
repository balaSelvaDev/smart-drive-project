import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VehicleModelService } from '../../../../core/services/admin-service/vehicle-model/vehicle-model.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-model-get-all',
  templateUrl: './vehicle-model-get-all.component.html',
  styleUrl: './vehicle-model-get-all.component.css'
})
export class VehicleModelGetAllComponent {

  brands: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private vehicleModelService: VehicleModelService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchBrands(this.currentPage, this.pageSize);
  }

  fetchBrands(page: number, size: number): void {
    this.vehicleModelService.getVehicleModels(page, size).subscribe(response => {
      console.log(response);
      this.brands = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchBrands(this.currentPage, this.pageSize);
  }

  navigateToAddBrand() {
    this.router.navigate(['/admin/add-vehicle-model']); // absolute navigation
  }

  editBrand(vehicleModelId: number) {
    this.router.navigate(['/admin/edit-vehicle-model', vehicleModelId]); // pass ID in URL
  }

  deleteBrand(brandId: number) {
    if (confirm('Are you sure you want to delete this brand?')) {
      console.log('Deleting brand with ID:', brandId);
      // TODO: call delete API
      this.vehicleModelService.deleteVehicleModels(brandId).subscribe(response => {
        console.log(response);
        this.reloadCurrentComponent();
      });
    }
  }
  reloadCurrentComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
