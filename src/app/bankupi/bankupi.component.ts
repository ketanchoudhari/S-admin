import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { TokenService } from '../services/token.service';
import { BankUpiService } from './bankupi.service';

@Component({
  selector: 'app-bankupi',
  templateUrl: './bankupi.component.html',
  styleUrls: ['./bankupi.component.scss']
})
export class BankupiComponent implements OnInit {

  selectedTabIndex: number = 0;
  loader: boolean = false;
  currentUser:any;
  noBank:boolean=true;
  showBankList:boolean=false;
  qrimg:any;
  bankList:any=[];
  Banks:any= [
    "Abhyudaya Co-Operative Bank Ltd",
    "Allahabad Bank",
    "Andhra Bank",
    "AU Small Finance Bank",
    "Axis Bank",
    "Bandhan Bank",
    "Bank of Bahrain and Kuwait",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Canara Bank",
    "Catholic Syrian Bank",
    "Central Bank of India",
    "CitiBank",
    "City Union Bank",
    "Corpation Bank",
    "DBS Bank",
    "Dhanlaxmi Bank",
    "Equitas Small Finance Bank",
    "Federal Bank",
    "GP Parsik Bank",
    "HDFC Bank",
    "ICICI Bank",
    "IDBI Bank",
    "IDFC FIRST Bank",
    "Indiabulls",
    "indian Bank",
    "Indian Overseas Bank",
    "Induslnd Bank",
    "ING Vysya Bank",
    "Jammu and Kashmir Bank",
    "Karnataka Bank Ltd",
    "Karur Vysya Bank",
    "Kotak Mahindra Bank",
    "Lakshmi Vilas Bank",
    "Nainital Bank",
    "Oriental Bank of Commerce",
    "Paytm Payments Bank",
    "Punjab & Sind Bank",
    "Punjab National Bank",
    "RBL Bank",
    "Shamrao Vitthal Co-Operative Bank",
    "Shivalik small Finance Bank",
    "South Indian Bank",
    "Standard Chartered",
    "State Bank of Bikaner & Jaipur",
    "State Bank of Hyderabad",
    "State Bank of India",
    "State Bank of Mysore",
    "State Bank of Patiala",
    "State Bank of Travancore",
    "Syndicate Bank",
    "Tamilnad Mercantile Bank Ltd.",
    "UCO Bank",
    "Ujjivan Small Finance Bank",
    "Union Bank of India",
    "United Bank of India",
    "Vijaya Bank",
    "Yes Bank"
  ];
  imgURL:string='';
  BankForm:FormGroup;
  editBankForm:FormGroup;
  qrForm:FormGroup;
  addBankInTransit:boolean=false;
  updateBankInTransit:boolean=false;
  preferredBankInTransit:boolean=false;
  deleteBankInTransit:boolean=false;
  Provider:any=['GPay','PhonePe','Paytm']
  selectedBankName:string='';
  selectedProvider:string='';
  selectedBankupi:any;
  noUPI:boolean=true;
  noQR:boolean=true;
  showUpiList:boolean=false;
  upiList:any=[];
  qrList:any=[];
  upiForm:FormGroup;
  editUpiForm:FormGroup;
  addUpiInTransit:boolean=false;
  updateUpiInTransit:boolean=false;
  preferredUpiInTransit:boolean=false;
  deleteUpiInTransit:boolean=false;
  xpgPay:boolean=false;
  addQrInTransit:boolean=false;
  updateQrInTransit:boolean=false;
  preferredQrInTransit:boolean=false;
  deleteQrInTransit:boolean=false;

  from:any='';
  p: number = 1;
  itemsPerPage: number =  10;

  constructor(
    private withdrawService:BankUpiService, 
    private authService: AuthService,
    private fb:FormBuilder, 
    private loadingService: LoadingService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if(this.currentUser.userName=="XPGPay"){
      this.xpgPay=true;
    }
    this.initForm();
    this.loadingService.setLoading(true);
    this.getBankAccountList();
    this.getUpiList();
    this.getQrList();
  }

