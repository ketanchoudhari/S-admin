import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcCasinoListComponent } from './awc-casino-list.component';

describe('AwcCasinoListComponent', () => {
  let component: AwcCasinoListComponent;
  let fixture: ComponentFixture<AwcCasinoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwcCasinoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwcCasinoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
