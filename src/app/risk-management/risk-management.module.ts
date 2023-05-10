import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RiskManagementComponent } from './risk-management.component';
import { RouterModule, Routes } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportAsModule } from 'ngx-export-as';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../pipes/pipes.module';
import { RiskManagementSkyComponent } from './risk-management-sky/risk-management-sky.component';
// import { TabModule } from 'angular-tabs-component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'riskManagement',
    pathMatch: 'full'
  },
  {
    path: 'cheatmanagement',
    component: RiskManagementComponent
  },
  {
    path: 'riskManagement',
    component: RiskManagementSkyComponent
  }
]

@NgModule({
  declarations: [RiskManagementComponent, RiskManagementSkyComponent],
  imports: [
    CommonModule,
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    ExportAsModule,
    DirectivesModule,
    ModalModule,
    NgSelectModule,
    PipesModule,
  ],
  providers: [DatePipe],
})
export class RiskManagementModule { }
