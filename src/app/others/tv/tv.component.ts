import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { EventsService } from '../../events/events.service';
import { IEvent } from '../../events/types/event';
import { GenericResponse } from '../../shared/types/generic-response';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss'],
})
export class TvComponent implements OnInit {
  isTvModalOpen: boolean = false;

  eventsLists: IEvent[];
  eventsListsHolder: IEvent[];

  constructor(
    private eventsService: EventsService,
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit(): void {
    this.getGameList();
  }

  getGameList() {
    this.loadingService.setLoading(true);
    this.eventsService
      .listGame()
      .subscribe((res: GenericResponse<IEvent[]>) => {
        if (res && res.errorCode === 0) {

          this.eventsListsHolder = res.result;
          this.eventsListsHolder = this.eventsListsHolder.filter(
            (event) => event.tv === 1
          );
          this.eventsLists = this.eventsListsHolder;
        }
        this.loadingService.setLoading(false);
      });
  }

  openTvWindow(eventId: number) {
    // console.log(tvPid);
    window.open(
      `${window.location.origin}${window.location.pathname}/#/x/tv?eventId=${eventId}`,
      `_blank`,
      `width=500,height=300`
    );
  }
}
