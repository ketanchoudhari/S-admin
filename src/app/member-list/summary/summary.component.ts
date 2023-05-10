import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShareUserService } from 'src/app/services/share-user.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ISharing } from 'src/app/shared/types/sharing';
import { User } from 'src/app/users/models/user.model';
import { UsersService } from 'src/app/users/users.service';
import { PasswordStrengthValidator } from 'src/app/users/users-list/sub/password-strength.validator';
import { environment } from 'src/environments/environment';
import { ShareDataService } from 'src/app/services/share-data.service';
import { Hierarchy } from 'src/app/shared/types/hierarchy';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  selectedUid: any;
  user?: User;
  currentUser: CurrentUser;
  hierarchyList = Array<Hierarchy>();
  changePassForm: FormGroup;
  changeShareForm: FormGroup;
  changeExposureLimitForm: FormGroup;

  changePassModalOpen: boolean = false;
  changeExposureLimitOpen: boolean = false;
  changeCommisionOpen: boolean = false;
  shareType: string;
  isClient: boolean = true;
  isWhitelabel: boolean = false;

  sharingMap: ISharing;
  userPassword: any;
  isShowPassword: boolean = false;
  isPremiumSite = environment.isPremiumSite;
  isRental = environment.isRental;
  isBdlevel = environment.isBdlevel;
  Update: any;
  accountParents:any=[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private shareUserService: ShareUserService,
    private toastr: ToastrService,
    private usersService: UsersService,
    private authService: AuthService,
    public commonService: CommonService,
    private shareService: ShareDataService
  ) {}

  ngOnInit(): void {
    this.getlanguages()
    this.currentUser = this.authService.currentUser;
    this.commonService.hierarchyList$.subscribe((list) => {
      this.hierarchyList = list;
    });
    this.commonService.apis$.subscribe((res) => {
      this.selectedUid = this.route.parent.snapshot.params.selectedUid;
      this.commonService.hierarchyMap$.subscribe(() => {
        if (this.currentUser.userType === this.commonService.vrnlUserType || this.currentUser.userType === this.commonService.whitelabelUserType) {
          this.accountDetails(this.selectedUid);
        }
      })
    })
    
    this.changePassForm = this.formBuilder.group(
      {
        userId: [, Validators.required],
        newpassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator,
          ]),
        ],
        confirm: [null, Validators.required],
        password: [, Validators.required],
      },
      { validators: SummaryComponent.confirm }
    );
    this.changeShareForm = this.formBuilder.group({
      userId: [, Validators.required],
      sharePercent: [],
      cricketSharing: [],
      cricketFancySharing: [],
      soccerSharing: [],
      soccerGoalsSharing: [],
      tennisSharing: [],
      indianCasinoSharing: [],
    });

    this.changeExposureLimitForm = this.formBuilder.group({
      userId: [, Validators.required],
      exposureLimit: [, Validators.required],
      password: [, Validators.required],
    });
    this.shareUserService.user$.subscribe((user) => {
      if (!!user) {
        this.user = user;
        this.changePassForm.get('userId').setValue(user.userId);
        this.changeExposureLimitForm.get('userId').setValue(user.userId);
        this.commonService.hierarchyMap$.subscribe((list) => {
          this.isClient = list.get(user.userType).name === 'client';
          this.isWhitelabel = list.get(user.userType).name === 'whitelabel';
        });
      }
    });

    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
    });
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
  }

  getUser() {
    this.usersService
      .getUser(this.user.userId)
      .subscribe((res: GenericResponse<User[]>) => {
        this.shareUserService.setUser(res.result[0]);
      });
  }

  accountDetails(userId) {
    this.usersService
      .accountDetails(userId)
      .subscribe((res: GenericResponse<User[]>) => {
        //console.log(res);
        this.accountParents=res.result;
      });
  }

  getHierachylevel(userType){
    let usersLevel = this.hierarchyList.filter(userLevel => userLevel.id == userType);
    return usersLevel[0]
  }

  get c() {
    return this.changePassForm.get('confirm');
  }

  static confirm(formGroup: FormGroup) {
    const newpassword = formGroup.get('newpassword');
    const confirm = formGroup.get('confirm');

    return confirm.dirty
      ? !!newpassword.value && newpassword.value !== confirm.value
        ? { isNotMatching: true }
        : null
      : null;
  }

  get f() {
    return this.changePassForm;
  }

  changePass() {
    if (this.changePassForm.valid) {
      const { confirm, ...result } = this.changePassForm.value;
      this.usersService
        .changePassword(result)
        .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
          if (res?.errorCode === 0) {
            this.toastr.success('Password changed successfully');
            this.changePassModalOpen = false;
            this.f.controls.newpassword.reset();
            this.f.controls.password.reset();
            this.f.controls.confirm.reset();
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      if (this.f.errors && this.f.errors.isNotMatching) {
        this.toastr.error("Passwords don't match");
        return;
      }
      this.toastr.error('Invalid Input');
    }
  }

  changeExposureLimit() {
    if (this.changeExposureLimitForm.valid) {
      this.usersService
        .changePassword(this.changeExposureLimitForm.value)
        .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Exposure Limit Changed');
            this.changeExposureLimitOpen = false;
            this.changeExposureLimitForm.reset();
            this.getUser();
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.toastr.error('Invalid Input');
    }
  }

  openChangePassModal() {
    this.changePassModalOpen = true;
  }

  openExposureLimitModal() {
    this.changeExposureLimitOpen = true;
  }

  openChangeSharingModal(shareType: string) {
    this.shareType = shareType;
    this.changeCommisionOpen = true;
  }

  showPassword() {
    this.isShowPassword = true;
    this.usersService
      .showPassword(this.user.userId)
      .subscribe((res: GenericResponse<any>) => {
      //  console.log(res);
        if (res?.errorCode == 0) {
          this.userPassword = JSON.parse(res.result[0]);
        } else {
          this.userPassword = null;
        }
      });
  }
}
