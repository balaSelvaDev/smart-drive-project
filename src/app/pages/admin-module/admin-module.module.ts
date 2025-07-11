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
import { BrandEditComponent } from './brand-module/brand-edit/brand-edit.component';
import { BrandDeleteComponent } from './brand-module/brand-delete/brand-delete.component';
import { VehicleModelAddComponent } from './vehicle-module/vehicle-model-add/vehicle-model-add.component';
import { VehicleModelGetAllComponent } from './vehicle-module/vehicle-model-get-all/vehicle-model-get-all.component';
import { VehicleModelEditComponent } from './vehicle-module/vehicle-model-edit/vehicle-model-edit.component';
import { VehicleModelDeleteComponent } from './vehicle-module/vehicle-model-delete/vehicle-model-delete.component';


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
