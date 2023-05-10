import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasinoListComponent } from './casino-list/casino-list.component';
import { CasinoGameComponent } from './casino-game/casino-game.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { ModalModule } from '../modal/modal.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: CasinoListComponent,
  },
  {
    path: 'tp/:tableId/:tableName/:gType',
    component: CasinoGameComponent,
  }
];

@NgModule({
  declarations: [
    CasinoListComponent,
    CasinoGameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    ModalModule,
    PipesModule,

    
    
  ]
})
export class CasinoModule { }
