import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from '../services/share-data.service';
import { GenericResponse } from '../shared/types/generic-response';
import { StakesettingsserviceService } from './stakesettingsservice.service';

@Component({
  selector: 'app-stakesettings',
  templateUrl: './stakesettings.component.html',
  styleUrls: ['./stakesettings.component.scss']
})
export class StakesettingsComponent implements OnInit {

  stakeSettingForm: FormGroup
  stakes: String
  Update: any;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private stakeService: StakesettingsserviceService,
    private shareService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.getlanguages();
    this.stakeSettingForm = this.formBuilder.group({
      stake1: [100],
      stake2: [500],
      stake3: [1000],
      stake4: [5000],
      stake5: [10000],
      stake6: [25000],
      stake7: [50000],
      stake8: [100000],
      stake9: [200000],
      stake10: [500000]
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
  submit() {
    //  console.log(this.stakeSettingForm.value);
    if (this.stakeSettingForm.valid) {
      for (let key in this.stakeSettingForm.value) {
        if (!this.stakeSettingForm.value[key]) {
          this.stakeSettingForm.value[key] = 0;
        }
      }
      this.stakes = this.stakeSettingForm.value.stake1 + ',' + this.stakeSettingForm.value.stake2 + ',' + this.stakeSettingForm.value.stake3 + ',' + this.stakeSettingForm.value.stake4 + ',' + this.stakeSettingForm.value.stake5 + ',' + this.stakeSettingForm.value.stake6 + ',' + this.stakeSettingForm.value.stake7 + ',' + this.stakeSettingForm.value.stake8 + ',' + this.stakeSettingForm.value.stake9 + ',' + this.stakeSettingForm.value.stake10;
      console.log(this.stakes);
      this.stakeService.setStakeSetting(this.stakes).subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode === 0) {
          this.toastr.success('Settings Saved');
        } else {
          this.toastr.error(res.errorDescription);
        }
      });
    } else {
      this.toastr.error('Invalid Input');
    }
  }
  back() {
    history.back();
  }

}
