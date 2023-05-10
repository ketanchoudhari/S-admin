import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinobetsComponent } from './sncasinobets.component';

describe('SncasinobetsComponent', () => {
  let component: SncasinobetsComponent;
  let fixture: ComponentFixture<SncasinobetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinobetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinobetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
