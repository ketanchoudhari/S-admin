import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookrateComponent } from './bookrate.component';

describe('BookrateComponent', () => {
  let component: BookrateComponent;
  let fixture: ComponentFixture<BookrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
