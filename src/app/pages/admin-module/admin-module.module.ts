import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { LoginModuleComponent } from './login-module/login-module.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    LoginModuleComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AdminModuleModule { }
