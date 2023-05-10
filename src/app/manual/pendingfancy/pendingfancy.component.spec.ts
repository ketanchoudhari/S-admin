import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingfancyComponent } from './pendingfancy.component';

describe('PendingfancyComponent', () => {
  let component: PendingfancyComponent;
  let fixture: ComponentFixture<PendingfancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingfancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingfancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
