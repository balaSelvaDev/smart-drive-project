import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousMainPageComponent } from './anonymous/anonymous-main-page/anonymous-main-page.component';
import { SearchResultPageComponent } from './anonymous/search-result-page/search-result-page.component';
import { IndividualCarComponent } from './anonymous/individual-car/individual-car.component';
import { AnonymousHeaderComponent } from './anonymous-header/anonymous-header.component';

const routes: Routes = [
  {
    path: 'customer',
    component: AnonymousHeaderComponent,
    children: [
      { path: 'main', component: AnonymousMainPageComponent },
      { path: 'search-result', component: SearchResultPageComponent },
      { path: 'individual-car', component: IndividualCarComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineModuleRoutingModule { }
