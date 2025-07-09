import { Component, ViewChild } from '@angular/core';
import { BrandService } from '../../../core/services/admin-service/brand-master/brand.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from "../../material/material.module";

@Component({
  selector: 'app-brand-master',
  templateUrl: './brand-master.component.html',
  styleUrl: './brand-master.component.css'
})
export class BrandMasterComponent {
  
   brands: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.fetchBrands(this.currentPage, this.pageSize);
  }

  fetchBrands(page: number, size: number): void {
    this.brandService.getBrands(page, size).subscribe(response => {
      console.log(response);
      this.brands = response;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchBrands(this.currentPage, this.pageSize);
  }

}
