import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesbetsComponent } from './betgamesbets.component';

describe('BetgamesbetsComponent', () => {
  let component: BetgamesbetsComponent;
  let fixture: ComponentFixture<BetgamesbetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgamesbetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesbetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
