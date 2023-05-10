import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import { GenericResponse } from '../shared/types/generic-response';
import { AnalysisService } from './analysis.service';
import { IBook } from './types/book';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit, OnDestroy {
  books: IBook;
  listBooksCalls: boolean = true;
  timerSubscription: Subscription;
  constructor(private analysisService: AnalysisService, private commonService: CommonService) { }
  ngOnInit(): void {
    this.commonService.apis$.subscribe(res => {
      this.timerSubscription = timer(500, 30000).pipe(
        map(() => {
          this.listBooks()
        })
      ).subscribe();
    })
  }

  listBooks() {
    if (!this.listBooksCalls) {
      return;
    }
    this.listBooksCalls = false;
    this.analysisService
      .listBooks()
      .subscribe((res: GenericResponse<IBook[]>) => {
        // if (res.errorCode === 0 && res.result.length && res.result[0][0]?.eventId) {
        //   this.books = res.result[0];
        // }
        this.listBooksCalls = true;
        if(typeof res.result[0] == 'string'){
          // setTimeout(() => {
          //   this.listBooks();
          // },2500);
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
          this.timerSubscription = timer(500, 30000).pipe(
            map(() => {
              this.listBooks();
            })
          ).subscribe();
        }
        if (res.errorCode === 0 && typeof res.result[0] != 'string' && res.result.length) {
          this.books = res.result[0];
        }

        
      }, err => {
        this.listBooksCalls = true;
      })
  }

  trackByFn(index, item) {
    return item.selName;
  }

  trackByIndex(index, item) {
    return index;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
