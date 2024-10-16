import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {TeacherService} from '../../../shared/service/teacher.service';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {StudentService} from '../../../shared/service/student.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {dateOptions, timeZone} from '../../../shared/data/config';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-Teacher.component.html',
    styleUrls: ['./add-Teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
    public setDate = new Date().toLocaleString('en-US', {timeZone: timeZone.location});
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getMonth() + 1 : new Date(this.setDate).getMonth(),
            day: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getDate() - 1 : new Date(this.setDate).getMonth() === (1 || 3 || 5 || 7 || 8 || 10 || 12) ? 31 : new Date(this.setDate).getMonth() === 2 ? 28 : 30,
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableSince: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() + 1
        },
    };
    public teacherForm: FormGroup;
    public type: any;
    public editData: any;
    public recordBase64Url: any;
    public stateListData: any;
    public countryListData: any;
    public imagepath: any;
    public imagepaththumb: any;
    public selectedSchool: any;
    public schoolData: any;
    public webhost: any;
    public doj: any;
    public dob: any;
    public teacherPermission: any;
    public gradeData: any;
    public subjectData: any;
    public schoolId: any;
    public allowSelect: boolean;
    public mask = {
        guide: false,
        showMask: false,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };

    @ViewChild('myInput') myInputVariable: ElementRef<any>;

    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder,
                public commondata: CommonDataService, private toastr: ToastrService, public newSubject: NewsubjectService,
                public auth: AuthService, public router: Router, public validationService: ValidationService, public teacherService: TeacherService,
                public common: CommonService, public brandservices: SchoolService, public sanitizer: DomSanitizer, public student: StudentService, public config: ConfigurationService, public datePipe: DatePipe) {
        this.webhost = this.config.getimgUrl();
        this.route.params.forEach((params) => {
            this.type = params.type;
        });


        this.imagepath = [];
        this.imagepaththumb = [];
        this.teacherForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email_id: ['', Validators.required],
            mobile: ['', Validators.required],
            schoolId: ['', Validators.required],
            subject: '',
            grade: '',
            teacherId: [''],
            Designation: '',
            doj: '',
            dob: '',
            gender: '',
            address1: '',
            address2: '',
            city: '',
            state: '0',
            country: '231',
            postalCode: '',
            status: '1',
            addStudent: '',
            updateStudent: '',
            displayEmailId: '',
            addContent: '',
            updateContent: '',
            addSubject: '',
            updateSubject: '',
            addBooks: '',
            updateBooks: '',
            addContents: '',
            updateContents: '',
            addRoom: '',
            updateRoom: '',
            addClass: '',
            addCurriculum: '',
            updateClass: '',
            updateCompletedClass: '',
            transferClass: '',
            selectAll: '',
        });
        this.newSubject.schoolChange.subscribe(params => {
            if (params != '') {
                if (this.router.url.includes('create-Teacher')) {
                    this.init(params);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
        });

        this.imagepath = [];
        this.imagepaththumb = [];


        if (this.type == 'edit') {
            this.allowSelect = true;
            this.newSubject.allowSchoolChange(this.allowSelect);
            this.editData = JSON.parse(this.auth.getSessionData('editTeacher'));
            this.teacherForm.controls.firstName.patchValue(this.editData.first_name);
            this.teacherForm.controls.lastName.patchValue(this.editData.last_name);
            this.teacherForm.controls.email_id.patchValue(this.editData.email_id);
            this.teacherForm.controls.mobile.patchValue(this.editData.mobile);
            this.teacherForm.controls.schoolId.patchValue(this.editData.school_name);
            this.teacherForm.controls.teacherId.patchValue(this.editData.school_idno);
            this.teacherForm.controls.Designation.patchValue(this.editData.designation);
            if (this.editData.gender != null) {
                this.teacherForm.controls.gender.patchValue(this.editData.gender.toLowerCase().trim());
            }
            this.teacherForm.controls.address1.patchValue(this.editData.address1);
            this.teacherForm.controls.address2.patchValue(this.editData.address2);
            this.teacherForm.controls.city.patchValue(this.editData.city);
            this.teacherForm.controls.country.patchValue(this.editData.country);
            this.teacherForm.controls.postalCode.patchValue(this.editData.postal_code);
            // this.teacherForm.controls.grade.patchValue(this.editData.grade_id);

            if (this.editData.grade_id == '0') {
                this.teacherForm.controls.grade.patchValue(null);
            } else {
                this.teacherForm.controls.grade.patchValue(this.editData.grade_id);
            }
            if (this.editData.subject == '0') {
                this.teacherForm.controls.subject.patchValue(null);
            } else {
                this.teacherForm.controls.subject.patchValue(this.editData.subject);
            }
            if (this.editData.status == 'Active') {
                this.teacherForm.controls.status.patchValue(1);
            } else if (this.editData.status == 'Inactive') {
                this.teacherForm.controls.status.patchValue(2);
            } else if (this.editData.status == 'Suspended') {
                this.teacherForm.controls.status.patchValue(3);
            } else if (this.editData.status == 'Deleted') {
                this.teacherForm.controls.status.patchValue(4);
            }
            if (this.editData.doj != '0000-00-00' && this.editData.doj != null) {
                const dob = this.editData.doj.split('-');
                const dobObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(dob[0]), parseInt(dob[1]) - 1, parseInt(dob[2]))},
                    dateRange: null
                };
                this.teacherForm.controls.doj.patchValue(dobObject);
            } else {
                this.teacherForm.controls.doj.patchValue(null);
            }
            if (this.editData.birthday != '0000-00-00' && this.editData.birthday != null && this.editData.birthday != '') {
                const dob1 = this.editData.birthday.split('-');
                const dobObject1: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(dob1[0]), parseInt(dob1[1]) - 1, parseInt(dob1[2]))},
                    dateRange: null
                };
                this.teacherForm.controls.dob.patchValue(dobObject1);
            } else {
                this.teacherForm.controls.dob.patchValue(null);
            }
            if (this.editData.profile_url != '') {
                this.imagepath.push(this.editData.profile_url);
            }
            this.imagepaththumb.push(this.editData.profile_thumb_url);
            this.PermissionTeacher(this.editData.user_id);
        } else {
            this.allowSelect = false;
            this.newSubject.allowSchoolChange(this.allowSelect);
            this.teacherForm.reset();
            this.teacherForm.controls.schoolId.patchValue(this.auth.getSessionData('rista-school_name'));
            this.teacherForm.controls.country.patchValue('231');
            this.teacherForm.controls.status.patchValue('1');
            this.teacherForm.controls.gender.patchValue('');
            this.imagepath = [];
            this.imagepaththumb = [];
            this.stateList('231');
        }

    }

    onDateChanged(event: IMyDateModel): void {
    }

    ngOnInit() {
        this.commondata.showLoader(false);

    }

    list(value) {
        console.log(value, 'value');
    }

    public datePattern(event: any) {
        this.validationService.dateValidation(event);
    }

    init(id) {
        this.teacherForm.controls.subject.patchValue(null);
        this.teacherForm.controls.grade.patchValue(null);
        this.schoolId = id;
        this.countryList();
        this.gradeList();
        this.subjectList();
    }

    addTeacher(value) {
        if (this.teacherForm.valid) {
            this.commondata.showLoader(true);
            let data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                first_name: this.teacherForm.controls.firstName.value,
                last_name: this.teacherForm.controls.lastName.value,
                email_id: this.teacherForm.controls.email_id.value,
                mobile: this.teacherForm.controls.mobile.value,
                school_id: this.schoolId,
                school_idno: this.teacherForm.controls.teacherId.value == null ? '' : this.teacherForm.controls.teacherId.value,
                designation: this.teacherForm.controls.Designation.value,
                doj: this.teacherForm.controls.doj.value == null ? '' : this.datePipe.transform(this.teacherForm.controls.doj.value.singleDate.jsDate, 'yyyy-MM-dd'),
                birthday: this.teacherForm.controls.dob.value == null ? '' : this.datePipe.transform(this.teacherForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
                gender: this.teacherForm.controls.gender.value,
                address1: this.teacherForm.controls.address1.value,
                address2: this.teacherForm.controls.address2.value == null ? '' : this.teacherForm.controls.address2.value,
                city: this.teacherForm.controls.city.value,
                state: this.teacherForm.controls.state.value == null ? '' : this.teacherForm.controls.state.value,
                country: this.teacherForm.controls.country.value,
                postal_code: this.teacherForm.controls.postalCode.value,
                status: this.teacherForm.controls.status.value,
                subject: this.teacherForm.controls.subject.value,
                grade: this.teacherForm.controls.grade.value,
                profile_url: this.imagepath.toString(),
                profile_thumb_url: this.imagepaththumb.toString(),
                permission: [{
                    group_id: 1,
                    group_name: 'Student',
                    permission: [{
                        id: 1,
                        status: this.teacherForm.controls.addStudent.value == true ? 1 : 0
                    }, {
                        id: 2,
                        status: this.teacherForm.controls.updateStudent.value == true ? 1 : 0
                    }, {
                        id: 3,
                        status: (this.teacherForm.controls.addStudent.value == true || this.teacherForm.controls.updateStudent.value == true) ? 1 : 0
                    }, {
                        id: 32,
                        status: this.teacherForm.controls.displayEmailId.value ? 1 : 0
                    }]
                }, {
                    group_id: 2,
                    group_name: 'Content-Creator',
                    permission: [{
                        id: 5,
                        status: this.teacherForm.controls.addContent.value == true ? 1 : 0
                    }, {
                        id: 6,
                        status: this.teacherForm.controls.updateContent.value == true ? 1 : 0
                    }, {
                        id: 7,
                        status: (this.teacherForm.controls.addContent.value == true || this.teacherForm.controls.updateContent.value == true) ? 1 : 0
                    }]
                }, {
                    group_id: 3,
                    group_name: 'Subject',
                    permission: [{
                        id: 9,
                        status: this.teacherForm.controls.addSubject.value == true ? 1 : 0
                    }, {
                        id: 10,
                        status: this.teacherForm.controls.updateSubject.value == true ? 1 : 0
                    }, {
                        id: 11,
                        status: (this.teacherForm.controls.addSubject.value == true || this.teacherForm.controls.updateSubject.value == true) ? 1 : 0
                    }]
                }, {
                    group_id: 4,
                    group_name: 'Book',
                    permission: [{
                        id: 13,
                        status: this.teacherForm.controls.addBooks.value == true ? 1 : 0
                    }, {
                        id: 14,
                        status: this.teacherForm.controls.updateBooks.value == true ? 1 : 0
                    }, {
                        id: 15,
                        status: (this.teacherForm.controls.addBooks.value == true || this.teacherForm.controls.updateBooks.value == true) ? 1 : 0
                    }]
                }, {
                    group_id: 5,
                    group_name: 'Content',
                    permission: [{
                        id: 17,
                        status: this.teacherForm.controls.addContents.value == true ? 1 : 0
                    }, {
                        id: 18,
                        status: this.teacherForm.controls.updateContents.value == true ? 1 : 0
                    }, {
                        id: 19,
                        status: (this.teacherForm.controls.addContents.value == true || this.teacherForm.controls.updateContents.value == true) ? 1 : 0
                    }]
                }, {
                    group_id: 6,
                    group_name: 'Content Folder',
                    permission: [{
                        id: 21,
                        status: this.teacherForm.controls.addRoom.value == true ? 1 : 0
                    }, {
                        id: 23,
                        status: this.teacherForm.controls.updateRoom.value == true ? 1 : 0
                    }, {
                        id: 22,
                        status: (this.teacherForm.controls.addRoom.value == true || this.teacherForm.controls.updateRoom.value == true) ? 1 : 0
                    }]
                }, {
                    group_id: 7,
                    group_name: 'Classes',
                    permission: [{
                        id: 25,
                        status: this.teacherForm.controls.addClass.value == true ? 1 : 0
                    }, {
                        id: 27,
                        status: this.teacherForm.controls.updateClass.value == true ? 1 : 0
                    }, {
                        id: 26,
                        status: (this.teacherForm.controls.addClass.value == true || this.teacherForm.controls.updateClass.value == true) ? 1 : 0
                    }, {
                        id: 29,
                        status: this.teacherForm.controls.addCurriculum.value == true ? 1 : 0
                    }, {
                        id: 31,
                        status: this.teacherForm.controls.updateCompletedClass.value == true ? 1 : 0
                    }]
                }, {
                    group_id: 8,
                    group_name: 'Transfer Class',
                    permission: [{
                        id: 30,
                        status: this.teacherForm.controls.transferClass.value == true ? 1 : 0
                    }]
                }
                ]
            };
            if (value == 'add') {
                this.teacherService.teacherAdd(data).subscribe((successData) => {
                        this.addTeacherSuccess(successData);
                    },
                    (error) => {
                        this.addTeacherFailure(error);
                    });
            } else if (value == 'edit') {
                data['selected_user_id'] = this.editData.user_id;
                this.teacherService.teacherEdit(data).subscribe((successData) => {
                        this.addTeacherSuccess(successData);
                    },
                    (error) => {
                        this.addTeacherFailure(error);
                    });
            }
        } else {
            this.validationService.validateAllFormFields(this.teacherForm);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    addTeacherSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.toastr.success(successData.ResponseObject, 'Teacher');
            this.router.navigate(['/users/user-list']);
        } else {
            this.commondata.showLoader(false);
            this.toastr.error(successData.ErrorObject, '');
        }
    }

    addTeacherFailure(error) {
        console.log(error, 'error');
        this.commondata.showLoader(false);
        this.toastr.error(error.ResponseObject, 'Teacher');
    }

    public numberPattern(event: any) {
        this.validationService.numberValidate1(event);
    }

    encodeImageFileAsURL(event: any) {
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const imgDetails = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const url = event.target.result;
                const getUrl = url.split(',');
                const pic = imgDetails.type.split('/');
                if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] == 'jpg') {
                    this.onUploadKYCFinished(getUrl, imgDetails);
                } else {
                    this.toastr.error('JPEG ,PNG & JPG are the required type');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }
    }

    onUploadKYCFinished(getUrlEdu, imageList) {
        this.recordBase64Url = getUrlEdu[1];
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: [{
                image: this.recordBase64Url,
                size: imageList.size,
                type: imageList.type,
                name: imageList.name
            }],
            uploadtype: 'teacher'
        };
        this.commondata.showLoader(true);
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.uploadSuccess(successData);
            },
            (error) => {
                this.uploadFailure(error);
            }
        );
    }

    uploadSuccess(successData) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.imagepath = [];
            this.imagepaththumb = [];
            console.log(successData.ResponseObject.imagepath, 'ImageUpload');
            this.imagepath.push(successData.ResponseObject.imagepath[0].original_image_url);
            this.imagepaththumb.push(successData.ResponseObject.imagepath[0].resized_url);
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    uploadFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    deleteImg() {
        this.imagepath = [];
        this.reset();
    }

    reset() {
        console.log(this.myInputVariable.nativeElement.files);
        this.myInputVariable.nativeElement.value = '';
        console.log(this.myInputVariable.nativeElement.files);
    }

    countryList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid')
        };
        this.common.getCountryList(data).subscribe((successData) => {
                this.countryListSuccess(successData);
            },
            (error) => {
                this.countryListFailure(error);
            });
    }

    countryListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.countryListData = successData.ResponseObject;
            console.log(this.countryListData, 'Country');
            if (this.type == 'edit') {
                this.stateList(this.editData.country);
            }
        }
    }

    countryListFailure(error) {
        console.log(error, 'error');
    }

    stateList(id) {
        const countryVal = this.teacherForm.controls.country.value;
        this.teacherForm.controls.state.patchValue(null);
        const data = {
            platform: 'web',
            country_id: id,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid')
        };
        this.common.getStateList(data).subscribe((successData) => {
                this.stateListSuccess(successData);
            },
            (error) => {
                this.stateListFailure(error);
            });
    }

    stateListSuccess(successData) {
        if (successData.IsSuccess) {
            this.stateListData = successData.ResponseObject;
            if (this.type == 'edit') {
                this.stateListData.forEach((value) => {
                    if (value.state_id == this.editData.state) {
                        this.teacherForm.controls.state.patchValue(value.state_id);
                    }
                });
            }
        }
    }

    stateListFailure(error) {
        console.log(error, 'error');
    }

    checkValue() {
        this.loopingPermission();
    }

    loopingPermission() {
        this.teacherPermission = [{
            permission: [{
                status: this.teacherForm.controls.addStudent.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateStudent.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.displayEmailId.value ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addContent.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateContent.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addSubject.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateSubject.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addBooks.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateBooks.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addContents.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateContents.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addRoom.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateRoom.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.addClass.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.addCurriculum.value == true ? 1 : 0
            }, {
                status: this.teacherForm.controls.updateCompletedClass.value == true ? 1 : 0
            }]
        }, {
            permission: [{
                status: this.teacherForm.controls.transferClass.value == true ? 1 : 0
            }]
        }
        ];
        this.checkLoopPermission();
    }

    checkLoopPermission() {
        for (let i = 0; i < this.teacherPermission.length; i++) {
            this.teacherPermission[i].selectAll = true;
            for (let j = 0; j < this.teacherPermission[i].permission.length; j++) {
                if (this.teacherPermission[i].permission[j].status == 0) {
                    this.teacherPermission[i].selectAll = false;
                    break;
                }
            }
        }
        for (let i = 0; i < this.teacherPermission.length; i++) {
            if (this.teacherPermission[i].selectAll == false) {
                this.teacherForm.controls.selectAll.patchValue(0);
                break;
            } else {
                this.teacherForm.controls.selectAll.patchValue(1);
            }
        }
    }

    checkValue1() {
        if (this.teacherForm.controls.selectAll.value == true) {
            this.teacherForm.controls.addStudent.patchValue(1);
            this.teacherForm.controls.updateStudent.patchValue(1);
            this.teacherForm.controls.displayEmailId.patchValue(1);
            this.teacherForm.controls.addContent.patchValue(1);
            this.teacherForm.controls.updateContent.patchValue(1);
            this.teacherForm.controls.addSubject.patchValue(1);
            this.teacherForm.controls.updateSubject.patchValue(1);
            this.teacherForm.controls.addBooks.patchValue(1);
            this.teacherForm.controls.updateBooks.patchValue(1);
            this.teacherForm.controls.addContents.patchValue(1);
            this.teacherForm.controls.updateContents.patchValue(1);
            this.teacherForm.controls.addRoom.patchValue(1);
            this.teacherForm.controls.updateRoom.patchValue(1);
            this.teacherForm.controls.addClass.patchValue(1);
            this.teacherForm.controls.updateClass.patchValue(1);
            this.teacherForm.controls.addCurriculum.patchValue(1);
            this.teacherForm.controls.updateCompletedClass.patchValue(1);
            this.teacherForm.controls.transferClass.patchValue(1);
        } else {
            this.teacherForm.controls.addStudent.patchValue(0);
            this.teacherForm.controls.updateStudent.patchValue(0);
            this.teacherForm.controls.displayEmailId.patchValue(0);
            this.teacherForm.controls.addContent.patchValue(0);
            this.teacherForm.controls.updateContent.patchValue(0);
            this.teacherForm.controls.addSubject.patchValue(0);
            this.teacherForm.controls.updateSubject.patchValue(0);
            this.teacherForm.controls.addBooks.patchValue(0);
            this.teacherForm.controls.updateBooks.patchValue(0);
            this.teacherForm.controls.addContents.patchValue(0);
            this.teacherForm.controls.updateContents.patchValue(0);
            this.teacherForm.controls.addRoom.patchValue(0);
            this.teacherForm.controls.updateRoom.patchValue(0);
            this.teacherForm.controls.addClass.patchValue(0);
            this.teacherForm.controls.updateClass.patchValue(0);
            this.teacherForm.controls.updateCompletedClass.patchValue(0);
            this.teacherForm.controls.addCurriculum.patchValue(0);
            this.teacherForm.controls.transferClass.patchValue(0);
        }
    }

    selectClass() {
        if ((this.teacherForm.controls.addClass.value == 1 || this.teacherForm.controls.addClass.value == true)) {
            this.teacherForm.controls.addCurriculum.patchValue(1);
            this.loopingPermission();
        } else {
            this.teacherForm.controls.addCurriculum.patchValue(0);
        }
    }

    selectCurriculum() {
        if (this.teacherForm.controls.addCurriculum.value == 0 || this.teacherForm.controls.addCurriculum.value == false) {
            this.teacherForm.controls.addClass.patchValue(0);
        }
    }

    PermissionTeacher(id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            teacher_id: id,
            school_id: this.schoolId
        };
        this.teacherService.PermissionTeacher(data).subscribe((successData) => {
                this.PermissionTeacherSuccess(successData);
            },
            (error) => {
                this.PermissionTeacherFailure(error);
            });
    }

    PermissionTeacherSuccess(successData) {
        this.teacherPermission = successData.ResponseObject.Permission;
        this.checkLoopPermission();
        this.teacherForm.controls.addStudent.patchValue(this.teacherPermission[0].permission[0].status);
        this.teacherForm.controls.updateStudent.patchValue(this.teacherPermission[0].permission[1].status);
        this.teacherForm.controls.displayEmailId.patchValue(this.teacherPermission[0].permission[3].status);
        this.teacherForm.controls.addContent.patchValue(this.teacherPermission[1].permission[0].status);
        this.teacherForm.controls.updateContent.patchValue(this.teacherPermission[1].permission[1].status);
        this.teacherForm.controls.addSubject.patchValue(this.teacherPermission[2].permission[0].status);
        this.teacherForm.controls.updateSubject.patchValue(this.teacherPermission[2].permission[1].status);
        this.teacherForm.controls.addBooks.patchValue(this.teacherPermission[3].permission[0].status);
        this.teacherForm.controls.updateBooks.patchValue(this.teacherPermission[3].permission[1].status);
        this.teacherForm.controls.addContents.patchValue(this.teacherPermission[4].permission[0].status);
        this.teacherForm.controls.updateContents.patchValue(this.teacherPermission[4].permission[1].status);
        this.teacherForm.controls.addRoom.patchValue(this.teacherPermission[5].permission[0].status);
        this.teacherForm.controls.updateRoom.patchValue(this.teacherPermission[5].permission[2].status);
        this.teacherForm.controls.addClass.patchValue(this.teacherPermission[6].permission[0].status);
        this.teacherForm.controls.updateClass.patchValue(this.teacherPermission[6].permission[2].status);
        this.teacherForm.controls.addCurriculum.patchValue(this.teacherPermission[6].permission[3].status);
        this.teacherForm.controls.updateCompletedClass.patchValue(this.teacherPermission[6].permission[4].status);
        this.teacherForm.controls.transferClass.patchValue(this.teacherPermission[7].permission[0].status);
        if (this.teacherForm.controls.addClass.value == 1) {
            this.selectClass();
        }
    }

    PermissionTeacherFailure(error) {
    }

    checkDoj(eve) {
        if (eve.value != '') {
            this.teacherForm.controls.doj.setValidators([Validators.required]);
            this.teacherForm.controls.doj.updateValueAndValidity();
        } else {
            this.teacherForm.controls.doj.clearValidators();
            this.teacherForm.controls.doj.setValidators(null);
            this.teacherForm.controls.doj.updateValueAndValidity();
        }
    }

    // grade list
    gradeList() {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            type: 'active',
            school_id: this.schoolId
        };
        this.student.getgradeList(data).subscribe((successData) => {
                this.gradeListSuccess(successData);
            },
            (error) => {
                this.gradeListFailure(error);
            });
    }

    gradeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;

        }
    }

    gradeListFailure(error) {
        console.log(error, 'error');
    }

    // subject list
    subjectList() {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            type: 'active'
        };
        this.teacherService.subjectList(data).subscribe((successData) => {
            this.subjectListSuccess(successData);
        });

    }

    subjectListSuccess(successData) {
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;

        }
    }
}

