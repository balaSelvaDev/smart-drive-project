import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { LoginModuleComponent } from './login-module/login-module.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrandAddComponent } from './brand-module/brand-add/brand-add.component';
import { BrandGetComponent } from './brand-module/brand-get/brand-get.component';


@NgModule({
  declarations: [
    LoginModuleComponent,
    AdminLayoutComponent,

    BrandAddComponent,
    BrandGetComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatPaginatorModule
  ]
})
export class AdminModuleModule { }
