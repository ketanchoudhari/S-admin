import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmakingListComponent } from './bookmaking-list.component';

describe('BookmakingListComponent', () => {
  let component: BookmakingListComponent;
  let fixture: ComponentFixture<BookmakingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmakingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmakingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
