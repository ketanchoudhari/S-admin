import { Injectable } from '@angular/core';
import { ThemeService } from './theme';

export class Environment {
  balanceLabel: string = 'Main';
  showVoidCancel: boolean = false;
  toTimeinput: boolean = false;
  showtotalpnl: boolean = false;
  show_set_MM_msgs_tabs: boolean = false;
}

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  environment: Environment = new Environment();
  constructor(private themeService: ThemeService) { }

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.setEnvVariables();
      resolve();
    });
  }

  private setEnvVariables(): void {
    const hostname = window && window.location && window.location.hostname;

    if (/^.*localhost.*/.test(hostname)) {
      // this.environment.showtotalpnl = true;
      // this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('cricBuzzer');
      // this.environment.toTimeinput = true;
      // this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = true;
    } 
    else if (/tripbets.io/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('tripbets');
    }
     else if (/betbuzz365.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betbuzz365N');
    }
    else if (/betbuzz365.win/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betbuzz365N');
    }
    else if (/winbuzz365.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('winbuzz365');
    }
    else if (/bdbet247.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('lc247');
    }
    else if (/lotusbook.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('cricExch');
    } else if (/lcexch.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('lcExch');
      this.environment.showVoidCancel = true;
    } else if (/cricexch.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('cricExch');
      this.environment.showVoidCancel = true;
    } else if (/skysports365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('skyExch');
    } 
    else if (/cricbuzzer.io/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('cricBuzzer');
    } 
    else if (/paribuzzer.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('paribuzzer');
    } 
    else if (/dreamcric247.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('dreamcric');
    } 
    else if (/velkibuzzer.io/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('velkibuzzer');
    }
    else if (/cricbuzzer.com.bd/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('cricBuzzerbd');
    }
    else if (/exchdiamond.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('exchDiamond');
      this.environment.showVoidCancel = true;
    } else if (/diamondexch.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('Diamondexch');
    } 
    else if (/exchlotus.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('exchlotus');
    } else if (/betswiz.com/.test(hostname)) {
      //this.environment.toTimeinput = true;
      this.themeService.setTheme('betswiz');
    }  else if (/skyfaire.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('Skyfaire');
      this.environment.showVoidCancel = true;
    } else if (/lotusbookk.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('lotusbookk');
    } else if (/mx365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('mx365');
    } else if (/skysports365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('betskyexch');
    } else if (/betskyexch.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('betskyexch');
      this.environment.showVoidCancel = true;
    } else if (/skybet369.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('skybet369');
    }
    else if (/4wickets.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('wicket4');
    }
    else if (/9betexch.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betexch9');
    }
    else if (/line1000.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('line1000');
      this.environment.showVoidCancel = true;
    } 
    else if (/skybet365.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('skybet365');
      this.environment.showVoidCancel = true;
    }else if (/jeetfair.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.themeService.setTheme('jeetfair');
    } else if (/theskyexchange.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('theskyexchange');
    } else if (/betskyexchange.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betskyexchange');
      this.environment.showVoidCancel = true;
    } else if (/sports365.pro/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('sports365');
    }
    else if (/weexch666.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('weexch666');
    } 
    else if (/bdwicket.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('bdwicket');
    } 
    else if (/runbet.pro/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('runbet');
    } 
    else if (/bett365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('bett365');
    } 
     else if (/tensports.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('tensports');
    } else if (/lotusbook.us/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('lotusbooksky');
    } else if (/skyxchange.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyxchange');
    }
    else if (/skyyexchange.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyxchange');
    }
    else if (/radoexchange.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('radoexchange');
    }
    else if (/cheetahexch.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('cheetahexch');
    }
    else if (/lionexchange.games/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('lionexchange');
    }
    else if (/skyfair23.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyfair23');
    }
    else if (/betbuzz365.site/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betbuzz365');
    }
    else if (/ekexchanges.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('ekexchanges');
    }
    else if (/rivermark.live/.test(hostname)) {
      this.themeService.setTheme('rivermark');
    }
    else if (/skyexch.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchh');
    } 
    else if (/sky-exch.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchh');
    }
     else if (/mskyexch.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchh');
    }
    else if (/skyexch8.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexch8');
    }
     else if (/runexch.club/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('runexchange');
    }
    else if (/mpl365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('mpl365');
    }
    else if (/9wicketss.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('wicketss9');
    }
    else if (/skyexchange8.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchange8');
    }
    else if (/ad1.rivermark.live/.test(hostname)) {
      this.themeService.setTheme('exch1');
    }
    else if (/skylaser.io/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skylaser');
    }
    else if (/capitalexch.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('capitalexch');
      this.environment.showVoidCancel = true;
    }
    else if (/worldexch.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('worldexch');
    }
    else if (/fastbets.io/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('fastbets');
    }
    else if (/runexch.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.showVoidCancel = true;
      this.environment.show_set_MM_msgs_tabs = false;
      this.themeService.setTheme('runexch');
    }
    else if (/sky7sports.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('sky7sports');
      this.environment.showVoidCancel = true;
    }
    else if (/laserbook247.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('laserbook247');
      this.environment.showVoidCancel = true;
    }
    else if (/7exch.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('exch7');
      this.environment.showVoidCancel = true;
    }
    else if (/1nexch.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('exch1n');
      this.environment.showVoidCancel = true;
    }
    else if (/jeesky7.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('jeesky7');
      this.environment.showVoidCancel = true;
    }
    else if (/jee365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('jee365');
      this.environment.showVoidCancel = true;
    }

    else if (/rajbet.win/.test(hostname)) {
      this.themeService.setTheme('rajbet');
      this.environment.showVoidCancel=true;
    }
    else if (/neyaludis.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('wckt9');
    }
    else if (/9ex.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('ex9');
    }
    else if (/nayaludis.site/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('nayaludis');
    }
    else if (/velkiex.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkiex');
    }
    else if (/palki.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('palki');
    }

    else if (/lcbuzz.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('lcbuzz');
    }
    else if (/baaji365vip.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('baji365');
    }
    else if (/bet-365.bet/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('bet365');
    }
    else if (/baaji365.site/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baaji365');
    }
    else if (/baaji365.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baaji365bet');
    }
    else if (/bajix365.vip/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('bajix365');
    }
    else if (/star365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('star365');
    }
    else if (/baajii365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baajii365');
    }
    else if (/velkii365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkii365');
    }
    else if (/baaji24.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baaji24');
    }
    else if (/vellkii.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('vellkii');
    }
    else if (/velkii.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkii365');
    }
    else if (/velkibuzz.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkibuzz');
    }
    else if (/velkii.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkii');
    }
    else if (/runexch365.io/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('runexch365');
    }
    else if (/velki.asia/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velki');
    }
    else if (/skybuzz.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skybuzz');
    }
    else if (/bdbuzz365.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('bdbuzz365');
    }
    else if (/velkiie.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('vellkii');
    }
    else if (/runx.bet/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('runx');
    }
    else if (/fiarsky.com/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('luck247');
    }
    else if (/betx365.asia/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('betx365');
    }
    else if (/baajighor365.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('baajighor365');
    }
    else if (/cricpunt.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('cricpunt');
    }
    else if (/skyinplay365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyinplay365');
    }

    else if (/velki365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velki365');
    }
    else if (/baji365.vip/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baji365vip');
    }

    // velkibuzz.live

    // else if (/exch3.rivermark.live/.test(hostname)) {
    //   this.themeService.setTheme('exch3');
    // }
    // else if (/exch4.rivermark.live/.test(hostname)) {
    //   this.themeService.setTheme('exch4');
    // }


    // skyfair23

    else if (/mathaexchall.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('mathaexchall');
    }
    else if (/skyxch.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyxch');
    }
    else if (/baaji247.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('baaji247');
    }

    else if (/dubaimax24.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('dubaimax24');
    }
    else if (/mash247.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.environment.showVoidCancel = true;
      this.themeService.setTheme('mash247');
    }
    else if (/khela365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('khela365');
    }
    else if (/sky444.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('sky444');
    }
    else if (/betbuz365.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('betbuz365');
    }
    else if (/gamex.asia/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('gamex');
    }
    else if (/velkii.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('velkiibet');
    }
    else if (/maza247.bet/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('maza247');
    }
    else if (/skyproexchange.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyproexchange');
    }

    else if (/jio365.me/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('jio365');
    }
    
    else if (/spacexch.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('spacexch');
    }
    else if (/9wicket.vip/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('wicket9');
    }
    // marketing site start
       else if (/9wckt.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/ambeexch.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/bajii365.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/betstar777.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/easy247.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/fiarsky.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/funsports.live/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/runexch.pro/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('runexchpro');
    }
    else if (/runexch.co/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('runexchco');
    }
    else if (/velkix.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('velkix');
    }
    else if (/vellki365.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('vellki365');
    }
    else if (/lc247.co/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('lc247co');
    }
    else if (/winplus247.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.balanceLabel = 'Bal';
      this.themeService.setTheme('winplus247');
    }
    else if (/lionbook247.com/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('lionbook247');
    }
    else if (/winplus99.com/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('winplus99');
    }
    else if (/xpgexch.com/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('xpgexch');
    }
    else if (/xpgexch.io/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('xpgexchio');
    }
    else if (/betwinners.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.themeService.setTheme('betwinners');
    }
    else if (/lc247.xyz/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('lc247');
    }
    else if (/lc247.live/.test(hostname)) {
      this.environment.showVoidCancel=true;
      this.environment.toTimeinput = true;
      this.themeService.setTheme('lc247');
    }
    else if (/mx365.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/sawtaka.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/skyfiar.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/skyexchM.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/cricbuzzer.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/jio365.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/jio365.net/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/jio365.vip/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/skyexch999.co/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/tenn365.com/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }
    else if (/vbexchange.in/.test(hostname)) {
      this.environment.toTimeinput = true;
      this.environment.show_set_MM_msgs_tabs = true;
      this.themeService.setTheme('skyexchM');
    }


    // marketing site end



    else {
      console.warn(`Cannot find environment for host name ${hostname}`);
    }
  }
}
