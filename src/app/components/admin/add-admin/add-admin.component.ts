import {Component, ElementRef, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {CommonService} from '../../../shared/service/common.service';
import {DatePipe} from '@angular/common';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {AdminService} from '../../../shared/service/admin.service';
import {SchoolService} from '../../../shared/service/School.service';
import {dateOptions} from "../../../shared/data/config";


@Component({
    selector: 'app-add-category',
    templateUrl: './add-admin.component.html',
    styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit, OnDestroy {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        disableSince: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() + 1
        },
    };
    public adminForm: FormGroup;
    public type: any;
    public editData: any;
    public selectedSchool: any;
    public schoolData: any;
    public allowDropDown: boolean;
    public showSchoolSearch: boolean;
    public schoolid: any;

    @ViewChild('myInput') myInputVariable: ElementRef<any>;

    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public commondata: CommonDataService, private toastr: ToastrService,
                public auth: AuthService, public brandservices: SchoolService,
                public router: Router, public validationService: ValidationService, public adminService: AdminService,
                public config: ConfigurationService, public common: CommonService, public datePipe: DatePipe, public newSubject: NewsubjectService) {
        this.route.params.forEach((params) => {
            this.type = params.type;
        });

        this.adminForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email_id: ['', Validators.required],
            mobile: ['', Validators.required],
            schoolId: ['', Validators.required],
            status: '1',
            gender: '',
            dob: '',
            allowDash: '',
        });

        this.newSubject.schoolChange.subscribe((params) => {
            if (params != '') {
                if (this.router.url.includes('create-admin/add')) {
                    this.init(params);
                } else if (this.router.url.includes('create-admin/edit')) {
                    this.init(params);
                }
            } else {
                this.init(params);
            }
        });

        if (this.type == 'edit') {
            this.editData = JSON.parse(this.auth.getSessionData('editAdmin'));
            this.adminForm.controls.firstName.patchValue(this.editData.first_name);
            this.adminForm.controls.lastName.patchValue(this.editData.last_name);
            this.adminForm.controls.email_id.patchValue(this.editData.email_id);
            this.adminForm.controls.mobile.patchValue(this.editData.mobile);
            this.adminForm.controls.schoolId.patchValue(this.editData.school_id);
            this.editData.allow_dashboard == '1' ? this.adminForm.controls.allowDash.patchValue(true) :
                this.adminForm.controls.allowDash.patchValue(false);
            if (this.editData.status == 'Active') {
                this.adminForm.controls.status.patchValue(1);
            } else if (this.editData.status == 'Inactive') {
                this.adminForm.controls.status.patchValue(2);
            }
            if (this.editData.status == 'Suspended') {
                this.adminForm.controls.status.patchValue(3);
            } else if (this.editData.status == 'Deleted') {
                this.adminForm.controls.status.patchValue(4);
            }
            this.adminForm.controls.gender.patchValue(this.editData.gender);
            if (this.editData.birthday != '0000-00-00') {
                const ed = this.editData.birthday.split('-');
                const edObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(ed[0]), parseInt(ed[1]) - 1, parseInt(ed[2]))},
                    dateRange: null
                };
                this.adminForm.controls.dob.patchValue(edObject);
            } else {
                this.adminForm.controls.dob.patchValue(null);
            }
        } else {
            this.adminForm.reset();
            let schoolid: any = [];
            schoolid = [this.schoolid];
            if (this.schoolid == 0) {
                this.adminForm.controls.schoolId.patchValue(null);
            } else {
                this.adminForm.controls.schoolId.patchValue(schoolid);
            }
            this.adminForm.controls.firstName.patchValue('');
            this.adminForm.controls.lastName.patchValue('');
            this.adminForm.controls.email_id.patchValue('');
            this.adminForm.controls.mobile.patchValue('');
            this.adminForm.controls.status.patchValue('1');
            this.adminForm.controls.gender.patchValue('');
            this.adminForm.controls.dob.patchValue(null);
            this.adminForm.controls.allowDash.patchValue('');
        }
    }

    ngOnInit() {
        this.commondata.showLoader(false);
        // this.schoolList();
        this.allowDropDown = true;
        this.newSubject.allowSchoolChange(this.allowDropDown);

    }

    ngOnDestroy() {
        this.allowDropDown = false;
        this.newSubject.allowSchoolChange(this.allowDropDown);
    }

    public datePattern(event: any) {
        this.validationService.dateValidation(event);
    }

    init(data) {
        this.schoolid = this.auth.getSessionData('rista-school_id');
        if (this.schoolid != 0) {
            this.schoolList();
            this.adminForm.controls.schoolId.patchValue(this.schoolid);
        } else {
            this.adminForm.controls.schoolId.patchValue(null);
            this.schoolList();
        }
    }

    addAdmin(value) {
        if (this.adminForm.valid) {
            this.commondata.showLoader(true);
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                first_name: this.adminForm.controls.firstName.value,
                last_name: this.adminForm.controls.lastName.value,
                email_id: this.adminForm.controls.email_id.value,
                mobile: this.adminForm.controls.mobile.value,
                selected_school_id: this.adminForm.controls.schoolId.value,
                status: this.adminForm.controls.status.value,
                birthday: this.adminForm.controls.dob.value == null ? '' : this.datePipe.transform(this.adminForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
                gender: this.adminForm.controls.gender.value,
                allow_dashboard: this.adminForm.controls.allowDash.value == true ? '1' : '0'
            };
            if (value == 'add') {
                this.adminService.adminAdd(data).subscribe((successData) => {
                        this.addAdminSuccess(successData);
                    },
                    (error) => {
                        this.addAdminFailure(error);
                    });
            } else if (value == 'edit') {
                data['selected_user_id'] = this.editData.user_id,
                    this.adminService.adminEdit(data).subscribe((successData) => {
                            this.addAdminSuccess(successData);
                        },
                        (error) => {
                            this.addAdminFailure(error);
                        });
            }
        } else {
            this.validationService.validateAllFormFields(this.adminForm);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    addAdminSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.toastr.success(successData.ResponseObject, 'Admin');
            this.router.navigate(['/users/user-list']);
        } else {
            this.commondata.showLoader(false);
            this.toastr.error(successData.ErrorObject, 'Admin');
        }
    }

    addAdminFailure(error) {
        this.commondata.showLoader(false);
        this.toastr.error(error.ResponseObject, 'Admin');
    }

    public numberPattern(event: any) {
        this.validationService.numberValidate1(event);
    }

    schoolList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            type: this.type == 'add' ? 'active' : 'inactive'
        };
        this.brandservices.getSchoolList(data).subscribe((successData) => {
                this.schoolListSuccess(successData);
            },
            (error) => {
                this.schoolListFailure(error);
            });
    }

    schoolListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.schoolData = successData.ResponseObject;
            this.selectedSchool = [];
            for (let i = 0; i < this.schoolData.length; i++) {
                this.selectedSchool.push({id: this.schoolData[i].school_id, name: this.schoolData[i].school_name});
            }

        }
    }

    schoolListFailure(error) {
        this.commondata.showLoader(false);
    }

    onDateChanged(event: IMyDateModel): void {

    }
}
