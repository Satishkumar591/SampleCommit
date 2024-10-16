import {AfterContentInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {TeacherService} from '../../../shared/service/teacher.service';
import {AnswerSheetComponent} from '../../studentlogin/answer-sheet/answer-sheet.component';
import {A} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-items-report',
  templateUrl: './items-report.component.html',
  styleUrls: ['./items-report.component.scss']
})
export class ItemsReportComponent implements OnInit {
  @Input() studentView: boolean;
  @Input() showContent: any;
  @Input() timeView: boolean;
  @ViewChild(AnswerSheetComponent , {static : false}) public answerCom: AnswerSheetComponent;
  public studentReport: FormGroup;
  public classList: any;
  public studentList: any;
  public webhost: any;
  public rows: any;
  public rowContent: any;
  public sectionList: any = [];
  public missedWorkStudentNoRecord = false;
  public missedWorkNoRecord = false;
  public functionCalled = false;
  public message: any;
  public reportData: any;
  public roleId: any;
  public classID: any;
  public sectionIndex: any = 1;
  windowSize: any;
  recordsperpage: any;
  pageOffSet: any;
  pageno: any;
  totalrecords: any;
  harizontalScroll: any;
  public  notifyType: any;
  public  studentname: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public showContentDetails: boolean;
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
  public studentName: any;
  public selectContentFormate: any;
  public contentId: any;
  public contentFormat: any;
  public classId: any;
  public studentId: any;
  public studentContentList: any;
  public questionStatus: any;
  public questionStatusAlt: any = [];
  public hoverTitle: any;
  public showQuestion = false;
  @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
  public studentContentId: any;
  constructor(public auth: AuthService, public report: ReportService, public confi: ConfigurationService, public sanitizer: DomSanitizer, public datePipe: DatePipe,
              public route: Router, public commondata: CommonDataService, private modalService: NgbModal, public toastr: ToastrService, public teacher: TeacherService,
              public validationService: ValidationService, private formBuilder: FormBuilder, public common: CommonService, public contentDetail: ContentdetailService) {
    this.harizontalScroll = true;
    this.roleId = this.auth.getSessionData('rista-roleid');
    this.recordsperpage = 10;
    this.pageOffSet = 0;
    this.pageno = 1;
    this.webhost = this.confi.getimgUrl();
    this.studentReport = this.formBuilder.group({
      className: '',
      contentName: '',
      studentName: '',
      submitted: '',
      contentType: '2'
    });
    this.reportData = JSON.parse(this.auth.getSessionData('Individual-items-Report'));
    this.studentReport.controls.className.patchValue(this.reportData.class_id);
    this.studentReport.controls.submitted.patchValue(this.reportData.status);
    this.studentReport.controls.contentName.patchValue(this.reportData.content_id);
    this.classID = this.reportData.class_id;
    this.selectContentFormate = this.reportData.content_format;
  }

