import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { MessagesService } from '../messages.service';
import {
  CreateCommentaryResponse,
  MessagesCommentary,
} from '../models/commentary.model';

@Component({
  selector: 'app-commentary',
  templateUrl: './commentary.component.html',
  styleUrls: ['./commentary.component.scss'],
})
export class CommentaryComponent implements OnInit {
  isAddNewModalOpen = false;
  isEditModalOpen = false;
  newCommentary: MessagesCommentary = {
    commentary: undefined,
    sportName: 'cricket',
    description: undefined,
    active: false,
  };
  editCommentary: MessagesCommentary = {
    commentary: undefined,
    sportName: 'cricket',
    description: undefined,
    active: false,
  };
  commentaries = [];
  selectedItems: boolean[] = [];
  events = [];
  isAllSelected = false;

  constructor(
    private messagesService: MessagesService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.messagesService
        .listGames()
        .subscribe((res: GenericResponse<any[]>) => {
          // this.events = [{
          //   eventId: 123,
          // }, {
          //   eventId: 124,
          // }, {
          //   eventId: 125,
          // }, {
          //   eventId: 126,
          // }];
          if (res.errorCode === 0) {
            this.events = res.result;
          }
          this.listCommentaries();
        });
    });
  }

  onSelectAll(event): void {
    this.selectedItems = [];
    if (event.target.checked) {
      this.isAllSelected = true;
      for (let {} of this.commentaries) {
        this.selectedItems.push(true);
      }
    } else {
      this.isAllSelected = false;
    }
  }

  toggleItemSelect(id: number): void {
    this.selectedItems[id] = !this.selectedItems[id];
  }

  openAddNewModal(): void {
    this.isAddNewModalOpen = true;
    this.newCommentary = {
      commentary: undefined,
      sportName: 'cricket',
      description: undefined,
      active: false,
    };
  }

  openEditModal(index: number): void {
    this.editCommentary = Object.assign({}, this.commentaries[index]);
    this.editCommentary.id = index;
    this.isEditModalOpen = true;
  }

  createNewComment(): void {
    const commentary: MessagesCommentary = {
      commentary: this.newCommentary.commentary,
      description: btoa(this.newCommentary.description),
      sportName: this.newCommentary.sportName,
      active: this.newCommentary.active,
    };
    this.messagesService
      .createCommentary(commentary)
      .subscribe((res: GenericResponse<CreateCommentaryResponse>) => {
        if (res.errorCode === 0) {
          this.isAddNewModalOpen = false;
          this.listCommentaries();
        } else {
          alert(res.errorDescription);
        }
      });
  }

  findEventNameFromID(id: string): string {
    const index = this.events.findIndex(
      (event) => event.eventId.toString() === id
    );
    return this.events[index].eventName;
  }

  listCommentaries(): void {
    const eventIds = this.events.map((event) => event.eventId).join(',');
    this.messagesService
      .listComments(eventIds)
      .subscribe((res: GenericResponse<MessagesCommentary[]>) => {
        if (res.errorCode === 0) {
          this.commentaries = res.result.map((comment) => ({
            ...comment,
            description: atob(comment.description),
            eventName: this.findEventNameFromID(comment.commentary),
          }));
          this.selectedItems = new Array(this.commentaries.length).fill(false);
          this.isAllSelected = false;
        }
      });
  }

  updateCommentary(): void {
    this.isEditModalOpen = false;
    const data = {
      commentary: this.editCommentary.commentary,
      description: btoa(this.editCommentary.description),
      sportName: this.editCommentary.sportName,
      active: this.editCommentary.active,
    };
    this.messagesService
      .createCommentary(data)
      .subscribe((res: GenericResponse<CreateCommentaryResponse>) => {
        if (res.errorCode === 0) {
          this.isEditModalOpen = false;
          this.listCommentaries();
        } else {
          alert(res.errorDescription);
        }
      });
  }

  async deleteSelectedComments(): Promise<void> {
    const commentaries = this.commentaries.slice();
    const selectedItems = this.selectedItems.slice();
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      if (item) {
        await this.messagesService
          .deleteCommentary(commentaries[i].commentary)
          .subscribe();
      }
    }
    setTimeout(() => this.listCommentaries(), 1000);
  }
}
