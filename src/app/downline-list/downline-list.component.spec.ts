import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlineListComponent } from './downline-list.component';

describe('DownlineListComponent', () => {
  let component: DownlineListComponent;
  let fixture: ComponentFixture<DownlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownlineListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
