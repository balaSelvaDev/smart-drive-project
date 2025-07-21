import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModuleModule } from './pages/admin-module/admin-module.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './pages/material/material.module';
import { OnlyNumbersDirective } from './shared/directives/only-numbers.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OnlineModuleModule } from './pages/online-module/online-module.module';
import { OnlineLoginModule } from './pages/online-login/online-login.module';

// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Add your routes here
    ReactiveFormsModule,
    MaterialModule,
    AdminModuleModule,
    OnlineLoginModule
    // NgxMatTimepickerModule
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 