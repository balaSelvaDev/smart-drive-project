import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './login-module/login-module.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { BrandMasterComponent } from './brand-master/brand-master.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: BrandMasterComponent },
      { path: 'brand', component: BrandMasterComponent },
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
