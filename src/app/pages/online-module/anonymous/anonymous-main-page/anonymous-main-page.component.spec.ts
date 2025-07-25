import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousMainPageComponent } from './anonymous-main-page.component';

describe('AnonymousMainPageComponent', () => {
  let component: AnonymousMainPageComponent;
  let fixture: ComponentFixture<AnonymousMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnonymousMainPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnonymousMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
