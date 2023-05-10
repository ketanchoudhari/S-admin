import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlPokerlogsComponent } from './pl-pokerlogs.component';

describe('PlPokerlogsComponent', () => {
  let component: PlPokerlogsComponent;
  let fixture: ComponentFixture<PlPokerlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlPokerlogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlPokerlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
