import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tv-win',
  templateUrl: './tv-win.component.html',
  styleUrls: ['./tv-win.component.scss'],
})
export class TvWinComponent implements OnInit {
  tvUrl: SafeResourceUrl;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
    //  console.log(params.eventId);
      this.tvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.tvUrl}?eventId=${params.eventId}`)
    });
  }
}
