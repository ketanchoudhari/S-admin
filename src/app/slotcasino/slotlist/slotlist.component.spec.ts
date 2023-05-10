import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotlistComponent } from './slotlist.component';

describe('SlotlistComponent', () => {
  let component: SlotlistComponent;
  let fixture: ComponentFixture<SlotlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
