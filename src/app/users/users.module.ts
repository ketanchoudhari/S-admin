import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes
} from '@angular/router';
// import { BreadcrumbModule } from 'angular-crumbs';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from '../directives/directives.module';
import { AccountDetailsComponent } from '../member-list/account-details.component';
import { BettingHistoryComponent } from '../member-list/betting-history/betting-history.component';
import { ClAccountstatementComponent } from '../member-list/cl-accountstatement/cl-accountstatement.component';
import { LoginHistoryComponent } from '../member-list/login-history/login-history.component';
import { MemberListModule } from '../member-list/member-list.module';
import { PnlComponent } from '../member-list/pnl/pnl.component';
import { SummaryComponent } from '../member-list/summary/summary.component';
import { TransactionHistoryComponent } from '../member-list/transaction-history/transaction-history.component';
import { ModalModule } from '../modal/modal.module';
import { PipesModule } from '../pipes/pipes.module';
// import { LoginHistoryComponent } from '../my-account/login-history/login-history.component';
import { TableModule } from '../table/table.module';
import { ChildrenComponent } from './children/children.component';
import { UserComponent } from './user/user.component';
import { AlluserComponent } from './users-list/alluser/alluser.component';
import { SubComponent } from './users-list/sub/sub.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { CasinobethistoryComponent } from '../member-list/casinobethistory/casinobethistory.component';
import { CasinoprofitlossComponent } from '../member-list/casinoprofitloss/casinoprofitloss.component';
import { CasinoPnlComponent } from '../member-list/casino-pnl/casino-pnl.component';
import { SncasinobethistoryComponent } from '../member-list/sncasinobethistory/sncasinobethistory.component';
import { SncasinoprofitlossComponent } from '../member-list/sncasinoprofitloss/sncasinoprofitloss.component';
import { SncasinoPnlComponent } from '../member-list/sncasino-pnl/sncasino-pnl.component';
import { SlotcasinobethistoryComponent } from '../member-list/slotcasinobethistory/slotcasinobethistory.component';
import { SlotcasinobetprofitlossComponent } from '../member-list/slotcasinobetprofitloss/slotcasinobetprofitloss.component';
import { SlotcasinoPnlComponent } from '../member-list/slotcasino-pnl/slotcasino-pnl.component';
import { BetgamesbethistoryComponent } from '../member-list/betgamesbethistory/betgamesbethistory.component';
import { BetgamesbetprofitlossComponent } from '../member-list/betgamesbetprofitloss/betgamesbetprofitloss.component';
import { BetgamesPnlComponent } from '../member-list/betgames-pnl/betgames-pnl.component';
import { AwccasinobethistoryComponent } from '../member-list/awccasinobethistory/awccasinobethistory.component';
import { AwccasinobetprofitlossComponent } from '../member-list/awccasinobetprofitloss/awccasinobetprofitloss.component';
import { AwccasinoPnlComponent } from '../member-list/awccasino-pnl/awccasino-pnl.component';
const accountSummary: Routes = [
  {
    path: '',
    component: AccountDetailsComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'accountSummary',
        component: SummaryComponent,
      },
      {
        path: 'profitAndLoss',
        component: PnlComponent,
      },
      {
        path: 'claccountstatement',
        component: ClAccountstatementComponent,
      },
      {
        path: 'bettingHistory',
        component: BettingHistoryComponent,
      },
      {
        path: 'transactionCashHistory',
        component: TransactionHistoryComponent,
      },
      {
        path: 'loginHistory',
        component: LoginHistoryComponent,
      },
      {
        path: 'casino-bethistory',
        component: CasinobethistoryComponent,
      },
      {
        path: 'casino-profitloss',
        component: CasinoprofitlossComponent,
      },
      {
        path: 'casino-pnl',
        component: CasinoPnlComponent,
      },
      {
        path: 'awccasino-bethistory',
        component: AwccasinobethistoryComponent,
      },
      {
        path: 'awccasino-profitloss',
        component: AwccasinobetprofitlossComponent,
      },
      {
        path: 'awccasino-pnl',
        component: AwccasinoPnlComponent,
      },
      {
        path: 'sncasino-bethistory',
        component: SncasinobethistoryComponent,
      },
      {
        path: 'sncasino-profitloss',
        component: SncasinoprofitlossComponent,
      },
      {
        path: 'sncasino-pnl',
        component: SncasinoPnlComponent,
      },
      {
        path: 'slotcasino-bethistory',
        component: SlotcasinobethistoryComponent,
      },
      {
        path: 'slotcasino-profitloss',
        component: SlotcasinobetprofitlossComponent,
      },
      {
        path: 'slotcasino-pnl',
        component: SlotcasinoPnlComponent,
      },
      {
        path: 'betgames-bethistory',
        component: BetgamesbethistoryComponent,
      },
      {
        path: 'betgames-profitloss',
        component: BetgamesbetprofitlossComponent,
      },
      {
        path: 'betgames-pnl',
        component: BetgamesPnlComponent,
      },
    ],
  },
];
const clientRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...accountSummary,
    ],
  },
];

const agentRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...clientRoutes,
      ...accountSummary,
    ],
  },
];

const masterRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...agentRoutes,
      ...accountSummary,
    ],
  },
];

const superMasterRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...masterRoutes,
      ...accountSummary,
    ],
  },
];

const subAdminRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...superMasterRoutes,
      ...accountSummary,
    ],
  },
];

const adminRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...subAdminRoutes,
      ...accountSummary,
    ],
  },
];

const whitelabelRoutes: Routes = [
  {
    path: 'sub/:selectedUid',
    component: ChildrenComponent,
    resolve: {
      breadcrumb: 'breadcrumb',
    },
    children: [
      {
        path: '',
        component: SubComponent,
      },
      ...adminRoutes,
      ...accountSummary,
    ],
  },
];

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    children: [
      {
        path: 'search',
        component: SubComponent,
      },
      {
        path: 'alluser',
        component: AlluserComponent,
      },
      {
        path: ':userType',
        component: ChildrenComponent,
        resolve: {
          breadcrumb: 'breadcrumb',
        },
        children: [
          {
            path: '',
            component: SubComponent,
          },
          ...whitelabelRoutes,
          ...accountSummary,
        ],
      },
      {
        path: ':userType/:selectedUid',
        component: ChildrenComponent,
        resolve: {
          breadcrumb: 'breadcrumb',
        },
        children: [
          {
            path: '',
            component: AlluserComponent,
          },
          ...accountSummary,
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    UsersListComponent,
    UserComponent,
    SubComponent,
    ChildrenComponent,
    AlluserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    // BreadcrumbModule,
    TableModule,
    NgxPaginationModule,
    MemberListModule,
    DirectivesModule,
    PipesModule,
    NgSelectModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: 'breadcrumb',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        // route.data
        return history.state.data;
      },
    },
  ],
})
export class UsersModule {}
