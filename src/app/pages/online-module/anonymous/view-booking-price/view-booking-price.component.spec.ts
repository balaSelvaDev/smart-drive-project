import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookingPriceComponent } from './view-booking-price.component';

describe('ViewBookingPriceComponent', () => {
  let component: ViewBookingPriceComponent;
  let fixture: ComponentFixture<ViewBookingPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBookingPriceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBookingPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
