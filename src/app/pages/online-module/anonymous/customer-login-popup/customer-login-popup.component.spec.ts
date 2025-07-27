import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoginPopupComponent } from './customer-login-popup.component';

describe('CustomerLoginPopupComponent', () => {
  let component: CustomerLoginPopupComponent;
  let fixture: ComponentFixture<CustomerLoginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerLoginPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerLoginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
