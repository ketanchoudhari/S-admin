import { TitleCasePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BreadcrumbModule } from 'angular-crumbs';
// import { BreadcrumbsService } from '@exalif/ngx-breadcrumbs';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectivesModule } from './directives/directives.module';
import { DownlineListComponent } from './downline-list/downline-list.component';
import { EnvService } from './env.service';
import { HeaderComponent } from './header/header.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MainComponent } from './main/main.component';
import { ModalModule } from './modal/modal.module';
import { PipesModule } from './pipes/pipes.module';
import { ThemeModule } from './theme/theme.module';
import {
  betsWizTheme,
  // betswizTheme,
  // betsWizTheme,
  cricBuzzerTheme,
  paribuzzerTheme,
  velkibuzzerTheme,
  cricBuzzerbdTheme,
  dreamcricTheme,
  cricExchTheme,
  skyproexchangeTheme,
  bdbet247Theme,
  skyxchangeTheme,
  exchDiamondTheme,
  DiamondexchTheme,
  DiamondexTheme,
  exchlotusTheme,
  lcExchTheme,
  sawTakaTheme,
  skyexchange8Theme,
  skyexch777Theme,
  skyExchTheme,
  skyexch8Theme,
  wicketss9Theme,
  ex9Theme,
  runexchangeTheme,
  Playexch444Theme,
  SkyfaireTheme,
  lotusbookkTheme,
  lotusbookTheme,
  mx365Theme,
  skybet369Theme,
  betskyexchTheme,
  radoexchangeTheme,
  line1000Theme,
  skyexch999Theme,
  skybet365Theme,
  jeetfairTheme,
  theskyexchangeTheme,
  betskyexchangeTheme,
  sports365Theme,
  theflyexchangeTheme,
  Ten365Theme,
  BonusbookTheme,
  sports1Theme,
  runbetTheme,
  spacexchTheme,
  bdwicketTheme,
  weexch666Theme,
  betfair21Theme,
  tensportsTheme,
  khela247Theme,
  lotusbooksTheme,
  fc365Theme,
  skyproexchTheme,
  betx365Theme,
  lionexchangeTheme,
  skyfair23Theme,
  betbuzz365Theme,
  betbuzz365NTheme,
  winbuzz365Theme,
  wickets9Theme,
  wicket4Theme,
  ekexchangesTheme,
  tripbetsTheme,
  rivermarkTheme,
  skyexchhTheme,
  maza247Theme,
  skyinr247Theme,
  exch1Theme,
  exch2Theme,
  skylaserTheme,
  lc247coTheme,
  winplus247Theme,
  winplus99Theme,
  lionbook247Theme,
  baajighorTheme,
  xpgexchTheme,
  xpgexchioTheme,
  worldexchTheme,
  yogiexchangeTheme,
  fastbetsTheme,
  runexchTheme,
  runexch365Theme,
  sky7sportsTheme,
  exch7Theme,
  laserbook247Theme,
  jeesky7Theme,
  jee365Theme,
  exch1nTheme,
  velkiexTheme,
  vellkiTheme,
  palkiTheme,
  rajbetTheme,
  sports11Theme,
  wckt9Theme,
  nayaludisTheme,
  velkiibetTheme,
  luck247Theme,
  runxTheme,
  mpl365Theme,
  vellkiiTheme,
  bdbuzz365Theme,
  deep11exchTheme,
  cricpuntTheme,
  skyinplay365Theme,
  velki365Theme,
  star365Theme,
  velkii365Theme,
  velkiiTheme,
  skybuzzTheme,
  velkiTheme,
  velkibuzzTheme,
  runexchproTheme,
  runexchcoTheme,
  mathaexchallTheme,
  velkixTheme,
  vellki365Theme,
  skyxchTheme,
  Bajii365Theme,
  baaji24Theme,
  baji365Theme,
  bet365Theme,
  bett365Theme,
  betexch9Theme,
  baji365vipTheme,
  betwinnersTheme,
  baaji365Theme,
  baaji365betTheme,
  bajix365Theme,
  baajii365Theme,
  baaji247Theme,
  dubaimax24Theme,
  lc247Theme,
  lcbuzzTheme,
  mash247Theme,
  khela365Theme,
  bossexchangTheme,
  sky444Theme,
  betbuz365Theme,
  gamexTheme,
  jio365Theme,
  lc365Theme,
  wickets3Theme,
  cricBuzz365Theme,
  winBuzzTheme,
  playbet365Theme,
  velki123Theme,
  velkeiTheme,
  velkiex123Theme
  // exch3Theme,
  // exch4Theme,
  // skyexchange8Theme
} from './theme/themes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandler } from './GlobalErrorHandler/GlobalErrorHandler';
import { RemoveSpacePipe } from './pipes/remove-space.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    DownlineListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModalModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
    ThemeModule.forRoot({
      themes: [
        skyExchTheme,
        skyexch8Theme,
        runexchangeTheme,
        lcExchTheme,
        cricBuzzerTheme,
        paribuzzerTheme,
        velkibuzzerTheme,
        cricBuzzerbdTheme,
        dreamcricTheme,
        cricExchTheme,
        skyproexchangeTheme,
        bdbet247Theme,
        skyxchangeTheme,
        exchDiamondTheme,
        DiamondexchTheme,
        DiamondexTheme,
        exchlotusTheme,
        sawTakaTheme,
        // skyExchange8Theme,
        betsWizTheme,
        Playexch444Theme,
        SkyfaireTheme,
        lotusbookkTheme,
        lotusbookTheme,
        mx365Theme,
        skybet369Theme,
        betskyexchTheme,
        radoexchangeTheme,
        line1000Theme,
        skyexch999Theme,
        skybet365Theme,
        jeetfairTheme,
        theskyexchangeTheme,
        betskyexchangeTheme,
        sports365Theme,
        luck247Theme,
        runxTheme,
        theflyexchangeTheme,
        Ten365Theme,
        BonusbookTheme,
        sports1Theme,
        runbetTheme,
        spacexchTheme,
        bdwicketTheme,
        weexch666Theme,
        betfair21Theme,
        tensportsTheme,
        khela247Theme,
        lotusbooksTheme,
        fc365Theme,
        skyproexchTheme,
        betx365Theme,
        lionexchangeTheme,
        skyfair23Theme,
        betbuzz365Theme,
        betbuzz365NTheme,
        winbuzz365Theme,
        wickets9Theme,
        wicket4Theme,
        ex9Theme,
        ekexchangesTheme,
        tripbetsTheme,
        rivermarkTheme,
        skyexchhTheme,
        maza247Theme,
        skyinr247Theme,
        skyexchange8Theme,
        skyexch777Theme,
        exch1Theme,
        exch2Theme,
        skylaserTheme,
        lc247coTheme,
        winplus247Theme,
        winplus99Theme,
        lionbook247Theme,
        baajighorTheme,
        xpgexchTheme,
        xpgexchioTheme,
        worldexchTheme,
        yogiexchangeTheme,
        fastbetsTheme,
        runexchTheme,
        runexch365Theme,
        wicketss9Theme,
        sky7sportsTheme,
        exch7Theme,
        laserbook247Theme,
        jeesky7Theme,
        jee365Theme,
        exch1nTheme,
        velkiexTheme,
        vellkiTheme,
        palkiTheme,
        rajbetTheme,
        sports11Theme,
        wckt9Theme,
        nayaludisTheme,
        velkiibetTheme,
        mpl365Theme,
        vellkiiTheme,
        bdbuzz365Theme,
        deep11exchTheme,
        cricpuntTheme,
        velki365Theme,
        star365Theme,
        velkii365Theme,
        velkiiTheme,
        skybuzzTheme,
        velkiTheme,
        velkibuzzTheme,
        runexchproTheme,
        runexchcoTheme,
        mathaexchallTheme,
        velkixTheme,
        vellki365Theme,
        skyxchTheme,
        Bajii365Theme,
        baaji24Theme,
        baji365Theme,
        bet365Theme,
        bett365Theme,
        betexch9Theme,
        baji365vipTheme,
        betwinnersTheme,
        baaji365Theme,
        baaji365betTheme,
        bajix365Theme,
        baajii365Theme,
        baaji247Theme,
        dubaimax24Theme,
        lc247Theme,
        lcbuzzTheme,
        mash247Theme,
        lc365Theme,
        khela365Theme,
        bossexchangTheme,
        sky444Theme,
        betbuz365Theme,
        gamexTheme,
        jio365Theme,
        wickets3Theme,
        cricBuzz365Theme,
        winBuzzTheme,
        playbet365Theme,
        velki123Theme,
        velkeiTheme,
        velkiex123Theme
        // exch3Theme,
        // exch4Theme,
      ],
      active: environment.siteName,
    }),
  ],
  providers: [
    CookieService,
    // BreadcrumbsService,
    TitleCasePipe,
    RemoveSpacePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: EnvService) => () => envService.init(),
      deps: [EnvService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
