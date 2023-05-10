import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcasinobethistoryComponent } from './slotcasinobethistory.component';

describe('SlotcasinobethistoryComponent', () => {
  let component: SlotcasinobethistoryComponent;
  let fixture: ComponentFixture<SlotcasinobethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotcasinobethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotcasinobethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
