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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CountUpDirective } from './shared/directives/count-up.directive';

// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Add your routes here
    ReactiveFormsModule,
    MaterialModule,
    AdminModuleModule,
    OnlineLoginModule,
    OnlineModuleModule,
    NgbModule,
    CountUpDirective
    // NgxMatTimepickerModule
    
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 