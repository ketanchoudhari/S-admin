import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BetlistComponent } from './betlist.component';
import { BetListLiveComponent } from './bet-list-live/bet-list-live.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportAsModule } from 'ngx-export-as';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../pipes/pipes.module';
import { BetListLive2Component } from './bet-list-live2/bet-list-live2.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DropdownModule } from 'primeng/dropdown';
import { LivebetsComponent } from './livebets/livebets.component';
import { SettledbetsComponent } from './settledbets/settledbets.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bet-list',
  },
  {
    path: 'bet-list',
    component: BetlistComponent,
  },
  {
    path: 'bet-list-live',
    component: BetListLiveComponent,
  },
  {
    path: 'bet-list-live2',
    component: BetListLive2Component,
  },
  {
    path: 'livebets',
    component: LivebetsComponent,
  },
  {
    path: 'settled-bets',
    component: SettledbetsComponent,
  },
];
@NgModule({
  declarations: [BetlistComponent, BetListLiveComponent, BetListLive2Component, LivebetsComponent, SettledbetsComponent],
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
    ScrollingModule,
    DropdownModule
  ],
  providers: [DatePipe],
})
export class BetlistModule {}
