import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-onlineuser',
  templateUrl: './onlineuser.component.html',
  styleUrls: ['./onlineuser.component.scss']
})
export class OnlineuserComponent implements OnInit {
  onlineuserdata: any = [];
  p: number = 1;
  n: number = 10;
  filterdata: any;
  searchTerm: string;
  filterdaataa: any;
  constructor(private commonService: CommonService,private reportService:ReportsService) { }

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.Onlineuser();

    });
  }
  Onlineuser() {
    this.reportService.onlineuser().subscribe((resp: any) => {
      this.onlineuserdata = resp.result
      this.filterdata = resp.result;
    });
  }
  selectNoRows(numberOfRows: number) {
    this.p = 1;
    this.n = +numberOfRows;
  }
  pageChanged(event) {
    this.p = event;
  }
  filterByUser(term?: string) {
    this.p = 1;
    this.filterdata = this.onlineuserdata.filter((user) => {
      return user.userName?.toLowerCase().includes(term.toLowerCase())
      // this.filterdaataa = user.userId
      // console.log(this.filterdaataa);
    });

  }
}
