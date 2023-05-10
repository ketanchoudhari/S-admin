import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesbetprofitlossComponent } from './betgamesbetprofitloss.component';

describe('BetgamesbetprofitlossComponent', () => {
  let component: BetgamesbetprofitlossComponent;
  let fixture: ComponentFixture<BetgamesbetprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgamesbetprofitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesbetprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
