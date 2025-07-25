import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMap2Component } from './google-map2.component';

describe('GoogleMap2Component', () => {
  let component: GoogleMap2Component;
  let fixture: ComponentFixture<GoogleMap2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleMap2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleMap2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
