import {AfterContentInit, Component, Input, Output, OnDestroy, OnInit, TemplateRef, ViewChild, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/service/auth.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {parse} from 'flatted';
import {ReportService} from '../../../shared/service/report.service';
import {CommonService} from '../../../shared/service/common.service';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {TeacherService} from '../../../shared/service/teacher.service';
import {AnswerSheetComponent} from '../../studentlogin/answer-sheet/answer-sheet.component';
import {A} from '@angular/cdk/keycodes';
import {ClassService} from '../../../shared/service/class.service';
import {StudentService} from '../../../shared/service/student.service';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {SseClient} from 'ngx-sse-client';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-missed-work-report',
  templateUrl: './missed-work-report.component.html',
  styleUrls: ['./missed-work-report.component.scss']
})
export class MissedWorkReportComponent implements OnInit , AfterContentInit , OnDestroy {
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
    };
  @Input() classShow: boolean;
  @Input() calledForm?: any = '';
  @Input() studentView: boolean;
  @Input() showContent: any;
  @Input() timeView: boolean;
  @Input() contentNameValue: any;
  @Output() value? = new EventEmitter<any>();
  @ViewChild(AnswerSheetComponent , {static : false}) public answerCom: AnswerSheetComponent;
  public studentReport: FormGroup;
  public classList: any;
  public studentList: any;
  public webhost: any;
  public rows: any;
  public rowContent: any;
  public coloumValues: any = [];
  public studentContentList: any;
  public missedWorkStudentNoRecord = false;
  public missedWorkNoRecord = false;
  public message: any;
  public reportData: any;
  public viewdetail: any;
  public reportStudentData: any;
  public roleId: any;
  public classID: any;
  public contentData: any;
  windowSize: any;
  recordsperpage: any;
    studentName = '';
  pageOffSet: any;
  pageno: any;
  totalrecords: any;
  harizontalScroll: any;
  public  notifyType: any;
  public  studentname: any;
  private modalRef: NgbModalRef;
  @ViewChild('viewoveralldetails') viewoveralldetails: TemplateRef<any>;
  public closeResult: string;
  public showContentDetails: boolean;
  public myDpOptions1: IAngularMyDpOptions;
  public from1Date: any;
  public to1Date: any;
  public studentAnswer: any;
  public totalAns: any;
  public totalPoints: any;
  public studentPoints: any;
  public totalFeedBack: any;
  public totalPointsArray: any;
  public studentPointsArray: any;
  public dragQuestionsList: any = [];
  public pdfpath: any;
  public pdfTemplate: any;
  public selectContentFormate: any = [];
  public contentId: any;
  public contentFormat: any;
  public classId: any;
  public studentId: any;
  public bodyValue: any;
  @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
  @ViewChild('notStarted') notStarted: TemplateRef<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
  private modalRefOverAll: NgbModalRef;

  subs:  Subscription[] = [];
    public studentContentId: any;

  constructor(public auth: AuthService, public report: ReportService, public confi: ConfigurationService,
              public sanitizer: DomSanitizer, public datePipe: DatePipe, private sseClient: SseClient,
                public route: Router,  public studented: StudentService, public commondata: CommonDataService, private modalService: NgbModal, public toastr: ToastrService, public teacher: TeacherService,
                public validationService: ValidationService, private formBuilder: FormBuilder, public common: CommonService, public contentDetail: ContentdetailService) {
      // mobile and tab hide side navbar
      // this.windowSize = (window.screen.width);
      // if (this.windowSize <= 1200) {
      //     this.harizontalScroll = true;
      // } else {
        this.harizontalScroll = true;
        const date = new Date(this.setDate);
        this.from1Date = this.datePipe.transform(new Date(this.setDate).setDate(date.getDate()-30), 'yyyy-MM-dd');
        this.to1Date = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.myDpOptions1 = {
            dateRange: false,
            dateFormat:dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate() != 1 ? date.getDate() - 1 : -1,
            },
        };
        this.roleId = this.auth.getSessionData('rista-roleid');
        this.recordsperpage = 10;
        this.pageOffSet = 0;
        this.pageno = 1;
        this.webhost = this.confi.getimgUrl();
        this.studentReport = this.formBuilder.group({
              className: '',
              contentType: '2',
              contentName: '',
              studentName: '',
              submitted: '',
              performance: '',
              fromDate: '',
              toDate: ''
        });
        this.reportData = JSON.parse(this.auth.getSessionData('Individual-Class-Report'));
        this.reportStudentData = JSON.parse(this.auth.getSessionData('Individual-student-Report'));
        this.studentReport.controls.className.patchValue(this.reportData.class_id);
        this.classID = this.reportData.class_id;
  }
    public missedWorkReport = {
        hideSubHeader: false,
        actions: {
            add: false,
            edit: false,
            delete: false,
            position: 'right',
        },
        columns: {
            student_name: {
                title: 'Student Name',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
                }
            },
            assignment1: {
                title: 'assignment1',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="select-red"></span>`;
                }
            },
            assignment2: {
                title: 'assignment2',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="select-yellow"></span>`;
                }
            },
            assignment3: {
                title: 'assignment3',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="select-green"></span>`;
                }
            },
            assignment4: {
                title: 'assignment4',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="select-green"></span>`;
                }
            },
            performance: {
                title: 'performance'
            }
        }
    };
