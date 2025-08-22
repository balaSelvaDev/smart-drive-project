import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKycDetailsComponent } from './edit-kyc-details.component';

describe('EditKycDetailsComponent', () => {
  let component: EditKycDetailsComponent;
  let fixture: ComponentFixture<EditKycDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditKycDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
