import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { ISharing } from 'src/app/shared/types/sharing';
import { User } from 'src/app/users/models/user.model';
import { PasswordStrengthValidator } from 'src/app/users/users-list/sub/password-strength.validator';
import { UsersService } from 'src/app/users/users.service';
import { MyAccountService } from '../my-account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  changePassModalOpen: boolean = false;
  changePassForm: FormGroup;
  currentUser?: CurrentUser;
  currentUserProfile?: User;
  isClient: boolean;
  showPassword: boolean = false;

  sharingMap: ISharing;
  Update: any;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private myAccountService: MyAccountService,
    private toastr: ToastrService,
    private router: Router,
    private usersService: UsersService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ) {}

  ngOnInit(): void {
    this.getlanguages();
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
      { validators: ProfileComponent.confirm }
    );

    this.auth.currentUser$.subscribe((currentUser) => {
      if (!!currentUser) {
        this.currentUser = currentUser;
        this.changePassForm.get('userId').setValue(currentUser.userId);
        this.commonService.apis$.subscribe((res) => {
          this.usersService
            .getUser(currentUser.userId)
            .subscribe((res: GenericResponse<User[]>) => {
              if (res.errorCode === 0) {
                this.currentUserProfile = res.result[0];
              }
            });
        });
      }
    });

    this.commonService.hierarchyMap$.subscribe((list) => {
      if (!!list && list.get(this.currentUser.userType)) {
        this.isClient = list.get(this.currentUser.userType).name === 'client';
      }
    });

    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
    });
  //  console.log(this.sharingMap, 'share');
  }
  getlanguages() {
    this.shareService._lagugageSub$.subscribe(data => {
      if(data != null){
        this.Update = data;
        console.log(this.Update);
}

    })
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
      this.myAccountService
        .changePassword(result)
        .subscribe((res: GenericResponse<any>) => {
        //  console.log(res);
          if (res.errorCode === 0) {
            this.toastr.success('Password changed successfully');
            this.changePassModalOpen = false;
            this.f.controls.newpassword.reset();
            this.f.controls.password.reset();
            this.f.controls.confirm.reset();
            this.router.navigateByUrl('/login');
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

  openChangePassModal() {
    this.changePassModalOpen = true;
  }
}
