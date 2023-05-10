import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RouterModule, Routes } from '@angular/router';
import { RulesComponent } from './rules/rules.component';
import { TickerComponent } from './ticker/ticker.component';
import { CommentaryComponent } from './commentary/commentary.component';
import { LogsComponent } from './logs/logs.component';
import { TickerDetailComponent } from './ticker/ticker-detail/ticker-detail.component';
import { ModalModule } from '../modal/modal.module';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rules',
        children: [
          {
            path: '',
            component: RulesComponent,
          },
        ],
      },
      {
        path: 'ticker',
        children: [
          {
            path: '',
            component: TickerComponent,
          },
          {
            path: 'new',
            component: TickerDetailComponent,
          },
        ],
      },
      {
        path: 'commentary',
        component: CommentaryComponent,
      },
      {
        path: 'logs',
        component: LogsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    RulesComponent,
    TickerComponent,
    CommentaryComponent,
    LogsComponent,
    TickerDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    RouterModule.forChild(routes),
    ModalModule,
    NgxPaginationModule
  ],
})
export class MessagesModule {}
