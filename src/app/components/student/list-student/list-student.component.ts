import {Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {TemplateService} from '../../../shared/service/template.service';
import {StudentService} from '../../../shared/service/student.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {TagInputModule} from 'ngx-chips';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {ViewCell} from 'ng2-smart-table';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';
import {ClassService} from '../../../shared/service/class.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {dateOptions} from '../../../shared/data/config';

TagInputModule.withDefaults({
    tagInput: {
        placeholder: 'Add a new tag',
        secondaryPlaceholder: 'Enter your EmailID'
    }
});


@Component({
    selector: 'app-list-student',
    templateUrl: './list-student.component.html',
    styleUrls: ['./list-student.component.scss'],
    providers: [TitleCasePipe]
})
export class ListTemplateComponent implements OnInit, OnChanges {
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        // disableUntil: {
        //     year: new Date().getFullYear(),
        //     month: new Date().getMonth() + 1,
        //     day: new Date().getDate() - 1
        // },
    };
    public studentPassword: FormGroup;
    public studentClassChange: FormGroup;
    public listData: any;
    public allowreset: boolean;
    public deleteUser: any;
    private modalRef: NgbModalRef;
    public viewdetail: any;
    public closeResult: string;
    public imgUrl: any;
    public filetype: any;
    public contentType = 'Assessment';
    public contentData = [];
    public allContentData = [];
    public getUrl: any;
    public getUrl1: any;
    public specificData: any;
    public url: any;
    public email: any;
    public studentId: any;
    public classId: any = 0;
    public contentId: any = 0;
    public studentBlukEmail: any = [];
    public studentBlukEmailValue: any = [];
    public recordBase64Url: any;
    public bulkSms: any;
    public fileUploader: any;
    public formattype: any;
    public webHost: any;
    public schoolData: any;
    public schoolDataList: any = 0;
    public rows: any;
    public schoolid: any;
    public roleid: any;
    public adminschool: any;
    public allClassList: any = [];
    public classStudentList: any = [];
    public listNotes = [];
    public listClass = [];
    public teacherschool: any;
    public allowAdd: boolean;
    public allowEdit: boolean;
    public allowTransfer: boolean;
    public schoolChange: boolean = false;
    public allowSelect: boolean;
    public validators = [this.must_be_email];
    public errorMessages = {
        'must_be_email': 'Please Enter a valid email format only allowed'
    };
    public conps: boolean;
    public conps1: boolean;
    public resetPassword: any;
    public passwordValid: boolean;
    public message: any;
    public gradeData: any;
    public grade: any;
    public schoolId: any;
    public schoolStatus: any;
    public selectedToClass: any;
    public student_id: any;
    @ViewChild('allNotes') allNotes: TemplateRef<any>;
    public settings = {
        hideSubHeader: false,
        pager:
            {
                perPage: 10
            },
        actions: {
            custom: [
                {
                    name: 'editAction',
                    title: '<i class="fa  fa-pencil" title="Edit Student"></i>'
                },
                {
                    name: 'resetpassword',
                    title: '&nbsp;<img src="assets/images/Group 17247.png" alt="" title="Reset Password By Mail" aria-hidden="true"></img>'
                },
                {
                    name: 'resetpasswordnow',
                    title: '<img src="assets/images/Group 17248.png" alt="" title="Reset Password Now" aria-hidden="true"></img>'
                },
                {
                    name: 'classChange',
                    title: '<img src="assets/images/icons/transfer-class-blue.png" alt="" title="Transfer Class" aria-hidden="true"></img>'
                },
                {
                    name: 'notes',
                    title: '<i aria-hidden="true" title="Notes" class="fa fa-newspaper-o ml-2"></i>'
                }
            ],
            add: false,
            edit: false,
            delete: false,
            position: 'right',
        },
        columns: {
            first_name: {
                title: 'First Name',
                type: 'custom',
                renderComponent: ViewComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.save.subscribe(row => {
                        console.log(row, 'rowwww');
                    });
                }
            },
            last_name: {
                title: 'Last Name',
                valuePrepareFunction: (data) => {
                    return this.firstcaps.transform(data);
                }
            },
            grade_name: {
                title: 'Grade',
                valuePrepareFunction: (data) => {
                    return this.firstcaps.transform(data);
                }
            },
            email_id: {
                title: 'E-Mail'
            },
            mobile: {
                title: 'Contact Number',
                type: 'html',
                valuePrepareFunction: (data) => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] != '') {
                            return `<a title="${data}">${data[0]}`;
                        } else {
                        }
                    }
                }
            },
            status: {
                title: 'Status'
            },
        },
    };

    @ViewChild('content') modalContent: TemplateRef<any>;
    @ViewChild('bulkmodal') bulkContent: TemplateRef<any>;
    @ViewChild('emailmodal') emailContent: TemplateRef<any>;
    @ViewChild('content1') modalContent1: TemplateRef<any>;
    @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
    @ViewChild('studentChange') changeStudent: TemplateRef<any>;

    @Input() page?: any;

    constructor(public config: NgbModalConfig, public templateservice: TemplateService, public student: StudentService, public configurationService: ConfigurationService, public teacher: TeacherService,
                public confi: ConfigurationService, private modalService: NgbModal, public auth: AuthService, public common: CommonService, public sanitizer: DomSanitizer,
                public commondata: CommonDataService, public route: Router, public firstcaps: TitleCasePipe, public toastr: ToastrService, public school: SchoolService, public classes: ClassService,
                public formBuilder: FormBuilder, public loginService: LoginService, public validationService: ValidationService, public newSubject: NewsubjectService, public contentDetail: ContentdetailService,
                public datePipe: DatePipe) {
        this.imgUrl = this.confi.getimgUrl();
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        this.studentClassChange = this.formBuilder.group({
            formClass: [null, Validators.required],
            toClass: [null, Validators.required],
            from_startdate: ['', Validators.required]
        });
        config.backdrop = 'static';
        config.keyboard = false;
        this.email = [];
        this.allowAdd = true;
        this.allowEdit = true;
        this.conps = true;
        this.conps1 = true;
        this.webHost = this.configurationService.getimgUrl();
        // if (this.schoolStatus.length != 0) {
        //     this.newSubject.schoolChange.subscribe(params => {
        //         if (params != '') {
        //             if (this.route.url.includes('list-student')) {
        //                 this.init(params);
        //             }
        //         } else {
        //             this.init(this.auth.getSessionData('rista-school_id'));
        //         }
        //     });
        // }
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.setSessionData('rista-browseAll', false);
        this.auth.removeSessionData('rista-classData');
        this.auth.removeSessionData('readonly_data');
        this.auth.removeSessionData('updatedStudent');
        this.auth.removeSessionData('readonly_startdate');
        this.auth.removeSessionData('editView');
        this.auth.setSessionData('rista-contentType', '');
        this.allowreset = this.auth.getSessionData('rista-roleid') == '4' && this.auth.getSessionData('rista-teacher_type') == '0';
        this.studentPassword = this.formBuilder.group({
            email: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: '',
        });
    }

    private must_be_email(control: FormControl) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
        if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
            return {"must_be_email": true};
        }
        return null;
    }

    ngOnInit() {
        this.auth.removeSessionData('rista-backOption');
    }

    ngOnChanges() {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    init(res) {
        this.schoolId = this.auth.getSessionData('rista-school_id');
        if (this.roleid == '4') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.allowreset = this.auth.getSessionData('rista-teacher_type') == '0';
            if (this.teacherschool.permissions[0].allowNav) {
                if (this.teacherschool.permissions[0].permission[0].status == 1) {
                    this.allowAdd = true;
                } else if (this.teacherschool.permissions[0].permission[0].status != 1) {
                    this.allowAdd = false;
                }
                if (this.teacherschool.permissions[0].permission[1].status == 1) {
                    this.allowEdit = true;
                } else if (this.teacherschool.permissions[0].permission[1].status != 1) {
                    this.allowEdit = false;
                }
                this.studentList();
            }
            if (this.teacherschool.permissions[7].permission[0].status != 1) {
                this.settings.actions.custom.splice(3, 1);
            }
            if(this.teacherschool.individual_teacher != '1'){
                this.settings.actions.custom.splice(1, 2);
            }
        } else {
            this.studentList();
        }
        this.studentClassList(0);
    }

    onCustomAction(event) {
        switch (event.action) {
            case 'editAction':
                this.editAction(event);
                break;
            case 'resetpassword':
                this.resetPassword = event.data;
                console.log(this.resetPassword, 'hgjhjh');
                this.showModal('mail');
                break;
            case 'resetpasswordnow':
                this.resetPassword = event.data;
                this.showModal('now');
                break;
            case 'classChange':
                // this.resetPassword = event.data;
                this.classChange(event.data);
                break;
            case 'notes':
                this.getNotes(event.data.user_id, this.classId, this.contentId);
        }
    }

    editAction(rows) {
        if (this.allowEdit == true) {
            this.auth.setSessionData('UsersRedirection', 'Student');
            this.auth.setSessionData('editStudent', JSON.stringify(rows.data));
            this.route.navigate(['/student/create-student/edit']);
            this.close();
        } else if (this.allowEdit == false) {
            this.toastr.error('You don\'t have permission to update student details');
        }
    }

    onDateChanged(event) {
        console.log(event, 'event');
    }
    // classList(item) {
    //     const data = {
    //         platform: 'web',
    //         role_id: this.auth.getSessionData('rista-roleid'),
    //         user_id: this.auth.getSessionData('rista-userid'),
    //         school_id: this.auth.getSessionData('rista-school_id'),
    //         student_id: item.user_id,
    //         type: '1',
    //         sort: '0'
    //     };
    //     this.teacher.studentClassDashboardList(data).subscribe((successData) => {
    //             this.classListSuccess(successData, item);
    //         },
    //         (error) => {
    //             console.error(error, 'error_ClassList');
    //         });
    // }
    //
    // classListSuccess(successData, item) {
    //     if (successData.IsSuccess) {
    //         this.listClass = successData.ResponseObject;
    //         this.contentList(this.listClass[0].class_id, item);
    //     }
    // }
    // contentList(id, item) {
    //     item['class_id'] = id;
    //     const data = {
    //         platform: 'web',
    //         role_id: this.auth.getSessionData('rista-roleid'),
    //         user_id: this.auth.getSessionData('rista-userid'),
    //         school_id: this.auth.getSessionData('rista-school_id'),
    //         student_id: item.user_id,
    //         class_id: id
    //     };
    //     this.classes.studentClassDetail(data).subscribe( (successData) => {
    //             this.contentListSuccess(successData, item);
    //         },
    //         (error) => {
    //             console.log(error, 'error');
    //         });
    // }
    // contentListSuccess(successData, item) {
    //     if (successData.IsSuccess) {
    //         if (this.contentType == 'Assessment') {
    //             this.contentData = successData.ResponseObject.assessment_detail;
    //         } else {
    //             this.contentData = successData.ResponseObject.assignment_detail;
    //         }
    //         item['content_id'] = this.contentData[0].content_id;
    //         this.getNotes(item);
    //     }
    // }
    changeNotes(event, type) {
        if (type == 'class') {
            console.log(event, 'get eve')
            if (event?.class_id) {
                this.classId = event.class_id;
            } else {
                this.classId = 0;
                this.close();
            }
            this.contentData = [];
            this.contentId = 0;
            this.specificData = null;
        } else {
            if (event?.content_id) {
                this.contentId = event.content_id;
            } else {
                this.contentId = 0;
            }
        }
        this.getNotes(this.studentId, this.classId, this.contentId);
    }
    getNotes(studentId, classId, contentId) {
        this.studentId = studentId;
        console.log(this.classId, 'class id')
        console.log(this.contentId, 'content id')
        const key = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: contentId,
            student_id: studentId,
            class_id: classId,
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.contentDetail.notesList(key).subscribe((successData) => {
                this.notesListSuccess(successData, key);
            },
            (error) => {
                console.error(error, 'error_classList');
            });
    }
    notesListSuccess(successData, key) {
        if (successData.IsSuccess) {
            this.listNotes = successData.ResponseObject;
            if (key.class_id == 0 && key.content_id == 0) {
                this.listClass = [];
                this.listNotes.forEach((val) => {
                    if (this.listClass.length > 0) {
                        let occured = false;
                        this.listClass.forEach((item) => {
                            if (item.class_id == val.class_id) {
                                occured = true;
                            }
                        });
                        if (!occured) {
                            this.listClass.push({class_name: val.class_name, class_id: val.class_id});
                        }
                    } else {
                        this.listClass.push({class_name: val.class_name, class_id: val.class_id});
                    }
                });
                this.contentData = [];
                this.listNotes.forEach((val) => {
                    if (this.contentData.length > 0) {
                        let occured = false;
                        this.contentData.forEach((item) => {
                            if (item.content_id == val.content_id) {
                                occured = true;
                            }
                        });
                        if (!occured) {
                            this.contentData.push({content_name: val.content_name, content_id: val.content_id, class_id: val.class_id});
                        }
                    } else {
                        this.contentData.push({content_name: val.content_name, content_id: val.content_id, class_id: val.class_id});
                    }
                });
                this.allContentData = [...this.contentData];
                this.modalRef = this.modalService.open(this.allNotes, {size: 'md'});
            } else if (key.class_id != 0) {
                this.contentData = this.allContentData.filter((val) => {
                    return val.class_id == this.classId;
                });
                console.log(this.contentData, 'get content');
            }
        }
    }

    selectedClass(event){
        this.selectedToClass = event;
        if (event.status == '1'){
            const sd = event.start_date.split('-');
            const sdObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))}, dateRange: null};
            this.myDpOptions1 = {};
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: parseInt(sd[0]),
                    month: parseInt(sd[1]),
                    day: parseInt(sd[2]) - 1
                },
            };
        }
    }
    submitChangeClass(){
        if (this.studentClassChange.controls.formClass.value == this.studentClassChange.controls.toClass.value){
            this.toastr.error('From Class and To Class should be different');
            return false;
        }
        if (this.studentClassChange.valid){
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolId,
                from_class: this.studentClassChange.controls.formClass.value,
                to_class: this.studentClassChange.controls.toClass.value,
                from_date: this.selectedToClass.start_date,
                end_date: this.selectedToClass.end_date,
                joining_date: this.studentClassChange.controls.from_startdate.value == null ? '' : this.datePipe.transform(this.studentClassChange.controls.from_startdate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                student_id: this.student_id,
                status: '1'
            };
            this.student.changeClass(data).subscribe((successData) => {
                    this.submitChangeSuccess(successData);
                },
                (error) => {
                    console.error(error, 'Submit_error');
                });
        }else {
            this.validationService.validateAllFormFields(this.studentClassChange);
            this.toastr.error('Please Select all the mandatory fields');
        }
    }

    submitChangeSuccess(successData){
        if (successData.IsSuccess){
            console.log(successData.ResponseObject, 'dasd');
            this.toastr.success(successData.ResponseObject);
            this.studentClassChange.reset();
            this.modalRef.close();
        }else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    studentList() {
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId
        };
        this.student.getStudentList(data).subscribe((successData) => {
                this.studentListSuccess(successData);
            },
            (error) => {
                this.studentListFailure(error);
            });
    }

    studentListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.listData = successData.ResponseObject;
            this.listData.forEach((value, index, array) => {
                this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
                    'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '';
            });
        }
    }

    studentListFailure(error) {
        console.log(error, 'error');
    }

    gradeList() {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
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
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;

        }
    }

    gradeListFailure(error) {
        console.log(error, 'error');
    }

    bulkModal() {
        this.filetype = '';
        this.grade = null;
        this.modalRef = this.modalService.open(this.bulkContent);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    emailModal() {
        this.studentBlukEmail = [];
        this.grade = null;
        this.gradeList();
        this.modalRef = this.modalService.open(this.emailContent);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    onSave() {
        this.modalRef.close();
        this.studentClassChange.reset();
    }

    close() {
        this.modalRef.close();
        this.studentClassChange.reset();
        this.fileUploader = '';
        this.filetype = '';
        this.studentBlukEmail = '';
        this.classId = 0;
        this.contentId = 0;
        this.contentData = [];
        this.listClass = [];
    }

    readUrl(event: any) {
        // if(this.schoolId != null){
        const file = event.target.files[0];
        // this.formattype = event.target.files[0].type.split('.');
        if (event.srcElement.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.srcElement.files[0].type == 'application/vnd.ms-excel') {
            this.filetype = event.target.files[0].name.split('.');
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: any) => {
                this.getUrl1 = [];
                this.url = event.target.result;
                this.getUrl = this.url.split(',');
                this.getUrl1.push(this.url.split(','));
                this.onUploadFinished1(this.getUrl, event);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
            // this.onUploadFinished(reader.result);
            this.toastr.success('Excel Upload Successfully', 'Success!');
        } else {
            this.toastr.error('Only Excel Format is required', 'Failed');
            this.filetype = '';
        }
    }

    onUploadFinished1(event, fileEvent) {
        this.getUrl = event[1];

    }

    onUploadFinished(type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            file: this.getUrl,
            extension: this.filetype[1],
            upload_type: 'Excel',
            user_type: 'Student',
        };
        this.common.excelUpload(data).subscribe(
            (successData) => {
                this.excelUpoadSuccess(successData, type);
            },
            (error) => {
                this.excelUpoadFailure(error);
            }
        );
    }

    excelUpoadSuccess(successData, type) {
        console.log(successData);
        if (successData.IsSuccess) {
            this.getUrl = '';
            // fileEvent = null;
            this.bulkInsert(type, successData.ResponseObject.upload_id);
            // this.fileUploader.nativeElement.value = '';
            this.toastr.success(successData.ResponseObject.Message, 'Success!');
        } else {
            this.toastr.error('Excel upload failed', 'Failed!');
        }
    }

    excelUpoadFailure(error) {
        console.log(error);
    }

    studentClassList(id) {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: id,
            school_id: this.schoolId
        };
        this.student.studentClassList(data).subscribe((successData) => {
                this.studentClassListSuccess(successData, id);
            },
            (error) => {
                console.error(error, 'error');
            });
    }

    studentClassListSuccess(successData, id) {
        if (successData.IsSuccess) {
            if (id == 0) {
                this.allClassList = successData.ResponseObject;
                this.allClassList.forEach((val) => {
                    val['fromClassLabel'] = val.class_name + '  -  ' + val.teacher_name;
                });
            } else {
                this.classStudentList = successData.ResponseObject;
            }
        }
    }

    bulkInsert(type, id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            upload_id: id,
            school_id: this.schoolId,
            grade_id: this.grade == null ? '' : this.grade
        };
        this.common.bulkInsert(data).subscribe(
            (successData) => {
                this.bulkInsertSuccess(type, successData);
            },
            (error) => {
                this.bulkInsertFailure(error);
            }
        );
    }

    bulkInsertSuccess(type, successData) {
        if (successData.IsSuccess) {
            this.close();
            this.studentList();
            if (type == 'upload') {
                this.toastr.success(successData.ResponseObject, 'Student');
            } else if (type == 'email') {
                this.toastr.success(successData.ResponseObject, 'Student');
            }
        } else if (!successData.IsSuccess) {
            if (type == 'upload') {
                this.toastr.error(successData.ErrorObject, 'Failure');
            } else if (type == 'email') {
                this.toastr.error('Email not sent', 'Failure');
            }
        }
    }

    bulkInsertFailure(error) {
        this.studentList();
        this.toastr.error('Excel upload failed', 'Failed!');
        console.log(error);
    }

    emailInviteUpload(type) {
        this.studentBlukEmail;
        for (let i = 0; i < this.studentBlukEmail.length; i++) {
            this.studentBlukEmailValue.push(this.studentBlukEmail[i].value);
        }
        if (this.grade != null) {
            if (this.studentBlukEmail.length != 0) {
                const data = {
                    platform: 'web',
                    role_id: this.auth.getSessionData('rista-roleid'),
                    user_id: this.auth.getSessionData('rista-userid'),
                    school_id: this.schoolId,
                    email_id: this.studentBlukEmailValue,
                    format: 'Email',
                    user_type: 'Student',
                    grade_id: this.grade
                };
                this.common.emailInviteUpload(data).subscribe((successData) => {
                        this.emailInviteUploadSuccess(type, successData);
                    },
                    (error) => {
                        this.emailInviteUploadFailure(error);
                    });
            } else {
                this.toastr.error('Enter Your Email Id', 'Failed!');
            }
        } else {
            this.toastr.error('Please Select the grade', 'Failed');
        }
    }

    emailInviteUploadSuccess(type, successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.bulkInsert(type, successData.ResponseObject.upload_id);
            // this.toastr.success('E-mail Invite Sent Sucessfully', 'Success!');
        } else {
            this.toastr.error(successData.ResponseObject, 'Failed!');
        }
    }

    emailInviteUploadFailure(error) {
    }

    downloadExcel() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            user_type: 'Student'

        };
        this.common.excelDownload(data).subscribe(
            (successData) => {
                this.excelDownloadSuccess(successData);
            },
            (error) => {
                this.excelDownloadFailure(error);
            }
        );
    }

    excelDownloadSuccess(successData) {
        if (successData.IsSuccess) {
            const url = this.webHost + '/' + successData.ResponseObject;
            window.open(url);
        }
    }

    excelDownloadFailure(error) {
        console.log(error);
    }

    checkPasswords() {
        const pass = this.studentPassword.controls.password.value;
        const confirmPass = this.studentPassword.controls.confirmpassword.value;
        this.passwordValid = pass !== confirmPass;
        return this.passwordValid;
    }

    cancel() {
        this.modalRef.close();
        this.studentPassword.reset();
    }

    change(type) {
        const data = {
            platform: 'web',
            role_id: this.resetPassword.role_id,
            email_id: this.resetPassword.email_id,
        };
        if (type == 1) {
            this.loginService.forgotPassword(data).subscribe((successData) => {
                    this.changeSuccess(successData, type);
                },
                (error) => {
                    this.changeFailure(error);
                });
        } else {
            if (this.studentPassword.valid) {
                if (this.passwordValid == false) {
                    this.commondata.showLoader(true);
                    data['password'] = this.studentPassword.controls.confirmpassword.value;
                    this.loginService.forgotPassword(data).subscribe((successData) => {
                            this.changeSuccess(successData, type);
                        },
                        (error) => {
                            this.changeFailure(error);
                        });
                } else {
                    this.toastr.error('Please enter same password in new and confirm password');
                }
            } else {
                this.validationService.validateAllFormFields(this.studentPassword);
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }
    }

    changeSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.message = successData.ResponseObject.message;
            this.route.navigate(['/users/user-list']);
            if (type == 1) {
                this.toastr.success('E-mail invite sent successfully for reset password ', 'Student');
            } else {
                this.studentPassword.reset();
                this.toastr.success(successData.ResponseObject.message, 'Student');
            }
            this.close();
        } else {
            this.commondata.showLoader(false);
        }
    }

    changeFailure(error) {
        console.log(error, 'error');
    }

    classChange(event) {
        this.student_id = event.user_id;
        this.studentClassList(event.user_id);
        this.modalRef = this.modalService.open(this.changeStudent, {size: 'lg'});
    }

    showModal(type) {
        if (this.allowreset) {
            this.toastr.error('You don\'t have permission to reset password for student');
        } else {
            if (type == 'mail') {
                this.modalRef = this.modalService.open(this.modalContent1);
            } else if (type == 'now') {
                this.modalRef = this.modalService.open(this.modalContentnow);
                this.studentPassword.controls.email.patchValue(this.resetPassword.email_id);
            }
            this.modalRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
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
}


// view content

@Component({
    selector: 'button-toggle',
    template: `

        <div class="form-group">
            <span class="text-capitalize font-weight-bold table-name" data-toggle="modal" data-target="#myModal"
                  (click)="viewdetailsList()">{{viewdetail.first_name}}</span>
        </div>
        <ng-template #viewdetails let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-basic-title">Student details</h4>
                <i class="fa fa-close fa-lg mt-1" aria-hidden="true"
                   style="color:#7F3486; cursor: pointer; float: right;" (click)="close()"></i>
            </div>
            <div class="modal-body">
                <!-- Container-fluid starts-->
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card-body pt-2">
                                <div class="row d-flex flex-column">
                                    <div class="mb-4 fit-image">
                                        <img *ngIf="viewdetail.profile_url != ''"
                                             [src]="sanitizer.bypassSecurityTrustResourceUrl(webhost + '/' + viewdetail.profile_url)"
                                             alt="">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && viewdetail.gender.toLowerCase() == 'male'"
                                             src="assets/images/ristaschool/male.png" alt="">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && viewdetail.gender.toLowerCase() == 'female'"
                                             src="assets/images/ristaschool/female1.png" alt="">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && (viewdetail.gender.toLowerCase() == 'n/a' || viewdetail.gender == '')"
                                             src="assets/images/ristaschool/Do not want to disclose.png" alt="">
                                    </div>
                                    <table class="capital mb-3">
                                        <tr>
                                            <td class="pl-4"><b>Status:</b></td>
                                            <td class="badge badge-success" *ngIf="viewdetail.status == 'Active'">
                                                Active
                                            </td>
                                            <span class="badge  badge-danger" *ngIf="viewdetail.status == 'Inactive'">In-Active</span>
                                            <span class="badge badge-warning" *ngIf="viewdetail.status  == 'Suspended'">Suspended</span>
                                            <span class="badge badge-danger" *ngIf="viewdetail.status  == 'Deleted'">In-Active</span>
                                        </tr>
                                        <tr>
                                            <td class="pl-4"><b>Contact no:</b></td>
                                            <td *ngIf="viewdetail.mobile[0] != ''">{{viewdetail.mobile[0]}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4"><b>Grade:</b></td>
                                            <td *ngIf="viewdetail.grade_name != ''">{{viewdetail.grade_name}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4" style="width: 150px"><b>Parent Name:</b></td>
                                            <td *ngIf="viewdetail.parent1_firstname != ''">{{viewdetail.parent1_firstname}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4" style="vertical-align: top"><b>Address:</b></td>
                                            <td *ngIf="viewdetail.address[0].address1 != ''">{{viewdetail.address[0].address1}}</td>
                                        </tr>
                                        <tr *ngIf="viewdetail.address[0].address2 != ''">
                                            <td></td>
                                            <td>{{viewdetail.address[0].address2}}</td>
                                        </tr>
                                        <tr *ngIf="viewdetail.address[0].address1 != ''">
                                            <td></td>
                                            <td>{{viewdetail.address[0].city}},{{viewdetail.address[0].state_name}}
                                                <br>{{viewdetail.address[0].country_name}}
                                                ,{{viewdetail.address[0].postal_code}}</td>
                                        </tr>
                                    </table>

                                    <table class="capital" *ngIf="viewdetail.parent2_firstname != '' && viewdetail.address[1].address1 != ''
                                    && viewdetail.address[1].city != '' && viewdetail.address[1].country_name != ''
                                     && viewdetail.address[1].postal_code != '' && viewdetail.address[1].state_name != ''">
                                        <tr>
                                            <td class="pl-4" style="width: 150px"><b>Parent2 Name:</b></td>
                                            <td>{{viewdetail.parent2_firstname}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4" style="vertical-align: top"><b>Address:</b></td>
                                            <td>{{viewdetail.address[1].address1}}</td>
                                        </tr>
                                        <tr *ngIf="viewdetail.address[1].address2 != ''">
                                            <td></td>
                                            <td>{{viewdetail.address[1].address2}}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>{{viewdetail.address[1].city}},{{viewdetail.address[1].state_name}}
                                                <br>{{viewdetail.address[1].country_name}}
                                                ,{{viewdetail.address[1].postal_code}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!--          <div class="row" *ngIf="this.auth.getRoleId() =='2'">-->
                    <!--            <app-overalldetails></app-overalldetails>-->
                    <!--          </div>-->
                </div>

                <!-- Container-fluid Ends-->

            </div>
            <div class="modal-footer">
                <button type="button" class="btn cancel" (click)="close()">Cancel</button>
                <button type="button" class="btn btn-primary" (click)="editAction(viewdetail)">Edit</button>
            </div>
        </ng-template>
        <ng-template #viewoveralldetails let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title color-primary" id="modal-basic-title">{{studentName}} Overall details</h4>
                <i class="fa fa-close fa-lg mt-1" aria-hidden="true"
                   style="color:#7F3486; cursor: pointer; float: right;" (click)="close()"></i>
            </div>
            <div class="modal-body">
                <app-overalldetails
                        [studentdata]="viewdetail"
                >
                </app-overalldetails>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn cancel" (click)="close()">Cancel</button>
                <button type="button" class="btn btn-primary" (click)="editAction(viewdetail)">Edit</button>
            </div>
        </ng-template>

    `
})

export class ViewComponent implements ViewCell, OnInit {
    status: any;
    private modalRef: NgbModalRef;
    viewdetail: any;
    webhost: any;
    renderValue: string;
    allowAdd: boolean;
    allowEdit: boolean;
    teacherschool: any;
    studentName: any;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();
    @ViewChild('viewdetails') viewDetailsContent: TemplateRef<any>;
    @ViewChild('viewoveralldetails') viewoveralldetails: TemplateRef<any>;

    constructor(private modalService: NgbModal, public route: Router, public config: NgbModalConfig, public sanitizer: DomSanitizer,
                public auth: AuthService, public toastr: ToastrService, public confi: ConfigurationService) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.webhost = this.confi.getimgUrl();
        if (this.auth.getSessionData('rista-roleid') == '4') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            if (this.teacherschool.permissions[0].permission[0].status == 1) {
                this.allowAdd = true;
            } else if (this.teacherschool.permissions[0].permission[0].status == 0) {
                this.allowAdd = false;
            }
            if (this.teacherschool.permissions[0].permission[1].status == 1) {
                this.allowEdit = true;
            } else if (this.teacherschool.permissions[0].permission[1].status == 0) {
                this.allowEdit = false;
            }
        } else {
            this.allowAdd = true;
            this.allowEdit = true;
        }

    }

    ngOnInit() {
        this.viewdetail = this.rowData;
    }

    viewdetailsList() {
        this.studentName = this.rowData.first_name  + ' ' + this.rowData.last_name;
        console.log(this.rowData, 'rowData');
        this.auth.setSessionData('student-profile-details', JSON.stringify(this.rowData));
        this.route.navigate(['studentlogin/profile-details']);
        // console.log('functionCalled');
        // this.modalRef = this.modalService.open(this.viewoveralldetails, {size: 'xl'});
        // if (this.auth.getRoleId() != '2') {
        //     console.log('through teacher')
        //     this.modalRef = this.modalService.open(this.viewDetailsContent);
        // } else {
        //     console.log('entered admin')
        //     this.studentName = this.rowData.first_name + ' ' + this.rowData.last_name;
        //     this.modalRef = this.modalService.open(this.viewoveralldetails, {size: 'xl'});
        // }
    }

    open(content) {
        this.modalService.open(content);
    }

    close() {
        this.modalRef.close();
    }

    cancel() {
        this.modalRef.close();
    }

    editAction(rows) {
        if (this.allowEdit == true) {
            this.auth.setSessionData('editStudent', JSON.stringify(rows));
            this.route.navigate(['/student/create-student/edit']);
            this.auth.setSessionData('navigation', 'student-list');
            this.close();
        } else if (this.allowEdit == false) {
            this.toastr.error('You don\'t have permission to update student details', 'Failed');
        }
    }
}
