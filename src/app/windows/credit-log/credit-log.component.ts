import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { UsersService } from 'src/app/users/users.service';

export interface ICreditRef {
  amount: number;
  oldValue: number;
  dateTime: string;
  description: string;
  txnType: number;
  userId: number;
  withUid: number;
}

@Component({
  selector: 'app-credit-log',
  templateUrl: './credit-log.component.html',
  styleUrls: ['./credit-log.component.scss'],
})
export class CreditLogComponent implements OnInit {
  logs: ICreditRef[];
  userName: string;
  p: number = 1;
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.userName = window['userName'];
  }

  ngOnInit(): void {;

    this.route.params.subscribe((params) => {
    //  console.log(params.userId);
      this.usersService
        .logCreditRef(params.userId)
        .subscribe((res: GenericResponse<ICreditRef[]>) => {
          if (res.errorCode === 0) {
            this.logs = res.result;
            for (let i = 0; i < this.logs.length; i++) {
              if (i === 0) {
              //  console.log(this.logs[i]);
                this.logs[i].oldValue = 0;
              } else {
                this.logs[i].oldValue = this.logs[i - 1].amount;
              }
            }
            this.logs = this.logs.sort((a, b) => {
              return Date.parse(b.dateTime) - Date.parse(a.dateTime);
            });
          }
        });

    });
  }
}
