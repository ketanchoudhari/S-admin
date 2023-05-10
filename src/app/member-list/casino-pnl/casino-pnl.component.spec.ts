import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoPnlComponent } from './casino-pnl.component';

describe('CasinoPnlComponent', () => {
  let component: CasinoPnlComponent;
  let fixture: ComponentFixture<CasinoPnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoPnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
