import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MyAccountService } from '../my-account/my-account.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { CurrentUser } from '../shared/models/current-user';
import { GenericResponse } from '../shared/types/generic-response';
import { PasswordMatchingValidatior } from '../users/users-list/sub/password-matching.validatior';
import { StrongPasswordValidator } from '../users/users-list/sub/password-strength.validator';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  loading = false;
  loader = environment.loader;
  isheaderShow: boolean = true;
  newuser: any;
  changepassmodal: boolean = false;
  changePassForm: FormGroup;
  currentUser?: CurrentUser;
  siteName = environment.siteName;
  isFirstTimePassword = environment.isFirstTimePassword;
  isPremiumSite=environment.isPremiumSite;
  constructor(private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private myAccountService: MyAccountService,
    public router: Router) { }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((currentUser) => {
      if (!!currentUser) {
        this.currentUser = currentUser;
        // console.log(this.currentUser);
        // console.log(this.currentUser.newUser);
        // console.log(this.isFirstTimePassword);
        
        if (this.currentUser.newUser == 1 && this.isFirstTimePassword) {
          this.changepassmodal = true
        }
      }
    });
    this.loadingService.loading$.subscribe((loading) => {
      setTimeout(() => {
        this.loading = loading;
      });
    });
    this.loadingService.loading$.subscribe((loading) => {
      setTimeout(() => {
        this.loading = loading;
      });
    });
    this.changePassForm = this.formBuilder.group(
      {
        userId: [this.currentUser.userId, Validators.required],
        newpassword: [
          null,
          Validators.compose([
            Validators.required,
            StrongPasswordValidator,
          ]),
        ],
        confirm: [null, Validators.compose([
          Validators.required,
          StrongPasswordValidator,
        ]),
        ],
        password: [, Validators.required],
      },
      { validator: PasswordMatchingValidatior('newpassword', 'confirm') }
    );
  }
  get f() {
    return this.changePassForm;
  }

  get c() {
    return this.changePassForm.get('confirm');
  }

  visiblePassword = false;
  showPassword() {
    this.visiblePassword = !this.visiblePassword;
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
            this.changepassmodal = false;
            this.f.controls.newpassword.reset();
            this.f.controls.password.reset();
            this.f.controls.confirm.reset();
            this.router.navigateByUrl('/login');
          } else {
            this.toastr.error(res.errorDescription);
          }
        });
    } else {
      this.toastr.error('Invalid Input');
    }
    // console.log(this.changePassForm);
    // console.log(this.changePassForm.valid);

  }
  ngOnDestroy() {
  }
}

