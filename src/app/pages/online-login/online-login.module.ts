import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineLoginRoutingModule } from './online-login-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    OnlineLoginRoutingModule
  ]
})
export class OnlineLoginModule { }
