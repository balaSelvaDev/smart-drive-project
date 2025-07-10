import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelDeleteComponent } from './vehicle-model-delete.component';

describe('VehicleModelDeleteComponent', () => {
  let component: VehicleModelDeleteComponent;
  let fixture: ComponentFixture<VehicleModelDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleModelDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
