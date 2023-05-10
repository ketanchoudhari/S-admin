import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionComponent } from './reports/commission/commission.component';
import { DownlineListComponent } from './downline-list/downline-list.component';
import { MainGuard } from './main.guard';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [MainGuard],
    children: [
      {
        path: '',
        redirectTo: '/my-account/account-summary',
        pathMatch: 'full',
      },
      {
        path: 'analysis',
        loadChildren: () =>
          import('./analysis/analysis.module').then((m) => m.AnalysisModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'downline',
        component: DownlineListComponent,
      },
      {
        path: 'Etgcasino',
        loadChildren: () =>
          import('./etgcasino/etgcasino.module').then((m) => m.EtgcasinoModule),
      },
      {
        path: 'slotlist',
        loadChildren: () =>
          import('./slotcasino/slotcasino.module').then((m) => m.SlotcasinoModule),
      },
      {
        path: 'awcCasino',
        loadChildren: () =>
          import('./awcCasino/awc-caasino.module').then((m) => m.AwcCaasinoModule),
      },
      {
        path: 'betgames',
        loadChildren: () =>
          import('./betgamesreport/betgamesreport.module').then((m) => m.BetgamesreportModule),
      },
      {
        path: 'sncasino',
        loadChildren: () =>
          import('./sncasino/sncasino.module').then((m) => m.SncasinoModule),
      },
      {
        path:'stakesettings',
        loadChildren: () =>
        import('./stakesettings/stakesettings.module').then((m) => m.StakesettingsModule),
      },
      {
        path: 'memberList',
        loadChildren: () =>
          import('./member-list/member-list.module').then(
            (m) => m.MemberListModule
          ),
      },
      {
        path: 'my-account',
        loadChildren: () =>
          import('./my-account/my-account.module').then(
            (m) => m.MyAccountModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'bet-list',
        loadChildren: () =>
          import('./betlist/betlist.module').then((m) => m.BetlistModule),
      },

      {
        path: 'risk-management',
        loadChildren: () =>
          import('./risk-management/risk-management.module').then(
            (m) => m.RiskManagementModule
          ),
      },
      {
        path: 'banking',
        loadChildren: () =>
          import('./banking/banking.module').then((m) => m.BankingModule),
      },
      {
        path: 'bankingreq',
        loadChildren: () =>
          import('./banking-req/banking-req.module').then((m) => m.BankingReqModule),
      },
      {
        path: 'bankingreqxpg',
        loadChildren: () =>
          import('./banking-req-xpg/banking-req-xpg.module').then((m) => m.BankingReqXpgModule),
      },
      {
        path: 'bankupi',
        loadChildren: () =>
          import('./bankupi/bankupi.module').then((m) => m.BankUpiModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'sports',
        loadChildren: () =>
          import('./sports/selectsports.module').then((m) => m.SelectsportsModule),
      },
      {
        path: 'teenpatti',
        loadChildren: () =>
          import('./teenpatti/teenpatti.module').then((m) => m.TeenpattiModule),
      },
      {
        path: 'races',
        loadChildren: () =>
          import('./races/races.module').then((m) => m.RacesModule),
      },
      {
        path: 'manual',
        loadChildren: () =>
          import('./manual/manual.module').then((m) => m.ManualModule),
      },
      {
        path: 'risk',
        loadChildren: () =>
          import('./risk-management/risk-management.module').then((m) => m.RiskManagementModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then((m) => m.MessagesModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'website',
        loadChildren: () =>
          import('./website/website.module').then((m) => m.WebsiteModule),
      },
      {
        path: 'others',
        loadChildren: () =>
          import('./others/others.module').then((m) => m.OthersModule),
      },
      {
        path: 'casino',
        loadChildren: () => import('./casino/casino.module').then((m) => m.CasinoModule),
      },
      {
        path: 'settlement',
        loadChildren: () =>
          import('./settlement/settlement.module').then(
            (m) => m.SettlementModule
          ),
      },
    ],
  },

  {
    path: 'x',
    loadChildren: () =>
      import('./windows/windows.module').then((m) => m.WindowsModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