  initForm(){
    this.BankForm = this.fb.group({
      account_holder:['',Validators.required],
      account_number:['',Validators.required],
      bank_name:['',Validators.required],
      ifsc_code:['', [Validators.required,Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
      uid:[this.currentUser.userId]
    })
    this.editBankForm = this.fb.group({
      bank_id:['',Validators.required],
      account_holder:['',Validators.required],
      account_number:['',Validators.required],
      bank_name:['',Validators.required],
      ifsc_code:['', [Validators.required,Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
    })
    this.upiForm = this.fb.group({
      value:['',Validators.required],
      type:['',Validators.required],
      name:['',Validators.required],
      uid:[this.currentUser.userId]
    })
    this.editUpiForm = this.fb.group({
      upi_id:['',Validators.required],
      value:['',Validators.required],
      name:['',Validators.required],
      type:['',Validators.required]
    })
    this.qrForm = this.fb.group({
      display_name:['',Validators.required],
      uid:[this.currentUser.userId],
      qr_img:[Validators.required]
    })
  }
  
  showOverlayInfo(value) {
    $(value).css('display', 'flex');
  }
  showEditUpi(value,bankupi){
    this.selectedBankupi = bankupi;
    this.editUpiForm.setValue({
      upi_id:this.selectedBankupi.upi_id,
      value:this.selectedBankupi.value,
      name:this.selectedBankupi.name,
      type:this.selectedBankupi.type
    });
    $(value).css('display', 'flex');
  }

  showconfirmation(value,from,bankupi){
    this.from = from;
    this.selectedBankupi = bankupi;
    $(value).css('display', 'flex');
  }

  showBanks(){
    this.showBankList = !this.showBankList;
  }

  trackById(idx, id) {
    return id.bank_id;
  }

  showEditBank(value:any,bankupi:any){
    this.selectedBankupi = bankupi;
    this.editBankForm.setValue({
      bank_id:this.selectedBankupi.bank_id,
      account_holder:this.selectedBankupi.account_holder,
      account_number:this.selectedBankupi.account_number,
      bank_name:this.selectedBankupi.bank_name,
      ifsc_code:this.selectedBankupi.ifsc_code
    });
    $(value).css('display', 'flex');
  }


  
  hideOverlayInfo(value) {
    this.selectedBankupi = '';
    $(value).fadeOut();
  }

  selectBank(bankName:string){
    this.selectedBankName = bankName;
  }

  selectProvider(providerName:string){
    this.selectedProvider = providerName;
  }
  
  getBankAccountList(){
    this.withdrawService.getBankAccountsList(this.currentUser.userId,this.xpgPay).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        this.noBank = false;
        if(resp.data){
          this.bankList = resp.data;
        }
            this.loadingService.setLoading(false);
      } else {
        this.noBank = true;
            this.loadingService.setLoading(false);
      }
    }, err => {
      console.log(err);
    }
    );
  }

  addBank(){
    if(this.addBankInTransit){
      return;
    }
    if(this.BankForm.valid){
      this.addBankInTransit = true;
          this.loadingService.setLoading(true);
      this.withdrawService.addBank(this.BankForm.value,this.xpgPay).subscribe((resp: any) => {
        if(resp){
          this.addBankInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
                this.loadingService.setLoading(false);
            this.hideOverlayInfo('#addBankDialog');
            this.BankFormReset();
            this.getBankAccountList();
          } else {
            this.toastr.error(resp.message)
                this.loadingService.setLoading(false);
          }
        }
      }, err => {
        this.addBankInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  setPreferredBank(){
        this.loadingService.setLoading(true);
    if(this.preferredBankInTransit){
      return
    }
    this.preferredBankInTransit = true;
    let data = {
      "uid":this.currentUser.userId,
      "bank_id":this.selectedBankupi.bank_id,
      "isPreferred":1
    }
    this.withdrawService.setPrefferedBank(data,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.preferredBankInTransit = false;
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
              this.loadingService.setLoading(false);
          this.hideOverlayInfo('#confirmation');
          this.getBankAccountList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
    }, err => {
      this.preferredBankInTransit = false;
      console.log(err);
    }
    );
  }

  deleteBank(){
        this.loadingService.setLoading(true);
    if(this.deleteBankInTransit){
      return
    }
    this.deleteBankInTransit = true;
    this.withdrawService.deleteBank(this.selectedBankupi.bank_id,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.deleteBankInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
              this.loadingService.setLoading(false);
          this.getBankAccountList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
    }, err => {
      this.hideOverlayInfo('#confirmation');
      this.deleteBankInTransit = false;
      console.log(err);
    }
    );
  }

  updateBank(){
    if(this.updateBankInTransit){
      return;
    }
    if(this.editBankForm.valid){
      this.updateBankInTransit = true;
          this.loadingService.setLoading(true);
      this.withdrawService.updateBank(this.editBankForm.value,this.xpgPay).subscribe((resp: any) => {
        if(resp){
          this.updateBankInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
                this.loadingService.setLoading(false);
            this.hideOverlayInfo('#editBankDialog');
            this.editBankForm.reset();
            this.getBankAccountList();
          } else {
            this.toastr.error(resp.message)
                this.loadingService.setLoading(false);
          }
        }
      }, err => {
        this.updateBankInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  BankFormReset(){
    this.BankForm.controls.account_holder.reset();
    this.BankForm.controls.account_number.reset();
    this.BankForm.controls.bank_name.reset();
    this.BankForm.controls.ifsc_code.reset();
  }

  selectTab(tabIndex) {
    if (tabIndex == 0) {
      //this.getActivateGame();
    } else if (tabIndex == 1) {
      //this.getVirtualGameList();
    } 
    this.selectedTabIndex = tabIndex;
  }

  getUpiList(){
    this.withdrawService.Getupilist(this.currentUser.userId,this.xpgPay).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        this.noUPI = false;
        if(resp.data){
          this.upiList = resp.data;
        }
            this.loadingService.setLoading(false);
      } else {
        this.noUPI = true;
            this.loadingService.setLoading(false);
      }
    }, err => {
      console.log(err);
    }
    );
  }

  addUpi(){
    console.log(this.upiForm.value);
    
    if(this.addUpiInTransit){
      return;
    }
    if(this.upiForm.valid){
      this.addUpiInTransit = true;
          this.loadingService.setLoading(true);
      this.withdrawService.addUpi(this.upiForm.value,this.xpgPay).subscribe((resp: any) => {
        if(resp){
          this.addUpiInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
                this.loadingService.setLoading(false);
            this.hideOverlayInfo('#addUpiDialog');
            this.upiFormReset();
            this.getUpiList();
          } else {
            this.toastr.error(resp.message)
                this.loadingService.setLoading(false);
          }
        }
      }, err => {
        this.addUpiInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }


  setPreferredUpi(){
        this.loadingService.setLoading(true);
    if(this.preferredUpiInTransit){
      return
    }
    this.preferredUpiInTransit = true;
    let data = {
      "uid":this.currentUser.userId,
      "upi_id":this.selectedBankupi.upi_id,
      "isPreferred":1
    }
    this.withdrawService.setPrefferedUpi(data,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.preferredUpiInTransit = false;
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
              this.loadingService.setLoading(false);
          this.hideOverlayInfo('#confirmation');
          this.getUpiList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
    }, err => {
      this.preferredUpiInTransit = false;
      console.log(err);
    }
    );
  }


  deleteUpi(){
        this.loadingService.setLoading(true);
    if(this.deleteUpiInTransit){
      return
    }
    this.deleteUpiInTransit = true;
    this.withdrawService.deleteUpi(this.selectedBankupi.upi_id,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.deleteUpiInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
              this.loadingService.setLoading(false);
          this.getUpiList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
      }, err => {
        this.hideOverlayInfo('#confirmation');
        this.deleteUpiInTransit = false;
        console.log(err);
      }
    );
  }


  updateUpi(){
    console.log(this.upiForm.value);
    
    if(this.updateUpiInTransit){
      return;
    }
    if(this.editUpiForm.valid){
      this.updateUpiInTransit = true;
          this.loadingService.setLoading(true);
      this.withdrawService.updateUpi(this.editUpiForm.value,this.xpgPay).subscribe((resp: any) => {
        if(resp){
          this.updateUpiInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
                this.loadingService.setLoading(false);
            this.hideOverlayInfo('#editUpiDialog');
            this.editUpiForm.reset();
            this.getUpiList();
          } else {
            this.toastr.error(resp.message)
                this.loadingService.setLoading(false);
          }
        }
      }, err => {
        this.updateUpiInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  showQR(img:any){
    this.imgURL = `https://sc.cricbuzzer.io/${img}`;
    $("#bigQR").fadeIn();
  }

  closeQR(){
    this.imgURL ='';
    $("#bigQR").fadeOut();
  }


  upiFormReset(){
    this.upiForm.controls.value.reset();
    this.upiForm.controls.type.reset();
    this.upiForm.controls.name.reset();
  }

  getQrList(){
    this.withdrawService.Getqrlist(this.currentUser.userId,this.xpgPay).subscribe((resp: any) => {
      if (resp.status === 'Success') {
        this.noQR = false;
        if(resp.data){
          this.qrList = resp.data;
        }
            this.loadingService.setLoading(false);
      } else {
        this.noQR = true;
            this.loadingService.setLoading(false);
      }
    }, err => {
      console.log(err);
    }
    );
  }

  addQR(){
    console.log(this.qrForm.value);
    if(this.addQrInTransit){
      return;
    }
    if(this.qrForm.valid){
      this.addQrInTransit = true;
      this.loadingService.setLoading(true);
      let formData = new FormData();
      formData.append('uid', this.qrForm.controls.uid.value.toString());
      formData.append('display_name',this.qrForm.controls.display_name.value.toString());
      formData.append('qr_img', this.qrForm.controls.qr_img.value);
      this.withdrawService.addQr(formData,this.xpgPay).subscribe((resp: any) => {
        if(resp){
          this.hideOverlayInfo('#addQRDialog');
          this.addQrInTransit = false;
          if (resp.status === 'Success') {
            this.toastr.success(resp.message)
            this.loadingService.setLoading(false);
            this.qrFormReset();
            this.getQrList();
          } else {
            this.toastr.error(resp.message)
            this.loadingService.setLoading(false);
          }
        }
      }, err => {
        this.hideOverlayInfo('#addQRDialog');
        this.addQrInTransit = false;
        console.log(err);
      }
      );
    }
    else{
      this.toastr.error('Invalid Input')
    }
  
  }

  qrFormReset(){
    this.qrForm.controls.display_name.reset();
    this.qrForm.controls.qr_img.reset();
  }

  setPreferredQr(){
    if(this.preferredQrInTransit){
      return
    }
    this.loadingService.setLoading(true);
    this.preferredQrInTransit = true;
    let data = {
      "uid":this.currentUser.userId,
      "qr_id":this.selectedBankupi.qr_id,
      "isPreferred":1
    }
    this.withdrawService.setPrefferedQr(data,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.preferredQrInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
              this.loadingService.setLoading(false);
          this.getQrList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
    }, err => {
      this.preferredQrInTransit = false;
      this.hideOverlayInfo('#confirmation');
      console.log(err);
    }
    );
  }

  deleteQr(){
    if(this.deleteQrInTransit){
      return
    }
    this.deleteQrInTransit = true;
    this.loadingService.setLoading(true);
    this.withdrawService.deleteQr(this.selectedBankupi.qr_id,this.xpgPay).subscribe((resp: any) => {
      if(resp){
        this.deleteQrInTransit = false;
        this.hideOverlayInfo('#confirmation');
        if (resp.status === 'Success') {
          this.toastr.success(resp.message)
          this.loadingService.setLoading(false);
          this.getQrList();
        } else {
          this.toastr.error(resp.message)
              this.loadingService.setLoading(false);
        }
      }
      }, err => {
        this.hideOverlayInfo('#confirmation');
        this.deleteQrInTransit = false;
        console.log(err);
      }
    );
  }

  saveImage(ss:any){
    this.qrForm.controls.qr_img.setValue(ss.item(0));
  }


}
