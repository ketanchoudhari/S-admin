import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FancyListComponent } from './fancy-list/fancy-list.component';
import { FancyComponent } from './fancy/fancy.component';
import { FancyrateComponent } from './fancy/fancyrate/fancyrate.component';
import { BookmakingComponent } from './bookmaking/bookmaking.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BookmakingListComponent } from './bookmaking/bookmaking-list/bookmaking-list.component';
import { BookrateComponent } from './bookmaking/bookrate/bookrate.component';
import { PendingfancyComponent } from './pendingfancy/pendingfancy.component';
import { AddpanelfancyComponent } from './addpanelfancy/addpanelfancy.component';
import { ModalModule } from '../modal/modal.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '../fancy',
  },
  {
    path: 'pendingfancy',
    component: PendingfancyComponent,
  },
  {
    path: 'panelfancy',
    component: AddpanelfancyComponent,
  },
  {
    path: 'fancy',
    children: [
      {
        path: '',
        component: FancyListComponent,
        pathMatch: 'full',
      },
      {
        path: 'new',
        component: FancyComponent,
      },
      {
        path: 'edit',
        component: FancyComponent,
      },
      {
        path: 'fancyrate',
        component: FancyrateComponent,
      }
    ],
  },
  {
    path: 'bookmaking',
    children: [
      {
        path: '',
        component: BookmakingListComponent,
        pathMatch: 'full',
      },
      {
        path: 'edit',
        component: BookmakingComponent,
      },
      {
        path: 'new',
        component: BookmakingComponent,
      },
      {
        path: 'bookrate',
        component: BookrateComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    FancyComponent,
    FancyListComponent,
    FancyrateComponent,
    BookmakingComponent,
    BookmakingListComponent,
    BookrateComponent,
    PendingfancyComponent,
    AddpanelfancyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    NgxPaginationModule,
    ModalModule,
  ],
})
export class ManualModule {}
