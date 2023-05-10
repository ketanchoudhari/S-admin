import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AccountDetailsComponent } from './account-details.component';
import { PnlComponent } from './pnl/pnl.component';
import { SummaryComponent } from './summary/summary.component';
import { BettingHistoryComponent } from './betting-history/betting-history.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from '../modal/modal.module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { ExportAsModule } from 'ngx-export-as';
import { ClAccountstatementComponent } from './cl-accountstatement/cl-accountstatement.component';
import { CasinobethistoryComponent } from './casinobethistory/casinobethistory.component';
import { CasinoprofitlossComponent } from './casinoprofitloss/casinoprofitloss.component';
import { CasinoPnlComponent } from './casino-pnl/casino-pnl.component';
import { SncasinoPnlComponent } from './sncasino-pnl/sncasino-pnl.component';
import { SncasinobethistoryComponent } from './sncasinobethistory/sncasinobethistory.component';
import { SncasinoprofitlossComponent } from './sncasinoprofitloss/sncasinoprofitloss.component';
import { SlotcasinoPnlComponent } from './slotcasino-pnl/slotcasino-pnl.component';
import { SlotcasinobethistoryComponent } from './slotcasinobethistory/slotcasinobethistory.component';
import { SlotcasinobetprofitlossComponent } from './slotcasinobetprofitloss/slotcasinobetprofitloss.component';
import { BetgamesPnlComponent } from './betgames-pnl/betgames-pnl.component';
import { BetgamesbethistoryComponent } from './betgamesbethistory/betgamesbethistory.component';
import { BetgamesbetprofitlossComponent } from './betgamesbetprofitloss/betgamesbetprofitloss.component';
import { AwccasinoPnlComponent } from './awccasino-pnl/awccasino-pnl.component';
import { AwccasinobethistoryComponent } from './awccasinobethistory/awccasinobethistory.component';
import { AwccasinobetprofitlossComponent } from './awccasinobetprofitloss/awccasinobetprofitloss.component';

const routes: Routes = [
  {
    path: ':userID',
    component: AccountDetailsComponent,
    children: [
      {
        path: 'accountSummary',
        component: SummaryComponent,
      },
      {
        path: 'claccountstatement',
        component: ClAccountstatementComponent,
      },
      {
        path: 'profitAndLoss',
        component: PnlComponent,
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

@NgModule({
  declarations: [
    AccountDetailsComponent,
    SummaryComponent,
    PnlComponent,
    BettingHistoryComponent,
    TransactionHistoryComponent,
    LoginHistoryComponent,
    ClAccountstatementComponent,
    CasinobethistoryComponent,
    CasinoPnlComponent,
    CasinoprofitlossComponent,
    SncasinoPnlComponent,
    SncasinobethistoryComponent,
    SncasinoprofitlossComponent,
    SlotcasinoPnlComponent,
    SlotcasinobethistoryComponent,
    SlotcasinobetprofitlossComponent,
    BetgamesPnlComponent,
    BetgamesbethistoryComponent,
    BetgamesbetprofitlossComponent,
    AwccasinoPnlComponent,
    AwccasinobethistoryComponent,
    AwccasinobetprofitlossComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    NgxPaginationModule,
    ModalModule,
    DirectivesModule,
    PipesModule,
    ExportAsModule
  ],
  exports: [
    AccountDetailsComponent,
    SummaryComponent,
    PnlComponent,
    BettingHistoryComponent,
    TransactionHistoryComponent,
    LoginHistoryComponent,
    RouterModule,
  ],
  providers: [DatePipe]
})
export class MemberListModule {}
