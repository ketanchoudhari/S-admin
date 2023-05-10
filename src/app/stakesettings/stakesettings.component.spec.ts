import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakesettingsComponent } from './stakesettings.component';

describe('StakesettingsComponent', () => {
  let component: StakesettingsComponent;
  let fixture: ComponentFixture<StakesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakesettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
