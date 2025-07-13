import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGetComponent } from './booking-get.component';

describe('BookingGetComponent', () => {
  let component: BookingGetComponent;
  let fixture: ComponentFixture<BookingGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingGetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
