import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineModuleRoutingModule } from './online-module-routing.module';
import { AnonymousMainPageComponent } from './anonymous/anonymous-main-page/anonymous-main-page.component';
import { SearchResultPageComponent } from './anonymous/search-result-page/search-result-page.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { IndividualCarComponent } from './anonymous/individual-car/individual-car.component';
import { AnonymousHeaderComponent } from './anonymous-header/anonymous-header.component';
import { ViewBookingPriceComponent } from './anonymous/view-booking-price/view-booking-price.component';


@NgModule({
  declarations: [
    AnonymousMainPageComponent,
    SearchResultPageComponent,
    IndividualCarComponent,
    AnonymousHeaderComponent,
    ViewBookingPriceComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    OnlineModuleRoutingModule,
    FormsModule
    
  ]
})
export class OnlineModuleModule { }
