import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesPnlComponent } from './betgames-pnl.component';

describe('BetgamesPnlComponent', () => {
  let component: BetgamesPnlComponent;
  let fixture: ComponentFixture<BetgamesPnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgamesPnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
