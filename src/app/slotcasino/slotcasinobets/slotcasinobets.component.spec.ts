import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcasinobetsComponent } from './slotcasinobets.component';

describe('SlotcasinobetsComponent', () => {
  let component: SlotcasinobetsComponent;
  let fixture: ComponentFixture<SlotcasinobetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotcasinobetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotcasinobetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
