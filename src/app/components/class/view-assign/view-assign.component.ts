import {Component, ElementRef, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {AssessmentService} from '../../../shared/service/assessment.service';
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ClassService} from '../../../shared/service/class.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-create-assessment',
    templateUrl: './view-assign.component.html',
    styleUrls: ['./view-assign.component.scss']
})
export class ViewAssignComponent implements OnInit, OnDestroy {
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date().getDate() - 1 : -1,
        },
    };
    myDpOptions2: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getMonth() + 1,
            day: new Date(this.setDate).getDate() != 1 ? new Date().getDate() - 1 : -1,
        },
    };
    public contentForm: FormGroup;
    public del: any;
    public type: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public choosedData: any;
    public className: any;
    public resourceList: any;
    public roleId: any;
    public teacherType: any = '1';
    public filetype: any;
    public webhost: any;
    public contentDetaildata: any;
    public profileurl: any;
    public createdby: any;
    public gradename: any;
    public subjectname: any;
    public tags: any;
    public totalpoints: any;
    public noofquestions: any;
    public description: any;
    public details: any;
    public pdfpath: any;
    public classid: any;
    public response: any;
    public deleteDetail: any;
    public contentname: any;
    public viewer: any;
    public previewType: any;
    public detailData: any;
    public viewType: any;
    public schoolId: any;
    public allowClass: boolean;
    public grade: any;
    public edit: any;
    public fromTime: any;
    public toTime: any;
    public timeErr: any;
    public contentType: any;
    public meridian: boolean;
    public spinner: boolean;
    public allowSelect: boolean;
    public gridView: any;
    public showGrid: any;
    public viewtypehighlight: any;
    public dueButton: any;
    public typeName: any;
    public selectContent: any;
    public contentNameValue: any;
    public reportData: any;
    public pdfTeacherVersion: any = [];
    @ViewChild('detailsTemplate') addDetails: TemplateRef<any>;
    @ViewChild('resources') addResources: TemplateRef<any>;
    @ViewChild('assignment') addAssignment: TemplateRef<any>;
    @ViewChild('assessment') addAssessment: TemplateRef<any>;
    @ViewChild('content') deleteContent: TemplateRef<any>;
    @ViewChild('assign') addAssign: TemplateRef<any>;
    @ViewChild('reports') reports: TemplateRef<any>;
    @ViewChild('itemsReports') itemsReports: TemplateRef<any>;
    @ViewChild('teacherVersion') teacherVersion: TemplateRef<any>;
    public dateValidation: boolean;
    public allowScore: boolean;
    public checkAutoRelease = true;
    public content_id = '';
    public contentFormat = '';
    constructor(public auth: AuthService, public assessment: AssessmentService, public router: Router, private formBuilder: FormBuilder, public route: ActivatedRoute, public newSubject: NewsubjectService,
                public sanitizer: DomSanitizer, public config: ConfigurationService, private modalService: NgbModal, public classService: ClassService, public datePipe: DatePipe,
                public toastr: ToastrService, public common: CommonService, public commondata: CommonDataService, public creatorService: CreatorService) {
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
        if (this.viewType == '1' || this.viewType == '3'){
            this.choosedData = JSON.parse(this.auth.getSessionData('card-data'));
            this.className = this.choosedData[0].class_name;
            this.typeName = 'Class Name';
            this.classid = this.choosedData[0].class_id;
        }else if (this.viewType == '2'){
            this.choosedData = JSON.parse(this.auth.getSessionData('rista-classbatch'));
            this.className = this.choosedData.batch_name;
            this.typeName = 'Content Folder Name';
        }
        if (this.auth.getSessionData('rista-return')) {
            const typ = this.auth.getSessionData('rista-return');
            if (typ == 'assessments') {
                this.classList(3);
            } else if (typ == 'assignments') {
                this.classList(2);
            } else if (typ == 'resources') {
                this.classList(1);
            }
            this.auth.removeSessionData('rista-return');
        } else {
            this.classList(2);
        }
        this.schoolId = JSON.parse(this.auth.getSessionData('rista_data1'));
        if (this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '0'){
            this.allowClass = this.schoolId.permissions[6].permission[3].status == 1;
        }else {
            this.allowClass = true;
        }
    }

    ngOnInit(): void {
        this.commondata.showLoader(false);
        this.listView(2);
    }
    ngOnDestroy(): void {
        // this.auth.removeSessionData('class-curriculum');
    }

    droppedCorrect(event: CdkDragDrop<string[]>) {
        const control = this.resourceList as any;
        moveItemInArray(control, event.previousIndex, event.currentIndex);
    }

    classList(id) {
        this.viewtypehighlight = '2';
        this.dueButton = 'In Progress';
        if (id == '1') {
            this.type = 'resources';
            this.viewType == '1' || this.viewType == '3' ? this.viewResource() : this.viewBatchResource();
        } else if (id == '2') {
            this.type = 'assignments';
            this.viewType == '1' || this.viewType == '3' ? this.viewAssignment() : this.viewBatchAssignment();
        } else if (id == '3') {
            this.type = 'assessments';
            this.viewType == '1' || this.viewType == '3' ? this.viewAssessment() : this.viewBatchAssessment();
        }
    }

    typeSelection(id){
        this.viewtypehighlight = id;
        if (id == '0'){
            this.dueButton = 'All';
        }else if (id == '1'){
            this.dueButton = 'Upcoming';
        }else if (id == '2'){
            this.dueButton = 'In Progress';
        }else {
            this.dueButton = 'Completed';
        }
        if (this.type == 'resources'){
            this.viewType == '1' || this.viewType == '3' ? this.viewResource() : this.viewBatchResource();
        }else if (this.type == 'assignments'){
            this.viewType == '1' || this.viewType == '3' ? this.viewAssignment() : this.viewBatchAssignment();
        }else if (this.type == 'assessments'){
            this.viewType == '1' || this.viewType == '3' ? this.viewAssessment() : this.viewBatchAssessment();
        }
    }

    onSave(){
        this.modalRef.close();
        this.auth.removeSessionData('Individual-Class-Report');
    }
    navigateToStudentView(list, type) {
        console.log(list, 'click happens');
        if (this.viewType == '1' || this.viewType == '3') {
            if (list.content_format == '1') {
                this.PreviewPage(list, type, 'student_preview');
            } else {
                this.PreviewText(list, type, 'student_preview');
            }
        }
    }
    upload(type){
        this.auth.setSessionData('rista-resourceAccess', true);
        this.auth.setSessionData('rista-allowCurriculum', '1');
        this.auth.setSessionData('rista-return', type);
        this.auth.setSessionData('rista-batchassign', this.viewType);
        this.auth.setSessionData('rista-assignedForm', this.viewType == '2' ? 'content-Folder' : 'class');
        if (type == 'resources'){
            this.viewType == '1' || this.viewType == '3' ? this.viewResource() : this.viewBatchResource();
            this.auth.setSessionData('rista-contentType', 1);
        }else if (type == 'assignments'){
            this.viewType == '1' || this.viewType == '3' ? this.viewAssignment() : this.viewBatchAssignment();
            this.auth.setSessionData('rista-contentType', 2);
        }else if (type == 'assessments'){
            this.viewType == '1' || this.viewType == '3' ? this.viewAssessment() : this.viewBatchAssessment();
            this.auth.setSessionData('rista-contentType', 3);
        }
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.non_directcontentSearch));
        data.forEach((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                items.libary = this.auth.getSessionData('rista-contentType');
            }else {
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
            console.log(data, 'data');
            this.auth.setSessionData(SessionConstants.non_directcontentSearch, JSON.stringify(data));
        });
        this.router.navigate(['/repository/content-home']);
    }
    backAction(){
        if (this.viewType == '1'){
            this.enterList();
        }else if (this.viewType == '2'){
            this.router.navigate(['/classroom/list-classroom']);
        }else if (this.viewType == '3'){
            this.router.navigate(['/class/list-class']);
        }
    }
    enterList() {
        if (this.choosedData[0].grade == ''){
            this.grade = [];
        }else {
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
        this.classService.classDetails(data).subscribe( (successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                this.enterListFailure(error);
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
            console.log(classReturn, 'classreturn');
            console.log(classReturn == 'true', 'classreturn');
            if (classReturn == 'true'){
                // this.router.navigate(['/class/create-class/edit']);
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
                }
                else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0' && this.roleId != '2') {
                    this.router.navigate(['/class/list-class']);
                }
                else if (this.detailData[0].classDate_status == '4' && (this.detailData[0].class_status == '1' || this.roleId == '2')) {
                    console.log('1', 'enter logic');
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
            }else {
                this.auth.setSessionData('classView', true );
                this.router.navigate(['/class/list-class']);
            }
        }
    }
    enterListFailure(error) {
        console.log(error, 'error');
    }
    detailPreview(data){
        this.modalRef = this.modalService.open(this.addDetails, { size: 'lg', backdrop: 'static' });
        this.detailpreviewlist(data);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    deleteAction(id){
        this.del = id;
        this.modalRef = this.modalService.open(this.deleteContent, { size: 'md', backdrop: 'static' });
        if (this.type == 'resources'){
            this.auth.setSessionData('resourceReroute', 1);
        }else if (this.type == 'assignments' ){
            this.auth.setSessionData('resourceReroute', 2);
        }else if (this.type == 'assessments'){
            this.auth.setSessionData('resourceReroute', 3);
        }
    }
    onDateChanged(event: IMyDateModel): void {
        this.myDpOptions2 = {};
        this.myDpOptions2 = {
            dateRange: false,
            dateFormat:dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: event.singleDate.date.year,
                month: event.singleDate.date.month,
                day: event.singleDate.date.day - 1 ,
            },
        };
    }
    editAction(id, data){
        console.log(data, 'data');
        this.edit = id;
        this.contentname = data.content_name;
        const stTime1 = data.start_time.replace(' ', ':').split(':');
        if (parseInt(stTime1[0]) < 12 && stTime1[2] != 'AM') {
            stTime1[0]  = parseInt(stTime1[0]) + 12;
            const  stObject1 = {
                hour: parseInt(stTime1[0]), minute: parseInt(stTime1[1]), second: 0
            };
            this.fromTime = stObject1;
        }
        else {
            let newstart = stTime1[0];
            if (stTime1[2] == 'AM'){
                if (newstart == 12){
                    stTime1[0]  = 0;
                }else {
                    newstart = stTime1[0];
                }
            }else if (stTime1[2] == 'PM'){
                if (newstart == 12){
                    stTime1[0]  = 12;
                }else {
                    newstart = stTime1[0];
                }
            }
            const  stObject2 = {
                hour: parseInt(stTime1[0]) , minute: parseInt(stTime1[1]), second: 0
            };
            this.fromTime = stObject2;
        }
        const etTime1 = data.end_time.replace(' ', ':').split(':');
        if (parseInt(etTime1[0]) < 12 && etTime1[2] != 'AM') {
            etTime1[0]  = parseInt(etTime1[0]) + 12;
            const  etObject1 = {
                hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), second: 0
            };
            this.toTime = etObject1;
        }
        else {
            const  etObject2 = {
                hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), second: 0
            };
            this.toTime = etObject2;
        }
        if (data.start_date != '0000-00-00'){
            const sd = data.start_date.split('-');
            const sdObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))}, dateRange: null};
            this.contentForm.controls.startdate.patchValue(sdObject);
        }else {
            this.contentForm.controls.startdate.patchValue(null);
        }
        if (data.end_date != '0000-00-00'){
            const sd = data.end_date.split('-');
            const sdObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))}, dateRange: null};
            this.contentForm.controls.enddate.patchValue(sdObject);
        }else {
            this.contentForm.controls.enddate.patchValue(null);
        }
        // this.contentType = data.content_type;
        // this.releaseGrade = data.allow_autograde;
        // this.checkQuestion = data.without_question;
        this.contentForm.controls.releaseScore.patchValue(data.auto_review && data.auto_review != '' ? data.auto_review : '0');
        this.content_id = data.content_id;
        this.allowScore = data.allow_autograde == '1' && this.type != 'resources' && data.without_question != 1;
        this.modalRef = this.modalService.open(this.addAssign, { size: 'lg', backdrop: 'static' });
        if (this.type == 'resources'){
            this.auth.setSessionData('resourceReload', 1);
        }else if (this.type == 'assignments' ){
            this.auth.setSessionData('resourceReload', 2);
        }else if (this.type == 'assessments'){
            this.auth.setSessionData('resourceReload', 3);
        }
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

    checkTime() {
        if (this.fromTime == undefined || this.toTime == undefined) {
            this.timeErr = true;
        } else  {
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

    close() {
        this.modalRef.close();
    }
    contentClose(){
        this.fromTime = '';
        this.toTime = '';
        this.contentname = '';
        this.modalRef.close();
    }

    dateDifferent(){
        if (this.contentForm.controls.startdate.value != null && this.contentForm.controls.enddate.value != null){
            const startdate = this.datePipe.transform(this.contentForm.controls.startdate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const st = startdate.split('-');
            const endDate = this.datePipe.transform(this.contentForm.controls.enddate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const et = endDate.split('-');
            if (st[0] == et [0]){
                if (st[1] == et [1]){
                    this.dateValidation = st[2] <= et [2];
                }else if (st[1] > et [1]){
                    this.dateValidation = false;
                }else {
                    this.dateValidation = true;
                }
            }  else {
                this.dateValidation = true;
            }
        }else {
            this.dateValidation = true;
        }
    }
    openTeacherVersionPdf(data) {
        let pdf = this.common.convertBase64(data.teacher_version_path);
        this.pdfTeacherVersion = this.webhost + '/' + pdf[0].original_image_url;
        this.modalRef = this.modalService.open(this.teacherVersion, {size: 'xl'});
    }
    editContentDetails(id){
        this.dateDifferent();
        if (this.dateValidation == true){
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                content_id: this.resourceList[id].content_id,
                class_id: this.classid,
                start_time: this.fromTime == null ? '' : this.fromTime,
                end_time: this.toTime == null ? '' : this.toTime,
                class_content_id : this.resourceList[id].class_content_id,
                auto_review: this.contentForm.controls.releaseScore.value,
                start_date: this.contentForm.controls.startdate.value == null ? '' : this.datePipe.transform(this.contentForm.controls.startdate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                end_date: this.contentForm.controls.enddate.value == null ? '' : this.datePipe.transform(this.contentForm.controls.enddate.value.singleDate.jsDate, 'yyyy-MM-dd'),
            };
            this.classService.editContentDetail(data).subscribe( (successData) => {
                    this.editSuccess(successData);
                },
                (error) => {
                    this.editFailure(error);
                });
        }else {
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
            if (this.auth.getSessionData('resourceReload') == '1'){
                this.viewResource();
            }else if (this.auth.getSessionData('resourceReload') == '2'){
                this.viewAssignment();
            }else if (this.auth.getSessionData('resourceReload') == '3'){
                this.viewAssessment();
            }
        }
    }
    editFailure(error) {
        console.log(error, 'error');
    }
    update(del){
        if (this.viewType == '1' || this.viewType == '3'){
            this.deleteContentDetails(del);
        }else if (this.viewType == '2'){
            this.deleteBatchContentDetails(del);
        }
    }
    listView(id){
        this.gridView = id;
        this.showGrid = id == 1;
    }
    reportDetails(type, value){
        this.selectContent = type;
        this.contentNameValue = value.content_id;
        let data: any;
        data = JSON.parse(this.auth.getSessionData('card-data'));
        this.auth.setSessionData('Individual-Class-Report', JSON.stringify(data[0]));
        this.auth.setSessionData('Individual-student-Report', JSON.stringify(value));
        this.modalRef = this.modalService.open(this.reports, {size: 'xl'});
    }
    viewResource() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewResources(data).subscribe( (successData) => {
                this.viewResourceSuccess(successData);
            },
            (error) => {
                this.viewResourceFailure(error);
            });
    }
    viewResourceSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewResourceFailure(error) {
        console.log(error, 'error');
    }
    deleteContentDetails(id){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.resourceList[id].content_id,
            class_id: this.classid,
            class_content_id : this.resourceList[id].class_content_id
        };
        this.classService.deleteContentDetail(data).subscribe( (successData) => {
                this.deleteSuccess(successData);
            },
            (error) => {
                this.deleteFailure(error);
            });
    }
    deleteSuccess(successData) {
        if (successData.IsSuccess) {
            this.deleteDetail = successData.ResponseObject;
            this.modalRef.close();
            if (this.auth.getSessionData('resourceReroute') == '1'){
                this.viewResource();
            }else if (this.auth.getSessionData('resourceReroute') == '2'){
                this.viewAssignment();
            }else if (this.auth.getSessionData('resourceReroute') == '3'){
                this.viewAssessment();
            }
        }
    }
    deleteFailure(error) {
        console.log(error, 'error');
    }
    deleteBatchContentDetails(id){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.resourceList[id].content_id,
            status: '2',
            batch_id: this.choosedData.batch_id
        };
        this.classService.deleteBatchContent(data).subscribe( (successData) => {
                this.deleteBatchSuccess(successData);
            },
            (error) => {
                this.deleteBatchFailure(error);
            });
    }
    deleteBatchSuccess(successData) {
        if (successData.IsSuccess) {
            this.deleteDetail = successData.ResponseObject;
            this.modalRef.close();
            if (this.auth.getSessionData('resourceReroute') == '1'){
                this.viewBatchResource();
            }else if (this.auth.getSessionData('resourceReroute') == '2'){
                this.viewBatchAssignment();
            }else if (this.auth.getSessionData('resourceReroute') == '3'){
                this.viewBatchAssessment();
            }
        }
    }
    deleteBatchFailure(error) {
        console.log(error, 'error');
    }
    viewAssignment() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewAssignments(data).subscribe( (successData) => {
                this.viewAssignmentSuccess(successData);
            },
            (error) => {
                this.viewAssignmentFailure(error);
            });
    }
    viewAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewAssignmentFailure(error) {
        console.log(error, 'error');
    }
    viewAssessment() {
        const data = {
            platform: 'web',
            type: this.viewtypehighlight,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.choosedData[0].class_id,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.viewAssessments(data).subscribe( (successData) => {
                this.viewAssessmentSuccess(successData);
            },
            (error) => {
                this.viewAssessmentFailure(error);
            });
    }
    viewAssessmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewAssessmentFailure(error) {
        console.log(error, 'error');
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
        this.classService.viewBatchResources(data).subscribe( (successData) => {
                this.viewBatchResourceSuccess(successData);
            },
            (error) => {
                this.viewBatchResourceFailure(error);
            });
    }
    viewBatchResourceSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewBatchResourceFailure(error) {
        console.log(error, 'error');
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
        this.classService.viewBatchAssignment(data).subscribe( (successData) => {
                this.viewBatchAssignmentSuccess(successData);
            },
            (error) => {
                this.viewBatchAssignmentFailure(error);
            });
    }
    viewBatchAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewBatchAssignmentFailure(error) {
        console.log(error, 'error');
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
        this.classService.viewBatchAssessment(data).subscribe( (successData) => {
                this.viewBatchAssessmentSuccess(successData);
            },
            (error) => {
                this.viewBatchAssessmentFailure(error);
            });
    }
    viewBatchAssessmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.resourceList = successData.ResponseObject;
        }
    }
    viewBatchAssessmentFailure(error) {
        console.log(error, 'error');
    }
    detailpreviewlist(id){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.resourceList[id].content_id
        };
        this.creatorService.detaillist(data).subscribe( (successData) => {
                this.contentDetailsSuccess(successData);
            },
            (error) => {
                this.contentDetailsFailure(error);
            });
    }
    contentDetailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.contentDetaildata = successData.ResponseObject;
            this.profileurl = this.contentDetaildata.profile_url;
            this.contentType = this.contentDetaildata.content_type;
            this.createdby = this.contentDetaildata.created_by;
            this.gradename = this.contentDetaildata.grade_name;
            this.subjectname = this.contentDetaildata.subject_name;
            this.tags = this.contentDetaildata.tags;
            this.noofquestions = this.contentDetaildata.no_of_questions;
            this.totalpoints = this.contentDetaildata.total_points;
            this.description = this.contentDetaildata.description;
            this.contentname = this.contentDetaildata.name;
            if (this.contentDetaildata.status == '1'){
                this.details = 'Published';
            }else if (this.contentDetaildata.status == '5'){
                this.details = 'Draft';
            }
        }
    }
    contentDetailsFailure(error) {
        console.log(error, 'error');
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
    PreviewPage(event, type, view){
        view == 'student_preview' ? this.auth.setSessionData('preview_type', 'yes') :
            this.auth.setSessionData('preview_type', 'no');
        this.auth.setSessionData('rista-return', type);
        this.previewType = 'pdf';
        this.viewer = view;
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }
    PreviewText(event, type, view){
        view == 'student_preview' ? this.auth.setSessionData('preview_type', 'yes') :
            this.auth.setSessionData('preview_type', 'no');
        this.auth.setSessionData('rista-return', type);
        this.previewType = 'text';
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
        if (view == 'student_preview'){
            this.auth.setSessionData('showAnswer', 1);
        }else {
            this.auth.removeSessionData('showAnswer');
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
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
    itemsReportDetails(data){
        this.auth.setSessionData('Individual-items-Report', JSON.stringify(data));
        this.reportData = JSON.parse(this.auth.getSessionData('Individual-items-Report'));
        this.modalRef = this.modalService.open(this.itemsReports, {size: 'xl'});
    }
}

