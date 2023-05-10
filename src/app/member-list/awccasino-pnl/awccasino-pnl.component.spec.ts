import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwccasinoPnlComponent } from './awccasino-pnl.component';

describe('AwccasinoPnlComponent', () => {
  let component: AwccasinoPnlComponent;
  let fixture: ComponentFixture<AwccasinoPnlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwccasinoPnlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwccasinoPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
