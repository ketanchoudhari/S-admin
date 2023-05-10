import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinoprofitlossComponent } from './sncasinoprofitloss.component';

describe('SncasinoprofitlossComponent', () => {
  let component: SncasinoprofitlossComponent;
  let fixture: ComponentFixture<SncasinoprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinoprofitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinoprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
