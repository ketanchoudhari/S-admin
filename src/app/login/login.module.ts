import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme';
import { LoginMobComponent } from './login-mob/login-mob.component';
import { DirectivesModule } from '../directives/directives.module';
import { BajiloginComponent } from './bajilogin/bajilogin.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, LoginMobComponent, BajiloginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    ThemeModule
  ],
})
export class LoginModule {}
