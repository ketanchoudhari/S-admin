import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcasinoPnlComponent } from './slotcasino-pnl.component';

describe('SlotcasinoPnlComponent', () => {
  let component: SlotcasinoPnlComponent;
  let fixture: ComponentFixture<SlotcasinoPnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotcasinoPnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotcasinoPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
