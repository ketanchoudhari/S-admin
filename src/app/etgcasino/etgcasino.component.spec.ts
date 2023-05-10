import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtgcasinoComponent } from './etgcasino.component';

describe('EtgcasinoComponent', () => {
  let component: EtgcasinoComponent;
  let fixture: ComponentFixture<EtgcasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtgcasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtgcasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
