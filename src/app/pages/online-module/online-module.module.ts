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


@NgModule({
  declarations: [
    AnonymousMainPageComponent,
    SearchResultPageComponent,
    IndividualCarComponent,
    AnonymousHeaderComponent,
    ViewBookingPriceComponent,
    CustomerLoginPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OnlineModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class OnlineModuleModule { }
