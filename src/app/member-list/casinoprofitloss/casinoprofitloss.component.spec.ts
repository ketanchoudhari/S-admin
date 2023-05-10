import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoprofitlossComponent } from './casinoprofitloss.component';

describe('CasinoprofitlossComponent', () => {
  let component: CasinoprofitlossComponent;
  let fixture: ComponentFixture<CasinoprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoprofitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
