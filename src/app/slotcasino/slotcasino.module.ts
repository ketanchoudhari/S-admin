import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SlotlistComponent } from './slotlist/slotlist.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportAsModule } from 'ngx-export-as';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from '../modal/modal.module';
import { SlotcasinobetsComponent } from './slotcasinobets/slotcasinobets.component';
const routes: Routes = [
  {
    path: 'CasinoCategories',
    component: SlotlistComponent,
  },
  {
    path: 'slotcasinobets',
    component: SlotcasinobetsComponent,
  },


];


@NgModule({
  declarations: [SlotlistComponent, SlotcasinobetsComponent],
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
export class SlotcasinoModule { }
