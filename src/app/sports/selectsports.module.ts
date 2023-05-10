import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { SelectsportsComponent } from './selectsports.component';

const routes: Routes = [
  {
    path: '',
    component: SelectsportsComponent
  }
]

@NgModule({
  declarations: [SelectsportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ModalModule,
    NgSelectModule,
    DirectivesModule
  ]
})
export class SelectsportsModule { }
