let hostname = window.origin;

console.log(hostname, 'Env');

export const environment = {
  production: true,
  siteName: 'jio365',
  // baseUrl: 'http://51.195.220.62:81', // Test
  baseUrl: 'http://136.244.79.114:81', // prod
  apisUrl: 'https://access.streamingtv.fun:3445/api/all_apis',
  BDapisUrl: 'https://api2.streamingtv.fun:3440/api/all_apis',
  // baseUrl: 'https://exchangegames.xyz/pad=81', // prod
  tvUrl: 'https://streamingtv.fun/live_tv/index.html',
  currency: '', //It should be blank here for Dynamic currency
  timeFormat: '',
  showCurrency: true,
  isProduction: true,
  scoreUrl: 'http://7skyexch.fun:3030/score_api',
  iframeTVScoreurl: "https://555555.services",
  oddsSocketUrl: 'ws://209.250.242.175',
  captcha: true,
  origin: '',
  oldAdmin: false,
  whatsapp: '',
  whatsapp1: '',
  skype: '',
  insta: '',
  telegram: '',
  telegram1: '',
  mail: '',
  transferdelay: false,
  settlemettab: false,
  loader: false,
  manual: true,
  fb: '',
  web: '',
  userMultiplier: 0,
  socialmediasection: true,
  internationalCasino: false,
  isAWCcasino:false,
  isPremiumSite: false,
  isBdlevel: false,
  isRental: false,
  isSharing: false,
  isB2C: false,
  isFirstTimePassword: true,
  isSupernova: false,
  isSlot: false,
  isPoker: false,
  isSkyFancy: false,
  xpgPay: false,
  isbetgame: false,
  islanguage: false,
  domainMap: [],
  isBajilogin:false
};

if (hostname.indexOf('tripbets.io') > -1) {
  environment.siteName = 'tripbets';
  environment.origin = 'tripbets.io';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;
}
else if (hostname.indexOf('lc247.live') > -1) {
  environment.siteName = 'lc247';
  environment.origin = 'lc247.live';
  environment.internationalCasino = true;
  environment.transferdelay=true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isSkyFancy = true;
  environment.isAWCcasino=true;
  environment.domainMap = [
    { id: 0, name: 'lc247.live' },
  ]
}
else if (hostname.indexOf('lc247.co') > -1) {
  environment.siteName = 'lc247co';
  environment.origin = 'lc247.co';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isAWCcasino=true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
  environment.islanguage = true;
  environment.domainMap = [
    { id: 0, name: 'betwinners.live' },
    { id: 1, name: 'baaji365vip.live' },
    { id: 2, name: 'bdwicket.com' },
    { id: 3, name: '3wickets.bet' },
    { id: 4, name: 'tripbets.io' },
    { id: 5, name: 'lionbook247.com' },
    { id: 6, name: 'runexch.co' },
    { id: 7, name: 'bet-365.bet' },
  ]
}
else if (hostname.indexOf('baajii365.live') > -1) {
  environment.siteName = 'baajii365';
  environment.origin = 'baajii365.live';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
}
else if (hostname.indexOf('winplus247.com') > -1) {
  environment.siteName = 'winplus247';
  environment.origin = 'winplus247.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
  environment.isB2C = true;
}
else if (hostname.indexOf('winplus99.com') > -1) {
  environment.siteName = 'winplus99';
  environment.origin = 'winplus99.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
}
else if (hostname.indexOf('lionbook247.com') > -1) {
  environment.siteName = 'lionbook247';
  environment.origin = 'lionbook247.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;

}
else if (hostname.indexOf('xpgexch.com') > -1) {
  environment.siteName = 'xpgexch';
  environment.origin = 'xpgexch.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.transferdelay = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSkyFancy = true;
}
else if (hostname.indexOf('xpgexch.io') > -1) {
  environment.siteName = 'xpgexchio';
  environment.origin = 'xpgexch.io';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.transferdelay = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSkyFancy = true;
}
else if (hostname.indexOf('betwinners.live') > -1) {
  environment.siteName = 'betwinners';
  environment.origin = 'betwinners.live';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  // environment.isbetgame = true;
  environment.isAWCcasino=true;
  environment.captcha = false;
  environment.isBdlevel = true;
}
else if (hostname.indexOf('runexch.pro') > -1) {
  environment.siteName = 'runexchpro';
  environment.origin = 'runexch.pro';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isAWCcasino=true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.domainMap = [
    { id: 0, name: 'runexch.pro' },
  ]
}
else if (hostname.indexOf('runexch.co') > -1) {
  environment.siteName = 'runexchco';
  environment.origin = 'runexch.co';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isAWCcasino=true;
 
}
else if (hostname.indexOf('velkix.live') > -1) {
  environment.siteName = 'velkix';
  environment.origin = 'velkix.live';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.transferdelay = true;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.domainMap = [
    { id: 1, name: 'velkix.live' },
  ]
  // environment.whatsapp = '+447444365816';
}
else if (hostname.indexOf('lcexch.in') > -1) {
  environment.siteName = 'lcExch';
  environment.captcha = false;
  environment.origin = 'lcexch.in';
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('cricbuzzer.io') > -1) {
  environment.siteName = 'cricBuzzer';
  environment.isProduction = false;
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isAWCcasino=true;
  environment.isPremiumSite = true;
  environment.isSupernova = true;
  environment.isSlot = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isSkyFancy = true;
  environment.islanguage = true;
  environment.isB2C = true;
}
else if (hostname.indexOf('paribuzzer.com') > -1) {
  environment.siteName = 'paribuzzer';
  environment.isProduction = false;
  environment.settlemettab = true;
 
}

