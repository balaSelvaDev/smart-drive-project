import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MainPageToSearchResultService } from '../../../../shared/component/main-page-to-search-result.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.css'
})
export class SearchResultPageComponent {

  hoveredIndex: number | null = null;
  locationAndDate!: FormGroup;

  fromDateDisplay: string = '';
  toDateDisplay: string = '';
  fromTimeDisplay: string = '';
  toTimeDisplay: string = '';

  vehicleResult: any[] = [];
  totalItems = 0;
  pageSize = 12;
  currentPage = 0;

  constructor(private vehicleService: VehicleService, private router: Router,
    private dialog: MatDialog, private datePipe: DatePipe, private mainPageToSearchResult: MainPageToSearchResultService
  ) { }

  ngOnInit(): void {
    let ab = this.mainPageToSearchResult.getData();
    this.locationAndDate = new FormGroup({
      pickupLocation: new FormControl(ab.pickupLocation, [Validators.required]),
      dropLocation: new FormControl(ab.dropLocation, [Validators.required]),
      pickupDateTime: new FormControl(ab.pickupDateTime, [Validators.required]),
      dropDateTime: new FormControl(ab.dropDateTime, [Validators.required])
    });
    this.fetchVehicles(this.currentPage, this.pageSize);
    this.setDefaultValues();


    console.log(this.mainPageToSearchResult.getData())
  }

  ngAfterViewInit(): void {
    // Disable auto sliding for all carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel: any) => {
      new bootstrap.Carousel(carousel, {
        interval: false,   // stop auto sliding
        ride: false,       // disable riding
        pause: false       // no resume on hover
      });
    });
  }

  abc = "10/07/2025 10:05 AM";
  xyz = "10/07/2025 10:30 AM";

  fetchVehicles(page: number, size: number): void {
    let userPickupDatetime: any = this.datePipe.transform(this.parseCustomDate(this.abc), 'yyyy-MM-dd\'T\'HH:mm:ss');
    let userDropDatetime: any = this.datePipe.transform(this.parseCustomDate(this.xyz), 'yyyy-MM-dd\'T\'HH:mm:ss');
    let isVisibleOnline: Boolean = true;
    let vehicleStatus: String = 'Active';
    this.vehicleService.getIndividualVehicleDetailsForSearchResult(page, size, userPickupDatetime, userDropDatetime, isVisibleOnline, vehicleStatus).subscribe(response => {
      console.log(response);
      this.vehicleResult = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
      console.log('Fetched vehicles:', this.vehicleResult);
    });
  }

  setDefaultValues() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    this.fromDateDisplay = this.datePipe.transform(this.parseCustomDate(this.abc), 'dd MMM')!;
    this.fromTimeDisplay = this.datePipe.transform(this.parseCustomDate(this.abc), 'h:mm a')!;

    this.toDateDisplay = this.datePipe.transform(this.parseCustomDate(this.xyz), 'dd MMM')!;
    this.toTimeDisplay = this.datePipe.transform(this.parseCustomDate(this.xyz), 'h:mm a')!;
  }

  parseCustomDate(dateStr: string) {
    const [datePart, timePart, meridian] = dateStr.split(/[\s]+/); // split into ["30/07/2025", "07:14", "PM"]
    const [day, month, year] = datePart.split("/").map(Number);
    let [hours, minutes] = timePart.split(":").map(Number);

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  }

  navigateToVehicleDetails(vehicleId: number): void {
    console.log('Navigating to vehicle details for ID:', vehicleId);
    this.router.navigate(['customer/individual-car', vehicleId]);
  }

}
