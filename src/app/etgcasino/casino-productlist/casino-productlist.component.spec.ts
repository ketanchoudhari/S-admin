import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoProductlistComponent } from './casino-productlist.component';

describe('CasinoProductlistComponent', () => {
  let component: CasinoProductlistComponent;
  let fixture: ComponentFixture<CasinoProductlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoProductlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoProductlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
