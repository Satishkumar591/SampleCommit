import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/service/auth.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {parse} from 'flatted';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {ReportService} from '../../../shared/service/report.service';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {dateOptions} from "../../../shared/data/config";

@Component({
  selector: 'app-grade-report',
  templateUrl: './grade-report.component.html',
  styleUrls: ['./grade-report.component.scss']
})
export class GradeReportComponent implements OnInit { 
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1}
  };
  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1},
  };
  public studentReport: FormGroup;
  public listData: any;
  public sortType: any;
  public viewData: any;
  public webhost: any;
  public sortButton: any;
  public classList: any;
  public reportList: any;
  public classCode: any;
  public type: any;
  public studentAnswer: any;
  public totalAns: any;
  public totalPoints: any;
  public studentPoints: any;
  public totalFeedBack: any;
  public totalPointsArray: any;
  public studentPointsArray: any;
  public elem: any;
  public globalPdfViewerPath: any;
  public rectElem: any;
  public dragButton: any;
  public dragQuestionsList: any = [];
  public pdfpath: any;
  public pdfTemplate: any;
  public pageVariable: any;
  public from1Date: any;
  public to1Date: any;
  public schoolID: any;
  public schoolStatus: any;
  public zoom = 1.0;
  public allowSelect: boolean;
  public studentName: any;
  public contentId: any;
  public contentFormat: any;
  public classId: any;
  public studentId: any;
  public dateCount: any;
  private modalRef: NgbModalRef;
  @ViewChild('content') viewContent: TemplateRef<any>;
  @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
  public studentContentId: any;
  constructor(public auth: AuthService, public report: ReportService, public confi: ConfigurationService, public sanitizer: DomSanitizer, public datePipe: DatePipe,
              public route: Router, public commondata: CommonDataService, public common: CommonService, public teacher: TeacherService,
              private modalService: NgbModal, public toastr: ToastrService, public validationService: ValidationService,
              private formBuilder: FormBuilder, public newSubject: NewsubjectService) {
    console.log(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.webhost = this.confi.getimgUrl();
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.studentReport = this.formBuilder.group({
      className: '',
      fromDate: '',
      toDate: ''
    });
    if (this.schoolStatus.length != 0) {
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.route.url.includes('grade-report')) {
            this.init(params);
            this.studentReport.reset();
            this.studentReport.controls.className.patchValue('');
          }
        } else {
          this.init(this.auth.getSessionData('rista-school_id'));
        }
      });
    } else {

    }
  }

  public assignment = {
    hideSubHeader: false,
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },


    columns: {
      content_name: {
        title: 'Assignment Name',
        type: 'html',
        valuePrepareFunction: (data) => {
          return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
        }
      },
      graded: {
        title: 'Graded'
      },
      absent: {
        title: 'Absent'
      },
      start_date: {
        title: 'Assignment Date'
      },
      earned_points: {
        title: 'Min.Score'
      },
      total_points: {
        title: 'Max.Score'
      },
      percentage: {
        title: 'Avg. Score'
      }
    }
  };

  public assessment = {
    hideSubHeader: false,
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },


    columns: {
      content_name: {
        title: 'Assessment Name',
        type: 'html',
        valuePrepareFunction: (data) => {
          return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
        }
      },
      graded: {
        title: 'Graded'
      },
      absent: {
        title: 'Absent'
      },
      start_date: {
        title: 'Assessment Date'
      },
      earned_points: {
        title: 'Min.Score'
      },
      total_points: {
        title: 'Max.Score'
      },
      percentage: {
        title: 'Avg. Score'
      }
    }
  };
  init(res){
    this.schoolID = res;
    this.classDetails();
    this.reports();
    this.dateCountDetails();
  }

  ngOnInit(): void {

    this.allowSelect = false;
    this.newSubject.allowSchoolChange(this.allowSelect);
  }
  OnDestroy(): void {
    // this.close();
  }
  numberValidate(event){
    this.validationService.numberValidate(event);
  }
  markValidation(event, high , i, j) {
    const val = parseFloat(event.target.value);
    const pt = parseFloat(high);
    if (val > pt) {
      this.totalAns[i].section[j].maxValErr = true;
    }else{
      this.totalAns[i].section[j].maxValErr = false;
    }
  }
  getFeedback(event , i, j) {
    this.totalAns[i].section[j].feedback = event.target.value;
  }
  getPoints(event , index, id) {
    if (event.target.value != '') {
      console.log(event.target.value, 'in');
      this.totalAns[index].section[id].givenpoints = event.target.value;
      let count = 0;
      for (let i = 0; i < this.totalAns.length; i++) {
        for (let j = 0; j < this.totalAns[i].section.length; j++) {
          count += 1;
          if (index == i && id == j) {
            this.studentPointsArray[count - 1].point = parseFloat(event.target.value);
          }
        }
      }
      this.studentPoints = this.studentPointsArray.reduce((acc, value) => acc += value.point, 0);
    }
  }
  parseVal(val) {
    if (val != '' && val != null) {
      const graph = parse(val);
      return graph;
    } else {
      const graph = false;
      return graph;
    }
  }
  onDateChanged1(event: any, type): void {
    if(type == '1'){
      let localCurrentDate = new Date().toISOString();
      let maxDate = localCurrentDate;
      let min = new Date(event.singleDate.formatted);
      let min1 = new Date(event.singleDate.formatted);
      let validTo =  new Date(min.setDate(min.getDate() + (this.dateCount - 1))).toISOString();
      if (maxDate >= validTo) {
        let minToDate = new Date(event.singleDate.formatted);
        let maxToDate1 = new Date(min1.setDate(min1.getDate() + (this.dateCount - 1)));
        this.myDpOptions1 = {
          dateRange: false,
          dateFormat:dateOptions.pickerFormat,
          firstDayOfWeek: 'su',
          disableUntil: { year: new Date(minToDate).getFullYear(), month: new Date(minToDate).getMonth(), day: new Date(minToDate).getDate()},
          disableSince: { year: new Date(maxToDate1).getFullYear(), month: new Date(maxToDate1).getMonth() + 1, day: new Date(maxToDate1).getDate()},
        };
        this.from1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
        const dObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(maxToDate1)}, dateRange: null};
        this.studentReport.controls.toDate.patchValue(dObject);
        this.to1Date = this.datePipe.transform(this.studentReport.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
        this.reports();
      } else {
        this.myDpOptions1 = {
          dateRange: false,
          dateFormat:dateOptions.pickerFormat,
          firstDayOfWeek: 'su',
          disableUntil: { year: event.singleDate.date.year, month: event.singleDate.date.month, day: event.singleDate.date.day - 1},
          disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1},
        };
        this.from1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
        const cObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date()}, dateRange: null};
        this.studentReport.controls.toDate.patchValue(cObject);
        this.to1Date = this.datePipe.transform(this.studentReport.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
        this.reports();
      }
    } else {
      if (event.singleDate.formatted != '' && event.singleDate.formatted != null) {
        this.to1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
      } else {
        this.to1Date = '';
      }
      this.reports();
    }

  }
  classDetails() {
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      class_code: '',
      from_date: this.from1Date == '' ? '' : this.from1Date,
      to_date: this.to1Date == '' ? '' : this.to1Date,
    };
    this.report.gradeReport(data).subscribe((successData) => {
          this.classDetailsSuccess(successData);
        },
        (error) => {
          this.classDetailsFailure(error);
        });
  }

  classDetailsSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.classList = successData.ResponseObject;
    }
  }

  classDetailsFailure(error) {
    console.log(error, 'error');
  }
  selectClass(event){
    console.log(event.target.value);
    this.studentReport.controls.className.patchValue(event.target.value);
    this.reports();
    console.log(this.studentReport.controls.className.value, 'classs');
  }
  reports() {
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      class_code: this.studentReport.controls.className.value,
      from_date: this.from1Date == '' ? '' : this.from1Date,
      to_date: this.to1Date == '' ? '' : this.to1Date,
    };
    this.report.gradeReport(data).subscribe((successData) => {
          this.reportsSuccess(successData);
        },
        (error) => {
          this.reportsFailure(error);
        });
  }

  reportsSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.reportList = successData.ResponseObject;
      this.reportList.forEach((items) => {
        items.student_list.forEach((student) => {
          student.assessment.forEach((assess) => {
            if (assess.start_date != '00-00-0000') {
              assess.start_date = this.datePipe.transform(assess.start_date, dateOptions.dateFormat);
            } else {
              assess.start_date = '';
            }
          });
          student.assignment.forEach((assign) => {
            if (assign.start_date != '00-00-0000') {
              assign.start_date = this.datePipe.transform(assign.start_date, dateOptions.dateFormat);
            } else {
              assign.start_date = '';
            }
          });
        });
      });
    }
  }

  reportsFailure(error) {
    console.log(error, 'error');
  }
  dateCountDetails() {
    const data = {
      platform: 'web',
    };
    this.report.reportDateCount(data).subscribe((successData) => {
      this.dateCountSuccess(successData);
        },
        (error) => {
          this.dateCountFailure(error);
        });
  }
  dateCountSuccess(successData) {
    if (successData.IsSuccess) {
      this.dateCount = successData.ResponseObject.class_report_days;
      const a = new Date();
      const b = new Date();
      a.setDate(a.getDate() - this.dateCount);
      const aObject: IMyDateModel = {isRange: false, singleDate: {jsDate: a}, dateRange: null};
      const bObject: IMyDateModel = {isRange: false, singleDate: {jsDate: b}, dateRange: null};
      this.studentReport.controls.fromDate.patchValue(aObject);
      const aa = this.studentReport.controls.fromDate.value.singleDate.jsDate;
      this.myDpOptions1 = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
          year: new Date(aa).getFullYear(),
          month: new Date(aa).getMonth() +1,
          day: new Date(aa).getDate() -1
        },
      };
      this.studentReport.controls.toDate.patchValue(bObject);
      this.from1Date = this.datePipe.transform(this.studentReport.controls.fromDate.value.singleDate.jsDate, 'yyyy-MM-dd');
      this.to1Date = this.datePipe.transform(this.studentReport.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
      this.reports();
    }
  }
  dateCountFailure(error) {
    console.log(error, 'error');
  }
  add() {
  }

  viewdetailsList(type, data) {
    this.type = type;
    this.viewData = data;
    this.modalRef = this.modalService.open(this.viewContent);
  }

  open(content) {
    this.modalService.open(content);
  }

  close() {
    this.modalRef.close();
  }
  onSave() {
    this.modalRef.close('viewStudentDetails');
  }
  studentCorrectionDetail(event) {
    this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
    console.log(event, 'ccccc');
    // this.studentName = event;
    this.contentId = event.data.content_id;
    this.contentFormat = event.data.content_format;
    this.classId = event.data.class_id;
    this.studentId = event.data.student_id;
    this.studentContentId = event.data.student_content_id;
  }
}
