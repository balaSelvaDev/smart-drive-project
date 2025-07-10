import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelEditComponent } from './vehicle-model-edit.component';

describe('VehicleModelEditComponent', () => {
  let component: VehicleModelEditComponent;
  let fixture: ComponentFixture<VehicleModelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleModelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
