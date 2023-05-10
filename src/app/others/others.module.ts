import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from '../modal/modal.module';
import { TvComponent } from './tv/tv.component';

const routes: Routes = [
  {
    path: 'tv',
    component: TvComponent
  }
]

@NgModule({
  declarations: [TvComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ModalModule,
  ]
})
export class OthersModule { }
