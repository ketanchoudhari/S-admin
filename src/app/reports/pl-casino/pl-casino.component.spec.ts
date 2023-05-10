import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlCasinoComponent } from './pl-casino.component';

describe('PlCasinoComponent', () => {
  let component: PlCasinoComponent;
  let fixture: ComponentFixture<PlCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlCasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
