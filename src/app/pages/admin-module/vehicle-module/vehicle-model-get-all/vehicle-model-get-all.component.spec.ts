import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelGetAllComponent } from './vehicle-model-get-all.component';

describe('VehicleModelGetAllComponent', () => {
  let component: VehicleModelGetAllComponent;
  let fixture: ComponentFixture<VehicleModelGetAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelGetAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleModelGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
