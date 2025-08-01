import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyDetailsComponent } from './ky-details.component';

describe('KyDetailsComponent', () => {
  let component: KyDetailsComponent;
  let fixture: ComponentFixture<KyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KyDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
