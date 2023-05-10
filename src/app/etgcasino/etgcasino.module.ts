import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from '../directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../pipes/pipes.module';
import { EtgcasinoComponent } from './etgcasino.component';
import { ModalModule } from '../modal/modal.module';
import { ExportAsModule } from 'ngx-export-as';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CasinobethistoryComponent } from '../member-list/casinobethistory/casinobethistory.component';
import { CasinoProductlistComponent } from './casino-productlist/casino-productlist.component';
import { CasinoPnlComponent } from '../member-list/casino-pnl/casino-pnl.component';


const routes: Routes = [
  {
    path: '',
    component: EtgcasinoComponent,
  },

  {
    path: 'casino-productlist',
    component: CasinoProductlistComponent,
  },

];

@NgModule({
  declarations: [EtgcasinoComponent, CasinoProductlistComponent],
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
export class EtgcasinoModule { }
