import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerLoginPopupComponent } from '../anonymous/customer-login-popup/customer-login-popup.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-anonymous-header',
  templateUrl: './anonymous-header.component.html',
  styleUrl: './anonymous-header.component.css'
})
export class AnonymousHeaderComponent {


  fromDateDisplay: string = '';
  toDateDisplay: string = '';
  fromTimeDisplay: string = '';
  toTimeDisplay: string = '';

  constructor(private router: Router, private dialog: MatDialog, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.setDefaultValues();
  }

  openDialog() {
    const myObject = {
      name: 'John Doe',
      age: 30,
      location: 'Chennai'
    };

    this.dialog.open(CustomerLoginPopupComponent, {
      width: '1200px',
      height: '480px',
      data: myObject,
      panelClass: 'custom-dialog-container',
      disableClose: true // ✅ This prevents closing on outside click or ESC
    });
  }

  setDefaultValues() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    this.fromDateDisplay = this.datePipe.transform(now, 'dd MMM')!;
    this.fromTimeDisplay = this.datePipe.transform(now, 'h:mm a')!;

    this.toDateDisplay = this.datePipe.transform(tomorrow, 'dd MMM')!;
    this.toTimeDisplay = this.datePipe.transform(now, 'h:mm a')!;
  }



}
