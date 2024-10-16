import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public accountForm: FormGroup;
  public roleId: any;
  public passwordValid: boolean;
  public conps: boolean;
  public conps1: boolean;
  public conps2: boolean;

  constructor(private formBuilder: FormBuilder, public commondata: CommonDataService, private toastr: ToastrService,
              public auth: AuthService, public category: CategoryService, public router: Router,
              public validation: ValidationService, public env: EnvironmentService) {
    this.accountForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      oldpassword: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      confirmPassword: ['', Validators.required],
    });
    this.conps = true;
    this.conps1 = true;
    this.conps2 = true;
  }
  ngOnInit() {
    this.commondata.showLoader(false);
  }


  changePassword() {
      const pass = this.accountForm.controls.password.value;
      const confirmpass = this.accountForm.controls.confirmPassword.value;
    if (this.accountForm.valid && pass == confirmpass) {
        const data = {
          platform: 'web',
          role_id: this.auth.getSessionData('rista-roleid'),
          user_id: this.auth.getSessionData('rista-userid'),
          password: this.accountForm.controls.password.value,
          old_password: this.accountForm.controls.oldpassword.value,
          confirm_password: this.accountForm.controls.confirmPassword.value
        };
          this.category.changePassword(data).subscribe((successData) => {
          this.changePasswordSuccess(successData);
        },
          (error) => {
            this.changePasswordFailure(error);
          });
    } else {
      this.validation.validateAllFormFields(this.accountForm);
    }
  }
  changePasswordSuccess(successData) {

    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject.message, '');
      this.roleId = this.auth.getSessionData('rista-roleid');
      if (this.roleId == 2 || this.roleId == 4 || this.roleId == 6  ) {
        this.router.navigate(['home/list-home']);
      } else if (this.roleId == 3) {
        this.router.navigate(['repository/content-home']);
      }else if (this.roleId == 5){
        this.router.navigate(['studentlogin/list-home']);
      }
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, '');
    }
  }
  changePasswordFailure(error) {
    console.log(error, 'error');
  }

  checkPasswords() {
    let pass = this.accountForm.controls.password.value;
    let confirmPass = this.accountForm.controls.confirmPassword.value;
    if (pass === confirmPass) {
      this.passwordValid = false;
    } else {
      this.passwordValid = true;
    }
    return this.passwordValid;
  }


}
