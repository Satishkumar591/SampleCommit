import {Component, OnInit, HostListener, ViewChild, TemplateRef, SecurityContext} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SchoolService} from '../../../shared/service/School.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {StudentService} from '../../../shared/service/student.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public type: any;
    public checkbox: any;
    public adminForm: FormGroup;
    public schoolForm: FormGroup;
    public contentForm: FormGroup;
    public studentForm: FormGroup;
    public corporatesForm: FormGroup;
    public graderForm: FormGroup;
    public registerForm: FormGroup;
    public conps = true;
    public conps1 = true;
    public remember: boolean;
    public mobileView: boolean;
    public userId: any;
    public checkterms: any;
    public roleId: any;
    public corporateId: any;
    public typeCheck: any;
    public closeResult: string;
    @ViewChild('tcupdate') updateContent: TemplateRef<any>;
    private modalRef: NgbModalRef;
    public studentdata: any;
    public teacherdata: any;
    public admindata: any;
    public logo: any;
    public gradedata: any;
    private schoolData: any;
    private settingData = [];
    private timeZoneList = [];
    public passwordValid: boolean;
    public registerResponse: any;
    public enrollCode: any;

    public loginForm: FormGroup;
    public creatorData: any;
    public classCode = '';
    public gradeList = [];
    constructor(private formBuilder: FormBuilder, public activateRoute: ActivatedRoute, public loginService: LoginService, public commondata: CommonDataService, public common: CommonService, private deviceService: DeviceDetectorService, public domSanitizer: DomSanitizer, public student: StudentService,
                public authService: AuthService, public config: ConfigurationService, public router: Router, private toastr: ToastrService, public validation: ValidationService, private modalService: NgbModal, public schoolService: SchoolService, public behavior: NewsubjectService) {
        this.activateRoute.params.forEach((params) => {
            this.type = params.type;
            this.remember = false;
            console.log(this.type);
            this.classCode = params.classCode ? params.classCode : '';
            this.classCode != '' ? localStorage.setItem('studentClassCode', this.classCode) : '';
            console.log(this.classCode, 'classCode');
            // if (this.type == undefined) {
            //     this.checkDeviceType();
            // }
        });
        if (localStorage.getItem('studentClassCode') == 'undefined' || localStorage.getItem('studentClassCode') ==  null) {
            this.enrollCode = '';
            console.log(this.enrollCode, 'enrollcodeEmpty');
        } else {
            this.enrollCode = localStorage.getItem('studentClassCode');
            console.log(this.enrollCode, 'enrollcodeAnswer');
        }
        const url = window.location.href;
        console.log(url, 'url');
        if (url.toString().indexOf('xtracurriculum') > -1) {
            this.logo = 'xtraCurriculum.png';
        } else if (url.toString().indexOf('safeteen') > -1) {
            this.logo = 'safeTeensOrg.png';
        } else if (url.toString().indexOf('elevenace') > -1) {
            this.logo = 'elevenAce.png';
        } else if (url.toString().indexOf('uniqprep') > -1) {
            this.logo = 'uniqprep.png';
        } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('edveda') > -1) {
            this.logo = 'EdQuill_2.png';
        }
        this.conps = true;
        this.conps1 = true;
        this.loginForm = this.formBuilder.group({
            userName: '',
            password: '',
            checkbox: '',
        });
        this.studentForm = this.formBuilder.group({
            userName: null,
            password: '',
            checkbox3: '',
        });
        this.formresetValue();
        if (localStorage.getItem('username') != '') {
            this.loginForm.controls.userName.patchValue(localStorage.getItem('username'));
            this.loginForm.controls.password.patchValue(localStorage.getItem('password'));
            this.loginForm.controls.checkbox.patchValue(localStorage.getItem('checked'));
        }
    }

    ngOnInit() {
        if (this.classCode != '') {
            this.enrollClassLogin();
        } else {
            this.authService.checkAuthentication();
        }
    }

    numberValidate(event) {
        this.validation.numberValidate(event);
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        if (window.innerWidth <= 1100) {
            this.mobileView = true;
        } else {
            this.mobileView = false;
        }
    }

    enrollClassLogin() {

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

    checkClassCodeSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData, 'successData');
            if (successData.ResponseObject.length != 0) {
                this.gradeList = successData.ResponseObject[0].grade_details;
            } else {
                this.gradeList = [];
            }
            console.log(this.gradeList, 'gradeList');
            // this.route.navigate(['/auth/login']);
            // localStorage.setItem('studentClassCode', this.classCode);
        } else {
            this.toastr.error(successData.ErrorObject, '');
        }
    }

    checkDeviceType() {
        console.log(this.deviceService.getDeviceInfo(), 'devicedetecteor');
        if (this.deviceService.getDeviceInfo().os == 'iOS' ||
            (this.deviceService.getDeviceInfo().os == 'Mac' && this.deviceService.isTablet())){
            const urlString = 'https://apps.apple.com/us/app/edquill/id1584334449';
            const url = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL,
                this.domSanitizer.bypassSecurityTrustResourceUrl(urlString));
            window.open(url, '_self');
        }
    }

    setRemeberMe(value) {
        console.log(value, 'value');
        // localStorage.setItem('type1', type);
        localStorage.setItem('username', value ? this.loginForm.controls.userName.value : '');
        localStorage.setItem('password', value ? this.loginForm.controls.password.value : '');
        localStorage.setItem('checked', value);
        this.remember = value;
        console.log(this.remember, 'remeber');
    }

    rememberList(value, type?) {
        // this.setRemeberMe(value.target.checked);
        // if (type == '1') {
        //     if (value.target.checked == true) {
        //         localStorage.setItem('type1', type);
        //         localStorage.setItem('username', this.adminForm.controls.userName.value);
        //         localStorage.setItem('password', this.adminForm.controls.password.value);
        //         localStorage.setItem('checked', value.target.checked);
        //         this.remember = true;
        //     } else {
        //         localStorage.setItem('username', '');
        //         localStorage.setItem('password', '');
        //         localStorage.setItem('checked', '');
        //         this.remember = false;
        //     }
        // }
        // if (type == '2') {
        //     if (value.target.checked == true) {
        //         localStorage.setItem('type2', type);
        //         localStorage.setItem('username1', this.contentForm.controls.userName.value);
        //         localStorage.setItem('password1', this.contentForm.controls.password.value);
        //         localStorage.setItem('checked1', value.target.checked);
        //         this.remember = true;
        //     } else {
        //         localStorage.setItem('username1', '');
        //         localStorage.setItem('password1', '');
        //         localStorage.setItem('checked1', '');
        //         this.remember = false;
        //     }
        // }
        // if (type == '3') {
        //     if (value.target.checked == true) {
        //         localStorage.setItem('type3', type);
        //         localStorage.setItem('username2', this.schoolForm.controls.userName.value);
        //         localStorage.setItem('password2', this.schoolForm.controls.password.value);
        //         localStorage.setItem('checked2', value.target.checked);
        //         this.remember = true;
        //     } else {
        //         localStorage.setItem('username2', '');
        //         localStorage.setItem('password2', '');
        //         localStorage.setItem('checked2', '');
        //         this.remember = false;
        //     }
        // }
        // if (type == '4') {
        //     if (value.target.checked == true) {
        //         localStorage.setItem('type4', type);
        //         localStorage.setItem('username3', this.studentForm.controls.userName.value);
        //         localStorage.setItem('password3', this.studentForm.controls.password.value);
        //         localStorage.setItem('checked3', value.target.checked);
        //         this.remember = true;
        //     } else {
        //         localStorage.setItem('username3', '');
        //         localStorage.setItem('password3', '');
        //         localStorage.setItem('checked3', '');
        //         this.remember = false;
        //     }
        // }
        // if (type == '7') {
        //     if (value.target.checked == true) {
        //         localStorage.setItem('type7', type);
        //         localStorage.setItem('username7', this.graderForm.controls.userName.value);
        //         localStorage.setItem('password7', this.graderForm.controls.password.value);
        //         localStorage.setItem('checked7', value.target.checked);
        //         this.remember = true;
        //     } else {
        //         localStorage.setItem('username7', '');
        //         localStorage.setItem('password7', '');
        //         localStorage.setItem('checked7', '');
        //         this.remember = false;
        //     }
        // }
    }

    enterKey(event) {
        if (event.key == 'Enter') {
            this.login();
        }
    }

    login() {
        if (this.loginForm.valid) {
            this.remember = this.loginForm.controls.checkbox.value == true || this.loginForm.controls.checkbox.value == 'true';
            console.log(this.remember, 'remeber');
            const data = {
                platform: 'web',
                username: this.loginForm.controls.userName.value,
                password: this.loginForm.controls.password.value,
                remember: this.remember
            };
            this.loginService.login(data).subscribe((successData: any) => {
                    if (successData.IsSuccess) {
                        this.loginSuccess(successData);
                        console.log(successData);
                    } else {
                        this.toastr.error(successData.ErrorObject);
                    }
                },
                (error) => {
                    console.error(error, 'error_login');
                });
        } else {
            this.validation.validateAllFormFields(this.loginForm);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    loginSuccess(successData) {
        this.setRemeberMe(this.remember);
        if (successData.ResponseObject.user_role == '2') {
            this.loginAdminSuccess(successData);
        } else if (successData.ResponseObject.user_role == '3') {
            this.loginCreatorSuccess(successData);
        } else if (successData.ResponseObject.user_role == '4') {
            this.loginSchoolSuccess(successData);
        } else if (successData.ResponseObject.user_role == '5') {
            this.loginStudentSuccess(successData);
        } else if (successData.ResponseObject.user_role == '6') {
            this.loginCorporatesSuccess(successData);
        } else if (successData.ResponseObject.user_role == '7') {
            this.loginGraderSuccess(successData);
        }
    }

    loginAdminSuccess(successData) {
        this.admindata = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.userId = this.admindata.user_id;
            this.roleId = this.admindata.user_role;
            this.authService.setToken(this.admindata.user_id, this.admindata.first_name, this.admindata.last_name, this.admindata.user_role, this.admindata.Accesstoken);
            this.authService.setSessionData('rista-status', this.admindata.status);
            this.authService.setSessionData('rista-default_password', this.admindata.default_password);
            this.authService.setSessionData('rista-birthday', this.admindata.birthday);
            this.authService.setSessionData('rista-email_id', this.admindata.email_id);
            this.authService.setSessionData('rista-mobile', this.admindata.mobile);
            this.authService.setSessionData('rista-profile_url', this.admindata.profile_url);
            this.authService.setSessionData('rista-profile_thumb_url', this.admindata.profile_thumb_url);
            this.authService.setSessionData('rista-gender', this.admindata.gender);
            this.authService.setSessionData('rista-location', this.admindata.location);
            this.authService.setSessionData('rista-school_id', this.admindata.school_details[0].school_id);
            this.authService.setSessionData('rista-school_name', this.admindata.school_details[0].name);
            this.authService.setSessionData('rista-school_details', JSON.stringify(this.admindata.school_details));
            this.authService.setSessionData('rista-resourceAccess', false);
            this.authService.setSessionData('rista_data1', JSON.stringify(this.admindata.school_details[0]));
            this.loginService.changeHomePage(this.admindata.user_role);
            // this.authService.setSessionData('preview_type', 'no');
            this.loginService.changeHomePage(this.admindata.user_role);
            this.settingList();
            this.getTimeZone();
            this.searchFunction();
            // if (this.remember == true) {
            //     localStorage.setItem('type1', '1');
            //     localStorage.setItem('username', this.adminForm.controls.userName.value);
            //     localStorage.setItem('password', this.adminForm.controls.password.value);
            //     localStorage.setItem('checked', this.adminForm.controls.checkbox.value);
            // } else {
            //     localStorage.setItem('type1', '');
            //     localStorage.setItem('username', '');
            //     localStorage.setItem('password', '');
            //     localStorage.setItem('checked', '');
            // }
            if (this.admindata.tc_status == '0') {
                this.modalRef = this.modalService.open(this.updateContent);
            } else {
                if (this.admindata.school_details.length > 1) {
                    this.router.navigate(['/auth/select']);
                } else {
                    // this.toastr.success(successData.ResponseObject.message, 'Login');
                    setTimeout(() => {
                        this.admindata.school_details[0].allow_dashboard == '1' ? this.router.navigate(['/dashboard/default']) :
                            this.router.navigate(['/schedule/schedule-page']);
                    }, 700);
                    this.toastr.success(successData.ResponseObject.message, 'Login');
                }
            }
        } else {
            this.toastr.error(successData.ErrorObject, 'Login');
        }
    }

    settingList() {
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.authService.getSessionData('rista-roleid'),
            user_id: this.authService.getSessionData('rista-userid'),
            school_id: this.authService.getSessionData('rista-school_id'),
        };
        this.common.settingsDetails(data).subscribe( (successData) => {
                this.listSuccess(successData, data);
            },
            (error) => {
                this.listFailure(error);
            });
    }

    listSuccess(successData, data) {
        if (successData.IsSuccess) {
            this.settingData = successData.ResponseObject;
            this.authService.setSessionData('settingList', JSON.stringify(this.settingData));
            if (data.role_id != '5') {
                this.settingData.forEach((item) => {
                    if (item.name == 'date_format') {
                        this.behavior.changeDateFormat(item.date);
                    } else if (item.name == 'timezone') {
                        this.timeZoneList.forEach((list) => {
                            if (item.value == list.id) {
                                const split = list.time_zone.split('(');
                                this.behavior.changeTimeZone(split[0]);
                            }
                        });
                    }
                });
            }
            this.authService.setSessionData('settingList', JSON.stringify(this.settingData));
        }
    }

    listFailure(error) {
        console.log(error, 'error');
    }

    getTimeZone() {
        const data = {
            platform: 'web',
            role_id: this.authService.getSessionData('rista-roleid'),
            user_id: this.authService.getSessionData('rista-userid')
        };
        this.common.timeZone(data).subscribe((successData) => {
                this.timeZoneSuccess(successData);
            },
            (error) => {
                this.listFailure(error);
            });
    }

    timeZoneSuccess(successData) {
        if (successData.IsSuccess) {
            this.timeZoneList = successData.ResponseObject;
        }
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

    loginCreatorSuccess(successData) {
        this.creatorData = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.userId = this.creatorData.user_id;
            this.roleId = this.creatorData.user_role;
            this.authService.setToken(this.creatorData.user_id, this.creatorData.first_name, this.creatorData.last_name, this.creatorData.user_role, this.creatorData.Accesstoken);
            this.authService.setSessionData('rista-status', this.creatorData.status);
            this.authService.setSessionData('first_name', this.creatorData.first_name);
            this.authService.setSessionData('last_name', this.creatorData.last_name);
            this.authService.setSessionData('rista-default_password', this.creatorData.default_password);
            this.authService.setSessionData('rista-email_id', this.creatorData.email_id);
            this.authService.setSessionData('rista-mobile', this.creatorData.mobile);
            this.authService.setSessionData('rista-birthday', this.creatorData.birthday);
            this.authService.setSessionData('rista-profile_url', this.creatorData.profile_url);
            this.authService.setSessionData('rista-profile_thumb_url', this.creatorData.profile_thumb_url);
            this.authService.setSessionData('rista-gender', this.creatorData.gender);
            this.authService.setSessionData('rista-location', this.creatorData.location);
            this.authService.setSessionData('rista-school_id', this.creatorData.school_details[0].school_id);
            this.authService.setSessionData('rista-creator_id', this.creatorData.school_idno);
            this.authService.setSessionData('rista-address1', this.creatorData.address1);
            this.authService.setSessionData('rista-address2', this.creatorData.address2);
            this.authService.setSessionData('rista-city', this.creatorData.city);
            this.authService.setSessionData('rista-statename', this.creatorData.state_name);
            this.authService.setSessionData('rista-countryname', this.creatorData.country_name);
            this.authService.setSessionData('rista-country', this.creatorData.country);
            this.authService.setSessionData('rista-state', this.creatorData.state);
            this.authService.setSessionData('rista-schooldetails', this.creatorData.school_details[0].name);
            this.authService.setSessionData('rista-designation', this.creatorData.school_details[0].designation);
            this.authService.setSessionData('rista-school_profile_url', this.creatorData.school_details[0].profile_url);
            this.authService.setSessionData('rista-resourceAccess', false);
            this.behavior.changeDateFormat('MM/dd/yyyy');
            this.searchFunction();
            // this.authService.setSessionData('preview_type', 'no');
            // if (this.remember == true) {
            //     localStorage.setItem('type2', '2');
            //     localStorage.setItem('username1', this.contentForm.controls.userName.value);
            //     localStorage.setItem('password1', this.contentForm.controls.password.value);
            //     localStorage.setItem('checked1', this.contentForm.controls.checkbox1.value);
            // } else {
            //     localStorage.setItem('type2', '');
            //     localStorage.setItem('username1', '');
            //     localStorage.setItem('password1', '');
            //     localStorage.setItem('checked1', '');
            // }
            this.loginService.changeHomePage(this.creatorData.user_role);
            if (this.creatorData.tc_status == '0') {
                this.modalRef = this.modalService.open(this.updateContent);
            } else {
                if (this.creatorData.school_details.length > 1) {
                    this.router.navigate(['/auth/select']);
                } else {
                    this.router.navigate(['/repository/content-home']);
                }
                this.toastr.success(successData.ResponseObject.message, 'Login');
            }
        } else {
            this.toastr.error(successData.ErrorObject, 'Login');
        }
    }

    loginSchoolSuccess(successData) {
        this.teacherdata = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.userId = this.teacherdata.user_id;
            this.roleId = this.teacherdata.user_role;
            this.authService.setToken(this.teacherdata.user_id, this.teacherdata.first_name, this.teacherdata.last_name, this.teacherdata.user_role, this.teacherdata.Accesstoken);
            this.authService.setSessionData('rista-status', this.teacherdata.status);
            this.authService.setSessionData('rista-default_password', this.teacherdata.default_password);
            this.authService.setSessionData('rista-email_id', this.teacherdata.email_id);
            this.authService.setSessionData('rista-mobile', this.teacherdata.mobile);
            this.authService.setSessionData('rista-birthday', this.teacherdata.birthday);
            this.authService.setSessionData('rista-profile_url', this.teacherdata.profile_url);
            this.authService.setSessionData('rista-profile_thumb_url', this.teacherdata.profile_thumb_url);
            this.authService.setSessionData('rista-gender', this.teacherdata.gender);
            this.authService.setSessionData('rista-address1', this.teacherdata.address1);
            this.authService.setSessionData('rista-address2', this.teacherdata.address2);
            this.authService.setSessionData('rista-city', this.teacherdata.city);
            this.authService.setSessionData('rista-statename', this.teacherdata.state_name);
            this.authService.setSessionData('rista-countryname', this.teacherdata.country_name);
            this.authService.setSessionData('rista-country', this.teacherdata.country);
            this.authService.setSessionData('rista-state', this.teacherdata.state);
            this.authService.setSessionData('rista-resourceAccess', false);
            this.behavior.changeDateFormat('MM/dd/yyyy');
            ////Check Nav Permission////
            for (let i = 0; i < this.teacherdata.schoolDetails.length; i++) {
                for (let j = 0; j < this.teacherdata.schoolDetails[i].permissions.length; j++) {
                    this.teacherdata.schoolDetails[i].permissions[j].allowNav = false;
                    for (let k = 0; k < this.teacherdata.schoolDetails[i].permissions[j].permission.length; k++) {
                        if (this.teacherdata.schoolDetails[i].permissions[j].permission[k].status == 1) {
                            this.teacherdata.schoolDetails[i].permissions[j].allowNav = true;
                            break;
                        }
                    }
                }
            }
            this.authService.setSessionData('rista-school_details', JSON.stringify(this.teacherdata.schoolDetails));
            this.authService.setSessionData('rista_data1', JSON.stringify(this.teacherdata.schoolDetails[0]));
            this.authService.setSessionData('rista-school_id', this.teacherdata.schoolDetails[0].school_id);
            this.authService.setSessionData('rista-school_name', this.teacherdata.schoolDetails[0].name);
            this.authService.setSessionData('rista-teacher_type', this.teacherdata.schoolDetails[0].individual_teacher);
            this.authService.setSessionData('rista-school_profile', this.teacherdata.schoolDetails[0].profile_url);
            this.settingList();
            this.loginService.changeHomePage(this.teacherdata.user_role);
            this.searchFunction();
            this.getTimeZone();
            if (this.teacherdata.tc_status == '0') {
                this.modalRef = this.modalService.open(this.updateContent);
            } else {
                if (this.teacherdata.schoolDetails.length > 1) {
                    this.router.navigate(['/auth/select']);
                } else {
                    setTimeout(() => {
                        this.router.navigate(['/schedule/schedule-page']);
                    }, 700);
                    this.toastr.success(successData.ResponseObject.message, 'Login');
                }
            }
        } else {
            this.toastr.error(successData.ErrorObject, 'Login');
        }
    }

    loginStudentSuccess(successData) {
        this.studentdata = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.userId = this.studentdata.user_id;
            this.roleId = this.studentdata.user_role;
            this.authService.setToken(this.studentdata.user_id, this.studentdata.first_name, this.studentdata.last_name, this.studentdata.user_role, this.studentdata.Accesstoken);
            this.authService.setSessionData('rista-status', this.studentdata.status);
            this.authService.setSessionData('rista-default_password', this.studentdata.default_password);
            this.authService.setSessionData('rista-email_id', this.studentdata.email_id);
            this.authService.setSessionData('rista-mobile', this.studentdata.mobile);
            this.authService.setSessionData('rista-birthday', this.studentdata.birthday);
            this.authService.setSessionData('rista-profile_url', this.studentdata.profile_url);
            this.authService.setSessionData('rista-profile_thumb_url', this.studentdata.profile_thumb_url);
            this.authService.setSessionData('rista-gender', this.studentdata.gender);
            this.authService.setSessionData('rista-location', this.studentdata.location);
            this.loginService.changeHomePage(this.studentdata.user_role);
            this.behavior.changeDateFormat('MM/dd/yyyy');
            this.settingList();
            this.authService.setSessionData('rista-permission', JSON.stringify(this.studentdata.school_details));
            // this.loginService.changeHomePage(this.authService.getRoleId());
            this.authService.setSessionData('rista-school_details', JSON.stringify(this.studentdata.school_details));
            this.authService.setSessionData('rista_data1', JSON.stringify(this.studentdata.school_details[0]));
            this.authService.setSessionData('rista-school_id', this.studentdata.school_details[0].school_id);
            this.authService.setSessionData('rista-school_profile', this.studentdata.school_details[0].profile_url);
            this.authService.setSessionData('rista-school_name', this.studentdata.school_details[0].name);
            this.studentSearchFunction();
            setTimeout(() => {
                if (this.studentdata.tc_status == '0') {
                    this.modalRef = this.modalService.open(this.updateContent);
                } else {
                    if (this.studentdata.school_details.length > 1) {
                        this.router.navigate(['/auth/select']);
                    } else {
                        if (this.enrollCode != '') {
                            this.router.navigate(['/studentlogin/enrollclass']);
                        } else {
                            this.router.navigate(['/studentlogin/list-home']);
                        }
                    }
                    this.toastr.success(successData.ResponseObject.message, 'Login');
                }
            }, 700);

        } else {
            this.toastr.error(successData.ErrorObject, 'Login');
        }
    }

    loginCorporatesSuccess(successData) {
        const data = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.userId = data.user_id;
            this.roleId = data.role_id;
            this.corporateId = data.corporate_id;
            this.authService.setToken(data.user_id, data.first_name, data.last_name, data.role_id, data.Accesstoken);
            this.authService.setSessionData('first_name', data.first_name);
            this.authService.setSessionData('last_name', data.last_name);
            this.authService.setSessionData('rista-email_id', data.email_id);
            this.authService.setSessionData('rista-mobile', data.mobile);
            this.authService.setSessionData('rista-corporate_id', data.corporate_id);
            this.authService.setSessionData('rista-corporate_code', data.corporate_code);
            this.authService.setSessionData('rista-corporate_name', data.corporate_name);
            this.authService.setSessionData('rista-school_profile', data.profile_url);
            this.authService.setSessionData('rista-profile_url', data.profile_url);
            this.authService.setSessionData('rista-resourceAccess', false);
            this.behavior.changeDateFormat('MM/dd/yyyy');
            this.loginService.changeHomePage(data.role_id);
            this.searchFunction();
            this.schoolList();
            this.toastr.success('Logged in Successfully', 'Login');
        } else {
            this.toastr.error(successData.ErrorObject, 'Login');
        }
    }

    loginGraderSuccess(successData) {
        this.gradedata = successData.ResponseObject;
        console.log(this.gradedata, 'gradedata');
        if (successData.IsSuccess) {
            this.userId = this.gradedata.user_id;
            this.roleId = this.gradedata.user_role;
            this.authService.setToken(this.gradedata.user_id, this.gradedata.first_name, this.gradedata.last_name, this.gradedata.user_role, this.gradedata.Accesstoken);
            this.authService.setSessionData('rista-status', this.gradedata.status);
            this.authService.setSessionData('rista-default_password', this.gradedata.default_password);
            this.authService.setSessionData('rista-email_id', this.gradedata.email_id);
            this.authService.setSessionData('rista-mobile', this.gradedata.mobile);
            this.authService.setSessionData('rista-birthday', this.gradedata.birthday);
            this.authService.setSessionData('rista-profile_url', this.gradedata.profile_url);
            this.authService.setSessionData('rista-profile_thumb_url', this.gradedata.profile_thumb_url);
            this.authService.setSessionData('rista-gender', this.gradedata.gender);
            this.authService.setSessionData('rista-location', this.gradedata.location);
            this.behavior.changeDateFormat('MM/dd/yyyy');
            // this.authService.setSessionData('preview_type', 'no');
            this.searchFunction();
            // if (this.remember == true) {
            //     localStorage.setItem('type7', '7');
            //     localStorage.setItem('username7', this.graderForm.controls.userName.value);
            //     localStorage.setItem('password7', this.graderForm.controls.password.value);
            //     localStorage.setItem('checked7', this.graderForm.controls.checkbox7.value);
            // } else {
            //     localStorage.setItem('type7', '');
            //     localStorage.setItem('username7', ''

            ////Check Nav Permission////
            for (let i = 0; i < this.gradedata.schoolDetails.length; i++) {
                for (let j = 0; j < this.gradedata.schoolDetails[i].permissions.length; j++) {
                    this.gradedata.schoolDetails[i].permissions[j].allowNav = false;
                    for (let k = 0; k < this.gradedata.schoolDetails[i].permissions[j].permission.length; k++) {
                        if (this.gradedata.schoolDetails[i].permissions[j].permission[k].status == 1) {
                            this.gradedata.schoolDetails[i].permissions[j].allowNav = true;
                            break;
                        }
                    }
                }
            }
            this.authService.setSessionData('rista-school_details', JSON.stringify(this.gradedata.schoolDetails));
            this.authService.setSessionData('rista_data1', JSON.stringify(this.gradedata.schoolDetails[0]));
            this.authService.setSessionData('rista-school_id', this.gradedata.schoolDetails[0].school_id);
            this.authService.setSessionData('rista-school_name', this.gradedata.schoolDetails[0].name);
            this.authService.setSessionData('rista-teacher_type', this.gradedata.schoolDetails[0].individual_teacher);
            this.authService.setSessionData('rista-school_profile', this.gradedata.schoolDetails[0].profile_url);
            this.loginService.changeHomePage(this.gradedata.user_role);
            this.searchFunction();
            this.loginService.changeHomePage(this.gradedata.user_role);
            this.gradedata.schoolDetails > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/student-content/list-content/old']);
            this.toastr.success(successData.ResponseObject.message);
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    schoolList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.roleId ? this.roleId : '',
            user_id: this.userId ? this.userId : '',
            corporate_id: this.corporateId ? this.corporateId : ''
        };
        this.schoolService.getSchoolList(data).subscribe((successData) => {
                this.schoolListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_schoolList');
            });
    }

    schoolListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.schoolData = successData.ResponseObject;
            this.authService.setSessionData('rista-school_details', JSON.stringify(this.schoolData));
            this.authService.setSessionData('rista_data1', this.schoolData.length != 0 ?
                JSON.stringify(this.schoolData[this.schoolData.length - 1]) : JSON.stringify(this.schoolData));
            this.authService.setSessionData('rista-school_id', this.schoolData.length != 0 ?
                this.schoolData[this.schoolData.length - 1]?.school_id : '');
            this.authService.setSessionData('rista-school_profile', this.schoolData.length != 0 ?
                this.schoolData[this.schoolData.length - 1]?.profile_url : '');
            this.authService.setSessionData('rista-profile_url', this.schoolData.length != 0 ?
                this.schoolData[this.schoolData.length - 1]?.profile_url : '');
            this.authService.setSessionData('rista-school_name', this.schoolData.length != 0 ?
                this.schoolData[this.schoolData.length - 1]?.name : '');
            this.schoolData.length > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/dashboard/default']);
            this.searchFunction();
        }
    }

    confirmtermDetails() {
        const data = {
            platform: 'web',
            role_id: this.roleId ? this.roleId : '',
            user_id: this.userId ? this.userId : '',
            status: this.checkterms ? '1' : '0',
        };
        this.loginService.tcUpdateList(data).subscribe((successData) => {
                this.getTcListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_TermLists');
            });
    }

    getTcListSuccess(successData) {
        this.modalRef.close();
        this.toastr.success('Logged in Successfully', 'Login');
        if (this.roleId == '2') {
            if (this.admindata.school_details.length > 1) {
                this.router.navigate(['/auth/select']);
            } else {
                this.admindata.school_details[0].allow_dashboard == '1' ? this.router.navigate(['/dashboard/default']) :
                    this.router.navigate(['/class/list-class']);
            }
        } else if (this.roleId == '3') {
            this.creatorData.school_details.length > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/repository/content-home']);
        } else if (this.roleId == '4') {
            this.teacherdata.schoolDetails.length > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/schedule/schedule-page']);
        } else if (this.roleId == '5') {
            if (this.enrollCode != '') {
                this.router.navigate(['/studentlogin/enrollclass']);
            } else {
                this.studentdata.school_details.length > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/studentlogin/list-home']);
            }
        } else if (this.roleId == '7') {
            this.gradedata.schoolDetails.length > 1 ? this.router.navigate(['/auth/select']) : this.router.navigate(['/student-content/list-content/old']);
        }
    }

    searchFunction() {
        const classSearchData = [{
            curriculum_Folder: undefined,
            grade: [],
            subject: [],
            teacher: null,
            className: '',
            studentName: '',
            classDateStatus: '3',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.classSearch, JSON.stringify(classSearchData));

        const assignmentData = [{
            curriculum_Folder: undefined,
            teacher: undefined,
            className: '',
            assignmentDateStatus: 2,
            studentName: '',
            assignmentName: '',
            sortType: 1,
            sortButton: 'Sort by',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.assignSearch, JSON.stringify(assignmentData));

        const assessmentData = [{
            curriculum_Folder: undefined,
            teacher: undefined,
            className: '',
            assessmentDateStatus: 2,
            assessmentName: '',
            studentName: '',
            sortType: 1,
            sortButton: 'Sort by',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.assessSearch, JSON.stringify(assessmentData));

        const studentWorkData = [{
            curriculum_Folder: undefined,
            teacher: undefined,
            class: undefined,
            contentType: 2,
            studentName: '',
            contentName: '',
            date: '',
            teacherCorrectionStatus: '0',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentWorkSearch, JSON.stringify(studentWorkData));

        const directContentData = [{
            contentName: '',
            extact_Search: false,
            libary: '0',
            content_userid: '0',
            sortFilter: '0',
            type_id: 'list',
            grade_id: [],
            subject_id: [],
            tag_id: [],
            selectAuthored: '',
            selectDraft: '',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.directcontentSearch, JSON.stringify(directContentData));

        const contentData = [{
            contentName: '',
            extact_Search: false,
            libary: '0',
            content_userid: '0',
            sortFilter: '0',
            type_id: 'list',
            grade_id: [],
            subject_id: [],
            tag_id: [],
            selectAuthored: '',
            selectDraft: '',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.non_directcontentSearch, JSON.stringify(contentData));
    }

    studentSearchFunction() {
        const classSearchData = [{
            className: '',
            classDateStatus: '3',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentClassSearch, JSON.stringify(classSearchData));

        const resourceData = [{
            resourceName: '',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentResourceSearch, JSON.stringify(resourceData));

        const assignmentData = [{
            assignmentDateStatus: 3,
            assignmentName: '',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentAssignmentSearch, JSON.stringify(assignmentData));

        const assessmentData = [{
            assessmentDateStatus: 3,
            assessmentName: '',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentAssessmentSearch, JSON.stringify(assessmentData));

        const homeData = [{

            // Class Data //
            classDateStatus: '3',
            className: '',
            classButton: 'In Progress',
            classSortType: '0',
            classSortButton: 'Sort',

            // Assignment Data //
            assignmentDateStatus: '3',
            assignmentName: '',
            assignButton: 'In Progress',
            assignSortType: '0',
            assignSortButton: 'Sort',

            // Assessment Data //
            assessmentDateStatus: '3',
            assessmentName: '',
            assessButton: 'In Progress',
            assessSortButton: 'Sort',
            assessSortType: '0',
            school_id: this.authService.getSessionData('rista-school_id')
        }];
        this.authService.setSessionData(SessionConstants.studentHomeSearch, JSON.stringify(homeData));
    }

    goToRegister(value) {
        this.type = value;
        this.router.navigate(['/auth/login/' + '' + value]);
    }

    checkPasswords() {
        const pass = this.registerForm.controls.password.value;
        const confirmPass = this.registerForm.controls.confirmpassword.value;
        this.passwordValid = pass !== confirmPass;
        return this.passwordValid;
    }

    submitRegisterForm() {
        if (this.registerForm.get('email_id').value == '' || this.registerForm.get('password').value == '' || this.registerForm.get('first_name').value == '' || this.registerForm.get('last_name').value == '' ||
            this.registerForm.get('gender').value == '' || this.registerForm.get('confirmpassword').value == '') {
            this.validation.validateAllFormFields(this.registerForm);
            this.toastr.error('Please fill all mandatory field');
        } else {
            const data = {
                platform: 'web',
                class_code: this.enrollCode,
                email_id: this.registerForm.controls.email_id.value,
                password: this.registerForm.controls.password.value,
                first_name: this.registerForm.controls.first_name.value,
                last_name: this.registerForm.controls.last_name.value,
                gender: this.registerForm.controls.gender.value,
                role_id: '5',
                mobile: [this.registerForm.controls.mobile.value],
                grade_id: this.registerForm.controls.grade_id.value ? this.registerForm.controls.grade_id.value : ''
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

    enrollRegisterClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.registerResponse = successData.ResponseObject;
            if (successData.IsSuccess) {
                this.userId = this.registerResponse.user_id;
                this.roleId = this.registerResponse.user_role;
                this.authService.setToken(this.registerResponse.user_id, this.registerResponse.first_name, this.registerResponse.last_name, this.registerResponse.user_role, this.registerResponse.Accesstoken);
                this.authService.setSessionData('rista-status', this.registerResponse.status);
                this.authService.setSessionData('rista-default_password', this.registerResponse.default_password);
                this.authService.setSessionData('rista-email_id', this.registerResponse.email_id);
                this.authService.setSessionData('rista-mobile', this.registerResponse.mobile);
                this.authService.setSessionData('rista-birthday', this.registerResponse.birthday);
                this.authService.setSessionData('rista-profile_url', this.registerResponse.profile_url);
                this.authService.setSessionData('rista-profile_thumb_url', this.registerResponse.profile_thumb_url);
                this.authService.setSessionData('rista-gender', this.registerResponse.gender);
                this.authService.setSessionData('rista-location', this.registerResponse.location);
                this.loginService.changeHomePage(this.registerResponse.user_role);
                this.behavior.changeDateFormat('MM/dd/yyyy');
                this.setRemeberMe(this.remember);
                // if (this.remember == true) {
                //     localStorage.setItem('type4', '4');
                //     localStorage.setItem('username3', this.studentForm.controls.userName.value);
                //     localStorage.setItem('password3', this.studentForm.controls.password.value);
                //     localStorage.setItem('checked3', this.studentForm.controls.checkbox3.value);
                // } else {
                //     localStorage.setItem('type4', '');
                //     localStorage.setItem('username3', '');
                //     localStorage.setItem('password3', '');
                //     localStorage.setItem('checked3', '');
                // }
                this.authService.setSessionData('rista-permission', JSON.stringify(this.registerResponse.school_details));
                // this.loginService.changeHomePage(this.authService.getRoleId());
                this.authService.setSessionData('rista-school_details', JSON.stringify(this.registerResponse.school_details));
                this.authService.setSessionData('rista_data1', JSON.stringify(this.registerResponse.school_details[0]));
                this.authService.setSessionData('rista-school_id', this.registerResponse.school_details[0].school_id);
                this.authService.setSessionData('rista-school_profile', this.registerResponse.school_details[0].profile_url);
                this.authService.setSessionData('rista-school_name', this.registerResponse.school_details[0].name);
                this.authService.setSessionData('rista-teacher_id', this.registerResponse.school_details[0].school_idno);
                this.studentSearchFunction();
                localStorage.setItem('studentClassCode', this.registerResponse.class_code);
                this.settingList();
                setTimeout(() => {
                    if (this.registerResponse.tc_status == '0') {
                        this.modalRef = this.modalService.open(this.updateContent);
                    }
                    if (this.registerResponse.class_code != '') {
                        this.router.navigate(['/studentlogin/enrollclass']);
                    } else {
                        if (this.registerResponse.school_details > 1) {
                            this.router.navigate(['/auth/select']);
                        } else {
                            this.router.navigate(['/studentlogin/list-home']);
                        }
                        this.toastr.success(successData.ResponseObject.message, 'Login');
                    }
                }, 700);
            } else {
                this.toastr.error(successData.ErrorObject, 'Login');
            }
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
            mobile: '',
            grade_id: [null, Validators.required],
            email_id: ['', Validators.required],
            password: ['', Validators.required],
            confirmpassword: ''
        });
    }
}

