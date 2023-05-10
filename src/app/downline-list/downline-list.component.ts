import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-downline-list',
  templateUrl: './downline-list.component.html',
  styleUrls: ['./downline-list.component.scss'],
})
export class DownlineListComponent implements OnInit {
  addMemberModalOpen: boolean = false;
  creditRefModalOpen: boolean = false;
  changeStatusOpen: boolean = false;
  showAddMemberButton: boolean = true;

  userList = [];
  userData;

  constructor() {
  }

  ngOnInit(): void {}

  toggleAddMemberModal() {
    this.addMemberModalOpen = true;
  }

  openCreditRefModal() {
    this.creditRefModalOpen = true;
  }

  openChangeStatusModal() {
    this.changeStatusOpen = true;
  }

  showBalanceDetail(user) {
    // let el = document.getElementById(`tempBalanceTr_${user}`);
    // console.log(el.style.display);
    // if (el.style.display === 'none') {
    //   el.style.display = 'table-row';
    // } else {
    //   el.style.display = 'none';
    // }
    user.showBalance = !user.showBalance;
  }

  trackBy(index, item) {
    return index;
  }
}
