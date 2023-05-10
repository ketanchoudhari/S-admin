import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajiloginComponent } from './bajilogin.component';

describe('BajiloginComponent', () => {
  let component: BajiloginComponent;
  let fixture: ComponentFixture<BajiloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BajiloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BajiloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
