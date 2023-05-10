import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-children',
  template: `<router-outlet></router-outlet>`,
})
export class ChildrenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
