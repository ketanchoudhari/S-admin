import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BankUpiService {
  baseUrl: string = 'https://sc.cricbuzzer.io:15552/api';
  baseUrl2: string = 'https://api.cricpayz.io:15557/api';

  constructor(private http: HttpClient) {
    
  }
  getBankAccountsList(uid:any,xpg:any) {
    return this.http.get(`${xpg?this.baseUrl2:this.baseUrl}/GetAdminbankaccountsList/?uid=${uid}`);
  }

  Getupilist(uid:any,xpg:any) {
    return this.http.get(`${xpg?this.baseUrl2:this.baseUrl}/GetAdminUpiList/?uid=${uid}`);
  }

  Getqrlist(uid:any,xpg:any) {
    return this.http.get(`${xpg?this.baseUrl2:this.baseUrl}/GetAdminQrList/?uid=${uid}`);
  }

  addBank(bankdetails:any,xpg:any) {
    return this.http.post(`${xpg?this.baseUrl2:this.baseUrl}/AddAdminbankdetails`,bankdetails);
  }

  updateBank(bankdetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminbankdetails`,bankdetails);
  }

  setPrefferedBank(bankdetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminbankdetailpreferred`,bankdetails);
  }

  deleteBank(bank_id:any,xpg:any) {
    return this.http.delete(`${xpg?this.baseUrl2:this.baseUrl}/DeleteAdminbankdetails/?bank_id=${bank_id}`);
  }

  addUpi(upidetails:any,xpg:any) {
    return this.http.post(`${xpg?this.baseUrl2:this.baseUrl}/AddAdminupidetails`,upidetails);
  }

  updateUpi(upidetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminupi`,upidetails);
  }

  setPrefferedUpi(upidetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminupipreferred`,upidetails);
  }

  deleteUpi(upi_id:any,xpg:any) {
    return this.http.delete(`${xpg?this.baseUrl2:this.baseUrl}/DeleteAdminupi/?upi_id=${upi_id}`);
  }

  addQr(upidetails:any,xpg:any) {
    return this.http.post(`${xpg?this.baseUrl2:this.baseUrl}/AddAdminQrCode`,upidetails);
  }

  updateQr(upidetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminQr`,upidetails);
  }

  setPrefferedQr(upidetails:any,xpg:any) {
    return this.http.patch(`${xpg?this.baseUrl2:this.baseUrl}/UpdateAdminQrpreferred`,upidetails);
  }

  deleteQr(qr_id:any,xpg:any) {
    return this.http.delete(`${xpg?this.baseUrl2:this.baseUrl}/DeleteAdminQr/?qr_id=${qr_id}`);
  }

}
