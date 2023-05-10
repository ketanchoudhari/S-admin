import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinoComponent } from './sncasino.component';

describe('SncasinoComponent', () => {
  let component: SncasinoComponent;
  let fixture: ComponentFixture<SncasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