else if (hostname.indexOf('dreamcric247.com') > -1) {
  environment.siteName = 'dreamcric';
  environment.isProduction = false;
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isSkyFancy = true;
  environment.isB2C = true;
}
else if (hostname.indexOf('velkibuzzer.io') > -1) {
  environment.siteName = 'velkibuzzer';
  environment.isProduction = false;
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isB2C = true;
}
else if (hostname.indexOf('cricbuzzer.com.bd') > -1) {
  environment.siteName = 'cricBuzzerbd';
  environment.isProduction = false;
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isB2C = true;
}
else if (hostname.indexOf('cricexch') > -1) {
  environment.siteName = 'cricExch';
} else if (hostname.indexOf('exchdiamond') > -1) {
  environment.siteName = 'exchDiamond';
} else if (hostname.indexOf('Diamondexch') > -1) {
  environment.siteName = 'Diamondexch';
} else if (hostname.indexOf('diamondex') > -1) {
  environment.siteName = 'Diamondex';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
} else if (hostname.indexOf('exchlotus') > -1) {
  environment.siteName = 'exchlotus';
} else if (hostname.indexOf('betswiz.com') > -1) {
  environment.siteName = 'betswiz';
  environment.isFirstTimePassword = false;
  environment.currency = '';
  environment.timeFormat = '+0530';
} else if (hostname.indexOf('skyfaire.com') > -1) {
  environment.oldAdmin = true;
  environment.siteName = 'Skyfaire';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isSupernova = true;
  environment.isRental = true;
  environment.domainMap = [
    { id: 1, name: 'mx365.live' },
    { id: 2, name: 'betbuzz365.site' },
  ]
  // environment.currency = 'USD';
} else if (hostname.indexOf('lotusbook.net') > -1) {
  environment.siteName = 'lotusbook';
} else if (hostname.indexOf('runbet.pro') > -1) {
  environment.siteName = 'runbet';
  environment.origin = 'runbet.pro';
  environment.whatsapp = '+447949358122';
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('bett365.live') > -1) {
  environment.siteName = 'bett365';
  environment.origin = 'bett365.live';
  environment.internationalCasino = true;
}
else if (hostname.indexOf('bdwicket.com') > -1) {
  environment.siteName = 'bdwicket';
  environment.origin = 'bdwicket.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isbetgame = true;
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isSharing = true;
}
else if (hostname.indexOf('weexch666.com') > -1) {
  environment.siteName = 'weexch666';
  environment.origin = 'weexch666.com';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.settlemettab = true;
  environment.captcha = false;
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
}
else if (hostname.indexOf('mx365.live') > -1) {
  environment.siteName = 'mx365';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.oldAdmin = true;
} else if (hostname.indexOf('betskyexchange.com') > -1) {
  environment.captcha = false;
  environment.siteName = 'betskyexchange';
  environment.origin = 'betskyexchange.com';
  environment.settlemettab = true;
  environment.isPremiumSite = true;
} else if (hostname.indexOf('betskyexch.com') > -1) {
  environment.siteName = 'betskyexch';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('skybet369.co') > -1) {
  environment.siteName = 'skybet369';
  environment.isFirstTimePassword = false;
}
else if (hostname.indexOf('4wickets.com') > -1) {
  environment.siteName = 'wicket4';
  environment.isFirstTimePassword = false;
}
else if (hostname.indexOf('9betexch.com') > -1) {
  environment.siteName = 'betexch9';
  environment.origin = '9betexch.com';
  environment.internationalCasino = true;
  environment.isPremiumSite = true;
  environment.transferdelay = true;
  environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.socialmediasection = false;
  environment.isSupernova = true;
  environment.captcha = false;
  environment.isAWCcasino=true;

}
else if (hostname.indexOf('skybet365.in') > -1) {
  environment.siteName = 'skybet365';
  environment.settlemettab = true;
}
else if (hostname.indexOf('line1000.com') > -1) {
  environment.siteName = 'line1000';
  environment.settlemettab = true;
} else if (hostname.indexOf('sports365.pro') > -1) {
  environment.siteName = 'sports365';
  environment.origin = 'sports365.pro';
  environment.internationalCasino = true;
  environment.isSupernova= true;
  environment.isAWCcasino=true;
  // environment.isPremiumSite = true;
  // environment.oldAdmin = true;
  environment.transferdelay = true;
  // environment.isSupernova = true;
  // environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;
  environment.isFirstTimePassword = false;


} else if (hostname.indexOf('betbuzz365.site') > -1) {
  environment.siteName = 'betbuzz365';
  environment.origin = 'betbuzz365.site';

} else if (hostname.indexOf('skyexchange8.com') > -1) {
  environment.siteName = 'skyexchange8';
}
else if (hostname.indexOf('skyexch.live') > -1) {
  environment.siteName = 'skyexchh';
  environment.origin = 'skyexch.live';
  environment.captcha = false;
}
else if (hostname.indexOf('worldexch.live') > -1) {
  environment.siteName = 'worldexch';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;

} else if (hostname.indexOf('worldexch.net') > -1) {
  environment.siteName = 'worldexch';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
}
else if (hostname.indexOf('jeesky7.com') > -1) {
  environment.siteName = 'jeesky7';
  environment.origin = 'jeesky7.com';
  environment.captcha = false;
  environment.settlemettab = true;

}
else if (hostname.indexOf('jee365.com') > -1) {
  environment.siteName = 'jee365';
  environment.origin = 'jee365.com';
  environment.settlemettab = true;
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;

} else if (hostname.indexOf('rajbet.win') > -1) {
  environment.siteName = 'rajbet';
  environment.origin = 'rajbet.win';
  environment.internationalCasino = true;
  environment.isSupernova= true;
  environment.transferdelay = true;
  environment.isFirstTimePassword = false;
  environment.isAWCcasino=true;
  // environment.isPremiumSite = true;
  // environment.oldAdmin = true;
  // environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;
  environment.whatsapp = '+447417483162';


  environment.domainMap = [
    { id: 1, name: 'runx.bet' },
    { id: 2, name: 'vellki.pro' },
    { id: 3, name: 'sports365.pro' },
    { id: 4, name: 'baajighor365.live' },
  ]
}
else if (hostname.indexOf('nayaludis.site') > -1) {
  environment.siteName = 'nayaludis';
  environment.origin = 'nayaludis.site';
  environment.transferdelay = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isSlot = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('baaji365vip.live') > -1) {
  environment.siteName = 'baji365';
  environment.origin = 'baaji365vip.live';
  environment.internationalCasino = true;
  environment.captcha = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isFirstTimePassword = false;
  environment.oldAdmin = true;
  // environment.whatsapp = '+447438365133';
  environment.isSharing = true;
  environment.isBdlevel = true;
  environment.isPremiumSite = true;
}
else if (hostname.indexOf('bet-365.bet') > -1) {
  environment.siteName = 'bet365';
  environment.origin = 'bet-365.bet';
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isPoker = true;
  environment.isFirstTimePassword = false;
  environment.oldAdmin = true;
  environment.isSharing = true;
  environment.isBdlevel = true;
  environment.isPremiumSite = true;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('baaji365.site') > -1) {
  environment.siteName = 'baaji365';
  environment.origin = 'baaji365.site';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.domainMap = [
    { id: 1, name: 'velkii365.com' },
  ]
  // environment.whatsapp = '+447444365816';
}
else if (hostname.indexOf('baaji365.bet') > -1) {
  environment.siteName = 'baaji365bet';
  environment.isBajilogin = true;
  environment.origin = 'baaji365.bet';
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isSkyFancy = true;
}
else if (hostname.indexOf('bajix365.vip') > -1) {
  environment.siteName = 'bajix365';
  environment.isBajilogin = true;
  environment.origin = 'bajix365.vip';
  environment.oldAdmin = true;
  environment.isBdlevel = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isSkyFancy = true;
}
else if (hostname.indexOf('star365.live') > -1) {
  environment.siteName = 'star365';
  environment.origin = 'star365.live';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  // environment.whatsapp = '+447444365816';
}
else if (hostname.indexOf('velkii365.com') > -1) {
  environment.siteName = 'velkii365';
  environment.origin = 'velkii365.com';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isFirstTimePassword = false;
  // environment.whatsapp = '+447444365816';
}
else if (hostname.indexOf('vellkii.live') > -1) {
  environment.siteName = 'vellkii';
  environment.origin = 'vellkii.live';
  environment.oldAdmin = true;
  environment.isBajilogin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isBdlevel = true;
  environment.isFirstTimePassword = false;
}
else if (hostname.indexOf('velkii.co') > -1) {
  environment.siteName = 'velkii';
  environment.origin = 'velkii.co';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.domainMap = [
    { id: 1, name: 'velkibuzz.bet' },
    { id: 2, name: 'runexch365.io' },
    { id: 3, name: 'baaji365.bet' },
    { id: 4, name: 'baajii365.live' },
  ]

  // environment.whatsapp = '+447444365816';
}
else if (hostname.indexOf('runexch365.io') > -1) {
  environment.siteName = 'runexch365';
  environment.origin = 'runexch365.io';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isBdlevel = true;
}
else if (hostname.indexOf('velkibuzz.bet') > -1) {
  environment.siteName = 'velkibuzz';
  environment.origin = 'velkibuzz.bet';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  // environment.isbetgame = true;
  environment.isBdlevel = true;
  environment.captcha = false;

}
else if (hostname.indexOf('velkiex.live') > -1) {
  environment.siteName = 'velkiex';
  environment.origin = 'velkiex.live';
  environment.whatsapp = '+17064890549';
  environment.socialmediasection = false;
  environment.transferdelay = true;
  environment.internationalCasino = true;
  environment.isSlot = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('maza247.bet') > -1) {
  environment.siteName = 'maza247';
  environment.origin = 'maza247.bet';
  environment.transferdelay = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.captcha = false;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('bdbuzz365.bet') > -1) {
  environment.siteName = 'bdbuzz365';
  environment.origin = 'bdbuzz365.bet';
  environment.oldAdmin = true;
  environment.captcha = false;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
}
else if (hostname.indexOf('baaji24.live') > -1) {
  environment.siteName = 'baaji24';
  environment.origin = 'baaji24.live';
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isPoker = true;
  environment.isBajilogin = true
  environment.isBdlevel = true;
  environment.isFirstTimePassword = false;
  environment.captcha = false;
 environment.whatsapp = '+12184610167';

}
else if (hostname.indexOf('runx.bet') > -1) {
  environment.siteName = 'runx';
  environment.origin = 'runx.bet';
  environment.internationalCasino = true;
  environment.isSupernova= true;
  // environment.isPremiumSite = true;
  // environment.oldAdmin = true;
  environment.isFirstTimePassword = false;
  environment.transferdelay = true;
  environment.whatsapp = '+447949358122';
  environment.isAWCcasino=true;
  // environment.isSupernova = true;
  // environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;
}
else if (hostname.indexOf('fiarsky.com') > -1) {
  environment.siteName = 'luck247';
  environment.origin = 'fiarsky.com';
  environment.internationalCasino = true;
  environment.isSupernova= true;
  environment.isAWCcasino=true;
  environment.isBdlevel = true;
  environment.isFirstTimePassword = false;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isBdlevel = true;
}
else if (hostname.indexOf('betx365.asia') > -1) {
  environment.siteName = 'betx365';
  environment.origin = 'betx365.asia';
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSharing = true;
  environment.captcha = false;
  environment.isSkyFancy = true;
  environment.isAWCcasino=true;
}

