import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-bookmaking',
  templateUrl: './bookmaking.component.html',
  styleUrls: ['./bookmaking.component.scss']
})
export class BookmakingComponent implements OnInit {
  data: any;

  constructor(  private commonService: CommonService,) { }

  ngOnInit(): void {
    this.fanybooklist() 
  }

  fanybooklist() {
    this.commonService.bookmaking().subscribe((resp: any) => {
      this.data = resp.result;
      console.log("fanybooklist", this.data);
    })
  }

}
