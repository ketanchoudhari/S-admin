import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpanelfancyComponent } from './addpanelfancy.component';

describe('AddpanelfancyComponent', () => {
  let component: AddpanelfancyComponent;
  let fixture: ComponentFixture<AddpanelfancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpanelfancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpanelfancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
