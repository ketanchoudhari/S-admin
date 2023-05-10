import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyrateComponent } from './fancyrate.component';

describe('FancyrateComponent', () => {
  let component: FancyrateComponent;
  let fixture: ComponentFixture<FancyrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
