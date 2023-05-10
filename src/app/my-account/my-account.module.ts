import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { MyAccountComponent } from './my-account.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from '../modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'account-summary',
        pathMatch: 'full',
      },
      {
        path: 'account-summary',
        component: AccountSummaryComponent,
      },
      {
        path: 'account-statement',
        component: AccountStatementComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'login-history',
        component: LoginHistoryComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AccountSummaryComponent,
    AccountStatementComponent,
    ProfileComponent,
    LoginHistoryComponent,
    MyAccountComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
  ],
  exports: [
    AccountSummaryComponent,
    AccountStatementComponent,
    ProfileComponent,
    LoginHistoryComponent,
    MyAccountComponent,
  ],
})
export class MyAccountModule {}