  ngOnInit(): void {
    this.classDetails();
    if (this.showContent == 'Assignment') {
      this.studentReport.controls.contentType.patchValue('2');
    } else if (this.showContent == 'Assessment'){
      this.studentReport.controls.contentType.patchValue('3');
    }
  }
  numberValidate(event){
    this.validationService.numberValidate(event);
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
      // this.studentReport.controls.className.patchValue(this.classList[0].class_id);
      this.studentDetails();
      // this.StudentQuestionStatus();
      // this.StudentQuestionList();
    }
  }
  selectClass(){
    this.studentDetails();
    this.StudentQuestionStatus();
    // this.StudentQuestionList();
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
        content_id: this.studentReport.controls.contentName.value,
        class_id: this.studentReport.controls.className.value,
        class_content_id: this.reportData.class_content_id
      };
      this.report.getItemWiseStudentList(data).subscribe((successData) => {
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
      this.StudentQuestionStatus();
      // this.StudentQuestionList();
    } else {
      this.missedWorkNoRecord = false;
      this.missedWorkStudentNoRecord = false;
      this.message = 'No Records found';
      this.StudentQuestionStatus();
      // this.StudentQuestionList();
    }
  }

  studentDetailsFailure(error) {
    console.log(error, 'error');
  }
  StudentQuestionList() {
    // if (this.studentReport.controls.contentName.value != '') {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      class_id: this.studentReport.controls.className.value,
      // student_id: this.studentReport.controls.studentName.value,
      // student_id: '',
      type: this.studentReport.controls.submitted.value,
      content_id: this.studentReport.controls.contentName.value,
      content_format : this.selectContentFormate
    };
    this.report.getStudentQuestionList(data).subscribe((successData) => {
          this.StudentQuestionListSuccess(successData);
        },
        (error) => {
          this.StudentQuestionListFailure(error);
        });
    // }else {
    //   this.missedWorkStudentNoRecord = false;
    // }
  }

  StudentQuestionListSuccess(successData) {
    if (successData.IsSuccess) {
      console.log(successData.ResponseObject, 'valuee');
      this.missedWorkNoRecord = true;
      this.rows = successData.ResponseObject;
      // if (this.rows.length > 0) {
      //   this.hoverTitle = this.rows[0];
      //   this.showQuestion = true;
      // }
    } else{
        this.missedWorkNoRecord = false;
        this.message = 'No Records found';
    }
  }

  StudentQuestionListFailure(error) {
    console.log(error, 'error');
  }
  StudentQuestionStatus() {
    // if (this.studentReport.controls.contentName.value != '') {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        class_id: this.studentReport.controls.className.value,
        student_id: this.studentReport.controls.studentName.value,
        type: this.studentReport.controls.submitted.value,
        content_id: this.studentReport.controls.contentName.value,
        content_format : this.selectContentFormate,
        class_content_id : this.reportData.class_content_id
      };
      this.report.getStudentQuestionStatus(data).subscribe((successData) => {
            this.StudentQuestionStatusSuccess(successData);
          },
          (error) => {
            this.StudentQuestionStatusFailure(error);
          });
    // }else {
    //   this.missedWorkStudentNoRecord = false;
    // }
  }

  StudentQuestionStatusSuccess(successData) {
    if (successData.IsSuccess) {
      console.log(successData.ResponseObject, 'valuee');
      this.sectionIndex = 1;
      this.showQuestion = true;
      this.missedWorkNoRecord = true;
      this.sectionList = [];
      this.questionStatus = successData.ResponseObject;
      this.questionStatusAlt = JSON.parse(JSON.stringify(successData.ResponseObject));
      successData.ResponseObject[0].question.forEach((item) => {
        this.sectionList.push({heading: item.heading});
      });
      this.hoverTitle = this.questionStatus[0].question[this.sectionIndex - 1]?.section[0];
    } else {
      this.missedWorkNoRecord = false;
      this.message = 'No Records found';
    }
    this.functionCalled = true;
  }

  StudentQuestionStatusFailure(error) {
    console.log(error, 'error');
  }
  // splitTitleCode(value , id){
  //   let el = document.getElementById(id);
  //   console.log(el ,'el')
  //   let endNum = value.length - 4;
  //   return value.slice(3 ,endNum);
  // }
  clickEvent(data){
    console.log(data, 'data');
    this.hoverTitle = data;
    this.showQuestion = true;
      // setTimeout( () =>{
        // document.getElementById('myDiv').click();
      // } , 1000);

  }
  studentCorrectionDetail(data){
    console.log(data, 'data');
    this.studentName = data;
    this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
    this.contentId = data.content_id;
    this.contentFormat = data.content_format;
    this.classId = data.class_id;
    this.studentId = data.student_id;
    this.studentContentId = data.student_content_id;
  }
  changeSec(event) {
    if (event.target.value != 'all') {
      this.questionStatus = JSON.parse(JSON.stringify(this.questionStatusAlt));
      this.sectionIndex = parseInt(event.target.value);
      this.hoverTitle = this.questionStatus[0]?.question[this.sectionIndex - 1]?.section[0];
    } else {
      this.sectionIndex = 'all';
      this.questionStatus.forEach((item) => {
        item.question = [{section: []}];
      });
      this.questionStatusAlt.forEach((data, i) => {
        data.question.forEach((item, j) => {
          item.section.forEach((val) => {
            this.questionStatus[i].question[0].section.push(val);
          });
        });
      });
      this.hoverTitle = this.questionStatus[0]?.question[0]?.section[0];
    }
  }
}
