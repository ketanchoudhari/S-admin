import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagementSkyComponent } from './risk-management-sky.component';

describe('RiskManagementSkyComponent', () => {
  let component: RiskManagementSkyComponent;
  let fixture: ComponentFixture<RiskManagementSkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskManagementSkyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskManagementSkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
