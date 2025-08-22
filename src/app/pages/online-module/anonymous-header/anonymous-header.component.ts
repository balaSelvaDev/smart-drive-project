import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerLoginPopupComponent } from '../anonymous/customer-login-popup/customer-login-popup.component';
import { DatePipe } from '@angular/common';
import { AuthServiceService } from '../../../shared/service/auth-service.service';

@Component({
  selector: 'app-anonymous-header',
  templateUrl: './anonymous-header.component.html',
  styleUrl: './anonymous-header.component.css'
})
export class AnonymousHeaderComponent {

  user: any = null;
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  fromDateDisplay: string = '';
  toDateDisplay: string = '';
  fromTimeDisplay: string = '';
  toTimeDisplay: string = '';

  constructor(
    private router: Router, private dialog: MatDialog, private datePipe: DatePipe,
    public authService: AuthServiceService
  ) {

  }

  ngOnInit(): void {
    this.setDefaultValues();
    this.authService.user$.subscribe(u => {
      this.user = u;
      console.log(this.user)
    });
  }

  openDialog() {
    const myObject = {
      name: 'John Doe',
      age: 30,
      location: 'Chennai'
    };

    this.dialog.open(CustomerLoginPopupComponent, {
      width: '1200px',
      height: '550px',
      data: myObject,
      panelClass: 'custom-dialog-container',
      disableClose: true // ✅ This prevents closing on outside click or ESC
    });
    // subscribe to user updates

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

  openProfile() {
    this.router.navigate(['/customer/profile/basic-info']);
  }

  navigateToHome() {
    this.router.navigate(['/customer/main']);
  }

}
