import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DpDatePickerModule } from 'ng2-date-picker';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { ExportAsModule } from 'ngx-export-as';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from '../modal/modal.module';
import { BankingReqXpgComponent } from './banking-req-xpg.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'bankingreqxpg',
    pathMatch: 'full',
  },
  {
    path: 'bankingreqxpg',
    component: BankingReqXpgComponent,
  }
];

@NgModule({
  declarations: [BankingReqXpgComponent],
  imports: [
    CommonModule,
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    PipesModule,
    ExportAsModule,
    DirectivesModule,
    NgSelectModule,
    ModalModule
  ],
  providers: [DatePipe],
})
export class BankingReqXpgModule {}
