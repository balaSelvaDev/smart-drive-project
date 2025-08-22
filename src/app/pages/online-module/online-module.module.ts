import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineModuleRoutingModule } from './online-module-routing.module';
import { AnonymousMainPageComponent } from './anonymous/anonymous-main-page/anonymous-main-page.component';
import { SearchResultPageComponent } from './anonymous/search-result-page/search-result-page.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualCarComponent } from './anonymous/individual-car/individual-car.component';
import { AnonymousHeaderComponent } from './anonymous-header/anonymous-header.component';
import { ViewBookingPriceComponent } from './anonymous/view-booking-price/view-booking-price.component';
import { CustomerLoginPopupComponent } from './anonymous/customer-login-popup/customer-login-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileLayoutComponent } from './anonymous/profile-layout/profile-layout.component';
import { BasicInfoComponent } from './anonymous/basic-info/basic-info.component';
import { KyDetailsComponent } from './anonymous/ky-details/ky-details.component';
import { DashboardComponent } from './anonymous/dashboard/dashboard.component';
import { BookingHistoryComponent } from './anonymous/booking-history/booking-history.component';
import { ConfirmBookingPopupComponent } from './anonymous/confirm-booking-popup/confirm-booking-popup.component';
import { EditKycDetailsComponent } from './anonymous/edit-kyc-details/edit-kyc-details.component';


@NgModule({
  declarations: [
    AnonymousMainPageComponent,
    SearchResultPageComponent,
    IndividualCarComponent,
    AnonymousHeaderComponent,
    ViewBookingPriceComponent,
    CustomerLoginPopupComponent,
    ProfileLayoutComponent,
    BasicInfoComponent,
    KyDetailsComponent,
    DashboardComponent,
    BookingHistoryComponent,
    ConfirmBookingPopupComponent,
    EditKycDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OnlineModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
    
  ]
})
export class OnlineModuleModule { }
