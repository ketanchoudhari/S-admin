import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinoPnlComponent } from './sncasino-pnl.component';

describe('SncasinoPnlComponent', () => {
  let component: SncasinoPnlComponent;
  let fixture: ComponentFixture<SncasinoPnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinoPnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinoPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
