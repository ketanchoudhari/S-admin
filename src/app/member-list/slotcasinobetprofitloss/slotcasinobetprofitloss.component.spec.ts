import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcasinobetprofitlossComponent } from './slotcasinobetprofitloss.component';

describe('SlotcasinobetprofitlossComponent', () => {
  let component: SlotcasinobetprofitlossComponent;
  let fixture: ComponentFixture<SlotcasinobetprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotcasinobetprofitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotcasinobetprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
