import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlDiamondcasinoComponent } from './pl-diamondcasino.component';

describe('PlDiamondcasinoComponent', () => {
  let component: PlDiamondcasinoComponent;
  let fixture: ComponentFixture<PlDiamondcasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlDiamondcasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlDiamondcasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
