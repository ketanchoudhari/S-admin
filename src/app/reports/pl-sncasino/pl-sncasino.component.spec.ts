import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlSncasinoComponent } from './pl-sncasino.component';

describe('PlSncasinoComponent', () => {
  let component: PlSncasinoComponent;
  let fixture: ComponentFixture<PlSncasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlSncasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlSncasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
