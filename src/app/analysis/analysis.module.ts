import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from '../modal/modal.module';
import { PipesModule } from '../pipes/pipes.module';
import { AnalysisComponent } from './analysis.component';
import { ReportbetComponent } from './reportbet/reportbet.component';

const routes: Routes = [
  {
    path: '',
    component: AnalysisComponent,
  },
  {
    path: 'reportbet/:eventId',
    component: ReportbetComponent,
  },
];

@NgModule({
  declarations: [AnalysisComponent, ReportbetComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxPaginationModule,
    PipesModule,
  ],
})
export class AnalysisModule {}
