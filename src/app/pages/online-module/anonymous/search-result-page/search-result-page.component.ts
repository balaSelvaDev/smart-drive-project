import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MainPageToSearchResultService } from '../../../../shared/component/main-page-to-search-result.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { main } from '@popperjs/core';

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
  pageSize = 6;
  currentPage = 0;

  resultCurrentPage = 0;

  constructor(private vehicleService: VehicleService, private router: Router,
    private dialog: MatDialog, private datePipe: DatePipe,
    private mainPageToSearchResult: MainPageToSearchResultService,
    private modalService: NgbModal, private route: ActivatedRoute
  ) { }

  startDate: string = '';
  endDate: string = '';

  mainPageObj: any;

  ngOnInit(): void {
    this.mainPageObj = this.mainPageToSearchResult.getData();
    this.locationAndDate = new FormGroup({
      pickupLocation: new FormControl(this.mainPageObj.pickupLocation, [Validators.required]),
      dropLocation: new FormControl(this.mainPageObj.dropLocation, [Validators.required]),
      pickupDateTime: new FormControl(this.mainPageObj.pickupDateTime, [Validators.required]),
      dropDateTime: new FormControl(this.mainPageObj.dropDateTime, [Validators.required])
    });
    this.fetchVehicles(this.currentPage, this.pageSize, this.mainPageObj.pickupDateTime, this.mainPageObj.dropDateTime);
    console.log(this.mainPageToSearchResult.getData())

    this.setDefaultValues(this.mainPageObj.pickupDateTime, this.mainPageObj.dropDateTime);

    //
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    this.startDate = this.toDateTimeLocalString(now);
    this.endDate = this.toDateTimeLocalString(tomorrow);

    // this.calculateDistances();
    // this.route.queryParams.subscribe(params => {
    //   const token = params['token'];
    //   if (token) {
    //     localStorage.setItem('jwt', token);
    //     window.history.replaceState({}, '', '/home');
    //   }
    // });
    this.setDefaultRange(); // sets fromDate, toDate, fromTime, toTime
    this.updateSelectedRange(false); // <-- ensure UI has value on page load
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

  // abc = "10/07/2025 10:05 AM";
  // xyz = "10/07/2025 10:30 AM";

  setDefaultValues(fromDateStr: string, toDateStr: string): void {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    this.fromDateDisplay = this.datePipe.transform(this.parseCustomDate(fromDateStr), 'dd MMM')!;
    this.fromTimeDisplay = this.datePipe.transform(this.parseCustomDate(fromDateStr), 'h:mm a')!;

    this.toDateDisplay = this.datePipe.transform(this.parseCustomDate(toDateStr), 'dd MMM')!;
    this.toTimeDisplay = this.datePipe.transform(this.parseCustomDate(toDateStr), 'h:mm a')!;
  }

  parseCustomDate(dateStr: string) {
    const [datePart, timePart, meridian] = dateStr.split(/[\s]+/); // split into ["30/07/2025", "07:14", "PM"]
    const [day, month, year] = datePart.split("/").map(Number);
    let [hours, minutes] = timePart.split(":").map(Number);

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  }

  fetchVehicles(page: number, size: number, pickupDateTime: string, dropDateTime: string): void {
    // if (this.resultCurrentPage !== this.currentPage) {
    let userPickupDatetime: any = this.datePipe.transform(this.parseCustomDate(pickupDateTime), 'yyyy-MM-dd\'T\'HH:mm:ss');
    let userDropDatetime: any = this.datePipe.transform(this.parseCustomDate(dropDateTime), 'yyyy-MM-dd\'T\'HH:mm:ss');
    let isVisibleOnline: Boolean = true;
    let vehicleStatus: String = 'Active';
    this.vehicleService.getIndividualVehicleDetailsForSearchResult(page, size, userPickupDatetime, userDropDatetime, isVisibleOnline, vehicleStatus).subscribe(response => {
      console.log(response);
      if (response.content.length === 0) {
        // No vehicles found
        alert('No vehicles found for the selected criteria.');
      } else {
        this.vehicleResult.push(...response.content);
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        if (response.currentPage < response.totalPages) {
          this.resultCurrentPage = response.currentPage + 1;
        }
        console.log('curresultCurrentPage:', this.resultCurrentPage);
        console.log('Fetched vehicles:', this.vehicleResult);
      }

    });
    // }

  }



  navigateToVehicleDetails(vehicleId: number): void {
    console.log('Navigating to vehicle details for ID:', vehicleId);
    this.router.navigate(['customer/individual-car', vehicleId]);
  }

  // ----------------
  // date picker code
  // ----------------

  fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  hoveredDate: NgbDateStruct | null = null;

  fromTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 17, minute: 0, second: 0 };

  today = new Date();
  selectedRange: string = '';
  validationError: string = '';

  selectedFromFormattedRange: string = '';
  selectedToFormattedRange: string = '';

  openPicker(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isFrom(date: NgbDateStruct) {
    return this.fromDate && this.equals(date, this.fromDate);
  }

  isTo(date: NgbDateStruct) {
    return this.toDate && this.equals(date, this.toDate);
  }

  isInside(date: NgbDateStruct) {
    return this.toDate && this.fromDate && this.after(date, this.fromDate) && this.before(date, this.toDate);
  }

  isRange(date: NgbDateStruct) {
    return this.isFrom(date) || this.isTo(date) || this.isInside(date);
  }

  equals(one: NgbDateStruct, two: NgbDateStruct) {
    return one.year === two.year && one.month === two.month && one.day === two.day;
  }

  before(one: NgbDateStruct, two: NgbDateStruct) {
    if (one.year === two.year) {
      if (one.month === two.month) {
        return one.day < two.day;
      }
      return one.month < two.month;
    }
    return one.year < two.year;
  }

  after(one: NgbDateStruct, two: NgbDateStruct) {
    if (one.year === two.year) {
      if (one.month === two.month) {
        return one.day > two.day;
      }
      return one.month > two.month;
    }
    return one.year > two.year;
  }

  isDisabled = (date: NgbDateStruct) => {
    // Optional: disable past dates
    const today = new Date();
    const check = new Date(date.year, date.month - 1, date.day);
    return check < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  applySelection(modal: any, flag: boolean) {
    this.validationError = '';
    if (this.fromDate && this.toDate) {
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      if (toDateTime < fromDateTime) {
        this.validationError = 'End date & time cannot be earlier than start date & time.';
        return;
      }

      this.updateSelectedRange(flag);
      modal.close();
    }
  }

  updateSelectedRange(flag: boolean) {
    // console.log("updateSelectedRange method..");
    if (this.fromDate && this.toDate) {
      // console.log("updateSelectedRange method 1 ..");
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      const fromFormatted = this.datePipe.transform(fromDateTime, 'dd/MM/yyyy hh:mm a', 'IST');
      const toFormatted = this.datePipe.transform(toDateTime, 'dd/MM/yyyy hh:mm a', 'IST');

      this.selectedRange = `[ ${fromFormatted} ] → [ ${toFormatted} ]`;
      this.selectedFromFormattedRange = fromFormatted || '';
      this.selectedToFormattedRange = toFormatted || '';
      this.locationAndDate.controls['pickupDateTime'].setValue(this.selectedFromFormattedRange);
      this.locationAndDate.controls['dropDateTime'].setValue(this.selectedToFormattedRange);
      let mainPageObj = this.mainPageToSearchResult.getData();
      console.log(mainPageObj);
      mainPageObj.pickupDateTime = this.selectedFromFormattedRange;
      mainPageObj.dropDateTime = this.selectedToFormattedRange;
      this.mainPageToSearchResult.setData(mainPageObj);
      this.setDefaultValues(mainPageObj.pickupDateTime, mainPageObj.dropDateTime);

      if (flag) {
        this.fetchVehicles(this.currentPage, this.pageSize, mainPageObj.pickupDateTime, mainPageObj.dropDateTime);
        this.vehicleResult = [];
      }
      // const storedData = localStorage.getItem('userData');

      // if (storedData) {
      //   const parsedData = JSON.parse(storedData);
      //   console.log(parsedData.userId); // 123
      //   console.log(parsedData.name);   // Bala
      //   console.log(parsedData.role);   // Admin
      // }
    }
  }

  isInvalid(date: NgbDateStruct): boolean {
    if (this.fromDate && this.toDate) {
      // highlight everything if invalid
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );
      return toDateTime < fromDateTime;
    }
    return false;
  }
  setDefaultRange() {
    const now = new Date();

    // fromDate = today
    this.fromDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.fromTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // toDate = tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.toDate = { year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1, day: tomorrow.getDate() };
    this.toTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // ✅ update UI text right away
    // this.updateSelectedRange();
  }

  private toDateTimeLocalString(date: Date): string {
    // Converts to yyyy-MM-ddTHH:mm (required format for datetime-local)
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

}
