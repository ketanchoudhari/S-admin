import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { BankupiComponent } from './bankupi.component';

const routes: Routes = [
  {
    path: '',
    component: BankupiComponent
  }
]

@NgModule({
  declarations: [BankupiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxPaginationModule,
    DirectivesModule,
    DpDatePickerModule,
  ]
})
export class BankUpiModule { }
