import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AwcCasinoBetsComponent } from './awcCasinoBets/awc-casino-bets/awc-casino-bets.component';
import { AwcCasinoListComponent } from './awcCasinoList/awc-casino-list/awc-casino-list.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportAsModule } from 'ngx-export-as';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: AwcCasinoBetsComponent,
  },

  {
    path: 'awccasino-providerlist',
    component: AwcCasinoListComponent,
  },
  {
    path: 'awccasino-bets',
    component: AwcCasinoBetsComponent,
  },

];

@NgModule({
  declarations: [AwcCasinoListComponent,AwcCasinoBetsComponent],
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
  providers: [DatePipe]
})

export class AwcCaasinoModule { }
