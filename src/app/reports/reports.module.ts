import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PlDownlineComponent } from './pl-downline/pl-downline.component';
import { PlMarketComponent } from './pl-market/pl-market.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoginlogoutComponent } from './loginlogout/loginlogout.component';
import { TransferStatementComponent } from './transfer-statement/transfer-statement.component';
import { RejectBetHistoryComponent } from './reject-bet-history/reject-bet-history.component';
import { VoidBetsComponent } from './void-bets/void-bets.component';
import { NewAccountsComponent } from './new-accounts/new-accounts.component';
import { ExportAsModule } from 'ngx-export-as';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { CommissionComponent } from './commission/commission.component';
import { ModalModule } from '../modal/modal.module';
import { IndianCurrencyPipe } from '../pipes/indian-currency.pipe';
import { OnlineuserComponent } from './onlineuser/onlineuser.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlCasinoComponent } from './pl-casino/pl-casino.component';
import { PlSncasinoComponent } from './pl-sncasino/pl-sncasino.component';
import { PlDiamondcasinoComponent } from './pl-diamondcasino/pl-diamondcasino.component';
import { PlSlotcasinoComponent } from './pl-slotcasino/pl-slotcasino.component';
import { PlPokerlogsComponent } from './pl-pokerlogs/pl-pokerlogs.component';
import { PlBetgamesComponent } from './pl-betgames/pl-betgames.component';
import { PlAwccasinoComponent } from './pl-awccasino/pl-awccasino.component';
import { GlobalReportComponent } from './global-report/global-report.component';

const routes: Routes = [
  {
    path: 'commission',
    component: CommissionComponent,
  },
  {
    path: 'pl-downline',
    component: PlDownlineComponent,
  },
  {
    path: 'pnl-downline',
    component: GlobalReportComponent,
  },
  {
    path: 'pl-market',
    component: PlMarketComponent,
  },
  {
    path: 'pl-casino',
    component: PlCasinoComponent,
  },
  {
    path: 'pl-awccasino',
    component: PlAwccasinoComponent,
  },
  {
    path: 'pl-sncasino',
    component: PlSncasinoComponent,
  },
  {
    path: 'pl-slotcasino',
    component: PlSlotcasinoComponent,
  },
  {
    path: 'pl-betgames',
    component: PlBetgamesComponent,
  },
  {
    path: 'pl-pokerlogs',
    component: PlPokerlogsComponent,
  },
  {
    path: 'pl-diacasino',
    component: PlDiamondcasinoComponent,
  },
  {
    path: 'loginlogout',
    component: LoginlogoutComponent,
  },
  {
    path: 'transfer-statement',
    component: TransferStatementComponent,
  },
  {
    path: 'reject-bet-history',
    component: RejectBetHistoryComponent,
  },
  {
    path: 'void-bets',
    component: VoidBetsComponent,
  },
  {
    path: 'new-accounts',
    component: NewAccountsComponent,
  },
  {
    path: 'onlineuser',
    component: OnlineuserComponent,
  },
];

@NgModule({
  declarations: [
    PlDownlineComponent,
    PlMarketComponent,
    LoginlogoutComponent,
    TransferStatementComponent,
    RejectBetHistoryComponent,
    VoidBetsComponent,
    NewAccountsComponent,
    CommissionComponent,
    OnlineuserComponent,
    PlCasinoComponent,
    PlSncasinoComponent,
    PlDiamondcasinoComponent,
    PlSlotcasinoComponent,
    PlPokerlogsComponent,
    PlBetgamesComponent,
    PlAwccasinoComponent,
    GlobalReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ExportAsModule,
    DirectivesModule,
    PipesModule,
    NgSelectModule,
    ModalModule
  ],
  providers: [DatePipe],
})
export class ReportsModule {}
