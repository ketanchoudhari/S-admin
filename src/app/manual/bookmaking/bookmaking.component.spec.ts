import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmakingComponent } from './bookmaking.component';

describe('BookmakingComponent', () => {
  let component: BookmakingComponent;
  let fixture: ComponentFixture<BookmakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
