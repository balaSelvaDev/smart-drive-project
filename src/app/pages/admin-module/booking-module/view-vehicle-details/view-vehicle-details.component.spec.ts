import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehicleDetailsComponent } from './view-vehicle-details.component';

describe('ViewVehicleDetailsComponent', () => {
  let component: ViewVehicleDetailsComponent;
  let fixture: ComponentFixture<ViewVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewVehicleDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
