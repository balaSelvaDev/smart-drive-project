import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BrandService } from '../../../../core/services/admin-service/brand-master/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-get',
  templateUrl: './brand-get.component.html',
  styleUrl: './brand-get.component.css'
})
export class BrandGetComponent {

  brands: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private brandService: BrandService, private router: Router) { }

  ngOnInit(): void {
    this.fetchBrands(this.currentPage, this.pageSize);
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

}
