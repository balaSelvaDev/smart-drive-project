import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerLoginPopupComponent } from '../anonymous/customer-login-popup/customer-login-popup.component';

@Component({
  selector: 'app-anonymous-header',
  templateUrl: './anonymous-header.component.html',
  styleUrl: './anonymous-header.component.css'
})
export class AnonymousHeaderComponent {

  constructor(private router: Router, private dialog: MatDialog) { }

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

}
