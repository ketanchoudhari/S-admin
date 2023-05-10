import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinobethistoryComponent } from './sncasinobethistory.component';

describe('SncasinobethistoryComponent', () => {
  let component: SncasinobethistoryComponent;
  let fixture: ComponentFixture<SncasinobethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinobethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinobethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
