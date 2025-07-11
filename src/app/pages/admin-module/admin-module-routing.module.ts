import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './login-module/login-module.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { BrandAddComponent } from './brand-module/brand-add/brand-add.component';
import { BrandGetComponent } from './brand-module/brand-get/brand-get.component';
import { VehicleModelAddComponent } from './vehicle-module/vehicle-model-add/vehicle-model-add.component';
import { VehicleModelGetAllComponent } from './vehicle-module/vehicle-model-get-all/vehicle-model-get-all.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'get-brand', component: BrandGetComponent },
      { path: 'add-brand', component: BrandAddComponent },
      { path: 'add-vehicle-model', component: VehicleModelAddComponent },
      { path: 'get-vehicle-model', component: VehicleModelGetAllComponent },
      // { path: 'customer', component: CustomerMasterComponent },
      // { path: 'booking', component: BookingComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginModuleComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
