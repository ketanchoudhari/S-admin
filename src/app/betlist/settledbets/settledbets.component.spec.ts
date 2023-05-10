import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettledbetsComponent } from './settledbets.component';

describe('SettledbetsComponent', () => {
  let component: SettledbetsComponent;
  let fixture: ComponentFixture<SettledbetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettledbetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettledbetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
