import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from '../../shared/service/auth.service';
import {StudentService} from '../../shared/service/student.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-enrollclasscode',
    templateUrl: './enrollclasscode.component.html',
    styleUrls: ['./enrollclasscode.component.scss']
})
export class EnrollclasscodeComponent implements OnInit {

    public classCode: any = '';
    public closeResult: string;
    public loginForm: FormGroup;
    public registerForm: FormGroup;
    public conps: boolean;
    public conps1: boolean;
    public gradeData: any;
    public passwordValid: boolean;
    public response: any;
    @ViewChild('loginTemplate') modalContent: TemplateRef<any>;
    @ViewChild('registerTemplate') modalContent1: TemplateRef<any>;
    private modalRef: NgbModalRef;
    private modalRef1: NgbModalRef;

    constructor(private modalService: NgbModal, public formBuilder: FormBuilder, public auth: AuthService, public student: StudentService,
                public toastr: ToastrService, public route: Router, public activateRoute: ActivatedRoute) {
        this.activateRoute.params.forEach((params) => {
            this.classCode = params.type;
            localStorage.setItem('studentClassCode', this.classCode);
        });
        if (this.auth.getAccessToken() === undefined || this.auth.getAccessToken() === '' || this.auth.getAccessToken() == null) {
            // this.route.navigate(['/enrollclasscode/' + this.classCode]);
        } else {
            // setTimeout(function(){
            if (this.auth.getRoleId() == '5') {
                this.route.navigate(['/studentlogin/enrollclass']);
            } else {
                // this.route.navigate(['/enrollclasscode/' + this.classCode]);
            }
            // },3000);
        }
        this.conps = true;
        this.conps1 = true;
        this.loginForm = this.formBuilder.group({
            userName: '',
            password: '',
        });

        this.formresetValue();
    }

    ngOnInit(): void {

    }

    checkPasswords() {
        const pass = this.registerForm.controls.password.value;
        const confirmPass = this.registerForm.controls.confirmpassword.value;

        if (pass === confirmPass) {
            this.passwordValid = false;
        } else {
            this.passwordValid = true;
        }
        return this.passwordValid;
    }


    enrollClassLogin() {

        if (this.classCode == '' || this.classCode == 0 || this.classCode == null) {
            this.toastr.error('Please enter valid class code');
        } else {
            const data = {
                platform: 'web',
                class_code: this.classCode,
                timezone: 'Asia/Calcutta'
            };
            console.log(data, 'data');
            this.student.checkClassCode(data).subscribe((successData) => {
                    this.checkClassCodeSuccess(successData);
                },
                (error) => {
                    console.log(error, 'error');
                });
        }
    }

    checkClassCodeSuccess(successData) {
        if (successData.IsSuccess) {
            this.route.navigate(['/auth/login']);
            localStorage.setItem('studentClassCode', this.classCode);
        } else {
            this.toastr.error(successData.ErrorObject, '');
        }
    }

    close() {
        this.modalRef.close();
    }

    exit() {
        this.modalRef1.close();
    }

    submitLoginForm() {
        // {"platform":"web","role_id":"2","user_id":"3032","class_code":"4PGQADRU6W","email_id":"hemaramesh93@gmail.com","password":"123456"}
        if (this.loginForm.get('userName').value == '' || this.loginForm.get('password').value == '') {
            this.toastr.error('Please enter valid fields');
        } else {
            const data = {
                platform: 'web',
                class_code: this.classCode,
                email_id: this.loginForm.controls.userName.value,
                password: this.loginForm.controls.password.value
            };
            console.log(data, 'Logindata');

            this.student.enrollLoginClass(data).subscribe((successData) => {
                    this.enrollLoginClassSuccess(successData);
                },
                (error) => {
                    this.enrollLoginClassFailure(error);
                });
        }
    }

    enrollLoginClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.error(successData.ResponseObject, '');
        } else {
            this.toastr.error(successData.ErrorObject, '');
        }
    }

    enrollLoginClassFailure(error) {
        console.log(error, 'Error');
    }

    newRegister() {
        //Register template
        this.formresetValue();
        this.modalRef1 = this.modalService.open(this.modalContent1, {size: 'lg', backdrop: 'static'});
        this.modalRef1.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    submitRegisterForm() {
        /* "platform": "web","class_code": "4PGQADRU6W","email_id": "example@gmail.com","password": "123456","first_name": "ABC","last_name": "TR","gender": "male",*/
        if (this.registerForm.get('email_id').value == '' || this.registerForm.get('password').value == '' || this.registerForm.get('first_name').value == '' || this.registerForm.get('last_name').value == '' ||
            this.registerForm.get('gender').value == '' || this.registerForm.get('confirmpassword').value == '') {
            this.toastr.error('Please fill all mandatory field');
        } else {
            const data = {
                platform: 'web',
                class_code: this.classCode,
                email_id: this.registerForm.controls.email_id.value,
                password: this.registerForm.controls.password.value,
                first_name: this.registerForm.controls.first_name.value,
                last_name: this.registerForm.controls.last_name.value,
                gender: this.registerForm.controls.gender.value,
                user_id: '0'
            };
            console.log(data, 'RegisterData');

            this.student.enrollRegisterClass(data).subscribe((successData) => {
                    this.enrollRegisterClassSuccess(successData);
                },
                (error) => {
                    this.enrollRegisterClassFailure(error);
                });
        }
    }

    // gradeList() {
    //     const data = {
    //         platform: 'web',
    //         role_id: '2',
    //         user_id: '3032',
    //         school_id: '303',
    //         type: 'active'
    //     };
    //     this.student.getgradeList(data).subscribe((successData) => {
    //             this.gradeListSuccess(successData);
    //         },
    //         (error) => {
    //             this.gradeListFailure(error);
    //         });
    // }
    //
    // gradeListSuccess(successData) {
    //     console.log(successData, 'successData');
    //     if (successData.IsSuccess) {
    //         this.gradeData = successData.ResponseObject;
    //
    //     }
    // }
    //
    // gradeListFailure(error) {
    //     console.log(error, 'error');
    // }

    enrollRegisterClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.response = successData.ResponseObject;
            this.toastr.success(successData.ResponseObject, '');
            this.route.navigate(['auth/login']);
            this.modalRef.close();
            this.modalRef1.close();
            this.formresetValue();
        } else {
            this.toastr.error(successData.ErrorObject, '');
        }
    }

    enrollRegisterClassFailure(error) {
        console.log(error, 'error');
    }

    formresetValue() {
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            gender: '',
            grade: ['', Validators.required],
            email_id: ['', Validators.required],
            password: ['', Validators.required],
            confirmpassword: ''
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

}
