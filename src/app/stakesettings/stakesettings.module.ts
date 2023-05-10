import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StakesettingsComponent } from './stakesettings.component';
import { DirectivesModule } from '../directives/directives.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: StakesettingsComponent,
  }
];

@NgModule({
  declarations: [StakesettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    DirectivesModule
  ]
  
})
export class StakesettingsModule { }
