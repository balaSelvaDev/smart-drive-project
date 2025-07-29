import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserDeatilsComponent } from './view-user-deatils.component';

describe('ViewUserDeatilsComponent', () => {
  let component: ViewUserDeatilsComponent;
  let fixture: ComponentFixture<ViewUserDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserDeatilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUserDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
