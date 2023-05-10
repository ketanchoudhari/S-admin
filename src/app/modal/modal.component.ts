import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  private _modalState: boolean = false;
  closeShow: boolean=true;

  @Input() set open(state: boolean) {
    this._modalState = state;
    this.openChange.emit(state);
  }
  get open() {
    return this._modalState;
  }
  @Output() openChange = new EventEmitter();

  @Input() height: string;
  @Input() width: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    if (this.router.url == '/bet-list/bet-list'|| this.router.url == '/bet-list/bet-list-live' ) {
      this.closeShow = false;
    }
    this.router.events.subscribe((event: NavigationStart) => {
      if (event instanceof NavigationStart) {
        // console.log(event.url)

        if (event.url == '/bet-list/bet-list' || this.router.url == '/bet-list/bet-list-live') {
          this.closeShow = false;
        }
        else {
          this.closeShow = true;
        }
      }
    });
  }

  // open() {
  //   this.modalState = true;
  // }

  // close() {
  //   this.modalState = false;
  // }

}
