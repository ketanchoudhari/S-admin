import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerDetailComponent } from './ticker-detail.component';

describe('TickerDetailComponent', () => {
  let component: TickerDetailComponent;
  let fixture: ComponentFixture<TickerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TickerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
