import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwccasinobetprofitlossComponent } from './awccasinobetprofitloss.component';

describe('AwccasinobetprofitlossComponent', () => {
  let component: AwccasinobetprofitlossComponent;
  let fixture: ComponentFixture<AwccasinobetprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwccasinobetprofitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwccasinobetprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
