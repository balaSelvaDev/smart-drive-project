import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousMainPageComponent } from './anonymous/anonymous-main-page/anonymous-main-page.component';
import { SearchResultPageComponent } from './anonymous/search-result-page/search-result-page.component';
import { IndividualCarComponent } from './anonymous/individual-car/individual-car.component';
import { AnonymousHeaderComponent } from './anonymous-header/anonymous-header.component';
import { ProfileLayoutComponent } from './anonymous/profile-layout/profile-layout.component';
import { BasicInfoComponent } from './anonymous/basic-info/basic-info.component';
import { KyDetailsComponent } from './anonymous/ky-details/ky-details.component';
import { DashboardComponent } from './anonymous/dashboard/dashboard.component';
import { BookingHistoryComponent } from './anonymous/booking-history/booking-history.component';

const routes: Routes = [
  {
    path: 'customer',
    component: AnonymousHeaderComponent,
    children: [
      { path: 'main', component: AnonymousMainPageComponent },
      { path: 'search-result', component: SearchResultPageComponent },
      { path: 'individual-car', component: IndividualCarComponent },

      {
        path: 'profile',
        component: ProfileLayoutComponent,
        children: [
          { path: 'basic-info', component: BasicInfoComponent },
          { path: 'kyc-details', component: KyDetailsComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'booking-history', component: BookingHistoryComponent },
          { path: '', redirectTo: 'basic-info', pathMatch: 'full' },
        ]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineModuleRoutingModule { }
