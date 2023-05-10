import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwccasinobethistoryComponent } from './awccasinobethistory.component';

describe('AwccasinobethistoryComponent', () => {
  let component: AwccasinobethistoryComponent;
  let fixture: ComponentFixture<AwccasinobethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwccasinobethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwccasinobethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
