import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlSlotcasinoComponent } from './pl-slotcasino.component';

describe('PlSlotcasinoComponent', () => {
  let component: PlSlotcasinoComponent;
  let fixture: ComponentFixture<PlSlotcasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlSlotcasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlSlotcasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
