import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './login-module/login-module.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { BrandAddComponent } from './brand-module/brand-add/brand-add.component';
import { BrandGetComponent } from './brand-module/brand-get/brand-get.component';
import { VehicleModelAddComponent } from './vehicle-module/vehicle-model-add/vehicle-model-add.component';
import { VehicleModelGetAllComponent } from './vehicle-module/vehicle-model-get-all/vehicle-model-get-all.component';
import { UserAddComponent } from './user-module/user-add/user-add.component';
import { UserGetComponent } from './user-module/user-get/user-get.component';
import { UserEditComponent } from './user-module/user-edit/user-edit.component';
import { UserDeleteComponent } from './user-module/user-delete/user-delete.component';
import { BookingAddComponent } from './booking-module/booking-add/booking-add.component';
import { BookingGetComponent } from './booking-module/booking-get/booking-get.component';
import { VehicleAddComponent } from './vehicle/vehicle-add/vehicle-add.component';
import { VehicleGetComponent } from './vehicle/vehicle-get/vehicle-get.component';
import { VehicleEditComponent } from './vehicle/vehicle-edit/vehicle-edit.component';
import { VehicleDeleteComponent } from './vehicle/vehicle-delete/vehicle-delete.component';
import { GoogleMapComponent } from './testing-module/google-map/google-map.component';
import { GoogleMap2Component } from './testing-module/google-map2/google-map2.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'get-brand', component: BrandGetComponent },
      { path: 'add-brand', component: BrandAddComponent },

      { path: 'get-vehicle-model', component: VehicleModelGetAllComponent },
      { path: 'add-vehicle-model', component: VehicleModelAddComponent },

      { path: 'get-user', component: UserGetComponent },
      { path: 'add-user', component: UserAddComponent },
      { path: 'edit-user/:id', component: UserEditComponent },
      { path: 'delete-user/:id', component: UserDeleteComponent },

      { path: 'get-vehicle', component: VehicleGetComponent },
      { path: 'add-vehicle', component: VehicleAddComponent },
      { path: 'edit-vehicle/:id', component: VehicleEditComponent },
      { path: 'delete-vehicle/:id', component: VehicleDeleteComponent },

      { path: 'get-booking', component: BookingGetComponent },
      { path: 'add-booking', component: BookingAddComponent },

      // { path: 'customer', component: CustomerMasterComponent },
      // { path: 'booking', component: BookingComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'admin-login', component: LoginModuleComponent },
  { path: 'google-map-1', component: GoogleMapComponent },
  { path: 'google-map-2', component: GoogleMap2Component }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
