import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ValidationService} from '../../../shared/service/validation.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {split} from "ts-node";

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {
   public message: any;
   public passwordValid: any;
   public token: any;
   public roleId: any;
   public loginForm: FormGroup;
   public conps: boolean;
   public conps1: boolean;
    public logo: any;
    public hostName: any = 'EdQuill';
    public functionCalled: any = false;

  constructor(private formBuilder: FormBuilder, public commondata: CommonDataService, public route: ActivatedRoute,
              private toastr: ToastrService, public loginService: LoginService, public authService: AuthService,
              public router: Router, public validation: ValidationService) {
      let url = window.location.href;
      if (url.toString().indexOf('xtracurriculum') > -1) {
          this.logo = 'xtraCurriculum_2.png';
          this.hostName = 'XtraCurriculum';
      } else if (url.toString().indexOf('safeteen') > -1) {
          this.logo = 'safeTeensOrg_2.png';
          this.hostName = 'SafeTeens';
      } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('edveda') > -1) {
          this.logo = 'EdQuill_2.png';
          this.hostName = 'EdQuill';
      }
    this.route.params.forEach((params) => {
        this.token = params.id;
        this.conps = true;
        this.conps1 = true;
    });
    // let role = this.token.split('|');
    // this.roleId = role[1];
    this.createLoginForm();
  }

    owlcarousel = [
        {
            title: 'Welcome to EdQuill',
            desc: "We focus on making all EdQuill events both 'New' and 'News'",
        },
        {
            title: 'Welcome to EdQuill',
            desc: "We focus on making all EdQuill events both 'New' and 'News'",
        },
        {
            title: 'Welcome to EdQuill',
            desc: "We focus on making all EdQuill events both 'New' and 'News'",
        }
    ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: [''],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: [''],
    });
  }

  ngOnInit() {
  }

    // here we have the 'passwords' group
    checkPasswords() {
        let pass = this.loginForm.controls.password.value.toString();
        let confirmPass = this.loginForm.controls.confirmPassword.value.toString();
        if (pass === confirmPass) {
            this.passwordValid = false;
        } else {
            this.passwordValid = true;
        }
        return this.passwordValid;
    }

    checkConfirmPassword() {
      if (this.loginForm.controls.confirmPassword.value != '') {
       this.checkPasswords();
      }
    }

    update(){
        if(this.loginForm.valid && !this.passwordValid) {
            const data = {
                platform: 'web',
                role_id: '1',
                email_id: this.loginForm.controls.userName.value,
                encoded_user_id: this.token,
                password: this.loginForm.controls.password.value
            };
            this.loginService.changePassword(data).subscribe((successData) => {
                    this.changeSuccess(successData);
                },
                (error) => {
                    this.changeFailure(error);
                });
        } else{
            this.toastr.error('Fill Valid Data', 'Error');
            this.validation.validateAllFormFields(this.loginForm);
        }
    }

    changeSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject, 'Account Activated');
            //if (this.roleId == 6) {
            //     this.router.navigate(['/auth/login/corporate']);
            // } else {
                this.router.navigate(['/auth/login']);
            // }
        } else{
            this.toastr.error(successData.ErrorObject, '');
        }
    }
    changeFailure(error) {
        console.log(error, 'error');
    }
}
