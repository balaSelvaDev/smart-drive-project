import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-booking-price',
  templateUrl: './view-booking-price.component.html',
  styleUrl: './view-booking-price.component.css'
})
export class ViewBookingPriceComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewBookingPriceComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

}
