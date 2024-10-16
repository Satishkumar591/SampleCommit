import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ClassService} from '../../../shared/service/class.service';
import {DomSanitizer} from '@angular/platform-browser';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {ZoomServiceService} from '../../../shared/service/zoom-service.service';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {StudentService} from 'src/app/shared/service/student.service';
import {ValidationService} from 'src/app/shared/service/validation.service';
import {AlignmentTypes} from '@swimlane/ngx-charts';
import {style} from '@angular/animations';
import {Width} from 'ngx-owl-carousel-o/lib/services/carousel.service';
import {Key} from 'protractor';
import {HighlightSpanKind} from 'typescript';
import {EnvironmentService} from '../../../environment.service';

// import { threadId } from 'worker_threads';

@Component({
    selector: 'app-list-category',
    templateUrl: './list-class.component.html',
    styleUrls: ['./list-class.component.scss']
})
export class ListClassComponent implements OnInit, OnDestroy {
    // myDpOptions: IAngularMyDpOptions = {
    //     dateRange: false,
    //     dateFormat:dateOptions.pickerFormat,
    //     // other options are here...
    // };
    public setDate = new Date().toLocaleString('en-US', {timeZone: timeZone.location});
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() - 1
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() - 1
        },
    };
    public classCode = '';
    public classform: FormGroup;
    public studentEmailForm: FormGroup;
    public studentClassChange: FormGroup;
    public listData: any;
    public deleteUser: any;
    public modalRef: NgbModalRef;
    public modalRef1: NgbModalRef;
    public closeResult: string;
    public filetype: any;
    public url: any;
    public getUrl: any;
    public getUrl1: any;
    public schoolData: any;
    public webhost: any;
    public fileUploader: any;
    public schoolDataList: any = 0;
    public choosedData: any = [];
    public type: any;
    public schoolListDetails: any;
    public allStudentList: any = [];
    public idData: any;
    public detailData: any;
    public studentData: any = [];
    public className: any;
    public idForClass: any;
    public classlisthighlight: any;
    public schoolidnum: any;
    public teacheridnum = '';
    public allowClass: boolean;
    public teacherType: any;
    public batchData: any;
    public gradeData: any;
    public subjectData: any;
    public selectCurriculumFolder: any;
    public selectGrade: any = [];
    public selectSubject: any = [];
    public settingList = [];
    public settingValue = '0';
    public allowSelect: boolean;
    public searchClass: any;
    public roleId: any;
    public userId: any;
    public schoolStatus: any;
    public buttonSelect: boolean;
    public showLoader: boolean;
    public classInfo: any;
    public classId: any = '';
    public showNotes: any;
    public notes: any = '';
    public searchStudent: any = '';
    public editorValue: any;
    public currentDate: any;
    public studentShow = false;
    public teacherData: any = [];
    public selectTeacher = null;
    public selector: string = '.scrollPanel4';
    public pageNo: any = 1;
    public direction = '';
    public searchTime: any;
    public contentNameValue: any;
    public selectedClass: any;
    public videoSource: any = [];
    public customLoader: boolean = false;
    public recordLoader: boolean = false;
    public allowTransfer: boolean;
    public gradName: any;
    public gradeValue: any;
    public studentDataList: any;
    public studentName: any;
    public getDeleteStudentData: any;
    public selectClassData: any;
    public newlySelectedStuent = [];
    public selectedClassid: any;
    public multipleEmail: any = [];
    public blukEmailValue: any = [];
    public emailList: any = [];
    removable = true;
    validationEmail = false;
    public separatorKeysCodes = [ENTER, COMMA];
    public selectedChangeStudent: any;
    public allClassList: any = [];
    public classStudentList: any = [];
    public selectedToClass: any;
    public selectIcon = '';
    public viewdetail: any;
    public settings = {};
    allowEdit = true;
    allowEditCompleted = true;
    allowCurriculum = true;
    allowStudent = true;
    allowClassEdit = true;
    allowStudentEdit = true;
    public showEmailId = true;
    // public validators = [this.must_be_email];
    // public errorMessages = {
    //     'must_be_email': 'Please Enter a valid email format only allowed'
    // };

    @ViewChild('class') AddClass: TemplateRef<any>;
    @ViewChild('reports') reports: TemplateRef<any>;
    @ViewChild('showInform') showInform: TemplateRef<any>;
    @ViewChild('writeNoteOpen') writeNoteOpen: TemplateRef<any>;
    @ViewChild('zoomDialog') zoomDialog: TemplateRef<any>;
    @ViewChild('zoomDialog1') zoomDialog1: TemplateRef<any>;
    @ViewChild('meetingSelection') meetingSelection: TemplateRef<any>;
    @ViewChild('recordinglist') recordinglist: TemplateRef<any>;
    @ViewChild('video') video: TemplateRef<any>;
    @ViewChild('addStudentDialog') addStudentDialog: TemplateRef<any>;
    @ViewChild('addMultipleEmailDialog') addMultipleEmailDialog: TemplateRef<any>;
    @ViewChild('deleteStudentAlertDialog') deleteStudentAlertDialog: TemplateRef<any>;
    @ViewChild('mailbox') mailbox: TemplateRef<any>;
    @ViewChild('studentChange') changeStudent: TemplateRef<any>;
    @ViewChild('viewoveralldetails') viewoveralldetails: TemplateRef<any>;
    @ViewChild('deleteClass') deleteClassDialog: TemplateRef<any>;
    public classDetails: any;

    constructor(private formBuilder: FormBuilder, public config: NgbModalConfig, public confi: ConfigurationService, public teacher: TeacherService,
                public auth: AuthService, public commondata: CommonDataService, private modalService: NgbModal, public sanitizer: DomSanitizer,
                public route: Router, public firstcaps: TitleCasePipe,
                public toastr: ToastrService, public env: EnvironmentService,
                public newService: NewsubjectService,
                public datePipe: DatePipe, public zoomService: ZoomServiceService,
                public common: CommonService, public classes: ClassService,
                public newSubService: NewsubjectService, public student: StudentService, public validationService: ValidationService) {
        // this.settingList = JSON.parse(this.auth.getSessionData('settingList'));
        // console.log(this.settingList, 'settingList');
        // if (this.settingList != null || this.settingList != undefined) {
        //     this.settingList.forEach((items) => {
        //         if (items.name == 'teacher_zoom_view') {
        //             this.settingValue = items.value;
        //         }
        //     });
        // }
        this.roleId = this.auth.getSessionData('rista-roleid');
        this.userId = this.auth.getSessionData('rista-userid');
        if (this.roleId != '6') {
            this.settingList = JSON.parse(this.auth.getSessionData('settingList'));
            if (this.settingList) {
                this.settingList.forEach((items) => {
                    if (items.name == 'teacher_zoom_view') {
                        this.settingValue = items.value;
                    }
                });
            }
        }
        const date = new Date();
        this.currentDate = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        this.buttonSelect = true;
        this.classform = this.formBuilder.group({
            classname: ['', Validators.required],
            grade: ['', Validators.required],
            subject: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            describe: ['', Validators.required],
            tag: ['', Validators.required],
        });
        this.studentEmailForm = this.formBuilder.group({
            emails: this.formBuilder.array([], [this.validateArrayNotEmpty]),
        });
        this.studentClassChange = this.formBuilder.group({
            toClass: [null, Validators.required],
            from_startdate: ['', Validators.required]
        });
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.setSessionData('rista-browseAll', false);
        this.auth.removeSessionData('rista-classData');
        this.auth.removeSessionData('readonly_data');
        this.auth.removeSessionData('updatedStudent');
        this.auth.removeSessionData('editView');
        this.auth.removeSessionData('readonly_startdate');
        this.auth.setSessionData('rista-contentType', '');
        this.allowClass = true;
        this.webhost = this.confi.getimgUrl();
        if (this.auth.getSessionData('rista-roleid') == '2') {
            this.schoolidnum = this.auth.getSessionData('rista-school_id');
            this.teacheridnum = '0';
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.schoolidnum = this.schoolListDetails.school_id;
            this.teacheridnum = this.auth.getSessionData('rista-userid');
        } else if (this.auth.getSessionData('rista-roleid') == '6') {
            this.teacheridnum = '0';
        }

        console.log(this.schoolListDetails, 'schoolListDetails');
        if ((this.auth.getSessionData('rista-roleid') == '4') && this.auth.getSessionData('rista-teacher_type') == '0') {
            // if (this.schoolListDetails.permissions[6].permission[0].status == 1){
            //     this.allowClass = true;
            // }else if (this.schoolListDetails.permissions[6].permission[0].status == 0){
            //     this.allowClass = false;
            // }
            this.allowTransfer = this.schoolListDetails.permissions[7]?.permission[0]?.status == 1;
            this.allowCurriculum = this.schoolListDetails.permissions[6]?.permission[3]?.status == 1;
            this.allowEdit = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
            this.allowEditCompleted = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
            this.allowClass = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
            this.showEmailId = this.schoolListDetails.permissions[0]?.permission[3]?.status == 1;
        } else {
            // this.allowClass = true;
            this.allowTransfer = true;
            this.allowEdit = true;
        }
        config.backdrop = 'static';
        config.keyboard = false;
        if (this.schoolStatus.length != 0) {
            this.newService.schoolChange.subscribe((res: any) => {
                if (res != '') {
                    if (this.route.url.includes('list-class')) {
                        this.init(res);
                    }
                } else {
                    this.init(this.auth.getSessionData('rista-school_id'));
                }
            });
        } else {
        }

        this.allowSelect = false;
        this.newService.allowSchoolChange(this.allowSelect);
        this.studentList();

        this.settings = {
            singleSelection: false,
            idField: 'student_id',
            textField: 'name_with_email',
            enableCheckAll: true,
            selectAllText: 'Select all',
            unSelectAllText: 'UnSelect all',
            allowSearchFilter: true,
            limitSelection: -1,
            clearSearchFilter: true,
            maxHeight: 139,
            itemsShowLimit: 3,
            searchPlaceholderText: 'Search Student',
            noDataAvailablePlaceholderText: 'No data available',
            closeDropDownOnSelection: false,
            showSelectedItemsAtTop: false,
        };
    }

    // private must_be_email(control: FormControl) {
    //     var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    //     if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
    //         return {"must_be_email": true};
    //     }
    //     return null;
    // }
    add(event): void {
        console.log(event.value, 'value');
        console.log(event.value, 'value');
        console.log(event.value)
        // if (event.value) {
        //   if (this.validateEmail(event.value)) {
        //     this.emailList.push({ value: event.value, invalid: false });
        //   } else {
        //     this.emailList.push({ value: event.value, invalid: true });
        //     this.studentEmailForm.controls['emails'].setErrors({'incorrectEmail': true});
        //   }
        // }
        // if (event.input) {
        //   event.input.value = '';
        // }
        const a = event.value.split(/[ ,]+/);
        console.log(a.length, 'event.value');
        if (a.length != 0) {
            for (let i = 0; i < a.length; i++) {
                if (this.validateEmail(a[i])) {
                    this.emailList.push({value: a[i], invalid: false});
                } else if (a[i] != '') {
                    this.emailList.push({value: a[i], invalid: true});
                    this.studentEmailForm.controls['emails'].setErrors({incorrectEmail: true});
                }
                console.log(this.emailList, 'emailList');
            }
        } else {
            if (a) {
                if (this.validateEmail(a)) {
                    this.emailList.push({value: a, invalid: false});
                } else if (a != '') {
                    this.emailList.push({value: a, invalid: true});
                    this.studentEmailForm.controls['emails'].setErrors({incorrectEmail: true});
                }
                console.log(this.emailList, 'emailList');
            }
        }
        if (event.input) {
            event.input.value = '';
        }
        this.emailList = this.removeDuplicates(this.emailList, "value");
        const validation = this.emailList;
        this.validationEmail = validation.every((items) => {
            if (!items.invalid) {
                return true;
            }
            return false;
        });
        console.log(this.emailList, 'emailListOveral');
    }

    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    removeEmail(data: any): void {
        console.log('Removing ' + data);
        if (this.emailList.indexOf(data) >= 0) {
            this.emailList.splice(this.emailList.indexOf(data), 1);
        }
        console.log(this.emailList, 'emailListremove');
        const validation = this.emailList;
        this.validationEmail = validation.every((items) => {
            if (!items.invalid) {
                return true;
            }
            return false;
        });
    }

    ngOnInit() {
        this.auth.removeSessionData('rista-backOption');

    }

    ngOnDestroy(): void {
        this.setSearch_Filter(this.classlisthighlight);
    }

    private validateArrayNotEmpty(c: FormControl) {
        if (c.value && c.value.length === 0) {
            return {
                validateArrayNotEmpty: {valid: false},
            };
        }
        return null;
    }

    private validateEmail(email) {
        var re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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

    open(content) {
        this.modalService.open(content);
    }

    init(id) {
        this.getSearch_Filter();
        // this.teacheridnum = this.selectTeacher;
        console.log(this.teacheridnum, 'this.teacheridnum');
        this.showLoader = false;
        this.buttonSelect = true;
        this.schoolidnum = this.auth.getSessionData('rista-school_id');
        if (this.auth.getRoleId() == '4') {
            this.teacheridnum = this.auth.getSessionData('rista-userid');
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.teacherType = this.auth.getSessionData('rista-teacher_type');
            if (this.teacherType == '0') {
                this.allowClass = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
                this.allowTransfer = this.schoolListDetails.permissions[7]?.permission[0]?.status == 1;
                this.allowCurriculum = this.schoolListDetails.permissions[6]?.permission[3]?.status == 1;
                this.allowEdit = this.schoolListDetails.permissions[6]?.permission[1]?.status == 1;
                this.allowEditCompleted = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
                this.allowStudent = this.schoolListDetails.permissions[0]?.permission[0]?.status == 1;
                this.allowStudentEdit = this.schoolListDetails.permissions[0]?.permission[1]?.status == 1;
                this.allowClassEdit = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
            } else {
                this.allowClass = true;
                this.allowTransfer = true;
                this.allowEdit = true;
                this.allowStudent = true;
                this.allowClassEdit = true;
                this.allowStudentEdit = true;
            }
        } else {
            this.teacherType = '1';
            this.teacherList();
        }
        this.schoolIdNo();
        this.gradeList();
        this.subjectList();
        this.batchDataList();
    }

    checkClassDeleteConditions() {
        return this.auth.getRoleId() == '2' || (this.auth.getRoleId() == '4' && this.auth.getSessionData('rista-teacher_type') == '1');
    }

    deleteClassModal(row) {
        this.classDetails = row;
        console.log(this.classDetails, 'classDetails');
        this.modalRef = this.modalService.open(this.deleteClassDialog);
    }

    deleteClassList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getRoleId(),
            user_id: this.auth.getUserId(),
            class_id: this.classDetails.class_id,
        };
        this.classes.deleteclass(data).subscribe((successData) => {
                this.deleteClassSuccess(successData);
            },
            (error) => {
                console.error(error, 'class_delete');
        });
    }

    deleteClassSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.toastr.success('Class deleted Successfully', 'Class');
            this.modalRef.close();
            this.classList(this.classlisthighlight);
        } else{
            this.toastr.error(successData.ResponseObject, 'Class');
        }
    }

    onFilterChange(event) {
        console.log('evenn')
    }

    onDropDownClose(event) {
        console.log('evenn')
    }

    onItemSelect(event, select) {
        console.log(event, 'event');
        this.studentDataList.forEach((item) => {
            if (select == 'single'){
                if (item.student_id == event.student_id) {
                    this.newlySelectedStuent.push(item);
                }
            } else {
                // this.newlySelectedStuent = [];
                event.forEach((items1) => {
                    if (item.student_id == items1.student_id) {
                        this.newlySelectedStuent.push(item);
                    }
                });
            }
        });
        console.log(this.newlySelectedStuent, 'newlySelectedstudent');
    }

    onDeSelect(event) {
        console.log(event, 'eventt');
        this.newlySelectedStuent.forEach((item, index) => {
            if (event.student_id == item.student_id) {
                this.newlySelectedStuent.splice(index, 1);
            }
        });
        console.log(this.newlySelectedStuent, 'newlySelected');
    }

    onDeSelectAll() {
        console.log('evenn');
        this.newlySelectedStuent = [];
    }

    childCallfunction(event) {
        event.stopPropagation();
    }

    selectIconClass(type, list, i) {
        if (type == 'shareClass') {
            this.shareEmail(list);
        } else if (type == 'videoCamera') {
            this.openZoomDialog(list);
        } else if (type == 'record') {
            this.openRecordingList(list);
        } else if (type == 'curriculum') {
            this.curicullum(list);
        } else if (type == 'notes') {
            this.openNotes(i, list);
        } else if (type == 'information') {
            this.showInformation(list);
        } else if (type == 'reports') {
            this.reportDetails(list);
        } else if (type == 'enter') {
            if (!(this.auth.getRoleId() == '4' && this.classlisthighlight == '4')) {
                this.enterList(i, 'no', 'eve');
            } else {
                this.toastr.error('Not allowed in Enter');
            }
        }
    }

    onSave() {
        this.modalRef.close();
        this.auth.removeSessionData('Individual-Class-Report');
    }

    close() {
        this.modalRef.close();
        this.fileUploader = '';
        this.filetype = '';
    }

    classChange(event) {
        console.log(event, 'class_ssss');
        this.selectedChangeStudent = event;
        // this.student_id = event.user_id;
        this.studentClassList(event.user_id);
        this.studentClassChange.reset();
        this.modalRef = this.modalService.open(this.changeStudent, {size: 'lg'});
    }

    // selectAllForDropdownItems(items: any[])  {
    //     let allSelect = data => {
    //         data.forEach(element => {
    //             element['selectedAllGroup'] = 'selectedAllGroup'
    //         });
    //     };

    //     allSelect(items);
    // }

    studentClassList(id) {

        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: '0',
            class_id: this.idForClass,
            school_id: this.auth.getSessionData('rista-school_id')
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
            this.allClassList = successData.ResponseObject;
            this.allClassList.forEach((val) => {
                val['fromClassLabel'] = val.class_name + '  -  ' + val.teacher_name;
            });
            console.log(this.allClassList, 'allClassList');
            // if (id == 0) {
            //     this.allClassList = successData.ResponseObject;
            //     this.allClassList.forEach((val) => {
            //         val['fromClassLabel'] = val.class_name + '  -  ' + val.teacher_name;
            //     });
            //     console.log(this.allClassList, 'allClassList');
            // } else {
            //     this.classStudentList = successData.ResponseObject;
            // }
        }
    }

    selectedClassDetails(event) {
        this.selectedToClass = event;
        if (event.status == '1') {
            const sd = event.start_date.split('-');
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

    selectedTeacher() {
        // if (this.selectTeacher != null) {
        //     this.teacheridnum = this.selectTeacher;
        // } else {
        //     this.teacheridnum = '0';
        // }
    }

    onDateChanged(event: IMyDateModel): void {
    }

    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.classes.gradeList(data).subscribe((successData) => {
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

    subjectList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };

        this.classes.subjectList(data).subscribe((successData) => {
                this.subjectListSuccess(successData);
            },
            (error) => {
                this.subjectListFailure(error);
            });
    }

    subjectListSuccess(successData) {
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;
        }
    }

    subjectListFailure(error) {
        console.log(error, 'error');
    }

    batchDataList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: '2',
            list_type : 'list'
        };
        this.classes.batchList(data).subscribe((successData) => {
                this.batchListSuccess(successData);
            },
            (error) => {
                this.batchListFailure(error);
            });
    }

    batchListSuccess(successData) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            this.batchData = successData.ResponseObject;
        }
    }

    batchListFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    classList(id) {
        this.classlisthighlight = id;
        // this.buttonSelect = false;
        this.showLoader = true;
        const teacher_id = this.auth.getRoleId() == '4' ? this.auth.getUserId() : this.selectTeacher;
        // this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            type: id,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            teacher_id: teacher_id ? teacher_id : '0',
            grade: this.selectGrade ? this.selectGrade : [],
            subject: this.selectSubject ? this.selectSubject : [],
            classroom: this.selectCurriculumFolder ? this.selectCurriculumFolder : '',
            page_no: this.pageNo,
            records_per_page: '10',
            search: this.searchClass,
            student_search: this.searchStudent
        };
        this.classes.classesList(data).subscribe((successData) => {
                this.classListSuccess(successData);
            },
            (error) => {
                this.classListFailure(error);
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            const temp = successData.ResponseObject;
            if (this.searchClass.length > 0 && this.pageNo == 1) {
                this.choosedData = successData.ResponseObject;
            }
            if (this.searchClass.length == 0 && this.pageNo == 1) {
                this.choosedData = successData.ResponseObject;
                this.choosedData.forEach(element => {
                    element.checked = false;
                });
            }
            if (this.pageNo > 1 && temp.length > 0) {
                for (let entry of temp) {
                    this.choosedData.push(entry);
                }
            }
            this.buttonSelect = true;
            this.showLoader = false;
        }
    }

    classListFailure(error) {
        console.log(error, 'error');
    }

    teacherList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classes.individualTeacherList(data).subscribe((successData) => {
                this.teacherListSuccess(successData);
            },
            (error) => {
                this.teacherListFailure(error);
            });
    }

    teacherListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.teacherData = successData.ResponseObject;
        }
    }

    teacherListFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    updateFilter(event, type) {
        if (event.trim().length > 2 || event.trim().length == 0) {
            clearTimeout(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.classList(this.classlisthighlight);
                this.setSearch_Filter(this.classlisthighlight);
            }, 1200);
        }
    }

    schoolIdNo() {
        const data = {
            platform: 'web',
            role_id: this.auth.getRoleId(),
            user_id: this.auth.getUserId(),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.classes.idList(data).subscribe((successData) => {
                this.idListSuccess(successData);
            },
            (error) => {
                this.idListFailure(error);
            });
    }

    idListSuccess(successData) {
        if (successData.IsSuccess) {
            this.idData = successData.ResponseObject;
            this.auth.setSessionData('rista-teacher_id', this.idData[0]?.school_idno);
            this.classList(this.classlisthighlight);
        }
    }

    idListFailure(error) {
        console.log(error, 'error');
    }

    reportDetails(data) {
        this.auth.setSessionData('Individual-Class-Report', JSON.stringify(data));
        this.modalRef = this.modalService.open(this.reports, {size: 'xl'});
        this.contentNameValue = '';
    }

    showInformation(data) {
        this.classInfo = data;
        this.modalRef = this.modalService.open(this.showInform, {size: 'sm'});
    }


    enterList(id, type, event) {
        console.log(event, 'eventtt')
        this.selectedClassid = id;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.choosedData[id].class_id,
            grade: [this.choosedData[id].grade_id],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        if (type == 'yes') {
            // this.commondata.showLoader(true);
            this.studentShow = this.choosedData[id].class_id;
            this.classes.classDetails(data).subscribe((successData) => {
                    this.enterListSuccess(successData, type);
                },
                (error) => {
                    this.enterListFailure(error);
                });
            this.choosedData.forEach((element, index) => {
                if (index == id) {
                    element.checked = !element.checked
                } else {
                    element.checked = false;
                }
            });
            if (typeof event != 'string') {
                event.stopPropagation();
            }
        } else if (type == 'notes') {
            this.commondata.showLoader(true);
            this.classes.classDetails(data).subscribe((successData) => {
                    this.enterListSuccess(successData, type);
                },
                (error) => {
                    this.enterListFailure(error);
                });
        } else {
            this.commondata.showLoader(true);
            this.classes.classDetails(data).subscribe((successData) => {
                    this.enterListSuccess(successData, type);
                },
                (error) => {
                    this.enterListFailure(error);
                });
        }
    }

    enterListSuccess(successData, type) {
        this.className = successData.ResponseObject[0].class_name;
        this.idForClass = successData.ResponseObject[0].class_id;
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            if (type == 'yes') {
                this.studentData = successData.ResponseObject[0].students;
                this.studentData.forEach((items) => items.selected = false);
                this.choosedData[this.selectedClassid].no_of_students = this.studentData.length;
                console.log(this.studentData, 'studentData');
            } else if (type == 'notes') {
                this.showNotes = successData.ResponseObject[0].notes;
            } else {
                this.commondata.showLoader(false);
                this.detailData = successData.ResponseObject;
                this.auth.setSessionData('classView', true);
                this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
                this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
                this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
                this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
                this.auth.setSessionData('updatedStudent', 1);
                this.auth.removeSessionData('enterThroughSchedule');
                if (this.detailData[0].classDate_status == '2' || this.detailData[0].classDate_status == '5') {
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    }
                    if (this.detailData[0].class_status != '1') {
                        this.route.navigate(['/class/create-class/edit']);
                    } else {
                        this.route.navigate(['/class/create-class/edit']);
                        this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                        this.auth.setSessionData('updatedStudent', 1);
                    }
                } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0' && this.roleId != '2' && !this.allowEditCompleted) {
                    this.route.navigate(['/class/list-class']);
                } else if (this.detailData[0].classDate_status == '4' && (this.detailData[0].class_status == '1' || (this.roleId == '2' || this.allowEditCompleted))) {
                    console.log('1', 'enter logic');
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('classView', false);
                        console.log('2', 'enter complete class');
                    }
                    this.route.navigate(['/class/create-class/addEdit']);
                    this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                    this.auth.setSessionData('updatedStudent', 1);
                } else if (this.detailData[0].classDate_status == '3') {
                    if (this.detailData[0].class_status == '1') {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    } else {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        if (this.auth.getSessionData('rista-roleid') == '4' && this.teacherType == '0') {
                            this.auth.setSessionData('readonly_data', 'true');
                        } else {
                            this.auth.removeSessionData('readonly_data');
                        }
                    }
                    this.route.navigate(['/class/create-class/edit']);
                }
            }
        }
    }

    enterListFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    specificMail(detail, index) {
        this.studentData.forEach((items, id) => items.selected = index === id);
        this.mailAlert(detail);
    }

    mailAlert(detail) {
        const checked: boolean = this.studentData.some((items) => items.selected === true);
        if (checked) {
            this.modalRef = this.modalService.open(this.mailbox, {size: 'lg'});
        } else {
            this.toastr.error('Please select students');
        }
    }

    getEditorValue(event) {
        this.editorValue = event.editor;
        this.notes = event.content;
    }

    selectAllStudent(event) {
        this.studentData.forEach((items) => {
            items.selected = event.target.checked;
        });
    }

    sendMail() {
        const studentId = [];
        this.studentData.forEach((items => {
            if (items.selectedMail === true) {
                studentId.push(items.user_id);
            }
        }));
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: studentId
        };
        console.log(data, 'data');
    }

    readUrl(event: any) {
        const file = event.target.files[0];
        this.filetype = event.target.files[0].name.split('.');
        if (event.srcElement.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.srcElement.files[0].type == 'application/vnd.ms-excel') {
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
            this.toastr.success('Excel Upload Successfully', 'Success!');
        } else {
            this.toastr.error('Only Excel Format Is Required', 'Failed');
            this.filetype = '';
        }
    }

    onUploadFinished1(event, fileEvent) {
        this.getUrl = event[1];
    }

    openNotes(i, value) {
        this.modalRef = this.modalService.open(this.writeNoteOpen, {size: 'xl'});
        this.classId = value.class_id;
        this.notes = '';
        this.enterList(i, 'notes', 'eve');
    }

    addNotes() {
        if (this.notes == '') {
            this.toastr.error('Notes should not be empty');
            return false;
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.classId,
            note: this.notes.replace(/\r?\n/g, '<br />'),
            status: '1',
            add_date: this.currentDate
        };
        this.classes.getNotesList(data).subscribe((successData: any) => {
                if (successData.IsSuccess) {
                    this.showNotes = successData.ResponseObject;
                    this.editorValue != '' ? this.editorValue.setContent('') : '';
                    this.notes = '';
                } else {
                    this.toastr.error(successData.ErrorObject);
                }
            },
            (error) => {
            });
    }

    deletedNotes(value) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.classId ? this.classId : '',
            note: value.note,
            status: '2',
            id: value.id,
            add_date: value.add_date
        };
        this.classes.getNotesList(data).subscribe((successData: any) => {
                this.commondata.showLoader(false);
                if (successData.IsSuccess) {
                    this.showNotes = successData.ResponseObject;
                } else {
                    this.toastr.error(successData.ErrorObject);
                }
            },
            (error) => {
                this.commondata.showLoader(false);
            });
    }

    onsave() {
        this.modalRef.close();
    }

    onScrollDown(ev) {
        this.direction = 'down';
        this.pageNo++;
        this.classList(this.classlisthighlight);
    }

    onUp(ev) {
        this.direction = 'up';
    }

    shareEmail(value, calledForm?) {
        console.log(value);
        if (calledForm == 'addStudent') {
            this.modalRef.close('addStudentDialog');
        }
        this.emailList = [];
        this.blukEmailValue = [];
        this.selectClassData = value;
        this.modalRef = this.modalService.open(this.addMultipleEmailDialog, {size: 'lg'});
    }

    curicullum(value) {
        console.log(value, 'value');
        this.auth.setSessionData('card-data', JSON.stringify([value]));
        // this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
        this.route.navigate(['/class/topicsAndCurriculum/3']);
        // this.addclass(value, id);
    }

    setSearch_Filter(id) {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.classSearch));
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                    items.studentName = this.searchStudent;
                    items.className = this.searchClass;
                    items.subject = this.selectSubject;
                    items.grade = this.selectGrade;
                    items.teacher = this.selectTeacher;
                    items.curriculum_Folder = this.selectCurriculumFolder;
                    items.classDateStatus = id;
                } else {
                    const searchData = {
                        grade: this.selectGrade,
                        subject: this.selectSubject,
                        teacher: this.selectTeacher,
                        className: this.searchClass,
                        studentName: this.searchStudent,
                        curriculum_Folder: this.selectCurriculumFolder,
                        school_id: this.auth.getSessionData('rista-school_id'),
                        classDateStatus: this.classlisthighlight
                    };
                    data.push(searchData);
                }
            });
            data = data.filter((test, index, array) =>
                index === array.findIndex((findTest) =>
                findTest.school_id === test.school_id
                )
            );
            this.auth.setSessionData(SessionConstants.classSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.classSearch));
        let teacher_id: any;
        if (this.auth.getRoleId() == '4') {
            teacher_id = this.auth.getUserId();
        } else {
            teacher_id = '0';
        }
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                this.searchStudent = items.studentName;
                this.searchClass = items.className;
                this.selectSubject = items.subject;
                this.selectGrade = items.grade;
                this.selectTeacher = items.teacher;
                this.selectCurriculumFolder = items.curriculum_Folder;
                this.classlisthighlight = items.classDateStatus;
                return false;
            } else {
                this.searchClass = '';
                this.searchStudent = '';
                this.selectGrade = [];
                this.selectSubject = [];
                this.selectTeacher = null;
                this.selectCurriculumFolder = undefined;
                this.classlisthighlight = '3';
            }
            return true;
        });
    }

    getClassDetails(classData, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: classData.class_id,
            grade: [classData.grade_id],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.commondata.showLoader(true);
        this.classes.classDetails(data).subscribe((successData: any) => {
                this.commondata.showLoader(false);
                if (successData.IsSuccess) {
                    this.customLoader = false;
                    this.recordLoader = false;
                    console.log(successData, 'succ');
                    this.selectedClass = successData.ResponseObject[0];
                    if (type === 'call') {
                        this.selectedClass.allow_zoom_api = classData.allow_zoom_api;
                        const day = new Date().getDay();
                        const date = new Date();
                        var offset = -300; //Timezone offset for EST in minutes.
                        var estDate = new Date(date.getTime() + offset * 60 * 1000);
                        console.log(estDate, 'estDate');
                        console.log(new Date(), 'new Date()');
                        console.log(estDate.getUTCDay(), 'estDate.getUTCDay()');
                        /// day started from sunday => 0 , we are adding class in from the value 1 => monday .
                        const dayValue = estDate.getUTCDay() == 0 ? 7 : estDate.getUTCDay();
                        this.selectedClass.availabilityDate = this.selectedClass.availabilityDate.filter((item) => {
                            return item.slotday == dayValue;
                        });
                        console.log(this.selectedClass.availabilityDate, 'date');
                        if (this.selectedClass.availabilityDate.length == 0) {
                            this.modalRef = this.modalService.open(this.zoomDialog1, {size: 's'});
                        } else if (this.selectedClass.availabilityDate.length > 1) {
                            this.modalRef = this.modalService.open(this.meetingSelection, {size: 'lg'});
                            // if (this.roleId == '2') {
                            //     this.modalRef = this.modalService.open(this.meetingSelection, {size: 's'});
                            // } else if (this.roleId == '4') {
                            //     this.selectedClass.availabilityDate = this.selectedClass.availabilityDate.filter((item) => {
                            //         return this.userId == item.teacher_id;
                            //     });
                            // }
                        } else {
                            if (this.selectedClass.allow_zoom_api == '0') {
                                console.log(this.selectedClass.availabilityDate[0], 'this.selectedClass.availabilityDate[0]');
                                this.navigateOutsideZoom(this.selectedClass.availabilityDate[0]);
                            } else {
                                this.getMeetingLink(this.selectedClass, 0);
                            }
                        }
                    } else if (type === 'recording') {
                        // let recordings = [];
                        // this.selectedClass.availabilityDate.forEach( (item) => {
                        //     recordings.push(...item.meeting_recording);
                        // });
                        // this.videoSource = recordings;
                        this.getClassRecording(classData);
                    }
                }
            },
            (error) => {
                this.commondata.showLoader(false);
                this.customLoader = false;
                this.enterListFailure(error);
            });
    }

    chooseSchedule(datum, index) {
        if (datum.allow_zoom_api == '0') {
            this.navigateOutsideZoom(this.selectedClass.availabilityDate[index]);
        } else {
            this.getMeetingLink(datum, index);
        }
    }

    getMeetingLink(datum, index) {
        console.log(datum, 'datum')
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            start_date: datum.start_date,
            end_date: datum.end_date,
            class_id: datum.class_id,
            class_type: datum.class_type,
            allow_zoom_api: datum.allow_zoom_api,
            notes: datum.notes,
            schedule_id: datum.availabilityDate[index].shechdule_id,
            slotday: datum.availabilityDate[index].slotday,
            slotstarttime: datum.availabilityDate[index].slotstarttime,
            slotendtime: datum.availabilityDate[index].slotendtime,
            slotselected: datum.availabilityDate[index].slotselected,
        };
        this.classes.zoomInstant(data).subscribe((successData: any) => {
            this.zoomInstantSuccess(successData, datum);
        }, (error) => {
            this.toastr.error(error.ErrorObject, 'Failed!');
            this.commondata.showLoader(false);
        });
    }

    zoomInstantSuccess(successData, datum) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            console.log(successData.ResponseObject, 'successData.ResponseObject');
            if (datum.allow_zoom_api == '0') {
                // this.navigateOutsideZoom(successData.ResponseObject);
            } else if (datum.allow_zoom_api == '1') {
                if (this.settingValue == '2') {
                    this.selectedClass.teacher_link = successData.ResponseObject.teacher_link;
                    console.log(this.selectedClass, 'selectedClass both')
                    this.modalRef = this.modalService.open(this.zoomDialog, {size: 's'});
                } else if (this.settingValue == '1') {
                    this.navigateOutsideZoom(successData.ResponseObject);
                } else if (this.settingValue == '0') {
                    this.zoomService.initZoomMeeting(datum);
                }
            }
        } else {
            this.toastr.error(successData.ErrorObject, 'Failed!');
        }
    }

    getClassRecording(classData) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: classData.class_id,
            grade: [classData.grade_id],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.classes.recording(data).subscribe((successData: any) => {
            this.commondata.showLoader(false);
            if (successData.IsSuccess) {
                console.log(successData, 'successdatasdd')
                let recordings = [];
                successData.ResponseObject.forEach((item) => {
                    recordings.push(...item.meeting_recording);
                });
                this.videoSource = recordings;
                // this.videoSource = successData.ResponseObject;
                this.modalRef = this.modalService.open(this.recordinglist, {size: 's'});
            }
        }, (error) => {
            this.commondata.showLoader(false);
        });
    }

    openZoomDialog(classData) {
        this.selectedClass = classData;
        this.emailList = [];
        console.log(this.selectedClass, 'selectedClass')
        if (!this.customLoader) {
            this.customLoader = true;
            this.getClassDetails(classData, 'call');
        }
    }

    openRecordingList(classData) {
        this.selectedClass = classData;
        console.log(this.selectedClass, 'selectedClass')
        if (!this.recordLoader) {
            this.recordLoader = true;
            this.getClassDetails(classData, 'recording');
        }

    }

    navigateOutsideZoom(data) {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        if (this.selectedClass.allow_zoom_api == '0') {
            console.log(data.meeting_link, 'data.meeting_link');
            link.setAttribute('href', data.meeting_link);
        } else {
            console.log(data.teacher_link, 'data.teacher_link');
            link.setAttribute('href', data.teacher_link);
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    videoTemplate(data) {
        this.modalRef1 = this.modalService.open(this.video, {size: "lg"});
    }

    navigateOutsideRecording(data) {

        console.log(data, 'data');
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        // link.setAttribute('href', data.meeting_recording);
        link.setAttribute('href', data.play_video);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    addStudent(value, index) {
        console.log(value, 'list');
        this.selectedClassid = index;
        this.studentName = [];
        this.selectClassData = value;
        this.searchStudentList(1);
        this.modalRef = this.modalService.open(this.addStudentDialog, {
            size: 'lg',
            windowClass: 'customModalRef',
            scrollable: false
        });
    }

    getGradeValue(event) {
        console.log(event, 'event')
        if (typeof event == 'undefined') {
            this.gradeValue = [];
            this.searchStudentList(1);
        } else if (event.length == 0) {
            this.gradeValue = undefined;
            this.searchStudentList(2);
            this.studentDataList = [];
        } else {
            this.gradeValue = [];
            for (let i = 0; i < event.length; i++) {
                this.gradeValue.push(event[i].grade_id);
            }
            this.searchStudentList(1);
        }
    }

    searchStudentList(id) {
        if (this.gradeValue != '') {
            const data = {
                platform: 'web',
                type: 'list',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                end_date: this.choosedData[0].end_date,
                grade_id: this.gradeValue,
            };
            this.classes.searchList(data).subscribe((successData) => {
                    this.addstudentListSuccess(successData, id);
                },
                (error) => {
                    this.addstudentListFailure(error);
                });
        } else {
            this.studentDataList = [];
        }
    }

    addstudentListSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.studentDataList = successData.ResponseObject;
            console.log(this.studentDataList, 'studentDataLIST')
            // this.studentName = undefined;
            const result1 = this.studentDataList;
            const result2 = this.studentData;
            this.studentDataList = result1.filter(function (o1) {
                return !result2?.some(function (o2) {
                    return o1.student_id === o2.student_id; // return the ones with equal id
                });
            });
            // this.studentName = [];
            // this.newlySelectedStuent = this.studentDataList;
            console.log(this.newlySelectedStuent, 'newlyAddeddd');
            this.studentDataList.forEach((list) => {
                if (this.auth.getRoleId() == '4' && !this.showEmailId) {
                    list.name_with_email = list.name + (list.grade_name != '' ? '  - ' + list.grade_name : '');
                } else {
                    list.name_with_email = list.name + ' ( ' + (list.student_id)  + ' ) ' + (list.grade_name != '' ? '  - ' + list.grade_name : '');
                }
            });
            console.log(this.studentDataList, 'studentDataList');
            if (id == 2) {
                // this.studentDataList = [];
                this.studentName = [];
            }
        }
        // this.selectAllForDropdownItems(this.schoolDataList);
    }

    addstudentListFailure(error) {
        console.log(error, 'error');
    }

    closeStudentModRef() {
        this.modalRef.close();
        this.gradName = undefined;
        this.newlySelectedStuent = [];
        this.schoolDataList = [];
    }

    getStudentFullDetail(item) {
        this.allStudentList.forEach((val) => {
            if (val.user_id == item.user_id) {
                this.viewdetail = val;
                this.studentName = val.student_name;
            }
        });
        this.modalRef = this.modalService.open(this.viewoveralldetails, {size: 'xl'});
        console.log(this.viewdetail, 'viewDetail');
    }

    studentFullDetailSuccess(successData, item) {
        if (successData.IsSuccess) {

        }
    }

    editStudent(rows) {
        if (this.allowEdit == true) {
            this.allStudentList.forEach((list) => {
                if (list.user_id == rows.user_id) {
                    console.log(list, 'student pass data');
                    this.auth.setSessionData('editStudent', JSON.stringify(list));
                    this.auth.setSessionData('navigation', 'class');
                    this.route.navigate(['/student/create-student/edit']);
                }
            });
        } else if (this.allowEdit == false) {
            this.toastr.error('You don\'t have permission to update student details');
        }
    }

    studentList() {
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.student.getStudentList(data).subscribe((successData) => {
                this.studentListSuccess(successData);
            },
            (error) => {
                console.log(error, 'student list err');
            });
    }

    studentListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.allStudentList = successData.ResponseObject;
        }
    }

    studentSelect(event) {
        console.log(event, 'dasda');
        this.newlySelectedStuent = event;
        console.log(this.studentName, 'stdeuntANamda');
    }

    deleteStudentAlert(value) {
        this.modalRef = this.modalService.open(this.deleteStudentAlertDialog, {size: 's'});
        this.getDeleteStudentData = value;
    }

    deleteStudentList(value) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.studentShow,
            student_id: value.user_id
        };
        this.classes.deleteStudentList(data).subscribe((successData) => {
                this.deleteStudentListSuccess(successData, value);
            },
            (error) => {
                console.log(error);
            });
    }

    deleteStudentListSuccess(successData, value) {
        if (successData.IsSuccess) {
            // this.studentData = [];
            this.studentData.forEach((item, index) => {
                console.log(item, 'items');
                if (item.user_id == value.user_id) {
                    this.studentData.splice(index, 1);
                }
            });
            console.log(this.studentData, 'studentDta')
            this.modalRef.close();
            this.toastr.success(successData.ResponseObject);
            this.enterList(this.selectedClassid, 'yes', 'eve');
            // this.classList(this.classlisthighlight);
        }
    }

    submitClass(type) {
        if (this.newlySelectedStuent.length != 0) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.selectClassData.school_id,
                teacher_id: this.selectClassData.teacher_id,
                class_name: this.selectClassData.class_name,
                subject: this.selectClassData.subject,
                start_date: this.selectClassData.start_date,
                end_date: this.selectClassData.end_date,
                start_time: this.selectClassData.start_time,
                end_time: this.selectClassData.end_time,
                grade: this.gradName == undefined ? '' : this.gradName,
                meeting_link: this.selectClassData.meeting_link,
                meeting_id: this.selectClassData.meeting_id,
                passcode: this.selectClassData.passcode,
                class_code: this.selectClassData.class_code,
                status: this.selectClassData.status,
                class_id: this.selectClassData.class_id,
                students: this.newlySelectedStuent,
            };
            this.classes.submit(data).subscribe((successData) => {
                    this.submitClassSuccess(successData, type);
                },
                (error) => {
                    this.submitClassFailure(error);
                });
        } else {
            this.toastr.error('Please Select Student');
        }
    }

    submitClassSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.newlySelectedStuent = [];
            this.gradName = undefined;
            this.auth.setSessionData('submit-data', JSON.stringify(successData.ResponseObject[0]));
            this.auth.removeSessionData('updatedStudent');
            this.auth.removeSessionData('readonly_data');
            this.auth.removeSessionData('readonly_startdate');
            this.auth.removeSessionData('studentlist1');
            this.auth.removeSessionData('class-curriculum');
            const redirectSchedulePage = !!this.auth.getSessionData('enterThroughSchedule');
            this.modalRef.close();
            if (type == '1') {
                this.toastr.success(successData.ResponseObject, 'Class');
                this.auth.removeSessionData('editView');
                if (redirectSchedulePage == true) {
                    this.auth.removeSessionData('enterThroughSchedule');
                    // this.route.navigate(['/schedule/schedule-page']);
                } else {
                    // this.route.navigate(['/class/list-class']);
                }
                this.studentData = [];
                this.enterList(this.selectedClassid, 'yes', 'eve');
            }
        } else {
            this.toastr.error(successData.ResponseObject);
        }
    }

    submitClassFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject);
    }

    bulkMail() {
        this.emailList;
        console.log(this.emailList, 'mail');
        if (this.emailList.length != 0) {
            for (let i = 0; i < this.emailList.length; i++) {
                this.blukEmailValue.push(this.emailList[i].value);
            }
            console.log(this.blukEmailValue, 'emaildata');
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                class_id: this.selectClassData.class_id,
                student_id: [],
                email_id: this.blukEmailValue
            };
            this.classes.bulkMail(data).subscribe((successData) => {
                    this.bulkMailSuccess(successData);
                },
                (error) => {
                    this.bulkMailFailure(error);
                });
        } else {
            this.toastr.error('Enter emailId is required');
        }
    }

    bulkMailSuccess(successData) {
        if (successData.IsSuccess) {
            this.modalRef.close();
            this.toastr.success(successData.ResponseObject);
        } else {
            this.blukEmailValue = [];
            this.toastr.error(successData.ErrorObject);
        }
    }

    bulkMailFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject, 'Class');
    }

    check() {
        console.log(this.studentEmailForm, 'form');
        console.log(this.studentEmailForm.get('emails').hasError('incorrectEmail'), 'hasError');
        console.log(this.studentEmailForm.invalid, 'invalid');
    }

    submitChangeClass() {
        if (this.idForClass == this.studentClassChange.controls.toClass.value) {
            this.toastr.error('From Class and To Class should be different');
            return false;
        }
        console.log(this.studentClassChange.controls.from_startdate.value, 'startdata');
        if (this.studentClassChange.valid) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                from_class: this.idForClass,
                to_class: this.studentClassChange.controls.toClass.value,
                from_date: this.selectedToClass.start_date,
                end_date: this.selectedToClass.end_date,
                joining_date: this.studentClassChange.controls.from_startdate.value == null ? '' : this.datePipe.transform(this.studentClassChange.controls.from_startdate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                student_id: this.selectedChangeStudent.user_id,
                status: '1'
            };
            this.student.changeClass(data).subscribe((successData) => {
                    this.submitChangeSuccess(successData);
                },
                (error) => {
                    console.error(error, 'Submit_error');
                });
        } else {
            this.validationService.validateAllFormFields(this.studentClassChange);
            this.toastr.error('Please Select all the mandatory fields');
        }
    }

    submitChangeSuccess(successData) {
        if (successData.IsSuccess) {
            this.onSelect(this.selectedChangeStudent, 'non_direct');
            console.log(successData.ResponseObject, 'dasd');
            this.toastr.success(successData.ResponseObject);
            this.removeAction([this.selectedChangeStudent]);
            this.modalRef.close();
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    onSelect(selected, type) {
        let selectedItem = [];
        if (type == 'direct') {
            // this.selected = selected.selected;
            selected.selected.forEach((item) => {
                selectedItem.push(item.user_id);
            });
        } else {
            let shiftSelected = [selected]
            // this.selected = shiftSelected;
            shiftSelected.forEach((item) => {
                selectedItem.push(item.user_id);
            });
        }
        // type == 'direct' ? selected.selected : selected;
        // this.selected = selected.selected;
        // selected.selected.forEach((item) => {
        //     selectedItem.push(item.user_id);
        // });
        this.studentData.forEach((item) => {
            item.isSelect = selectedItem.includes(item.user_id);
        });
    }

    removeAction(selected) {
        let data = [];
        //    this.selected = [];
        this.studentData.forEach((item, index) => {
            if (item.isSelect == false) {
                data.push(item);
            }
        });

        //    this.selected.filter((item) => {
        //         return item.isSelect == true;
        //     });
        //    this.selectedRows = selected;
        //     for (let j = 0; j < this.selectedRows.length; j++) {
        //         for (let k = 0; k < this.studentData.length; k++) {
        //             if (this.selectedRows[j].student_id == this.studentData[k].student_id) {
        //                 this.studentData[k].status = '0';
        //             }
        //         }
        //     }
        this.studentData = [...data];
        //    this.temp = data;
        this.auth.setSessionData('studentlist1', JSON.stringify(this.studentData));
        this.auth.setSessionData('studentlist', JSON.stringify(this.studentData));
    }

    closeOverAll() {
        this.modalRef.close('viewoveralldetails');
    }
}
