import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandGetComponent } from './brand-get.component';

describe('BrandGetComponent', () => {
  let component: BrandGetComponent;
  let fixture: ComponentFixture<BrandGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandGetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
