import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { AssessmentService } from '../../../shared/service/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigurationService } from '../../../shared/service/configuration.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClassService } from '../../../shared/service/class.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../shared/service/common.service';
import { CommonDataService } from '../../../shared/service/common-data.service';
import { CreatorService } from '../../../shared/service/creator.service';
import { NavService } from '../../../shared/service/nav.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DatePipe } from '@angular/common';
import { IMyDateModel } from 'angular-mydatepicker';
import { ValidationService } from '../../../shared/service/validation.service';
import { NewsubjectService } from '../../../shared/service/newsubject.service';
import { SessionConstants } from '../../../shared/data/sessionConstants';
import { dateOptions, timeZone } from '../../../shared/data/config';

@Component({
    selector: 'app-create-assessment',
    templateUrl: './content-home.component.html',
    styleUrls: ['./content-home.component.scss']
})

export class ContentHomeComponent implements OnInit, OnDestroy {
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getDate() - 1 : -1,
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    myDpOptions2: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    @ViewChild(HeaderComponent) header: HeaderComponent;
    public linkform: FormGroup;
    public repeatlink: FormArray;
    public assessmentUpload: boolean;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public gradeData: any;
    public subjectData: any;
    public schoolId: any;
    public tagData: any;
    public contentdata: any;
    public detailData: any;
    public checkAutoRelease = true;
    public tagid: any = [];
    public gradeid: any = [];
    public subjectid: any = [];
    public pdfpath: any;
    public pdfpaththumb: any;
    public contentFormat: any;
    public checkQuestion: any;
    public webhost: any;
    public details: any;
    public libraryselection: any;
    public filterselection: any;
    public response: any;
    public pdflinks: any = [];
    public teacherData: any = [];
    public typeid: any;
    public contentDetaildata: any;
    public sortfilter: any;
    public contentUserid: any;
    public sortdetails: boolean;
    public profileurl: any;
    public createdby: any;
    public gradename: any;
    public tags: any;
    public type: any;
    public noofquestions: any;
    public totalpoints: any;
    public description: any;
    public subjectname: any;
    public highlight: any;
    public submitType: any;
    public cclist: any;
    public showIcon: boolean;
    public exactSearch: boolean = false;
    public contentUserId: any;
    public open: boolean;
    public pageNo: any = 1;
    public totalRecords: any;
    public threshhold: any;
    public choosedData: any;
    public className: any;
    public classid: any;
    public contentName: any;
    public submitData: any;
    public listStudent: boolean;
    public meridian: boolean;
    public spinner: boolean;
    public classData: any = [];
    public classDataSample = [];
    public topicsData: any = [];
    public classDetails: any;
    public allStudent: any;
    public contentid: any;
    public studentid: any;
    public randomSize: any;
    public contentdatabackup: any;
    public contentType: any;
    public detailButtonPreview: boolean;
    public allowDropDown: boolean;
    public edit: any;
    public assignIcon: any;
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    direction = '';
    modalOpen = false;
    public assignType: any;
    public previewType: any;
    public contentIcon: boolean;
    public assignDirect: boolean;
    public studentData: any;
    public classDropDown: boolean;
    public schoolListDetails: any;
    public selector: string = '.scrollPanel';
    public tagname: any;
    public browseAllAssign: boolean;
    public schoolid: any;
    public allowEdit: boolean;
    public timeErr: boolean;
    public resourcetype: boolean;
    public defaultShow: boolean;
    public firstAssign: boolean;
    public batchData: any;
    public showBatch: boolean;
    public assign: string;
    public batchid: any;
    public classbatchid: any;
    public endDate: any;
    public startdate: any;
    public end: any;
    public start: any;
    public searchKey: any = '';
    public roleid: any;
    public dateValidation: boolean;
    public allowCurriculum: boolean;
    public selectAuthored: any = '';
    public selectDraft: any = '';
    public deleteValue: any;
    public backContentIcon: boolean;
    public searchTime: any;
    public allowScore: boolean;
    public releaseGrade: any;
    public schoolStatus: any;
    public studentShow: any;
    public clearSession: boolean = true;
    public contentAssign = '';
    public contentFolder = true;
    public showInformation = true;
    public model: { singleDate: { jsDate: Date }; isRange: boolean };
    @ViewChild('detailsTemplate') addDetails: TemplateRef<any>;
    @ViewChild('select') addAsset: TemplateRef<any>;
    @ViewChild('allCreateContent') createContentTemp: TemplateRef<any>;
    @ViewChild('createScratch') createScratchTemp: TemplateRef<any>;
    @ViewChild('resources') addResources: TemplateRef<any>;
    @ViewChild('assignment') addAssignment: TemplateRef<any>;
    @ViewChild('assessment') addAssessment: TemplateRef<any>;
    @ViewChild('assign') addAssign: TemplateRef<any>;
    @ViewChild('batchassign') adddirectAssign: TemplateRef<any>;
    @ViewChild('delete') deleteList: TemplateRef<any>;

    @ViewChild('hiddenBtn', { static: false }) myHiddenBtn;

    public neededButtonType = '';
    public showModal = false;

