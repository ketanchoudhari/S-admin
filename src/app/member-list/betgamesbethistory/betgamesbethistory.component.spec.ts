import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesbethistoryComponent } from './betgamesbethistory.component';

describe('BetgamesbethistoryComponent', () => {
  let component: BetgamesbethistoryComponent;
  let fixture: ComponentFixture<BetgamesbethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgamesbethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesbethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
