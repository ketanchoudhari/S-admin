import { Component, OnInit } from '@angular/core';
import { IDayTimeCalendarConfig } from 'ng2-date-picker/day-time-calendar/day-time-calendar-config.model';

@Component({
  selector: 'app-void-bets',
  templateUrl: './void-bets.component.html',
  styleUrls: ['./void-bets.component.scss']
})
export class VoidBetsComponent implements OnInit {
  fromDate;
  toDate;

  dateConfig: IDayTimeCalendarConfig;
  constructor() {
    this.dateConfig = {
      format: 'YYYY-MM-DD',
    };
  }

  ngOnInit(): void {
  }

}