//  public newSettings = { columns: { first_column: { title: 'first_column', type: 'number' } } };
//  public missedWork = Object.assign({}, this.newSettings );

    ngOnInit(): void {

        if (this.classShow){
            if (this.contentNameValue != ''){
                this.studentReport.controls.contentName.patchValue([this.contentNameValue]);
            } else {
                this.studentReport.controls.contentName.patchValue([]);
            }
        }
        if (this.showContent == 'Assignment') {
            this.studentReport.controls.contentType.patchValue('2');
        } else if (this.showContent == 'Assessment'){
            this.studentReport.controls.contentType.patchValue('3');
        }
        if (this.timeView) {
            const fd = this.from1Date.split('-');
            const fdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(fd[0]), parseInt(fd[1]) - 1, parseInt(fd[2]))},
                dateRange: null
            };
            this.studentReport.controls.fromDate.patchValue(fdObject);
            const cd = this.to1Date.split('-');
            const cdObject: IMyDateModel = {
                isRange: false,
                singleDate: {jsDate: new Date(parseInt(cd[0]), parseInt(cd[1]) - 1, parseInt(cd[2]))},
                dateRange: null
            };
            this.studentReport.controls.toDate.patchValue(cdObject);
        } else{
            this.studentReport.controls.fromDate.patchValue('');
            this.studentReport.controls.toDate.patchValue('');
            this.from1Date = '';
            this.to1Date = '';
        }
        this.classDetails();
        // this.studentDetails();
    }

    ngAfterContentInit(): void {

    }

    ngOnDestroy(): void {
        this.subs.forEach(val => {
            val.unsubscribe();
        });
    }

    sseClientService() {
        // const sseUrl = 'https://uthkal.com/rista/api/index.php/v1/report/studentReportClassPrint';
        const sseUrl = 'report/studentReportClassPrint';
        // console.log(sseUrl, 'sseURL');
        this.subs.push(this.sseClient.stream(sseUrl, { keepAlive: true, reconnectionDelay: 5_000,
            responseType: 'event' }, {body: this.bodyValue  }, 'POST').subscribe((event) => {
                // console.log(event , 'event');
            if (event.type === 'error') {
                const errorEvent = event as ErrorEvent;
                // console.error(errorEvent, errorEvent.message);
            } else {
                const messageEvent = event as MessageEvent;
                // this.notificationEvent = messageEvent.data;
                // console.log(typeof messageEvent.data, 'SSE client called');
                this.studentReportDetailsSSESuccess(messageEvent.data === 'No Records found' ? messageEvent.data : JSON.parse(messageEvent.data));
                // console.info(SSE request with type "${messageEvent.type}" and data "${messageEvent.data}");
            }
        }));
    }
    studentReportDetailsSSESuccess(successData) {
        console.log(successData, 'successData SSE client call');
        if (successData === 'No Records found') {
            this.missedWorkNoRecord = false;
            this.message = successData;
        } else {
            this.missedWorkNoRecord = true;
            this.rows = successData.data;
            this.totalrecords = successData.total_count;
            if (this.rows.length != ''){
                for (let i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].content == ''){
                        this.missedWorkNoRecord = false;
                        this.message = 'No Records found';
                    }else {
                        this.missedWorkNoRecord = true;
                        this.missedWorkStudentNoRecord = true;
                        this.rowContent = this.rows[i].content;
                        this.coloumValues[i] = [];
                        this.rows[i].content.forEach( (item) => {
                            this.coloumValues[i].push(item);
                        });
                    }
                }
            } else{
                this.missedWorkNoRecord = false;
                this.message = 'No Records found';
            }
        }
    }

    numberValidate(event){
    this.validationService.numberValidate(event);
  }
    notifyParent(data, id){
        this.notifyType = id;
        this.studentname = [data];
        this.modalRef = this.modalService.open(this.modalContentnow);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    studentNotAnswer(data){
        this.modalRef = this.modalService.open(this.notStarted);
        this.studentname = [data];
    }
    setPage(pageInfo) {
        this.pageno = pageInfo.offset + 1;
        this.pageOffSet = pageInfo.offset;
    }
    close(){
        this.modalRef.close('modalContentnow');
        this.notifyType = '';
    }
    onSave() {
        this.modalRef.close('viewStudentDetails');
    }
    closeAnswer(){
        this.modalRef.close('viewStudentDetails');
    }
    closeNotstarted(){
        this.modalRef.close('notStarted');
    }
    onDateChanged1(event: any, type): void {
        if (type == '1'){
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat:dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: event.singleDate.date.year,
                    month: event.singleDate.date.month,
                    day: event.singleDate.date.day != 1 ? event.singleDate.date.day - 1 : -1,
                },
            };
            this.from1Date = event.singleDate.formatted;
            this.studentContentDetails();
        } else {
            this.to1Date = event.singleDate.formatted;
            this.studentContentDetails();
        }

    }
    confirmNotifiy(){
        let notifyStudent = [];
        this.studentname.forEach((items) => {
            console.log(items, 'items');
            notifyStudent.push({
                class_id: items.class_id,
                content_id: items.content_id,
                student_id: items.student_id,
                student_content_id: items.student_content_id
            });
        });
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            notify: notifyStudent
        };
        console.log(notifyStudent, 'notifyStudent');
        this.contentDetail.notifiyParent(data).subscribe( (successData) => {
                this.teacherNotifyParentSuccess(successData);
            },
            (error) => {
                this.teacherNotifiyParentError(error);
            });
    }

    teacherNotifyParentSuccess(successData){
        if (successData.IsSuccess) {
            this.modalRef.close();
            this.toastr.success(successData.ResponseObject);
            this.notifyType = '';
            this.studentDetails();
        }else{
            this.toastr.error(successData.ErrorObject);
        }
    }
    teacherNotifiyParentError(error){
        console.log(error);
        this.notifyType = '';
    }
    classDetails() {
        if (this.auth.getSessionData('rista-roleid') == '2'){
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                teacher_id: '0',
            };
            this.report.getMissedWorkClassList(data).subscribe((successData) => {
                    this.classDetailsSuccess(successData);
                },
                (error) => {
                    this.classDetailsFailure(error);
                });
        }else{
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                teacher_id: this.auth.getSessionData('rista-userid'),
            };
            this.report.getMissedWorkClassList(data).subscribe((successData) => {
                    this.classDetailsSuccess(successData);
                },
                (error) => {
                    this.classDetailsFailure(error);
                });
        }
    }

    classDetailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.classList = successData.ResponseObject;
            this.studentReport.controls.className.patchValue(this.classList[0].class_id);
            this.studentDetails();
        }
    }
    selectClass(){
        this.studentDetails();
    }
    classDetailsFailure(error) {
        console.log(error, 'error');
    }
    studentDetails() {
        if (this.studentReport.controls.className.value != ''){
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                teacher_id: this.auth.getSessionData('rista-userid'),
                class_id: this.studentReport.controls.className.value
            };
            if (this.classShow){
                data['class_id'] = this.classID;
            }
            this.report.getMissedWorkStudentList(data).subscribe((successData) => {
                    this.studentDetailsSuccess(successData);
                },
                (error) => {
                    this.studentDetailsFailure(error);
                });
        }else{
            this.missedWorkStudentNoRecord = false;
        }
    }

    studentDetailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.missedWorkStudentNoRecord = true;
            this.studentList = successData.ResponseObject;
            this.studentList.unshift({student_id: '', student_name: 'All'});
            this.studentContentDetails();
        } else {
            this.missedWorkNoRecord = false;
            this.missedWorkStudentNoRecord = false;
            this.message = 'No Records found';
            this.studentContentDetails();
        }
    }

    studentDetailsFailure(error) {
        console.log(error, 'error');
    }
    contentTypeSelect(){
        this.studentReport.controls.contentName.patchValue([]);
        this.studentContentDetails();
    }
    studentContentDetails() {
    if (this.studentReport.controls.className.value != ''){
        console.log(this.from1Date, 'this.from1Date');
        let dateSearchShow = this.timeView == true ? '1' : '2';
        if (this.from1Date == '' && this.to1Date == '' && this.timeView) {
            dateSearchShow = '3';
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            teacher_id: this.auth.getSessionData('rista-userid'),
            class_id: this.studentReport.controls.className.value,
            content_type: this.studentReport.controls.contentType.value,
            content_id: this.studentReport.controls.contentName.value,
            from_date: this.datePipe.transform(this.from1Date, 'yyyy-MM-dd'),
            to_date: this.datePipe.transform(this.to1Date, 'yyyy-MM-dd'),
            date_filter: dateSearchShow
        };
        if (this.classShow){
            data['class_id'] = this.classID;
            if (this.showContent == 'Assignment') {
                data['content_type'] = '2';
            } else if (this.showContent == 'Assessment'){
                data['content_type'] = '3';
            }  else {
                data['content_type'] = this.studentReport.controls.contentType.value;
            }
        }
        this.report.getPerformanceContent(data).subscribe((successData) => {

                this.studentContentDetailsSuccess(successData);
            },
            (error) => {
                this.studentContentDetailsFailure(error);
            });
    }else{
        this.missedWorkStudentNoRecord = false;
    }
    }

    studentContentDetailsSuccess(successData) {
        if (successData.IsSuccess) {
                this.missedWorkNoRecord = true;
                this.studentContentList = successData.ResponseObject;
                const selected = this.studentContentList.map(item => item.content_id);
                const selectedFormate = this.studentContentList.map(item => item.content_format);
                if (this.studentView){
                    let patchData = [];
                    let patachDataFormate = [];
                    selected.forEach((item) => {
                        if (parseInt(item) === parseInt(this.reportStudentData.content_id)){
                            patchData.push(item);
                        }
                        if(parseInt(item) === parseInt(this.reportStudentData.content_format)){
                            patachDataFormate.push(item);
                        }
                    });
                    this.studentReport.controls.contentName.patchValue(patchData);
                    this.selectContentFormate = patachDataFormate;
                    this.showContentDetails = true;
                }else{
                    this.studentReport.get('contentName').patchValue(selected);
                    this.selectContentFormate = selectedFormate;
                    this.showContentDetails = false;
                }
                this.studentReportDetails();
        } else{
            this.missedWorkNoRecord = false;
            this.studentList = [];
            this.studentContentList = [];
            this.studentReport.get('contentName').patchValue([]);
            this.message = 'No Records found';
        }
    }

    studentContentDetailsFailure(error) {
        console.log(error, 'error');
    }
    public onSelectAll() {
        const selected = this.studentContentList.map(item => item.content_id);
        const selectedFomat = this.studentContentList.map(item => item.content_format);
        this.selectContentFormate = selectedFomat;
        this.studentReport.controls.contentName.patchValue(selected);
        this.studentReportDetails();
    }
    selectContantName(eve){
        const selected = eve.map(item => item.content_id);
        const selectedFomat = eve.map(item => item.content_format);
        this.selectContentFormate = selectedFomat;
        this.studentReport.controls.contentName.patchValue(selected);
        this.studentReportDetails();
    }
    studentReportDetails() {
    if (this.studentReport.controls.contentName.value != '') {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            teacher_id: this.auth.getSessionData('rista-userid'),
            content_type: this.studentReport.controls.contentType.value,
            class_id: this.studentReport.controls.className.value,
            student_id: this.studentReport.controls.studentName.value,
            type: this.studentReport.controls.submitted.value,
            performance: this.studentReport.controls.performance.value,
            content_id: this.studentReport.controls.contentName.value,
            content_format : this.selectContentFormate,
            class_content_id: this.calledForm == 'class'  ? '' : this.reportStudentData?.class_content_id
        };
        if (this.classShow){
            data['class_id'] = this.classID;
            if (this.showContent == 'Assignment') {
                data['content_type'] = '2';
            } else if (this.showContent == 'Assessment'){
                data['content_type'] = '3';
            }  else {
                data['content_type'] = this.studentReport.controls.contentType.value;
            }
        }
        this.subs.forEach(val => {
            val.unsubscribe();
        });
        console.log(this.subs, 'subs');
        // this.subs = [];
        this.bodyValue = data;
        this.sseClientService();
        this.report.getMissedWorkReport(data).subscribe((successData) => {
                this.studentReportDetailsSuccess(successData);
            },
            (error) => {
                this.studentReportDetailsFailure(error);
            });
    }else {
        this.missedWorkStudentNoRecord = false;
    }
    }

    studentReportDetailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.missedWorkNoRecord = true;
            this.rows = successData.ResponseObject?.data;
            this.totalrecords = successData.ResponseObject.total_count;
            if (this.rows.length != ''){
                for (let i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].content == ''){
                        this.missedWorkNoRecord = false;
                        this.message = 'No Records found';
                        // this.missedWorkStudentNoRecord = false;
                        this.message = 'No Records found';
                    }else {
                        this.missedWorkNoRecord = true;
                        this.missedWorkStudentNoRecord = true;
                        this.rowContent = this.rows[i].content;
                        this.coloumValues[i] = [];
                        this.rows[i].content.forEach( (item) =>{
                            this.coloumValues[i].push(item);
                        });
                    }
                }
            } else{
                this.missedWorkNoRecord = false;
                this.message = 'No Records found';
            }
        } else{
            this.missedWorkNoRecord = false;
            this.message = 'No Records found';
        }
    }

    studentReportDetailsFailure(error) {
        console.log(error, 'error');
    }
    getStudentFullDetail(item) {
        console.log(item, 'datum');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: 'list'
        };
        this.studented.getStudentList(data).subscribe((successData) => {
                this.studentFullDetailSuccess(successData, item);
            },
            (error) => {
                console.log(error);
            });
    }
    studentFullDetailSuccess(successData, item) {
        if (successData.IsSuccess) {
            successData.ResponseObject.forEach((val) => {
                if (val.user_id == item.student_id) {
                    this.viewdetail = val;
                    this.studentName = item.student_name;
                }
            });
            this.modalRef = this.modalService.open(this.viewoveralldetails, {size: 'xl'});
            console.log(this.viewdetail, 'viewDetail');
        }
    }
    closeOverAll() {
        this.modalRef.close('viewoveralldetails');
    }
    studentContentAll(){
            const selected = this.studentContentList.map(item => item.content_id);
            let patchData = [];
            let patachDataFormate = [];
            selected.forEach((item) => {
                if (parseInt(item) === parseInt(this.reportStudentData.content_id)){
                    patchData.push(item);
                }
                if(parseInt(item) === parseInt(this.reportStudentData.content_format)){
                    patachDataFormate.push(item);
                }
            });
            this.studentReport.controls.contentName.patchValue(patchData);
            this.selectContentFormate = patachDataFormate;
            console.log(this.selectContentFormate, 'formate');
            this.showContentDetails = true;
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


    getMonths(row) {
        return row[0].color;
        // here you can see that I always pass index as zero. I need to access the row index I am at in the view and pass it to this method
    }


    public getRowIndex(row: any): number {
        return this.table.bodyComponent.getRowIndex(row); // row being data object passed into the template
    }
    studentCorrectionDetail(data){
        this.contentData = '';
        console.log(data, 'data');
        this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
        this.contentId = data.content_id;
        this.contentFormat = data.content_format;
        this.classId = data.class_id;
        this.studentId = data.student_id;
        this.studentContentId = data.student_content_id;
    }
    getStudentName(event) {
        this.contentData = event;
    }
    scoreRedirect(value){
        console.log(value)
        this.route.navigate(['/score/score-details/' + '' + value]);
        this.value.emit();
    }
}
