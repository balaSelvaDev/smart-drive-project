import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './login-module/login-module.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginModuleComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
