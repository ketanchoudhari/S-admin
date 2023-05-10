import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingComponent } from './banking.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bankingLogComponent } from './logs/bankinglog.componet';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { ExportAsModule } from 'ngx-export-as';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'banking',
    pathMatch: 'full',
  },
  {
    path: 'banking',
    component: BankingComponent,
  },
  {
    path: 'bankinglog',
    component: bankingLogComponent,
  },
  {
    path: 'bankinglog/:userId',
    component: bankingLogComponent,
  },
];

@NgModule({
  declarations: [BankingComponent, bankingLogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    PipesModule,
    ExportAsModule,
    DirectivesModule,
    DropdownModule
  ],
})
export class BankingModule {}
