import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {AuthService} from '../../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationService} from '../../../shared/service/validation.service';
import {CategoryService} from '../../../shared/service/category.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
    public message: any;
    public token: any;
    public type: any;
    public passwordValid: boolean;
    public forgotList: boolean;
    public loginForm: FormGroup;
    public forgotForm: FormGroup;
    public roleid: any;
    public logo: any;
    public hostName: any = 'EdQuill';
    public functionCalled: any = false;

    owlcarousel = [
        {
            title: 'Welcome to' + ' ' + this.hostName
        }
    ];

    constructor(private formBuilder: FormBuilder, public commondata: CommonDataService, public category: CategoryService,
                public loginService: LoginService, public authService: AuthService, public router: Router,
                public validation: ValidationService, public route: ActivatedRoute, public toastr: ToastrService) {
        const url = window.location.href;
        if (url.toString().indexOf('xtracurriculum') > -1) {
            this.logo = 'xtraCurriculum_2.png';
            this.hostName = 'XtraCurriculum';
        } else if (url.toString().indexOf('safeteen') > -1) {
            this.logo = 'safeTeensOrg.png';
            this.hostName = 'SafeTeens';
        } else if (url.toString().indexOf('uniqprep') > -1) {
            this.logo = 'uniqprep.png';
            this.hostName = 'Uniq Prep';
        }  else if (url.toString().indexOf('elevenace') > -1) {
            this.logo = 'elevenAce.png';
            this.hostName = 'ElevenAce';
        } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edveda') > -1) {
            this.logo = 'EdQuill_2.png';
            this.hostName = 'EdQuill';
        }
        this.createLoginForm();
        this.route.params.forEach((params) => {
            // this.type = params.type;
            console.log(this.type);
            this.token = params.id;
            // console.log(this.token);
            this.forgotList = !(this.token == undefined || this.token == '');
        });
        this.message = '';
        this.functionCalled = true;
    }

    owlcarouselOptions = {
        loop: true,
        items: 1,
        dots: true
    };

    createLoginForm() {
        this.loginForm = this.formBuilder.group({
            userName: ['']
        });
        this.forgotForm = this.formBuilder.group({
            // userName: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: [''],
        });

    }


    ngOnInit() {
        //   this.forgotForm.controls.userName.reset();
        this.forgotForm.controls.password.reset();
        this.forgotForm.controls.confirmpassword.reset();
        // if (this.type == 'admin') {
        //     this.roleid = '2';
        //     console.log(this.roleid, 'Admin Forgot Password');
        // } else if (this.type == 'content') {
        //     this.roleid = '3';
        //     console.log(this.roleid, 'Content-Creator Forgot Password');
        // } else if (this.type == 'teacher') {
        //     this.roleid = '4';
        //     console.log(this.roleid, 'Teacher Forgot Password');
        // } else if (this.type == 'student') {
        //     this.roleid = '5';
        //     console.log(this.roleid, 'Teacher Forgot Password');
        // } else if (this.type == 'corporate') {
        //     this.roleid = '6';
        //     console.log(this.roleid, 'Teacher Forgot Password');
        // } else if (this.type == 'grader') {
        //     this.roleid = '7';
        //     console.log(this.roleid, 'Teacher Forgot Password');
        // }
    }

    checkPasswords() {
        const pass = this.forgotForm.controls.password.value;
        const confirmPass = this.forgotForm.controls.confirmpassword.value;
        this.passwordValid = pass !== confirmPass;
        return this.passwordValid;
    }


    change() {
        if (this.loginForm.valid) {
            const data = {
                platform: 'web',
                email_id: this.loginForm.controls.userName.value
                // role_id: this.roleid
            };
            console.log(data, 'data');
            this.loginService.forgotPassword(data).subscribe((successData) => {
                    this.changeSuccess(successData);
                },
                (error) => {
                    console.error(error);
                });
        } else {
            this.validation.validateAllFormFields(this.loginForm);
        }
    }

    changeSuccess(successData) {
        if (successData.IsSuccess) {
            this.message = successData.ResponseObject.message;
        } else {
            this.toastr.error(successData.ErrorObject, 'Forgot password');
        }
    }

    update() {
        const pass = this.forgotForm.controls.password.value;
        const confirmpass = this.forgotForm.controls.confirmpassword.value;
        if (this.forgotForm.valid && pass == confirmpass) {
            const data = {
                platform: 'web',
                email_id: this.token,
                // email_id: this.forgotForm.controls.userName.value,
                // token: this.token,
                password: this.forgotForm.controls.password.value
            };
            this.loginService.changeForgotPassword(data).subscribe((successData) => {
                    this.changeForgotSuccess(successData);
                },
                (error) => {
                    console.error(error);
                });
        } else {
            this.validation.validateAllFormFields(this.forgotForm);
        }
    }

    changeForgotSuccess(successData) {
        // this.forgotForm.controls.userName.reset();
        this.forgotForm.controls.password.reset();
        this.forgotForm.controls.confirmpassword.reset();
        if (successData.IsSuccess) {
            if (successData.ResponseObject.type != '5') {
                this.toastr.success(successData.ResponseObject.message, 'Success');
            }
            this.router.navigate(['/auth/login']);
            // if (successData.ResponseObject.type == '2') {
            //     this.router.navigate(['/auth/login/admin']);
            // } else if (successData.ResponseObject.type == '3') {
            //     this.router.navigate(['/auth/login/content-creator']);
            // } else if (successData.ResponseObject.type == '4') {
            //     this.router.navigate(['/auth/login/school']);
            // } else if (successData.ResponseObject.type == '5') {
            //     this.router.navigate(['/auth/login/student']);
            //     // this.toastr.success('Password Reset Successfully. Please login in app');
            // } else if (successData.ResponseObject.type == '6') {
            //     this.router.navigate(['/auth/login/corporate']);
            //     // this.toastr.success('Password Reset Successfully. Please login in app');
            // }
            this.toastr.success(successData.ResponseObject.message);
        } else {
            this.toastr.error(successData.ErrorObject, 'Failed');
        }
    }

}
