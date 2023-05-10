import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { MessagesService } from '../messages.service';
import { MessagesRules, CreateRulesResponse } from '../models/rules.model';
import { LoadingService } from '../../services/loading.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent {
  rules = undefined;
  currentIPAddress: string;
  loading = true;
  Editor = ClassicEditor;
  messageRules = '';
  isNewRulesVisible = false;

  constructor(
    private messagesService: MessagesService,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {
    commonService.apis$.subscribe((res) => {
      this.listRules();
    });
  }

  listRules(): void {
    this.loadingService.setLoading(true);
    this.messagesService
      .listRules()
      .subscribe((res: GenericResponse<MessagesRules[]>) => {
        if (res.errorCode !== 1) {
          if (res.result.length === 0) {
            this.isNewRulesVisible = false;
          } else {
            this.isNewRulesVisible = false;
            this.rules = atob(res.result[0].rules);
          }
          this.loading = false;
          this.loadingService.setLoading(false);
        } else {
          this.isNewRulesVisible = true;
          this.loading = false;
          this.loadingService.setLoading(false);
        }
      });
  }

  addRules(): void {
    const rules: MessagesRules = {
      rules: btoa(this.messageRules),
    };
    this.messagesService
      .changeRules(rules)
      .subscribe((res: GenericResponse<CreateRulesResponse>) => {
        if (res.errorCode === 0) {
          this.rules = this.messageRules;
          this.isNewRulesVisible = false;
        } else {
          alert(res.errorDescription);
        }
      });
  }
}
