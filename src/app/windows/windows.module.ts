import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditLogComponent } from './credit-log/credit-log.component';
import { TvWinComponent } from './tv-win/tv-win.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'creditRefLog/:userId',
    component: CreditLogComponent
  },
  {
    path: 'tv',
    component: TvWinComponent
  }
]

@NgModule({
  declarations: [CreditLogComponent, TvWinComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WindowsModule { }
