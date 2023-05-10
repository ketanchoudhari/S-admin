import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgameslistComponent } from './betgameslist.component';

describe('BetgameslistComponent', () => {
  let component: BetgameslistComponent;
  let fixture: ComponentFixture<BetgameslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgameslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgameslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
