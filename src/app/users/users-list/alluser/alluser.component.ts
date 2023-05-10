import { GenericResponse } from 'src/app/shared/types/generic-response';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { UsersService } from '../../users.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EventsService } from 'src/app/events/events.service';
import { finalize } from 'rxjs/operators';
import { IEvent } from 'src/app/events/types/event';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { fullHierarchy, IUserList } from '../../models/user-list';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-alluser',
  templateUrl: './alluser.component.html',
  styleUrls: ['./alluser.component.scss']
})
export class AlluserComponent implements OnInit {
  isPremiumSite = environment.isPremiumSite;
  isRental = environment.isRental;
  isBdlevel = environment.isBdlevel;
  fullHirarchySub:Subscription;
  currentUser: CurrentUser;
  changeStatusOpen: boolean = false;
  statusUser?: User;
  selectedStatus: 0 | 1 | 2;
  statusForm: FormGroup;
  userStatusresult:any;
  statusMap = {
    0: 'Active',
    1: (this.isPremiumSite)?'Locked':'Suspend',
    2: (this.isPremiumSite)?'Suspended':'Locked',
  };
  userType:any;
  showActivateFancy: boolean;
  showActions: boolean;
  searchTerm:String="";
  selectedTabIndex:number=0;
  totalUser:number=0;
  totalAdmin:number=0;
  totalPlayer:number=0;
  totalOnlineUser:number=0;
  totalOnlineUserTemp:number=0;
  usersList:any=[];
  usersListfilter: any[];
  usersListHolder:any =[];
  adminList=[];
  playerList=[];
  isActiveGamesInTransit: boolean;
  activeGamesHolder: IEvent[] = [];
  cricketList=[];
  soccerList=[];
  tennisList=[];
  cricketMatchOdds=[];
  cricketTiedMatch=[];
  cricketToWinTheToss=[];
  soccerMatchOdds=[];
  soccerzero=[];
  soccerone=[];
  soccertwo=[];
  soccerthree=[];
  tennisMatchOdds=[];
  userMultiplier=0;
  lastuser: any;
  userid: any;
  usermainid: any;
  userlist=[]
  usermainid1: any;
  mainuserdata: any;
  constructor(
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private commonService: CommonService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private formBuilder: FormBuilder,
  ) {
    this.lastuser=localStorage.getItem('lastuser');
    
  }


  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.userMultiplier = environment.userMultiplier;
    this.commonService.apis$.subscribe((res) => {
      this.getActivateGame();
      this.listUser();
    });
    this.statusForm = this.formBuilder.group({
      password: [, Validators.required],
    });
    this.currentUser = this.authService.currentUser;
    this.userType = this.currentUser.userType;
    this.commonService.hierarchyMap$.subscribe(() => {
      if (this.currentUser.userType === this.commonService.vrnlUserType) {
        this.showActivateFancy = true;
      } else {
        this.showActivateFancy = false;
      }
      if (this.currentUser.userType === this.commonService.vrnlUserType || this.currentUser.userType === this.commonService.whitelabelUserType) {
        this.showActions = true;
      }
    });
  }
  getActivateGame() {
    this.cricketList=[];
    this.soccerList=[];
    this.tennisList=[];
    this.cricketMatchOdds=[];
    this.cricketTiedMatch=[];
    this.cricketToWinTheToss=[];
    this.soccerMatchOdds=[];
    this.soccerzero=[];
    this.soccerone=[];
    this.soccertwo=[];
    this.soccerthree=[];
    this.tennisMatchOdds=[];
    if (!this.isActiveGamesInTransit) {
      this.isActiveGamesInTransit = true;
      let activeGameSub = this.eventsService.activateListGame().pipe(finalize(() => (this.isActiveGamesInTransit = false)))
        .subscribe((res: any) => {
          if (res && res.errorCode === 0 && res.result.length) {
            this.activeGamesHolder = res.result;
            if(this.userType===1 || this.userType===2 || this.userType===3){
              this.totalOnlineUser =  +((this.activeGamesHolder[0].usersLogged + (this.activeGamesHolder[0].usersLogged*this.userMultiplier)).toFixed(0));
            }
            else{
              this.totalOnlineUser = this.activeGamesHolder[0].usersLogged;
            }
            this.loadingService.setLoading(false);
          }
        });
    }
  }

  filterByTerm(term?: string) {
    if (term && term != '') {
      this.usersList = this.usersListHolder.filter((user) => {
        return user.u.toLowerCase().includes(term.toLowerCase());
      });
    }else{
      this.usersList = [];
    }
  }

  onRefresh(){
      this.loadingService.setLoading(true);
      this.getActivateGame();
  }

 
  listUser(){
    this.adminList=[];
    this.playerList=[];
    this.fullHirarchySub = this.commonService._allUsersSub$.subscribe((res)=>{
      // console.log(res);
      if (res) {
        this.usersListHolder = res;
        this.usersList = [];
        this.usersListHolder.forEach(users => {
          if(users.t!=8){
            this.adminList.push(users)
          }
          if(users.t==8){
            this.playerList.push(users)
          }
        });
        this.totalAdmin =  this.adminList?.length;
        if(this.userType===1 || this.userType===2 || this.userType===3){
          this.totalPlayer =  +((this.playerList?.length + (this.playerList?.length*this.userMultiplier)).toFixed(0));
        }
        else{
          this.totalPlayer = this.playerList?.length;
          this.totalUser = this.usersListHolder?.length;
        }
        this.loadingService.setLoading(false);
      }
    })
  }
  
  
  async openChangeStatusModal(user) {
    this.getUser(user.d);
  }
  getUser(userId) {
    this.usersService
      .getUser(userId)
      .subscribe((res: GenericResponse<User[]>) => {
        this.statusUser = res.result[0];
        this.changeStatusOpen = true;
      });
  }
  selectStatus(event: Event, status: 0 | 1 | 2) {
    if (this.statusUser.userStatus !== status) {
      (<HTMLButtonElement>event.target).classList.add('open');
      this.selectedStatus = status;
    }
  }
  changeStatus() {
    if (this.statusForm.valid && this.selectedStatus !== null) {
      let changeStatus = this.statusForm.value;
      changeStatus.userStatus = this.selectedStatus;
      this.usersService
        .updateStatus(this.statusUser.userId, changeStatus)
        .subscribe((res: GenericResponse<any>) => {
          //  console.log(res);
          if (res && res.errorCode === 0) {
            this.changeStatusOpen = false;
            if(this.isPremiumSite){
              this.userStatusresult = res;
              setTimeout(() => {
                this.userStatusresult = undefined;
              }, 3000)
            }else{
              this.toastr.success('Changed status successfully');
            }
            this.selectedStatus = null;
            this.statusForm.reset();
          } else {
            if(this.isPremiumSite){
              this.userStatusresult = res;
              setTimeout(() => {
                this.userStatusresult = undefined;
              }, 3000)
            }else{
              this.toastr.error(res.errorDescription);
            }
          }
        });
    } else {
      //  console.log(this.statusForm);

      if(this.isPremiumSite){
        this.userStatusresult = {errorDescription:"Invalid Input",errorCode : 1};
        setTimeout(() => {
          this.userStatusresult = undefined;
        }, 3000)
      }else{
        this.toastr.error('Invalid Input');
      }
    }
  }
  resetStatusModal() {
    this.selectedStatus = null;
    this.statusForm.reset();
  }

  ngOnDestroy() {
    if(this.fullHirarchySub){
      this.fullHirarchySub.unsubscribe();
    }
  }

}
