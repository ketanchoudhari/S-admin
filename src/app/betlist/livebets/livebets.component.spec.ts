import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivebetsComponent } from './livebets.component';

describe('LivebetsComponent', () => {
  let component: LivebetsComponent;
  let fixture: ComponentFixture<LivebetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivebetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivebetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
