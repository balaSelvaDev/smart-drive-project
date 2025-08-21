import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBookingPopupComponent } from './confirm-booking-popup.component';

describe('ConfirmBookingPopupComponent', () => {
  let component: ConfirmBookingPopupComponent;
  let fixture: ComponentFixture<ConfirmBookingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmBookingPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmBookingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
