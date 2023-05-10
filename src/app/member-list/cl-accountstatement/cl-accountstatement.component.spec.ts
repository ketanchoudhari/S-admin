import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClAccountstatementComponent } from './cl-accountstatement.component';

describe('ClAccountstatementComponent', () => {
  let component: ClAccountstatementComponent;
  let fixture: ComponentFixture<ClAccountstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClAccountstatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClAccountstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
