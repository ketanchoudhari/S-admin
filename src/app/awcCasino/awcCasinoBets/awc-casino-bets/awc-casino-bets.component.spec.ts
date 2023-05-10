import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcCasinoBetsComponent } from './awc-casino-bets.component';

describe('AwcCasinoBetsComponent', () => {
  let component: AwcCasinoBetsComponent;
  let fixture: ComponentFixture<AwcCasinoBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwcCasinoBetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwcCasinoBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
