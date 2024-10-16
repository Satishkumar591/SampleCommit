import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {AssessmentService} from '../../../shared/service/assessment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ClassService} from '../../../shared/service/class.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {NavService} from '../../../shared/service/nav.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-topics-curriculum',
    templateUrl: './topics-curriculum.component.html',
    styleUrls: ['./topics-curriculum.component.scss'],
})
export class TopicsCurriculumComponent implements OnInit, OnDestroy {

    public setDate = new Date().toLocaleString('en-US', {timeZone: timeZone.location});
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date().getDate() - 1 : -1,
        },
    };
    myDpOptions2: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date().getDate() - 1 : -1,
        },
    };
    public typeName = '';
    public choosedData: any;
    public className = '';
    public title = '';
    public viewType: any;
    public roleId: any = '';
    public contentForm: FormGroup;
    public webhost: any;
    public meridian: boolean;
    public spinner: boolean;
    public allowSelect: boolean;
    public classid: any;
    public viewtypehighlight: any;
    public dueButton: any;
    public type: any;
    public resourceList: any;
    public gridView: any;
    public showGrid: any;
    public curriculumList: any = [];
    public topicListData: any = [];
    public topicName = '';
    public modalRef: NgbModalRef;
    public newCurriculumList: any = [];
    public topicPopupType = '';
    public updateTopicId = '';
    public previewType: any;
    public viewer: any;
    public selectContent: any;
    public contentNameValue: any;
    public reportData: any;
    public editData: any;
    public contentname: any;
    public fromTime: any;
    public toTime: any;
    public dateValidation: boolean;
    public deleteDetail: any;
    public allowClass: boolean;
    public timeErr: any;
    public schoolId: any;
    public grade: any;
    public detailData: any;
    public teacherType: any = '1';
    public topicStartdate: any;
    public topicEnddate: any;
    public deleteType: any;
    public delTopicId: any;
    public collapse = 'Collapse All';
    public isCollapsed = false;
    public checkAutoRelease = true;
    public allowScore: boolean;
    public content_id = '';
    public contentFormat = '';
    public deleteData: any;

    @ViewChild('itemsReports') itemsReports: TemplateRef<any>;
    @ViewChild('reports') reports: TemplateRef<any>;
    @ViewChild('assign') addAssign: TemplateRef<any>;
    @ViewChild('content') deleteContent: TemplateRef<any>;
    @ViewChild('createTopicPopup') createTopicPopup: TemplateRef<any>;

    constructor(public auth: AuthService, public assessment: AssessmentService, public router: Router, private formBuilder: FormBuilder, public route: ActivatedRoute, public newSubject: NewsubjectService,
                public sanitizer: DomSanitizer, public config: ConfigurationService, private modalService: NgbModal, public classService: ClassService, public datePipe: DatePipe,
                public toastr: ToastrService, public common: CommonService, public commondata: CommonDataService, public creatorService: CreatorService, public navservice: NavService) {
        this.roleId = this.auth.getRoleId();
        this.contentForm = this.formBuilder.group({
            startdate: [''],
            enddate: '',
            releaseScore: ['0']
        });
        this.webhost = this.config.getimgUrl();
        this.route.params.forEach((params) => {
            this.viewType = params.id;
        });
        this.meridian = true;
        this.spinner = false;
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);

        if (this.viewType == '1' || this.viewType == '3') {
            this.choosedData = JSON.parse(this.auth.getSessionData('card-data'));
            this.className = this.choosedData[0].class_name;
            this.typeName = 'Class Name';
            this.title = 'Topics';
            this.classid = this.choosedData[0].class_id;
        } else if (this.viewType == '2') {
            this.choosedData = JSON.parse(this.auth.getSessionData('rista-classbatch'));
            this.className = this.choosedData.batch_name;
            this.typeName = 'Content Folder Name';
        }

        this.curriculumService('2');

        this.schoolId = JSON.parse(this.auth.getSessionData('rista_data1'));
        if (this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '0') {
            this.allowClass = this.schoolId.permissions[6].permission[3].status == 1;
        } else {
            this.allowClass = true;
        }

    }

    ngOnInit() {
        this.creatorService.changeViewList(true);
        this.navservice.collapseSidebar = true;
    }

    ngOnDestroy() {
        this.creatorService.changeViewList(false);
        this.navservice.collapseSidebar = false;
    }

    typeSelection(id) {
        this.viewtypehighlight = id;
        console.log(this.viewtypehighlight, 'viewtypehighlight');
        if (id == '0') {
            this.dueButton = 'All';
            this.curriculumService(id);
        } else if (id == '1') {
            this.dueButton = 'Upcoming';
            this.curriculumService(id);
        } else if (id == '2') {
            this.dueButton = 'In Progress';
            this.curriculumService(id);
        } else {
            this.dueButton = 'Completed';
            this.curriculumService(id);
        }
    }

    curriculumService(id) {
        this.viewtypehighlight = '2';
        id == '2' ? this.dueButton = 'In Progress' : id == '0' ? this.dueButton = 'All' : id == '3' ? this.dueButton = 'Completed' : id == '1' ?
            this.dueButton = 'Upcoming' : '';
        const data = {
            platform: 'web',
            type: id,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            school_id: this.choosedData[0].school_id,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.viewCurriculumList(data).subscribe((successData) => {
                this.viewCurriculumListSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewCurriculumListSuccess(successData) {
        if (successData.IsSuccess) {
            this.curriculumList = successData.ResponseObject;
            this.resourceList = successData.ResponseObject;
            this.curriculumList.forEach((item, index) => {
                item.id = index + 1;
            });
            this.getTopicList();
        }
    }

    // Topic list service

    getTopicList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.topicList(data).subscribe((successData) => {
                this.viewTopicListSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewTopicListSuccess(successData) {
        if (successData.IsSuccess) {
            this.topicListData = successData.ResponseObject;
            this.topicListData.forEach((items) => {
                items.topicArray = [];
                this.curriculumList.forEach((curriculum) => {
                    if (curriculum.topic_id == items.topic_id) {
                        items.contentCollapse = true;
                        items.topicArray.push(curriculum);
                    }
                });
            });
            this.newCurriculumList = [];
            this.curriculumList.forEach((item) => {
                if (item.topic_id == '0' || item.topic_id == '') {
                    this.newCurriculumList.push(item);
                }
            });
            console.log(this.topicListData, 'topicList');
            console.log(this.curriculumList, 'curriList');
        }
    }

    // Add Topic service
    addTopicService() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            topic: this.topicName,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            start_date: this.topicStartdate == '' ? '' : this.datePipe.transform(this.topicStartdate?.singleDate?.jsDate, 'yyyy-MM-dd'),
            end_date: this.contentForm.controls.enddate.value == null ? '' : this.datePipe.transform(this.topicEnddate?.singleDate?.jsDate, 'yyyy-MM-dd'),
        };
        if (this.topicPopupType == 'edit' || this.topicPopupType == 'topic') {
            data['topic_id'] = this.topicPopupType == 'edit' ? this.updateTopicId : this.delTopicId;
            data['type'] = this.topicPopupType == 'edit' ?  '1' : '2';
            data['status'] = '1';
        }

        const url = this.topicPopupType == 'add' ? 'classes/addTopic' : 'classes/updateTopic';
        this.classService.addTopic(data, url).subscribe((successData) => {
                this.addTopicSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    addTopicSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            this.modalRef.close();
            this.getTopicList();
            this.curriculumService(this.viewtypehighlight);
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer !== event.container) {
            transferArrayItem(event.previousContainer.data, event.container.data,
                event.previousIndex, event.currentIndex);
        } else {
            if (event.previousIndex != event.currentIndex) {
                moveItemInArray(this.topicListData, event.previousIndex, event.currentIndex);
                const topicIdArr: [] = this.topicListData.map((item) => item.topic_id);
                this.updateTopicOrder(topicIdArr);
            }
        }
    }

    updateTopicOrder(topicIdArr) {
        // Intl.DateTimeFormat().resolvedOptions().timeZone
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            topic_order: topicIdArr,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.updateTopicOrder(data).subscribe((successData) => {
                this.updateTopicOrderSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    updateTopicOrderSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            // this.getTopicList();
        } else {
            this.toastr.error(successData.ResponseObject);
        }
    }

    createTopic(type, data) {
        console.log(data, 'dataa');
        this.topicPopupType = type;
        this.updateTopicId = data.topic_id;
        this.topicName = type == 'edit' ? data.topic : '';
        // Start Date Patch
        console.log(type, 'type');
        if (type == 'edit' && (data.start_date != null || data.end_date != null)) {
            if (data.start_date != '0000-00-00' && data.start_date) {
                const startDate = data.start_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(startDate[0]), parseInt(startDate[1]) - 1, parseInt(startDate[2]))},
                    dateRange: null
                };
                this.topicStartdate = sdObject;
            } else {
                this.topicStartdate = '';
            }
            // End Date Patch
            if (data.end_date != '0000-00-00' && data.end_date) {
                const endDate = data.end_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(endDate[0]), parseInt(endDate[1]) - 1, parseInt(endDate[2]))},
                    dateRange: null
                };
                this.topicEnddate = sdObject;
            } else {
                this.topicEnddate = '';
            }
        } else {
            this.topicStartdate = '';
            this.topicEnddate = '';
        }
        this.modalRef = this.modalService.open(this.createTopicPopup, {size: 'lg', backdrop: 'static'});
    }

    addContentResources(type) {
        this.auth.setSessionData('rista-resourceAccess', true);
        this.auth.setSessionData('rista-allowCurriculum', '1');
        this.auth.setSessionData('rista-return', type);
        this.auth.setSessionData('rista-batchassign', this.viewType);
        this.auth.setSessionData('rista-assignedForm', this.viewType == '2' ? 'content-Folder' : 'class');
        if (type == 'resources') {
            this.viewType == '1' || this.viewType == '3' ? this.viewResource() : this.viewBatchResource();
            this.auth.setSessionData('rista-contentType', 1);
        } else if (type == 'assignments') {
            this.viewType == '1' || this.viewType == '3' ? this.viewAssignment() : this.viewBatchAssignment();
            this.auth.setSessionData('rista-contentType', 2);
        } else if (type == 'assessments') {
            this.viewType == '1' || this.viewType == '3' ? this.viewAssessment() : this.viewBatchAssessment();
            this.auth.setSessionData('rista-contentType', 3);
        }
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.non_directcontentSearch));
        data.forEach((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                items.libary = this.auth.getSessionData('rista-contentType');
            } else {
                const contentData = {
                    contentName: '',
                    extact_Search: false,
                    libary: this.auth.getSessionData('rista-contentType'),
                    content_userid: '0',
                    sortFilter: '0',
                    type_id: 'list',
                    grade_id: [],
                    subject_id: [],
                    tag_id: [],
                    selectAuthored: '',
                    selectDraft: '',
                    school_id: this.auth.getSessionData('rista-school_id')
                };
                data.push(contentData);
            }
            data = data.filter((test, index, array) =>
                    index === array.findIndex((findTest) =>
                        findTest.school_id === test.school_id
                    )
            );
            this.auth.setSessionData(SessionConstants.non_directcontentSearch, JSON.stringify(data));
        });
        this.router.navigate(['/repository/content-home']);
    }

    viewResource() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
        };
        this.classService.viewResources(data).subscribe((successData) => {
                this.viewResourceSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewResourceSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }

    viewBatchResource() {
        const data = {
            platform: 'web',
            type: '0',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            batch_id: this.choosedData.batch_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewBatchResources(data).subscribe((successData) => {
                this.viewBatchResourceSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewBatchResourceSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }

    viewAssessment() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
        };
        this.classService.viewAssessments(data).subscribe((successData) => {
                this.viewAssessmentSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewAssessmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }


    viewAssignment() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
        };
        this.classService.viewAssignments(data).subscribe((successData) => {
                this.viewAssignmentSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }

    viewBatchAssignment() {
        const data = {
            platform: 'web',
            type: '0',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            batch_id: this.choosedData.batch_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewBatchAssignment(data).subscribe((successData) => {
                this.viewBatchAssignmentSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewBatchAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }

    viewBatchAssessment() {
        const data = {
            platform: 'web',
            type: '0',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            batch_id: this.choosedData.batch_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewBatchAssessment(data).subscribe((successData) => {
                this.viewBatchAssessmentSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    viewBatchAssessmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }

    correctionPage(list, type) {
        this.auth.setSessionData('rista-return', type);
        this.auth.setSessionData('correction-return', type);
        this.auth.setSessionData('rista-classDetails', JSON.stringify(list));
        if (type == 'assessments') {
            this.router.navigate(['/assessment-correction/correction-page']);
        } else if (type == 'assignments') {
            this.router.navigate(['/assignment-correction/correction-page']);
        }
    }

    PreviewPage(event, type, view) {
        view == 'student_preview' ? this.auth.setSessionData('preview_type', 'yes') :
            this.auth.setSessionData('preview_type', 'no');
        this.auth.setSessionData('rista-return', type);
        this.previewType = 'pdf';
        this.viewer = view;
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }

    PreviewText(event, type, view) {
        view == 'student_preview' ? this.auth.setSessionData('preview_type', 'yes') :
            this.auth.setSessionData('preview_type', 'no');
        this.auth.setSessionData('rista-return', type);
        this.previewType = 'text';
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
        if (view == 'student_preview') {
            this.auth.setSessionData('showAnswer', 1);
        } else {
            this.auth.removeSessionData('showAnswer');
        }
    }

    openTeacherVersionPdf(value) {

    }

    reportDetails(type, value) {
        this.selectContent = type;
        this.contentNameValue = value.content_id;
        let data: any;
        data = JSON.parse(this.auth.getSessionData('card-data'));
        this.auth.setSessionData('Individual-Class-Report', JSON.stringify(data[0]));
        this.auth.setSessionData('Individual-student-Report', JSON.stringify(value));
        this.modalRef = this.modalService.open(this.reports, {size: 'xl'});
    }

    itemsReportDetails(data) {
        this.auth.setSessionData('Individual-items-Report', JSON.stringify(data));
        this.reportData = JSON.parse(this.auth.getSessionData('Individual-items-Report'));
        this.modalRef = this.modalService.open(this.itemsReports, {size: 'xl'});
    }

    onDateChanged(event: IMyDateModel): void {
        this.myDpOptions2 = {};
        this.myDpOptions2 = {
            dateRange: false,
            dateFormat: dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: event.singleDate.date.year,
                month: event.singleDate.date.month,
                day: event.singleDate.date.day - 1,
            },
        };
    }

    checkTime() {
        if (this.fromTime == undefined || this.toTime == undefined) {
            this.timeErr = true;
        } else {
            const fromTime: any = this.fromTime.hour * 60;
            const fullFromTime = fromTime + this.fromTime.minute;
            const toTime: any = this.toTime.hour * 60;
            const fulltoTime = toTime + this.toTime.minute;
            if (fulltoTime > fullFromTime) {
                this.timeErr = false;
            } else {
                this.timeErr = true;
            }
        }
        return this.timeErr;
    }

    editAction(id, data) {
        this.editData = data;
        this.contentname = data.content_name;
        const stTime1 = data.start_time.replace(' ', ':').split(':');
        if (parseInt(stTime1[0]) < 12 && stTime1[2] != 'AM') {
            stTime1[0] = parseInt(stTime1[0]) + 12;
            const stObject1 = {
                hour: parseInt(stTime1[0]), minute: parseInt(stTime1[1]), second: 0
            };
            this.fromTime = stObject1;
        } else {
            let newstart = stTime1[0];
            if (stTime1[2] == 'AM') {
                if (newstart == 12) {
                    stTime1[0] = 0;
                } else {
                    newstart = stTime1[0];
                }
            } else if (stTime1[2] == 'PM') {
                if (newstart == 12) {
                    stTime1[0] = 12;
                } else {
                    newstart = stTime1[0];
                }
            }
            const stObject2 = {
                hour: parseInt(stTime1[0]), minute: parseInt(stTime1[1]), second: 0
            };
            this.fromTime = stObject2;
        }
        const etTime1 = data.end_time.replace(' ', ':').split(':');
        if (parseInt(etTime1[0]) < 12 && etTime1[2] != 'AM') {
            etTime1[0] = parseInt(etTime1[0]) + 12;
            const etObject1 = {
                hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), second: 0
            };
            this.toTime = etObject1;
        } else {
            const etObject2 = {
                hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), second: 0
            };
            this.toTime = etObject2;
        }
        if (data.start_date != '0000-00-00') {
            const sd = data.start_date.split('-');
            const sdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                dateRange: null
            };
            this.contentForm.controls.startdate.patchValue(sdObject);
        } else {
            this.contentForm.controls.startdate.patchValue(null);
        }
        if (data.end_date != '0000-00-00') {
            const sd = data.end_date.split('-');
            const sdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                dateRange: null
            };
            this.contentForm.controls.enddate.patchValue(sdObject);
        } else {
            this.contentForm.controls.enddate.patchValue(null);
        }
        this.contentForm.controls.releaseScore.patchValue(data.auto_review && data.auto_review != '' ? data.auto_review : '0');
        this.content_id = data.content_id;
        this.contentFormat = data.content_format;
        this.allowScore = data.allow_autograde == '1' && data.content_type != '1' && data.without_question != 1;
        this.modalRef = this.modalService.open(this.addAssign, {size: 'lg', backdrop: 'static'});

        // if (this.type == 'resources') {
        //   this.auth.setSessionData('resourceReload', 1);
        // } else if (this.type == 'assignments') {
        //   this.auth.setSessionData('resourceReload', 2);
        // } else if (this.type == 'assessments') {
        //   this.auth.setSessionData('resourceReload', 3);
        // }
    }

    deleteAction(type, data) {
        this.deleteType = type;
        this.deleteData = data;
        this.delTopicId = data.topic_id;
        this.topicPopupType = type;
        this.modalRef = this.modalService.open(this.deleteContent, {size: 'md', backdrop: 'static'});
    }

    listView(id) {
        this.gridView = id;
        this.showGrid = id == 1;
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
            content_id: this.content_id
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
                this.contentForm.controls.releaseScore.patchValue('0');
                this.checkAutoRelease = true;
            }, 3000);
        }
    }

    onSave() {
        this.modalRef.close();
        this.auth.removeSessionData('Individual-Class-Report');
    }

    moveToTopics(data, index, topicList, type) {
        if (type == 'curricullumList') {
            topicList.topicArray.push(data);
            this.newCurriculumList.splice(index, 1);
        } else {
            topicList.topicArray.push(data);
        }
        this.moveToTopicsService(data, topicList, 'add');
        console.log(this.topicListData, 'topicListData');
    }

    moveToTopicsService(curriculum, topic, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_content_id: curriculum.class_content_id,
            topic_id: type == 'add' ? topic.topic_id : '0',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.moveTopic(data).subscribe((successData) => {
                this.moveTopicSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    moveTopicSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData.ResponseObject, 'success');
            this.curriculumService(this.viewtypehighlight);
            // this.getTopicList();
        }
    }

    dateDifferent() {
        if (this.contentForm.controls.startdate.value != null && this.contentForm.controls.enddate.value != null) {
            const startdate = this.datePipe.transform(this.contentForm.controls.startdate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const st = startdate.split('-');
            const endDate = this.datePipe.transform(this.contentForm.controls.enddate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const et = endDate.split('-');
            if (st[0] == et[0]) {
                if (st[1] == et[1]) {
                    this.dateValidation = st[2] <= et[2];
                } else if (st[1] > et[1]) {
                    this.dateValidation = false;
                } else {
                    this.dateValidation = true;
                }
            } else {
                this.dateValidation = true;
            }
        } else {
            this.dateValidation = true;
        }
    }

    contentClose() {
        this.fromTime = '';
        this.toTime = '';
        this.contentname = '';
        this.modalRef.close();
    }

    addCurriculum() {
        this.auth.setSessionData('rista-resourceAccess', true);
        this.auth.setSessionData('rista-allowCurriculum', '1');
        this.auth.setSessionData('rista-batchassign', this.viewType);
        this.auth.setSessionData('rista-assignedForm', this.viewType == '2' ? 'content-Folder' : 'class');
        this.curriculumService(this.viewtypehighlight);

        let data = JSON.parse(this.auth.getSessionData(SessionConstants.non_directcontentSearch));
        data.forEach((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                items.libary = this.auth.getSessionData('rista-contentType');
            } else {
                const contentData = {
                    contentName: '',
                    extact_Search: false,
                    libary: this.auth.getSessionData('rista-contentType'),
                    content_userid: '0',
                    sortFilter: '0',
                    type_id: 'list',
                    grade_id: [],
                    subject_id: [],
                    tag_id: [],
                    selectAuthored: '',
                    selectDraft: '',
                    school_id: this.auth.getSessionData('rista-school_id')
                };
                data.push(contentData);
            }
            data = data.filter((test, index, array) =>
                    index == array.findIndex((findTest) =>
                        findTest.school_id === test.school_id
                    )
            );
            console.log(data, 'DATA');
            this.auth.setSessionData(SessionConstants.non_directcontentSearch, JSON.stringify(data));
        });
        this.router.navigate(['/repository/content-home']);
    }

    backAction() {
        this.navservice.collapseSidebar = false;
        if (this.viewType == '1') {
            this.enterList();
        } else if (this.viewType == '2') {
            this.router.navigate(['/classroom/list-classroom']);
        } else if (this.viewType == '3') {
            this.router.navigate(['/class/list-class']);
        }
    }

    enterList() {
        if (this.choosedData[0].grade == '') {
            this.grade = [];
        } else {
            this.grade = [this.choosedData[0].grade];
        }
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.choosedData[0].school_id,
            class_id: this.choosedData[0].class_id,
            grade: this.grade
        };
        this.classService.classDetails(data).subscribe((successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    enterListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
            if (this.roleId == '4') {
                this.teacherType = this.auth.getSessionData('rista-teacher_type');
            } else {
                this.teacherType = '1';
            }
            let classReturn: any;
            classReturn = this.auth.getSessionData('class-curriculum');
            if (classReturn == 'true') {
                if (this.detailData[0].classDate_status == '2' || this.detailData[0].classDate_status == '5') {
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    }
                    if (this.detailData[0].class_status != '1') {
                        this.router.navigate(['/class/create-class/edit']);
                    } else {
                        this.router.navigate(['/class/create-class/edit']);
                        this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                        this.auth.setSessionData('updatedStudent', 1);
                    }
                } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0' && this.roleId != '2') {
                    this.router.navigate(['/class/list-class']);
                } else if (this.detailData[0].classDate_status == '4' && (this.detailData[0].class_status == '1' || this.roleId == '2')) {
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('classView', false);
                        console.log('2', 'enter complete class');
                    }
                    this.router.navigate(['/class/create-class/addEdit']);
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
                    this.router.navigate(['/class/create-class/edit']);
                }
            } else {
                this.auth.setSessionData('classView', true);
                this.router.navigate(['/class/list-class']);
            }
        }
    }


    editContentDetails() {
        this.dateDifferent();
        if (this.dateValidation == true) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                content_id: this.editData.content_id,
                class_id: this.classid,
                start_time: this.fromTime == null ? '' : this.fromTime,
                end_time: this.toTime == null ? '' : this.toTime,
                class_content_id : this.editData.class_content_id,
                auto_review: this.contentForm.controls.releaseScore.value,
                start_date: this.contentForm.controls.startdate.value == null ? '' : this.datePipe.transform(this.contentForm.controls.startdate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                end_date: this.contentForm.controls.enddate.value == null ? '' : this.datePipe.transform(this.contentForm.controls.enddate.value.singleDate.jsDate, 'yyyy-MM-dd'),
            };
            this.classService.editContentDetail(data).subscribe((successData) => {
                    this.editSuccess(successData);
                },
                (error) => {
                    console.log(error);
                });
        } else {
            this.toastr.error('End Date Should be greater than Start Date ');
        }
    }

    editSuccess(successData) {
        if (successData.IsSuccess) {
            this.deleteDetail = successData.ResponseObject;
            this.fromTime = '';
            this.toTime = '';
            this.contentname = '';
            this.toastr.success(successData.ResponseObject);
            this.modalRef.close();

            // if (this.auth.getSessionData('resourceReload') == '1'){
            //     this.viewResource();
            // }else if (this.auth.getSessionData('resourceReload') == '2'){
            //     this.viewAssignment();
            // }else if (this.auth.getSessionData('resourceReload') == '3'){
            //     this.viewAssessment();
            // }
            this.curriculumService(this.viewtypehighlight);
        }
    }

    listDetails(event, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: type == 'resources' ? '1' : type == 'assignments' ? '2' : '3',
            school_id: event.school_id,
            class_id: this.choosedData[0]?.class_id,
            teacher_id: this.choosedData[0]?.teacher_id
        };
        this.auth.setSessionData('rista-editor', JSON.stringify(data));
        this.auth.setSessionData('rista-backOption', 'available');
        this.viewType == '2' ? this.auth.setSessionData('redirect-toassign', '1') :
            this.auth.setSessionData('redirect-toassign', '2');
        this.viewer == 'student_preview' || this.viewer == 'teacher_preview' ? this.auth.setSessionData('rista-preview', this.viewer)
            : this.auth.removeSessionData('rista-preview');
        this.previewType == 'pdf' ? this.auth.setSessionData('preview_page', 'create_' + type) :
            this.auth.setSessionData('preview_page', 'text_' + type);
        this.router.navigate(['repository/preview']);
    }

    update(type) {
        if (type == 'content') {
            if (this.viewType == '1' || this.viewType == '3') {
                this.deleteContentDetails();
            } else if (this.viewType == '2') {
                // this.deleteBatchContentDetails(del);
            }
        } else {
            this.addTopicService();
        }
    }

    deleteContentDetails() {
        console.log(this.resourceList, 'RESOURCE');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.deleteData.content_id,
            class_id: this.classid,
            class_content_id: this.deleteData.class_content_id
        };
        this.classService.deleteContentDetail(data).subscribe((successData) => {
                this.deleteSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    deleteSuccess(successData) {
        if (successData.IsSuccess) {
            this.deleteDetail = successData.ResponseObject;
            this.modalRef.close();
            // if (this.auth.getSessionData('resourceReroute') == '1') {
            //   this.viewResource();
            // } else if (this.auth.getSessionData('resourceReroute') == '2') {
            //   this.viewAssignment();
            // } else if (this.auth.getSessionData('resourceReroute') == '3') {
            //   this.viewAssessment();
            // }
            this.curriculumService(this.viewtypehighlight);
        }
    }

    deleteBatchContentDetails(id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.resourceList[id].content_id,
            status: '2',
            batch_id: this.choosedData.batch_id
        };
        this.classService.deleteBatchContent(data).subscribe((successData) => {
                this.deleteBatchSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    deleteBatchSuccess(successData) {
        if (successData.IsSuccess) {
            this.deleteDetail = successData.ResponseObject;
            this.modalRef.close();
            // if (this.auth.getSessionData('resourceReroute') == '1') {
            //   this.viewBatchResource();
            // } else if (this.auth.getSessionData('resourceReroute') == '2') {
            //   this.viewBatchAssignment();
            // } else if (this.auth.getSessionData('resourceReroute') == '3') {
            //   this.viewBatchAssessment();
            // }
            this.curriculumService(this.viewtypehighlight);
        }
    }

}