else if (hostname.indexOf('neyaludis.live') > -1) {
  environment.siteName = 'wckt9';
  environment.origin = 'neyaludis.live';
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSharing = true;
  environment.isSkyFancy = true;
  environment.captcha = false;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('baajighor365.live') > -1) {
  environment.siteName = 'baajighor365';
  environment.origin = 'baajighor365.live';
  environment.internationalCasino = true;
  environment.transferdelay = true;
  environment.isSupernova= true;
  environment.isSharing = true;
  environment.socialmediasection = false;
  environment.isFirstTimePassword = false;
  environment.isAWCcasino=true;


}
else if (hostname.indexOf('palki.live') > -1) {
  environment.siteName = 'palki';
  environment.origin = 'palki.live';
  environment.captcha = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova = true;
  environment.isbetgame = true;
  environment.isSlot = true;
  environment.isAWCcasino=true;
  environment.isPoker = true;
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
  environment.domainMap = [
    { id: 0, name: 'lcbuzz.live' },
  ]
}
else if (hostname.indexOf('lcbuzz.live') > -1) {
  environment.siteName = 'lcbuzz';
  environment.origin = 'lcbuzz.live';
  environment.captcha = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  // environment.isSupernova = true;
  // environment.isbetgame = true;
  // environment.isSlot = true;
  // environment.isPoker = true;
  environment.oldAdmin = true;
  environment.isAWCcasino=true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('mathaexchall.com') > -1) {
  environment.siteName = 'mathaexchall';
  environment.captcha = false;
  environment.origin = 'mathaexchall.com';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.isRental = true;
}
else if (hostname.indexOf('mash247.live') > -1) {
  environment.siteName = 'mash247';
  environment.origin = 'mash247.live';
  environment.oldAdmin = true;
  environment.settlemettab = true;
  environment.transferdelay = true;
}
else if (hostname.indexOf('vellki.pro') > -1) {
  environment.siteName = 'vellki';
  environment.origin = 'vellki.pro';
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isSupernova= true;
  // environment.isPremiumSite = true;
  // environment.oldAdmin = true;
  environment.transferdelay = true;
  environment.isAWCcasino=true;
  environment.whatsapp = '+447404916224';
  // environment.isSupernova = true;
  // environment.isBdlevel = true;
  environment.isSharing = true;
  environment.captcha = false;
}


