import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SnproviderlistComponent } from './snproviderlist/snproviderlist.component';
import { SncasinobetsComponent } from './sncasinobets/sncasinobets.component';
import { RouterModule, Routes } from '@angular/router';
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
    component: SncasinobetsComponent,
  },

  {
    path: 'sncasino-providerlist',
    component: SnproviderlistComponent,
  },
  {
    path: 'sncasino-bets',
    component: SncasinobetsComponent,
  },

];

@NgModule({
  declarations: [SnproviderlistComponent,SncasinobetsComponent],
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

export class SncasinoModule { }
