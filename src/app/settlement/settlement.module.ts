import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SettlementComponent } from './settlement.component';
import { RouterModule, Routes } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from '../modal/modal.module';

const routes: Routes = [
  {
    path: '',
    component: SettlementComponent
  }
]

@NgModule({
  declarations: [SettlementComponent],
  imports: [
    CommonModule,
    DpDatePickerModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbAccordionModule,
    NgbModalModule,
    ModalModule
  ],
  providers: [DatePipe],
  exports: [RouterModule]
})
export class SettlementModule { }
