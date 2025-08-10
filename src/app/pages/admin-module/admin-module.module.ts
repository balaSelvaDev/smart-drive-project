import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { LoginModuleComponent } from './login-module/login-module.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrandAddComponent } from './brand-module/brand-add/brand-add.component';
import { BrandGetComponent } from './brand-module/brand-get/brand-get.component';
import { BrandEditComponent } from './brand-module/brand-edit/brand-edit.component';
import { BrandDeleteComponent } from './brand-module/brand-delete/brand-delete.component';
import { VehicleModelAddComponent } from './vehicle-module/vehicle-model-add/vehicle-model-add.component';
import { VehicleModelGetAllComponent } from './vehicle-module/vehicle-model-get-all/vehicle-model-get-all.component';
import { VehicleModelEditComponent } from './vehicle-module/vehicle-model-edit/vehicle-model-edit.component';
import { VehicleModelDeleteComponent } from './vehicle-module/vehicle-model-delete/vehicle-model-delete.component';
import { UserAddComponent } from './user-module/user-add/user-add.component';
import { UserGetComponent } from './user-module/user-get/user-get.component';
import { UserDeleteComponent } from './user-module/user-delete/user-delete.component';
import { UserEditComponent } from './user-module/user-edit/user-edit.component';
import { BookingGetComponent } from './booking-module/booking-get/booking-get.component';
import { BookingAddComponent } from './booking-module/booking-add/booking-add.component';
import { VehicleAddComponent } from './vehicle/vehicle-add/vehicle-add.component';
import { VehicleGetComponent } from './vehicle/vehicle-get/vehicle-get.component';
import { VehicleEditComponent } from './vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleDeleteComponent } from './vehicle/vehicle-delete/vehicle-delete.component';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { GoogleMapComponent } from './testing-module/google-map/google-map.component';
import { GoogleMap2Component } from './testing-module/google-map2/google-map2.component';
import { ViewVehicleDetailsComponent } from './booking-module/view-vehicle-details/view-vehicle-details.component';
import { ViewUserDeatilsComponent } from './booking-module/view-user-deatils/view-user-deatils.component';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionComponent } from './transaction/transaction/transaction.component';
import { PaymentPopupComponent } from './transaction/payment-popup/payment-popup.component';


@NgModule({
  declarations: [
    LoginModuleComponent,
    AdminLayoutComponent,

    BrandAddComponent,
    BrandGetComponent,
    BrandEditComponent,
    BrandDeleteComponent,

    VehicleModelAddComponent,
    VehicleModelGetAllComponent,
    VehicleModelEditComponent,
    VehicleModelDeleteComponent,
    
    UserAddComponent,
    UserGetComponent,
    UserDeleteComponent,
    UserEditComponent,
    BookingGetComponent,
    BookingAddComponent,
    VehicleAddComponent,
    VehicleGetComponent,
    VehicleEditComponent,
    VehicleDeleteComponent,
    OnlyNumbersDirective,
    GoogleMapComponent,
    GoogleMap2Component,
    ViewVehicleDetailsComponent,
    ViewUserDeatilsComponent,
    TransactionComponent,
    PaymentPopupComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatPaginatorModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ]
})
export class AdminModuleModule { }
