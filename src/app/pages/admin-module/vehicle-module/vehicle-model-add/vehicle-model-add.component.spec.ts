import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelAddComponent } from './vehicle-model-add.component';

describe('VehicleModelAddComponent', () => {
  let component: VehicleModelAddComponent;
  let fixture: ComponentFixture<VehicleModelAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleModelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
