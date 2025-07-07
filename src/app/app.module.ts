import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModuleModule } from './pages/admin-module/admin-module.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Add your routes here
    ReactiveFormsModule,
    AdminModuleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 