else if (hostname.indexOf('3wickets.bet') > -1) {
  environment.siteName = 'wickets3';
  environment.origin = '3wickets.bet';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
  environment.isAWCcasino=true;
  environment.domainMap = [
    { id: 1, name: 'velki123.com' },
    { id: 2, name: 'cricbuzz365.live' },
    { id: 3, name: 'winbuzz.asia' },
    { id: 4, name: 'betx365.asia' },
  ]
}
else if (hostname.indexOf('velki123.com') > -1) {
  environment.siteName = 'velki123';
  environment.origin = 'velki123.com';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
}
else if (hostname.indexOf('velkei.live') > -1) {
  environment.siteName = 'velkei';
  environment.origin = 'velkei.live';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
  environment.isBajilogin = true
}
else if (hostname.indexOf('velkiex123.bet') > -1) {
  environment.siteName = 'velkiex123';
  environment.origin = 'velkiex123.bet';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSupernova= true;
  environment.isSkyFancy = true;
  environment.domainMap = [
    { id: 1, name: 'playbet365.live' },
    { id: 2, name: 'velkei.live' },
    { id: 3, name: 'bajix365.vip' },
    
  ]
}
else if (hostname.indexOf('winbuzz.asia') > -1) {
  environment.siteName = 'winBuzz';
  environment.origin = 'winbuzz.asia';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
  environment.whatsapp = '+17163203649';
  environment.isAWCcasino=true;

}
else if (hostname.indexOf('playbet365.live') > -1) {
  environment.siteName = 'playbet365';
  environment.origin = 'playbet365.live';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('cricbuzz365.live') > -1) {
  environment.siteName = 'cricBuzz365';
  environment.origin = 'cricbuzz365.live';
  environment.oldAdmin = true;
  environment.isPremiumSite = true;
  environment.socialmediasection = false;
  environment.internationalCasino = true;
  environment.isFirstTimePassword = false;
  environment.isBdlevel = true;
  environment.islanguage = true;
  environment.isSkyFancy = true;
  environment.isAWCcasino=true;
}
else if (hostname.indexOf('skyfiar.com') > -1) {
  environment.siteName = 'skyexchM';
  environment.origin = 'skyfiar.com';
  environment.isFirstTimePassword = false;
}
else if (hostname.indexOf('cricbuzzer.com') > -1) {
  environment.siteName = 'skyexchM';
  environment.origin = 'cricbuzzer.com';
  environment.isFirstTimePassword = false;
}

console.log(environment.siteName);