    constructor(public auth: AuthService, public config: ConfigurationService, public assessment: AssessmentService, public route: ActivatedRoute, private formBuilder: FormBuilder,
        public sanitizer: DomSanitizer, private modalService: NgbModal, public router: Router, public classService: ClassService, public creatorService: CreatorService,
        public toastr: ToastrService, public common: CommonService, public commondata: CommonDataService, public navServices: NavService, public datePipe: DatePipe,
        public validationService: ValidationService, public cdr: ChangeDetectorRef, public newSubject: NewsubjectService) {
        this.route.params.forEach((params) => {
            this.type = params.type;
        });
        this.assessmentUpload = false;
        if (this.auth.getRoleId() != '3') {
            this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        }
        this.dateValidation = true;
        this.model = { isRange: false, singleDate: { jsDate: new Date() } };
        if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
            this.choosedData = JSON.parse(this.auth.getSessionData('card-data'));
        } else {
            this.choosedData = JSON.parse(this.auth.getSessionData('rista-classbatch'));
        }
        this.contentAssign = this.auth.getSessionData('rista-assignedForm');
        console.log(this.contentAssign, 'content');
        this.randomSize = true;
        this.pageNo = 1;
        this.sortdetails = false;
        this.listStudent = false;
        this.meridian = true;
        this.spinner = false;
        this.assignIcon = false;
        this.contentIcon = true;
        this.detailButtonPreview = false;
        this.backContentIcon = true;
        this.allowEdit = true;
        this.webhost = this.config.getimgUrl();
        this.schoolId = this.auth.getSessionData('rista-school_id');
        this.roleid = this.auth.getSessionData('rista-roleid');
        if (this.auth.getRoleId() == '3' || this.schoolStatus?.length != 0) {
            this.newSubject.schoolChange.subscribe((res: any) => {
                if (res != '') {
                    if (this.router.url.includes('content-home')) {
                        this.contentdata = [];
                        this.pageNo = 1;
                        this.init(res);
                    }
                } else {
                    this.init(this.auth.getSessionData('rista-school_id'));
                }
            });
        }

        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            this.assignDirect = true;
            this.allowCurriculum = true;
        } else if (this.auth.getSessionData('rista-roleid') == '3') {
            this.assignIcon = true;
            this.showIcon = false;
            this.detailButtonPreview = true;
            this.allowCurriculum = true;
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            this.assignIcon = false;
            this.showIcon = true;
            this.assignDirect = true;
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.browseAllAssign = false;
        }
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            console.log('rista-resourceAccess');
            this.showIcon = true;
            this.assignIcon = true;
            this.assignDirect = false;
            this.backContentIcon = false;
            if (this.auth.getRoleId() == '4') {
                // this.contentIcon = this.schoolListDetails.permissions[4].permission[0].status == 1 &&
                //     this.auth.getSessionData('rista-assignedForm') == 'class';
                this.contentIcon = this.schoolListDetails.permissions[4].permission[0].status == 1;
            } else {
                this.contentIcon = true;
            }
            if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                this.className = this.choosedData[0].class_name;
                this.classid = this.choosedData[0].class_id;
            } else if (this.auth.getSessionData('rista-batchassign') == '2') {
                this.className = this.choosedData.batch_name;
                this.classid = this.choosedData.batch_id;
            }
            this.browseAllAssign = false;
        } else if (this.auth.getSessionData('rista-browseAll') == 'true') {
            this.browseAllAssign = true;
            this.assignDirect = false;
        } else {
            this.auth.removeSessionData('rista-assignedForm');
        }
        this.linkform = this.formBuilder.group({
            classname: [''],
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            radio: ['1'],
            typeSelection: ['n/a'],
            batch: [''],
            specificstudent: '',
            classSelect: '',
            topicSelect: '',
            teacherSelect: [],
            releaseScore: '0',
            notes: '',
            downloadcontent: ''
        });
        this.linkform.controls.classSelect.patchValue(null);
        this.linkform.controls.topicSelect.patchValue(null);
        this.linkform.controls.batch.patchValue(null);
        const stObject = { hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00') };
        this.linkform.controls.startTime.patchValue(stObject);
        const etObject = { hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00') };
        this.linkform.controls.endTime.patchValue(etObject);
        // this.typeid = 'list';
        this.cclist = [];
        this.auth.removeSessionData('updatedStudent');
        this.auth.removeSessionData('readonly_data');
        this.auth.removeSessionData('readonly_startdate');
    }

    ngOnInit(): void {
        this.allowDropDown = false;
        this.newSubject.allowSchoolChange(this.allowDropDown);
        this.totalRecords = 0;
        this.threshhold = 0;
        // this.sortfilter = '0';
        // this.contentUserId = '0';
        // this.typeid = 'list';
        // this.open = false;
        // this.creatorService.changeViewList(this.open);
        // this.navServices.collapseSidebar = false;
        this.contentdata = [];
        this.contentdatabackup = [];
        this.commondata.showLoader(false);

        this.auth.removeSessionData('rista-backOption');
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getRoleId() == '6') {
            this.classList();
            if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                this.liststudent();
            }
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
                if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                    this.classList();
                    this.liststudent();
                }
            }
        }
        this.teacherList();
        if (this.sortfilter == '0' || this.sortfilter == '-1' || this.sortfilter == 'AZ' || this.sortfilter == 'ZA') {
            this.contentUserid = '0';
        } else if (this.sortfilter != '0' && this.sortfilter != '-1' || this.sortfilter != 'AZ' || this.sortfilter != 'ZA') {
            this.contentUserid = this.sortfilter;
        }
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            this.allowDropDown = true;
            this.newSubject.allowSchoolChange(this.allowDropDown);
        }

        if (this.auth.getRoleId() != '4') {
            this.contentFolder = true;
        } else {
            console.log(this.schoolListDetails.permissions[5]);
            this.contentFolder = this.schoolListDetails.permissions[5].permission[0].status == 1;
        }
        console.log(this.contentFolder, 'contentFolder');
        this.neededButtonType = this.auth.getSessionData('rista-return');
    }

    ngOnDestroy(): void {
        // this.auth.setSessionData('rista-contentType', '');
        if (this.clearSession) {
            this.auth.setSessionData('rista-resourceAccess', false);
        }
        this.auth.removeSessionData('rista-allowCurriculum');
    }

    init(id) {
        this.schoolId = this.auth.getSessionData('rista-school_id');
        this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        let curriculum: any;
        curriculum = this.auth.getSessionData('rista-allowCurriculum');
        if (this.roleid == '4' && this.schoolListDetails.individual_teacher != 1 && curriculum != '1') {
            if (this.schoolListDetails.permissions[4].allowNav) {
            } else {
                this.router.navigate(['/home/list-home']);
            }
        } else if (this.roleid == '4' && this.schoolListDetails.individual_teacher != 1 && curriculum == '1') {
        }
        if (this.roleid == '4') {
            if (this.schoolListDetails.permissions[4].permission[0].status == 1) {
                this.contentIcon = true;
            } else if (this.schoolListDetails.permissions[4].permission[0].status == 0) {
                this.contentIcon = false;
            }
            if (this.schoolListDetails.permissions[4].permission[1].status == 1) {
                this.allowEdit = true;
            } else if (this.schoolListDetails.permissions[4].permission[1].status == 0) {
                this.allowEdit = false;
            }
            if (this.schoolListDetails.individual_teacher != 0) {
                this.allowCurriculum = true;
            } else {
                if (this.schoolListDetails.permissions[6].permission[3].status == 1) {
                    this.allowCurriculum = true;
                } else if (this.schoolListDetails.permissions[6].permission[3].status == 0) {
                    this.allowCurriculum = false;
                }
            }
        }
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            this.libraryselection = this.auth.getSessionData('rista-contentType');
        }
        // this.clearall();
        this.getSearch_Filter();
        this.sortlist();
        this.subjectList();
        this.gradeList();
        this.tagList();
        // this.contentCreators();
        this.classList();
    }

    onScrollDown(ev) {
        this.direction = 'down';
        this.pageNo++;
        this.sortlist();
    }

    onUp(ev) {
        this.direction = 'up';
    }

    sortExact() {
        this.pageNo = 1;
        if (this.searchKey != '') {
            this.sortlist();
        }
        this.setSearch_Filter();
    }

    updateFilter(event) {
        this.searchKey = event;
        clearTimeout(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.sortlist();
            this.setSearch_Filter();
        }, 1200);
        this.pageNo = 1;
    }

    onDateChanged1(event: any): void {
        this.myDpOptions.disableSince = event.date;
    }

    enterList() {
        if (this.auth.getSessionData('rista-batchassign') == '2') {
            this.router.navigate(['class/view-assign/2']);
        } else {
            this.classDetailService();
        }
    }

    classDetailService() {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.choosedData[0].class_id
        };
        this.classService.classDetails(data).subscribe((successData) => {
            this.enterListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_enter');
            });
    }

    enterListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.auth.setSessionData('classView', true);
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
            this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
            if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
                if (this.auth.getSessionData('rista-batchassign') == '1') {
                    this.router.navigate(['/class/topicsAndCurriculum/1']);
                } else if (this.auth.getSessionData('rista-batchassign') == '3') {
                    this.router.navigate(['class/topicsAndCurriculum/3']);

                }
                // else if (this.auth.getSessionData('rista-batchassign') == '2') {
                //     this.router.navigate(['class/view-assign/2']);
                // }
            }
            this.auth.removeSessionData('rista-assignedForm');
        }
    }

    contentCreators() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId
        };
        this.creatorService.contentCreatorList(data).subscribe((successData) => {
            this.contentCreatorListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_contentList');
            });
    }

    contentCreatorListSuccess(successData) {
        if (successData.IsSuccess) {
            this.cclist = successData.ResponseObject;
        }
    }

    classList() {
        const data = {
            platform: 'web',
            type: '5',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.classService.classesList(data).subscribe((successData) => {
            this.classListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_classLst');
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            this.classData = successData.ResponseObject;
            this.classDataSample = successData.ResponseObject;
        }
    }

    topicsList(classID) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: classID,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        this.classService.topicList(data).subscribe((successData) => {
            this.viewTopicListSuccess(successData);
        },
            (error) => {
                console.log(error);
            });
    }

    viewTopicListSuccess(successData) {
        if(successData.IsSuccess) {
            this.topicsData = successData.ResponseObject;
        }
    }

    liststudent() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id
        };
        this.creatorService.classList(data).subscribe((successData) => {
            this.studentListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_studentList');
            });
    }

    studentListSuccess(successData) {
        if (successData.IsSuccess) {
            this.studentData = successData.ResponseObject;
        }
    }

    dummyStudent(event) {
        let classID = this.linkform.controls.classSelect.value;
        this.topicsList(classID);
        if (event != undefined) {
            this.linkform.controls.specificstudent.patchValue([]);
            this.classbatchid = event.batch_id;
            if (event.start_date != '0000-00-00') {
                const sd = event.end_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: { jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2])) },
                    dateRange: null
                };
                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                const dropped = dr1.split('-');
                const droppedObject: IMyDateModel = {
                    isRange: false,
                    singleDate: { jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2])) },
                    dateRange: null
                };
                this.linkform.controls.startDate.patchValue(droppedObject);
                this.myDpOptions2 = {};
                this.myDpOptions2 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: this.myDpOptions.disableUntil.year,
                        month: this.myDpOptions.disableUntil.month,
                        day: this.myDpOptions.disableUntil.day
                    }
                };

                this.startdate = event.start_date;
            } else {
                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                const dropped = dr1.split('-');
                const droppedObject: IMyDateModel = {
                    isRange: false,
                    singleDate: { jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2])) },
                    dateRange: null
                };
                this.linkform.controls.startDate.patchValue(droppedObject);
            }
            if (event.end_date != '0000-00-00') {
                const sd = event.end_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: { jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2])) },
                    dateRange: null
                };
                // this.linkform.controls.endDate.patchValue(sdObject);
                this.myDpOptions1 = {};
                this.myDpOptions1 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: this.myDpOptions.disableUntil.year,
                        month: this.myDpOptions.disableUntil.month,
                        day: this.myDpOptions.disableUntil.day
                    }
                };
                this.endDate = event.end_date;
            } else {
                this.linkform.controls.endDate.patchValue(null);
            }
            this.liststudent1(event.class_id);
        } else {
            this.linkform.controls.endDate.patchValue(null);
            this.linkform.controls.specificstudent.patchValue([]);
            this.studentData = [];
        }
    }

    teacherFilter(event) {
        console.log(event);
        this.linkform.controls.classSelect.patchValue([]);
        this.linkform.controls.specificstudent.patchValue([]);
        this.linkform.controls.topicSelect.patchValue(null);
        this.topicsData = [];
        this.studentData = [];
        this.linkform.controls.endDate.patchValue(null);
        if (event != undefined) {
            this.classData = this.classDataSample.filter((val) => {
                return event.teacher_id == val.teacher_id;
            });
        } else {
            this.classData = this.classDataSample;
        }
        console.log(this.classData, 'classData');
        console.log(this.classDataSample, 'classDataSample');
    }
    releaseScoreFilter(event) {
        this.checkAutoRelease = true;
        if (event.target.value == '1') {
            this.releaseScoreCheck();
        }
    }
    releaseScoreCheck() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.contentid
        };
        this.creatorService.releaseScoreCheck(data).subscribe((successData) => {
            this.releaseCheckSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_studentList');
            });
    }
    releaseCheckSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData, 'check success');
        } else {
            this.checkAutoRelease = false;
            setTimeout(() => {
                this.linkform.controls.releaseScore.patchValue('0');
                this.checkAutoRelease = true;
            }, 3000);
        }
    }

    liststudent1(id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: id
        };
        this.creatorService.classList(data).subscribe((successData) => {
            this.studentListSuccess1(successData);
        },
            (error) => {
                console.error(error, 'error_studentList');
            });
    }

    studentListSuccess1(successData) {
        if (successData.IsSuccess) {
            this.studentData = successData.ResponseObject;
        }
    }

    detailpreviewlist(id, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.contentdata[id].content_id,
            content_format: this.contentdata[id].content_format,
            school_id: this.schoolId
        };
        this.creatorService.detaillist(data).subscribe((successData) => {
            this.contentDetailsSuccess(successData, type, data);
        },
            (error) => {
                console.error(error, 'error_contentDetails');
            });
    }

    contentDetailsSuccess(successData, type, data) {
        if (successData.IsSuccess) {
            this.contentDetaildata = successData.ResponseObject;
            this.contentName = this.contentDetaildata.name;
            this.contentid = this.contentDetaildata.content_id;
            this.contentType = this.contentDetaildata.content_type;
            this.contentFormat = this.contentDetaildata.content_format;
            this.checkQuestion = this.contentDetaildata.without_question;
            this.profileurl = this.contentDetaildata.profile_url;
            this.createdby = this.contentDetaildata.created_by;
            this.gradename = this.contentDetaildata.grade_name;
            this.subjectname = this.contentDetaildata.subject_name;
            this.tags = this.contentDetaildata.tags;
            this.noofquestions = this.contentDetaildata.no_of_questions;
            this.totalpoints = this.contentDetaildata.total_points;
            this.description = this.contentDetaildata.description;
            this.releaseGrade = this.contentDetaildata.allow_autograde;
            this.assignType = type;
            if (this.contentDetaildata.status == '1') {
                this.details = 'Published';
            } else if (this.contentDetaildata.status == '5') {
                this.details = 'Draft';
            }
            if (type == 'assign') {
                if (this.details != 'Draft') {
                    if (this.contentType == this.auth.getSessionData('rista-contentType')) {
                        if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                            if (this.contentDetaildata.download == '1') {
                                this.linkform.controls.downloadcontent.patchValue(true);
                            } else if (this.contentDetaildata.download == '0') {
                                this.linkform.controls.downloadcontent.patchValue(false);
                            }
                            this.linkform.controls.notes.patchValue('');
                            this.topicsList(this.classid);
                            this.modalRef = this.modalService.open(this.addAssign, { centered: false, scrollable: false, windowClass: 'assignPopUp', size: 'lg', backdrop: 'static' });
                            this.classDropDown = false;
                            this.resourcetype = true;
                            this.defaultShow = true;
                            this.firstAssign = false;
                            this.assign = '1';
                            this.showBatch = false;
                            this.allowScore = true;
                            if (this.choosedData[0].start_date != '0000-00-00') {
                                const sd = this.choosedData[0].start_date.split('-');
                                const sdObject: IMyDateModel = {
                                    isRange: false,
                                    singleDate: { jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2])) },
                                    dateRange: null
                                };
                                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                                const dropped = dr1.split('-');
                                const droppedObject: IMyDateModel = {
                                    isRange: false,
                                    singleDate: { jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2])) },
                                    dateRange: null
                                };
                                this.linkform.controls.startDate.patchValue(droppedObject);
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
                                this.startdate = this.choosedData[0].start_date;
                            } else {
                                const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
                                const dropped = dr1.split('-');
                                const droppedObject: IMyDateModel = {
                                    isRange: false,
                                    singleDate: { jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2])) },
                                    dateRange: null
                                };
                                this.linkform.controls.startDate.patchValue(droppedObject);
                                // this.linkform.controls.startDate.patchValue(null);
                            }
                            if (this.choosedData[0].end_date != '0000-00-00') {
                                const sd = this.choosedData[0].end_date.split('-');
                                const sdObject: IMyDateModel = {
                                    isRange: false,
                                    singleDate: { jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2])) },
                                    dateRange: null
                                };
                                // this.linkform.controls.endDate.patchValue(sdObject);
                                this.myDpOptions1 = {};
                                this.myDpOptions1 = {
                                    dateRange: false,
                                    dateFormat: dateOptions.pickerFormat,
                                    firstDayOfWeek: 'su',
                                    disableUntil: {
                                        year: this.myDpOptions.disableUntil.year,
                                        month: this.myDpOptions.disableUntil.month,
                                        day: this.myDpOptions.disableUntil.day
                                    },
                                };
                                this.endDate = this.choosedData[0].end_date;
                            } else {
                                this.linkform.controls.endDate.patchValue(null);
                            }
                            this.allowScore = this.releaseGrade == '1' && this.contentType != '1' && this.checkQuestion != 1;
                        }
                        else if (this.auth.getSessionData('rista-batchassign') == '2') {
                            this.modalRef = this.modalService.open(this.adddirectAssign, {
                                size: 'lg',
                                backdrop: 'static'
                            });
                            this.assign = '2';
                            this.showBatch = true;
                            this.allowScore = this.releaseGrade == '1' && this.contentType != '1' && this.checkQuestion != 1;
                        }
                    } else {
                        this.toastr.error('Please assign Correct content type form Content-Library');
                    }
                } else {
                    this.toastr.error('Draft Content can\'t be assigned for class');
                }
            } else if (type == 'notassign') {
                if (this.details != 'Draft') {
                    if ((this.auth.getSessionData('rista-roleid') == '2') || this.auth.getRoleId() == '6' || (this.auth.getSessionData('rista-roleid') == '4') && (this.auth.getSessionData('rista-teacher_type') == '0')) {
                        this.batchDataList();
                        this.modalRef = this.modalService.open(this.addAssign, { centered: false, scrollable: false, windowClass: 'assignPopUp', size: 'lg', backdrop: 'static' });
                        this.classDropDown = true;
                        this.firstAssign = true;
                        if (this.contentDetaildata.download == '1') {
                            this.linkform.controls.downloadcontent.patchValue(true);
                        } else if (this.contentDetaildata.download == '0') {
                            this.linkform.controls.downloadcontent.patchValue(false);
                        }
                        this.linkform.controls.startDate.patchValue('');
                        this.linkform.controls.endDate.patchValue('');
                    }
                    else if ((this.auth.getSessionData('rista-roleid') == '4') && (this.auth.getSessionData('rista-teacher_type') == '1')) {
                        this.firstAssign = false;
                        this.classDropDown = true;
                        this.resourcetype = true;
                        this.defaultShow = true;
                        this.assign = '1';
                        this.startdate = '';
                        this.endDate = '';
                        if (this.contentDetaildata.download == '1') {
                            this.linkform.controls.downloadcontent.patchValue(true);
                        } else if (this.contentDetaildata.download == '0') {
                            this.linkform.controls.downloadcontent.patchValue(false);
                        }
                        this.linkform.controls.classSelect.patchValue(null);
                        this.linkform.controls.notes.patchValue('');
                        this.linkform.controls.releaseScore.patchValue('0');
                        this.linkform.controls.radio.patchValue('1');
                        this.linkform.controls.startDate.patchValue('');
                        this.linkform.controls.endDate.patchValue('');
                        this.modalRef = this.modalService.open(this.addAssign, { centered: false, scrollable: false, windowClass: 'assignPopUp', size: 'lg', backdrop: 'static' });
                    }
                } else {
                    this.toastr.error('Draft Content can\'t be assigned for class');
                }
            } else if (type == 'browseAssign') {
                let classDetails = JSON.parse(this.auth.getSessionData('rista-classData'));
                this.auth.setSessionData('browseContent_id', data.content_id);
                if (this.contentDetaildata.content_format == 1) {
                    classDetails.content_id.push(
                        {
                            type: 'pdf',
                            id: data.content_id,
                            name: this.contentDetaildata.file_path[0].image,
                            path: this.contentDetaildata.profile_url
                        });
                } else if (this.contentDetaildata.content_format == 2) {
                    classDetails.content_id.push(
                        {
                            id: data.content_id,
                            type: 'link',
                            name: this.contentDetaildata.links[0],
                            path: this.contentDetaildata.profile_url
                        });
                } else if (this.contentDetaildata.content_format == 3) {
                    classDetails.content_id.push(
                        {
                            id: data.content_id,
                            type: 'text',
                            name: this.contentDetaildata.file_text,
                            path: this.contentDetaildata.profile_url
                        });
                }
                this.auth.setSessionData('rista-classData', JSON.stringify(classDetails));
                this.router.navigate(['/class/create-class/add']);
            }
        }
    }

    assignResource(data, type) {
        this.detailpreviewlist(data, type);
        this.classList();
    }

    dateValidation1() {
        if (this.linkform.controls.startDate.value != null && this.linkform.controls.endDate.value != null && this.linkform.controls.startDate.value != '' && this.linkform.controls.endDate.value != '') {
            const startdate = this.datePipe.transform(this.linkform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const st = startdate.split('-');
            const endDate = this.datePipe.transform(this.linkform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const et = endDate.split('-');
            if (st[0] == et[0]) {
                if (st[1] == et[1]) {
                    this.dateValidation = st[2] <= et[2];
                } else {
                    this.dateValidation = st[1] <= et[1];
                }
            } else {
                this.dateValidation = true;
            }
        } else {
            this.dateValidation = true;
        }
    }

    submitAssign(type) {

        this.dateValidation1();
        const allstudent = this.linkform.controls.radio.value;
        if (this.auth.getSessionData('rista-resourceAccess') == 'false') {
            this.classid = this.linkform.controls.classSelect.value;
            this.batchid = this.classbatchid;
        }
        const typeSelection = this.linkform.controls.typeSelection.value;
        if (allstudent == '1' || type == '2' || typeSelection == '2') {
            this.allStudent = '1';
            this.studentid = '';
        } else if (allstudent == '0') {
            this.allStudent = '0';
            this.studentid = this.linkform.controls.specificstudent.value == '' ? [] : this.linkform.controls.specificstudent.value;
        }
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                this.batchid = this.choosedData[0].batch_id;
            } else if (this.auth.getSessionData('rista-batchassign') == '2') {
                this.batchid = this.classid;
            }
        } else {
            const batchValue = JSON.parse(this.auth.getSessionData('selectedbatchId'));
            this.batchid = batchValue ? (batchValue.length == 0 ? null : batchValue) : null;
        }
        console.log(this.batchid, 'sadasda00');
        if (this.startdate == undefined) {
            this.start = '';
        } else {
            this.start = this.startdate;
        }
        if (this.endDate == undefined) {
            this.end = '';
        } else {
            this.end = this.endDate;
        }

        if (this.classid != null || this.batchid != null) {
            if ((this.allStudent == '0' && this.studentData.length != 0) || this.allStudent == '1') {
                if ((this.allStudent == '0' && this.studentid != '' && this.studentid != null) || this.allStudent == '1') {
                    if (this.dateValidation == true) {
                        const data = {
                            platform: 'web',
                            role_id: this.auth.getSessionData('rista-roleid'),
                            user_id: this.auth.getSessionData('rista-userid'),
                            assign: this.assign,
                            school_id: this.schoolId,
                            classdetails: [{
                                content_id: this.contentid,
                                class_id: this.classid,
                                start_date: this.linkform.controls.startDate.value == null || this.linkform.controls.startDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.linkform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                end_date: this.linkform.controls.endDate.value == null || this.linkform.controls.endDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.linkform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                start_time: this.linkform.controls.startTime.value == null || this.showBatch == true ? '' : this.linkform.controls.startTime.value,
                                end_time: this.linkform.controls.endTime.value == null || this.showBatch == true ? '' : this.linkform.controls.endTime.value,
                                all_student: this.allStudent,
                                student_id: this.studentid,
                                batch_id: this.batchid,
                                auto_review: this.linkform.controls.releaseScore.value,
                                notes: '',
                                download: this.linkform.controls.downloadcontent.value ? '1' : '0',
                                topic_id: this.linkform.controls.topicSelect.value ? this.linkform.controls.topicSelect.value : ''
                            }],
                            classroomDetails: [{
                                content_id: [this.contentid],
                                batch_id: this.batchid,
                                start_date: this.linkform.controls.startDate.value == null || this.linkform.controls.startDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.linkform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                end_date: this.linkform.controls.endDate.value == null || this.linkform.controls.endDate.value == '' || this.showBatch == true ? '' : this.datePipe.transform(this.linkform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                                start_time: this.linkform.controls.startTime.value == null || this.showBatch == true ? '' : this.linkform.controls.startTime.value,
                                end_time: this.linkform.controls.endTime.value == null || this.showBatch == true ? '' : this.linkform.controls.endTime.value,
                            }],
                            editor_type: ''
                        };
                        this.creatorService.addAssignResourse(data).subscribe((successData) => {
                            this.submitSuccess(successData);
                        },
                            (error) => {
                                console.error(error, 'error_submit');
                            });
                    } else {
                        this.toastr.error('End Date Should be greater than Start Date');
                    }
                } else {
                    this.toastr.error('Select Atleast one Student');
                }
            } else {
                this.toastr.error('No Student Available in this class please select all student');
            }
        } else {
            this.toastr.error('Please fill the mandatory field');
        }
    }

    submitSuccess(successData) {
        if (successData.IsSuccess) {
            this.submitData = successData.ResponseObject;
            this.toastr.success('Class Resource Updated Successfully');
            this.auth.setSessionData('rista-contentType', '');
            if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
                if (this.auth.getSessionData('rista-batchassign') == '1' || this.auth.getSessionData('rista-batchassign') == '3') {
                    this.router.navigate(['/class/topicsAndCurriculum/1']);
                } else if (this.auth.getSessionData('rista-batchassign') == '2') {
                    this.router.navigate(['class/view-assign/2']);
                }
            }
            this.linkform.reset();
            this.resourcetype = false;
            this.defaultShow = false;
            this.showBatch = false;
            this.linkform.controls.classSelect.patchValue(null);
            this.linkform.controls.typeSelection.patchValue('n/a');
            this.linkform.controls.releaseScore.patchValue('0');
            this.linkform.controls.notes.patchValue('');
            this.linkform.controls.radio.patchValue('1');
            this.linkform.controls.batch.patchValue(null);
            this.linkform.controls.startDate.patchValue('');
            this.linkform.controls.endDate.patchValue('');
            const stObject = { hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00') };
            this.linkform.controls.startTime.patchValue(stObject);
            const etObject = { hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00') };
            this.linkform.controls.endTime.patchValue(etObject);
            this.modalRef.close();
            this.startdate = '';
            this.endDate = '';
            this.myDpOptions2 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su'
            };
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su'
            };
            this.auth.setSessionData('rista-resourceAccess', false);
        } else {
            this.toastr.error(successData.ErrorObject ? successData.ErrorObject : successData.ResponseObject);
            this.linkform.controls.startDate.patchValue(null);
            this.linkform.controls.endDate.patchValue(null);
            this.startdate = '';
            this.endDate = '';
            const stObject = { hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00') };
            this.linkform.controls.startTime.patchValue(stObject);
            const etObject = { hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00') };
            this.linkform.controls.endTime.patchValue(etObject);
            this.myDpOptions2 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
            };
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
            };
        }
    }

    subjectList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
        };
        this.classService.subjectList(data).subscribe((successData) => {
            this.subjectListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_subjectList');
            });
    }

    subjectListSuccess(successData) {
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;
        }
    }

    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
        };
        this.classService.gradeList(data).subscribe((successData) => {
            this.gradeListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_gradeList');
            });
    }

    gradeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
    }

    teacherList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.individualTeacherList(data).subscribe((successData) => {
            this.teacherListSuccess(successData);
        },
            (error) => {
                console.log(error, 'error');
            });
    }

    teacherListSuccess(successData) {
        if (successData.IsSuccess) {
            this.teacherData = successData.ResponseObject;
            console.log(this.teacherData, 'teacherData')
        }
    }

    tagList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
        };
        this.classService.tagsList(data).subscribe((successData) => {
            this.tagListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_tagList');
            });
    }

    tagListSuccess(successData) {
        if (successData.IsSuccess) {
            this.tagData = successData.ResponseObject;
        }
    }

    sortlist() {
        const data = {
            platform: 'web',
            role_id: this.auth.getRoleId(),
            user_id: this.auth.getUserId(),
            school_id: this.auth.getSessionData('rista-school_id'),
            sort_by: this.sortfilter,
            content_user_id: this.contentUserId,
            type: this.typeid,
            page: this.pageNo,
            record_per_page: '12',
            library: this.libraryselection,
            filter: this.filterselection,
            tags: this.tagid,
            grade: this.gradeid,
            subject: this.subjectid,
            exact_search: this.exactSearch == true ? 1 : 0,
            search_name: this.searchKey
        };
        if (this.auth.getSessionData('rista-roleid') == '6') {
            data['corporate_id'] = this.auth.getSessionData('rista-corporate_id');
            this.creatorService.sortmasterlist(data).subscribe((successData) => {
                this.sortListSuccess(successData);
            },
                (error) => {
                    console.error(error, 'error_slotList');
                });
        } else {
            this.creatorService.sortmasterlist(data).subscribe((successData) => {
                this.sortListSuccess(successData);
            },
                (error) => {
                    console.error(error, 'error_slotList');
                });
        }
    }

    sortListSuccess(successData) {
        if (successData.IsSuccess) {
            let temp = successData.ResponseObject;
            if (this.searchKey.length > 0 && this.pageNo == 1) {
                this.contentdata = successData.ResponseObject;
                // this.totalRecords = 0;

            }
            if (this.searchKey.length == 0 && this.pageNo == 1) {
                this.contentdata = successData.ResponseObject;
                // this.totalRecords = 0;
            }

            if (this.pageNo > 1 && temp.length > 0) {
                for (let entry of temp) {
                    this.contentdata.push(entry);
                }
            }

            for (let i = 0; i < this.contentdata.length; i++) {
                if (this.contentdata[i].status == '1') {
                    this.contentdata[i].details = 'Published';
                } else if (this.contentdata[i].status == '5') {
                    this.contentdata[i].details = 'Draft';
                }
            }
            this.totalRecords = this.contentdata.length;
            this.threshhold = this.totalRecords - 2;
            this.contentdatabackup = this.contentdata;
            this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
    }

    listDetails(event, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: event.school_id
        };
        // data['class_id']
        this.auth.setSessionData('rista-editor', JSON.stringify(data));
        this.creatorService.repositoryDetail(data).subscribe((successData) => {
            this.detailsSuccess(successData, event, type);
        },
            (error) => {
                this.detailsFailure(error);
            });
    }

    detailsSuccess(successData, event, type) {
        if (successData.IsSuccess) {
            this.detailData = successData.ResponseObject;
            if (this.previewType == 'edit') {
                // this.auth.setSessionData('save-Question', JSON.stringify(this.detailData));
                if (event.content_type == '1') {
                    if (type == 'addPdf') {
                        this.router.navigate(['repository/add-resources/edit']);
                    } else if (type == 'addText') {
                        this.router.navigate(['content-text-resource/text-resource/edit']);
                    }
                } else if (event.content_type == '2') {
                    this.auth.setSessionData('rista-upload-type', 'assignment');
                    if (type == 'addPdf') {
                        this.router.navigate(['repository/create-assessment/edit']);
                    } else if (type == 'addText') {
                        this.auth.setSessionData('rista-textType', 'assignment');
                        this.router.navigate(['content-text-resource/text-assignment/edit']);
                    }
                } else if (event.content_type == '3') {
                    this.auth.setSessionData('rista-upload-type', 'assessment');
                    if (type == 'addPdf') {
                        this.router.navigate(['repository/create-assessment/edit']);
                    } else if (type == 'addText') {
                        this.auth.setSessionData('rista-textType', 'assessment');
                        this.router.navigate(['content-text-resource/text-assignment/edit']);
                    }
                }
            } else if (this.previewType == 'pdf') {
                this.auth.setSessionData('rista-preview', 'repository');
                if (type == '1') {
                    this.auth.setSessionData('preview_page', 'create_resources');
                    this.router.navigate(['repository/preview']);
                } else if (type == '2') {
                    this.auth.setSessionData('preview_page', 'create_assignments');
                    this.router.navigate(['repository/preview']);
                } else if (type == '3') {
                    this.auth.setSessionData('preview_page', 'create_assessments');
                    this.router.navigate(['repository/preview']);
                }
            } else if (this.previewType == 'text') {
                this.auth.setSessionData('rista-preview', 'repository');
                if (type == '1') {
                    this.auth.setSessionData('preview_page', 'text_resources');
                    this.router.navigate(['repository/preview']);
                } else if (type == '2') {
                    this.auth.setSessionData('preview_page', 'text_assignments');
                    this.router.navigate(['repository/preview']);
                } else if (type == '3') {
                    this.auth.setSessionData('preview_page', 'text_assessments');
                    this.router.navigate(['repository/preview']);
                }
            }
        }
    }

    detailsFailure(error) {
        console.log(error, 'error');
    }

    scratchTypeQuestions(value) {
        this.auth.setSessionData('rista-textType', value);
        this.router.navigate(['content-text-resource/text-assignment/add']);
        this.close();
    }

    scrollEnd(event) {
        event.refresh;
        if (event.endIndex < 0 || this.threshhold <= 0) {

            this.contentdata = [];
            // this.sortlist();
        } else {
            if (event.endIndex >= this.threshhold) {
                this.pageNo++;
                this.sortlist();
            }
        }
    }

    clearall() {
        this.clearSettedData();
        this.setSearch_Filter();
        this.sortlist();
    }

    clearSettedData() {
        this.libraryselection = '0';
        this.contentUserId = '0';
        this.sortfilter = '0';
        this.typeid = 'list';
        this.gradeid = [];
        this.subjectid = [];
        this.tagid = [];
        this.searchKey = '';
        this.exactSearch = false;
        this.selectAuthored = '';
        this.selectDraft = '';
    }

    callCurrentBtn(type) {
        this.contentdata = [];
        this.pageNo = 1;
        this.totalRecords = 0;
        this.threshhold = 0;
        if (type == 'authored') {
            if (this.selectAuthored == 'active2') {
                this.selectAuthored = '';
                this.contentUserId = '0';
            } else {
                this.selectAuthored = 'active2';
                this.contentUserId = this.auth.getUserId().toString();
            }
            // this.auth.setSessionData('rista-ContentHome-AuthoredByMe', this.contentUserId);
            this.typeid = 'list';
            // this.auth.setSessionData('rista-ContentHome-MyDraft', this.typeid);
            this.selectDraft = '';
        } else if (type == 'mydraft') {
            if (this.selectDraft == 'active2') {
                this.selectDraft = '';
                this.typeid = 'list';
            } else {
                this.selectDraft = 'active2';
                this.typeid = type;
            }
            this.contentUserId = '0';
            // this.auth.setSessionData('rista-ContentHome-AuthoredByMe', this.contentUserId);
            // this.auth.setSessionData('rista-ContentHome-MyDraft', this.typeid);
            this.selectAuthored = '';
        }
        this.setSearch_Filter();
        this.sortlist();
    }

    // mydraft(type) {
    //     this.contentdata = [];
    //     this.pageNo = 1;
    //     if (this.typeid == type) {
    //         this.typeid = 'list';
    //         this.auth.setSessionData('rista-ContentHome-MyDraft', this.typeid);
    //     } else {
    //         this.typeid = type;
    //         this.auth.setSessionData('rista-ContentHome-MyDraft', this.typeid);
    //     }
    //     // this.totalRecords = 0;
    //     // this.threshhold = 0;
    //     this.sortlist();
    // }

    selectedgrade(event) {
        this.contentdata = [];
        this.pageNo = 1;
        if (typeof event == 'undefined') {
            this.gradeid = [];
            // this.auth.setSessionData('rista-ContentHome-Grade', JSON.stringify(this.gradeid));
        } else {
            this.gradeid = [];
            for (let i = 0; i < event.length; i++) {
                this.gradeid.push(event[i].grade_id);
            }
            // this.auth.setSessionData('rista-ContentHome-Grade', JSON.stringify(this.gradeid));
        }
        this.setSearch_Filter();
        this.sortlist();
    }

    selectedsubject(event) {
        this.contentdata = [];
        this.pageNo = 1;
        if (typeof event == 'undefined') {
            this.subjectid = [];
            // this.auth.setSessionData('rista-ContentHome-Subject', JSON.stringify(this.subjectid));
        } else {
            this.subjectid = [];
            for (let i = 0; i < event.length; i++) {
                this.subjectid.push(event[i].subject_id);
            }
            // this.auth.setSessionData('rista-ContentHome-Subject', JSON.stringify(this.subjectid));
        }
        this.setSearch_Filter();
        this.sortlist();
    }

    selectedtag(event) {
        this.contentdata = [];
        this.pageNo = 1;
        if (typeof event == 'undefined') {
            this.tagid = [];
            // this.auth.setSessionData('rista-ContentHome-Tag', JSON.stringify(this.tagid));
        } else {
            this.tagid = [];
            for (let i = 0; i < event.length; i++) {
                this.tagid.push(event[i].tag_name);
            }
            // this.auth.setSessionData('rista-ContentHome-Tag', JSON.stringify(this.tagid));
        }
        this.setSearch_Filter();
        this.sortlist();
    }

    library(event) {
        this.libraryselection = event.target.value;
        this.setSearch_Filter();
        // this.auth.setSessionData('rista-ContentHome-EntireLibrary', this.libraryselection);
        this.contentdata = [];
        this.pageNo = 1;
        this.sortlist();
    }

    sort(event) {
        if (event.target.value == '0' || event.target.value == '-1' || event.target.value == 'AZ' || event.target.value == 'ZA') {
            this.sortfilter = event.target.value;
            // this.auth.setSessionData('rista-ContentHome-Sort', this.sortfilter);
            this.contentUserId = '0';
            // this.auth.setSessionData('rista-ContentHome-AuthoredByMe', this.contentUserId);
        } else {
            this.sortfilter = event.target.value;
            this.contentUserId = event.target.value;
            // this.auth.setSessionData('rista-ContentHome-Sort', this.contentUserId);
            // this.auth.setSessionData('rista-ContentHome-AuthoredByMe', this.contentUserId);
        }

        this.highlight = '';
        this.contentdata = [];
        this.pageNo = 1;
        this.setSearch_Filter();
        this.sortlist();
    }

    detailPreview(data, type) {
        this.modalRef = this.modalService.open(this.addDetails, { size: 'lg', backdrop: 'static' });
        this.detailpreviewlist(data, 'details');
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    navigateToPreview(data) {
        if (data.content_format == '1') {
            this.PreviewPage(data, data.content_type);
        } else {
            this.PreviewText(data, data.content_type);
        }
    }

    showAdd() {
        this.modalRef = this.modalService.open(this.createContentTemp, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    upload(type) {
        // const controlmulti = <FormArray>this.linkform.controls['repeatlink'];
        // for (let i = controlmulti.length; i >= 1; i--) {
        //     controlmulti.reset();
        //     controlmulti.removeAt(i);
        // }
        this.modalRef.close('addAsset');
        if (type == 'resource') {
            this.modalRef = this.modalService.open(this.addResources, { size: 'lg', backdrop: 'static' });
        } else if (type == 'assessment') {
            this.modalRef = this.modalService.open(this.addAssessment, { size: 'lg', backdrop: 'static' });
        } else if (type == 'assignment') {
            this.modalRef = this.modalService.open(this.addAssignment, { size: 'lg', backdrop: 'static' });
        }
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

    close() {
        this.modalRef.close();
    }

    close1() {
        this.modalRef.close();
        this.linkform.reset();
        this.linkform.controls.startTime.patchValue('');
        this.linkform.controls.endTime.patchValue('');
        this.myDpOptions = {
            dateRange: false,
            dateFormat: dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: new Date(this.setDate).getFullYear(),
                month: new Date(this.setDate).getMonth() + 1,
                day: new Date(this.setDate).getDate() != 1 ? new Date().getDate() - 1 : -1,
            },
        };
        this.myDpOptions1 = {
            dateRange: false,
            dateFormat: dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: this.myDpOptions.disableUntil.year,
                month: this.myDpOptions.disableUntil.month,
                day: this.myDpOptions.disableUntil.day
            },
        };
        const stObject = { hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00') };
        this.linkform.controls.startTime.patchValue(stObject);
        const etObject = { hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00') };
        this.linkform.controls.endTime.patchValue(etObject);
        this.linkform.controls.releaseScore.patchValue('0');
        this.linkform.controls.radio.patchValue('1');
    }

    cancel() {
        this.linkform.reset();
        this.resourcetype = false;
        this.allowScore = false;
        this.defaultShow = false;
        this.showBatch = false;
        this.linkform.controls.classSelect.patchValue(null);
        this.linkform.controls.notes.patchValue('');
        this.linkform.controls.typeSelection.patchValue('n/a');
        this.linkform.controls.releaseScore.patchValue('0');
        this.linkform.controls.radio.patchValue('1');
        this.linkform.controls.batch.patchValue(null);
        const stObject = { hour: parseInt('00'), minute: parseInt('00'), second: parseInt('00') };
        this.linkform.controls.startTime.patchValue(stObject);
        const etObject = { hour: parseInt('23'), minute: parseInt('59'), second: parseInt('00') };
        this.linkform.controls.endTime.patchValue(etObject);
        this.modalRef.close();
        this.startdate = '';
        this.endDate = '';
    }

    editAction(event, type, modelOpen) {
        console.log(event, 'eventEdit');
        this.clearSession = false;
        if (modelOpen == '1') {
            this.modalRef.close('detailsTemplate');
        }
        this.previewType = 'edit';
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }

    PreviewPage(event, type) {
        this.clearSession = false;
        this.previewType = 'pdf';
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }

    PreviewText(event, type) {
        this.clearSession = false;
        this.previewType = 'text';
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }

    encodePdfFileAsURL(event: any, type) {
        let images = [];
        let imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const pdfDetails = event.target.files[i];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                let uploadTypeList = event.target.result.split(',');
                images.push({
                    image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name
                });
                const pic = pdfDetails.type.split('/');
                if (pic[1] == 'pdf') {
                    if (imageLength == images.length) {
                        this.onUploadKYCFinishedpdf(images, type);
                    }
                } else {
                    this.toastr.error('PDF are the required file format');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }

    }

    onUploadKYCFinishedpdf(getUrlEdu, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: 'content'
        };

        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData, type);
            },
            (error) => {
                console.error(error, 'error_pdfUpload');
            }
        );
    }

    pdfuploadSuccess(successData, type) {
        // this.settings.loadingSpinner = false;
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.pdfpath = [];
            this.pdfpaththumb = [];
            this.response = successData.ResponseObject;
            for (let i = 0; i < this.response.imagepath.length; i++) {
                this.pdfpath.push(this.response.imagepath[i]);
                this.pdfpaththumb.push(this.response.imagepath[i].resized_url);
            }
            this.auth.setSessionData('pdf', JSON.stringify(this.pdfpath));
            this.auth.setSessionData('pdf_thumb', JSON.stringify(this.pdfpaththumb));
            if (type == 'resource') {
                this.router.navigate(['repository/add-resources/add']);
            } else if (type == 'assessment') {
                this.router.navigate(['repository/create-assessment/add']);
                this.auth.setSessionData('rista-upload-type', 'assessment');
            } else if (type == 'assignment') {
                this.router.navigate(['repository/create-assessment/add']);
                this.auth.setSessionData('rista-upload-type', 'assignment');
            }
            this.modalRef.close();
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    // openText(type) {
    //     if (type == 'assignment') {
    //         this.auth.setSessionData('rista-textType', 'assignment');
    //         this.router.navigate(['content-text-resource/text-assignment/add']);
    //         this.close();
    //     } else if (type == 'assessment') {
    //         this.auth.setSessionData('rista-textType', 'assessment');
    //         this.router.navigate(['content-text-resource/text-assignment/add']);
    //         this.close();
    //     }
    // }

    checkValue(eve) {
        if (eve.target.checked == true) {
            this.listStudent = true;
        }
    }

    checkValue1(eve) {
        if (eve.target.checked == true) {
            this.listStudent = false;
        }
    }

    onDateChanged(event: IMyDateModel): void {
        this.myDpOptions1 = {};
        this.myDpOptions1 = {
            dateRange: false,
            dateFormat: dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: event.singleDate.date.year,
                month: event.singleDate.date.month,
                day: event.singleDate.date.day - 1
            },
        };
    }

    changeStartTime() {
        if (this.linkform.controls.startDate.value.singleDate.jsDate && this.linkform.controls.endDate.value.singleDate.jsDate) {
            let startDate = this.datePipe.transform(this.linkform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            let endDate = this.datePipe.transform(this.linkform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            if (this.linkform.controls.startTime.value && this.linkform.controls.endTime.value) {
                let startTime = parseInt(this.linkform.controls.startTime.value.hour);
                let startTimeHour = parseInt(this.linkform.controls.startTime.value.minute);
                let endTime = parseInt(this.linkform.controls.endTime.value.hour);
                let endTimeHour = parseInt(this.linkform.controls.endTime.value.minute);
                let totalStartTimeMins = (startTime * 60) + startTimeHour;
                let totalendTimeHour = (endTime * 60) + endTimeHour;
                if (startDate == endDate) {
                    this.timeErr = totalStartTimeMins >= totalendTimeHour;
                } else {
                    this.timeErr = false;
                }
            }
        }
    }

    typeSelection() {
        var selectBox: any = document.getElementById('selectBox');
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        console.log(selectedValue, 'selected');
        if (selectedValue == 1) {
            this.resourcetype = true;
            this.defaultShow = true;
            this.showBatch = false;
            this.assign = '1';
        } else if (selectedValue == 2) {
            this.linkform.controls.radio.patchValue('1');
            this.resourcetype = false;
            this.defaultShow = true;
            this.showBatch = true;
            this.assign = '2';
            this.startdate = '';
            this.endDate = '';
            this.linkform.controls.classSelect.patchValue(null);
            this.linkform.controls.notes.patchValue('');
            const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
            const dropped = dr1.split('-');
            const droppedObject: IMyDateModel = {
                isRange: false,
                singleDate: { jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2])) },
                dateRange: null
            };
            this.linkform.controls.startDate.patchValue(droppedObject);
        }
        this.allowScore = this.releaseGrade == '1' && this.resourcetype && this.contentType != '1' && this.checkQuestion != 1;
    }

    batchDataList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            type: '2'
        };
        this.classService.batchList(data).subscribe((successData) => {
            this.batchListSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_batchData');
            });
    }

    batchListSuccess(successData) {
        if (successData.IsSuccess) {
            this.batchData = successData.ResponseObject;
        }
    }

    removeContent(value) {
        this.deleteValue = value;
        this.modalRef = this.modalService.open(this.deleteList, { size: 'md', backdrop: 'static' });
    }

    deleteContent(value) {
        console.log(value);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: value.content_id
        };
        this.creatorService.deleteContentRepository(data).subscribe((successData) => {
            this.deleteContentSuccess(successData, value);
        },
            (error) => {
                console.error(error, 'delete_content');
            });
    }

    deleteContentSuccess(successData, value) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            this.close();
            this.contentdata = [];
            this.pageNo = 1;
            this.sortlist();
        } else {
            this.deleteAssignedContent(value);
        }
    }

    deleteAssignedContent(value) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: value.content_id
        };
        this.creatorService.deleteAssignedContent(data).subscribe((successData) => {
            this.deleteAssignedContentSuccess(successData);
        },
            (error) => {
                console.error(error, 'error_deleteAssignedContent');
            });
    }

    deleteAssignedContentSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            this.close();
            this.contentdata = [];
            this.pageNo = 1;
            this.sortlist();
        }
    }

    showInfo(id, i) {
        this.contentdata.forEach((item, index) => {
            item.showDetails = index == i ? !item.showDetails : false;
        });
    }

    setSearch_Filter() {
        let data: any;
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            data = JSON.parse(this.auth.getSessionData(SessionConstants.non_directcontentSearch));
        } else {
            data = JSON.parse(this.auth.getSessionData(SessionConstants.directcontentSearch));
        }
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                    items.libary = this.libraryselection;
                    items.content_userid = this.contentUserId;
                    items.sortFilter = this.sortfilter;
                    items.type_id = this.typeid;
                    items.grade_id = this.gradeid;
                    items.subject_id = this.subjectid;
                    items.tag_id = this.tagid;
                    items.contentName = this.searchKey;
                    items.extact_Search = this.exactSearch;
                    items.selectAuthored = this.selectAuthored;
                    items.selectDraft = this.selectDraft;
                } else {
                    const searchData = {
                        contentName: this.searchKey,
                        libary: this.libraryselection,
                        content_userid: this.contentUserId,
                        sortFilter: this.sortfilter,
                        type_id: this.typeid,
                        grade_id: this.gradeid,
                        subject_id: this.subjectid,
                        tag_id: this.tagid,
                        extact_Search: this.exactSearch,
                        selectAuthored: this.selectAuthored,
                        selectDraft: this.selectDraft,
                        school_id: this.auth.getSessionData('rista-school_id')
                    };
                    data.push(searchData);
                }
            });
            data = data.filter((test, index, array) =>
                index === array.findIndex((findTest) =>
                    findTest.school_id === test.school_id
                )
            );
            this.auth.getSessionData('rista-resourceAccess') == 'true' ? this.auth.setSessionData(SessionConstants.non_directcontentSearch, JSON.stringify(data)) :
                this.auth.setSessionData(SessionConstants.directcontentSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data: any;
        if (this.auth.getSessionData('rista-resourceAccess') == 'true') {
            data = JSON.parse(this.auth.getSessionData(SessionConstants.non_directcontentSearch));
        } else {
            data = JSON.parse(this.auth.getSessionData(SessionConstants.directcontentSearch));
        }
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                this.libraryselection = items.libary;
                this.contentUserId = items.content_userid;
                this.sortfilter = items.sortFilter;
                this.typeid = items.type_id;
                this.gradeid = items.grade_id;
                this.subjectid = items.subject_id;
                this.tagid = items.tag_id;
                this.searchKey = items.contentName;
                this.exactSearch = items.extact_Search;
                this.selectAuthored = items.selectAuthored;
                this.selectDraft = items.selectDraft;
                return false;
            } else {
                this.clearSettedData();
            }
            return true;
        });
    }
    callCreateFrom() {
        this.modalRef.close('createContentTemp');
        this.modalRef = this.modalService.open(this.createScratchTemp, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
}
