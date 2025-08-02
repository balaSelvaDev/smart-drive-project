import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BrandService } from '../../../../core/services/admin-service/brand-master/brand.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../../shared/service/web-socket-service.service';

@Component({
  selector: 'app-brand-get',
  templateUrl: './brand-get.component.html',
  styleUrl: './brand-get.component.css'
})
export class BrandGetComponent {

  notifications: any[] = [];

  brands: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private brandService: BrandService, private router: Router,
    // private wsService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.fetchBrands(this.currentPage, this.pageSize);
    // this.wsService.getOrderNotifications().subscribe(data => {
    //   this.notifications.unshift(data);
    // });
  }

  fetchBrands(page: number, size: number): void {
    this.brandService.getBrands(page, size).subscribe(response => {
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
    this.router.navigate(['/admin/add-brand']); // absolute navigation
  }

  editBrand(brandId: number) {
    this.router.navigate(['/admin/edit-brand', brandId]); // pass ID in URL
  }

  deleteBrand(brandId: number) {
    if (confirm('Are you sure you want to delete this brand?')) {
      console.log('Deleting brand with ID:', brandId);
      // TODO: call delete API
      this.brandService.deleteBrand(brandId).subscribe(response => {
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
