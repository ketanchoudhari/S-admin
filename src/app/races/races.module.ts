import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacesComponent } from './races.component';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: RacesComponent }];

@NgModule({
  declarations: [RacesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgSelectModule, FormsModule],
})
export class RacesModule {}
