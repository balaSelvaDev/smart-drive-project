import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGetComponent } from './vehicle-get.component';

describe('VehicleGetComponent', () => {
  let component: VehicleGetComponent;
  let fixture: ComponentFixture<VehicleGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleGetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
