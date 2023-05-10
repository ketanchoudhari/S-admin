import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fancyrate',
  templateUrl: './fancyrate.component.html',
  styleUrls: ['./fancyrate.component.scss']
})
export class FancyrateComponent implements OnInit {

  fancyRateList = [
    { name: 'Q',value1: 0, value2: 0 },
    { name: 'W',value1: 0, value2: 0 },
    { name: 'E',value1: 0, value2: 0 },
    { name: 'R',value1: 0, value2: 0 },
    { name: 'T',value1: 0, value2: 0 },
    { name: 'Y',value1: 0, value2: 0 },
    { name: 'U',value1: 0, value2: 0 },
    { name: 'I',value1: 0, value2: 0 },
    { name: 'O',value1: 0, value2: 0 },
    { name: 'P',value1: 0, value2: 0 },

    { name: 'A',value1: 0, value2: 0 },
    { name: 'S',value1: 0, value2: 0 },
    { name: 'D',value1: 0, value2: 0 },
    { name: 'F',value1: 0, value2: 0 },
    { name: 'G',value1: 0, value2: 0 },
    { name: 'K',value1: 0, value2: 0 },
    { name: 'H',value1: 0, inc: true },
    { name: 'J',value1: 0, inc: true },
    { name: 'L',value1: 0 },
    { blank: true },

    { name: 'Z',value1: 0, value2: 0 },
    { name: 'X',value1: 0, value2: 0 },
    { name: 'C',value1: 0, value2: 0 },
    { name: 'V',value1: 0, value2: 0 },
    { name: 'B',value1: 0, value2: 0 },
    { name: 'N',value1: 0, value2: 0 },
    { name: 'M',value1: 0, value2: 0 },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
