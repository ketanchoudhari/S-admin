import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DirectivesModule } from '../directives/directives.module';
import { ModalModule } from '../modal/modal.module';
import { TeenpattiComponent } from './teenpatti.component';

const routes: Routes = [
  {
    path: '',
    component: TeenpattiComponent
  }
]

@NgModule({
  declarations: [TeenpattiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ModalModule,
    DpDatePickerModule,
    NgSelectModule,
    DirectivesModule
  ]
})
export class TeenpattiModule { }
