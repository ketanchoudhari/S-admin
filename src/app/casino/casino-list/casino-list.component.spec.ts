import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoListComponent } from './casino-list.component';

describe('CasinoListComponent', () => {
  let component: CasinoListComponent;
  let fixture: ComponentFixture<CasinoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
