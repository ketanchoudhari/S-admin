import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMobComponent } from './login-mob.component';

describe('LoginMobComponent', () => {
  let component: LoginMobComponent;
  let fixture: ComponentFixture<LoginMobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginMobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
