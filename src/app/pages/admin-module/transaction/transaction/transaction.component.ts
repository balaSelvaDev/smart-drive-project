import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/admin-service/booking-module/booking.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaymentPopupComponent } from '../payment-popup/payment-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  constructor(private router: Router, private bookingService: BookingService, private dialog: MatDialog) { }

  navigateToAddUser() {
    this.router.navigate(['/admin/add-user']); // absolute navigation
  }

  bookingDetails: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  fetchUsers(page: number, size: number): void {
    this.bookingService.getgetAllBookingApiUsers(page, size).subscribe(response => {
      console.log(response);
      this.bookingDetails = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  editUser(userId: number) {
    this.router.navigate(['/admin/edit-user', userId]); // pass ID in URL
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user with ID:', userId);
      // TODO: call delete API
      // this.vehicleModelService.deleteVehicleModels(userId).subscribe(response => {
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

  openPaymentPopup(row: any) {
    console.log("row:: ", row)
    // Calculate how much has been paid so far (if you have it)
    const alreadyPaidAmount = row.alreadyPaidAmount || 0;

    // Pass necessary fields to the popup
    const popupData = {
      bookingId: row.bookingId,
      userId: row.userId,
      totalAmount: row.totalAmount,
      pendingAmt: row.pendingAmt,
      alreadyPaidAmount: alreadyPaidAmount
    };

    const dialogRef = this.dialog.open(PaymentPopupComponent, {
      width: '900px',
      height: '300px',
      data: popupData  // <-- here you pass the data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Payment submitted:', result);
        // call your API to save payment
      }
    });
  }

}
