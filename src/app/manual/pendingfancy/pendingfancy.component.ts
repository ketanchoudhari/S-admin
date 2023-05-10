import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessagesService } from 'src/app/messages/messages.service';
import { CommonService } from 'src/app/services/common.service';
import { LoadingService } from 'src/app/services/loading.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ManualserviceService } from '../manualservice.service';

@Component({
  selector: 'app-pendingfancy',
  templateUrl: './pendingfancy.component.html',
  styleUrls: ['./pendingfancy.component.scss']
})
export class PendingfancyComponent implements OnInit {
  isAddNewModalOpen = false;
  fancies:any=[];
  isAllSelected = false;
  newFancy = {
    eventId: '',
    marketName: '',
    sid: ''
  };

  constructor(private manualservice:ManualserviceService,private messagesService: MessagesService,
    private commonService: CommonService,private toastr: ToastrService,private loadingService: LoadingService,) { 
  }

  ngOnInit(): void {
    this.commonService.apis$.subscribe((res) => {
      this.messagesService
        .listGames()
        .subscribe((res: GenericResponse<any[]>) => {
          this.getPendingfancy();
        });
    });
  }
  openAddNewModal(): void {
    this.isAddNewModalOpen = true;
    this.newFancy = {
      eventId: '',
      marketName: '',
      sid: ''
    };
  }
  getPendingfancy(){
    this.loadingService.setLoading(true);
    this.manualservice.pendingFancy().subscribe((resp: GenericResponse<any[]>)=>{
      this.fancies = resp.result;
      this.loadingService.setLoading(false);
    })
  }
  updateFancyStatus(gameid){
    this.manualservice.updateFancyStatus(gameid).subscribe((resp: GenericResponse<any[]>)=>{
      if (resp && resp.errorCode === 0) {
        this.getPendingfancy();
        this.toastr.success('Updated');
      } else {
        this.toastr.error(resp.errorDescription);
      }
      
    })
  }

  AddFancy(){
    this.manualservice.addFancyMarket(this.newFancy).subscribe((resp: GenericResponse<any[]>)=>{
      if (resp && resp.errorCode === 0) {
        this.toastr.success('Updated New Fancy');
      } else {
        this.toastr.error(resp.errorDescription);
      }
    })
  }

}
