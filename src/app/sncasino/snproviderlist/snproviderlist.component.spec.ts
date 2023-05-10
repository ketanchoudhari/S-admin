import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnproviderlistComponent } from './snproviderlist.component';

describe('SnproviderlistComponent', () => {
  let component: SnproviderlistComponent;
  let fixture: ComponentFixture<SnproviderlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnproviderlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnproviderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
