import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TeacherService} from '../../../shared/service/teacher.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {NavService} from '../../../shared/service/nav.service';
import {CommonService} from '../../../shared/service/common.service';
import {Router} from '@angular/router';
import {ValidationService} from '../../../shared/service/validation.service';
import {ToastrService} from 'ngx-toastr';
import {CreatorService} from '../../../shared/service/creator.service';
import {parse} from 'flatted';
import { jsPDF } from 'jspdf';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-answer-sheet',
  templateUrl: './answer-sheet.component.html',
  styleUrls: ['./answer-sheet.component.scss']
})
export class AnswerSheetComponent implements OnInit {
  @Input() answerShow: boolean;
  @Input() contentId: any;
  @Input() contentFormat: any;
  @Input() classId: any;
  @Input() studentReportId: any;
  @Input() backStatus: any;
  @Input() studentContentId: any;
  @Output() studentName = new EventEmitter<any>();

  public studentId: any;
  public scoreData: any;
  public studentAnswer: any;
  public totalAns = [];
  public openmenu: any;
  public showpdf: any;
  public functionCalled = false;
  public questionEmpty = false;
  public hideAnswer = false;
  public mathDelayer = false;
  public isPdfAvailable: boolean = true;
  public blink = true;
  public areaInfo = [];
  public sheetInfo = [];
  public dragQuestion = [];
  public workAnnotate = [];
  public totalSheetInfo = [];
  public workAnnotatePage = 0;
  public sheetIndex = 0;
  public workAnnotatePDF: any;
  public jsPDF: jsPDF;
  public webhost: any;
  public buttonName: any;
  public showingType: any;
  public pdfTemplate: any;
  public answerSheetPath: any;
  public AnswerType: any;
  public correctPdfPath: any;
  public correctAnswerKeyPath: any;
  public uploadAnswerPath: any;
  public showPDF = false;
  public showQuestion = false;
  public contentType = '';
  @ViewChild('workArea') workArea: TemplateRef<any>;
  @ViewChild('overallFeedback') overallFeedback: TemplateRef<any>;
  private modalRef: NgbModalRef;

  constructor(public config: NgbModalConfig, public confi: ConfigurationService, public sanitizer: DomSanitizer, public teacher: TeacherService,
              private modalService: NgbModal, public auth: AuthService, public commondata: CommonDataService, public navServices: NavService, public common: CommonService,
              public route: Router,public env: EnvironmentService, public validationService: ValidationService, public toastr: ToastrService, public creator: CreatorService) {
    this.backStatus = true;
    this.scoreData = JSON.parse(this.auth.getSessionData('rista-student-card'));
    this.contentType = this.auth.getSessionData('rista-ContentType');
    console.log(this.contentType, 'contentyPe');
    this.webhost = this.confi.getimgUrl();
    this.showpdf = true;
    this.buttonName = 'Question pdf';
    this.AnswerType = 'Hide answer';
    this.showingType = 1;
  }

  ngOnInit(): void {
    this.studentId = this.auth.getSessionData('rista-userid');
    if (this.answerShow){
      this.scoreData = {
        content_id : this.contentId,
        content_format : this.contentFormat,
        class_id : this.classId,
        student_content_id: this.studentContentId
      };
      this.studentId = this.studentReportId;
      this.backStatus = this.backStatus;
    }
    this.studentsAnswerList();
  }

  showOverallFeedback() {
    this.modalRef = this.modalService.open(this.overallFeedback, {size: 'xl', backdrop: 'static'});
  }
  clickEvent(){
    if (!this.mathDelayer) {
      this.mathDelayer = true;
      setTimeout( () => {
        document.getElementById('myDiv').click();
      } , 1000);
    }
    setTimeout(() => {
      this.mathDelayer = false;
    }, 1500);
  }
  parseVal(val) {
    if (val != '' && val != null) {
      let graph = parse(val);
      return graph;
    } else {
      let graph = false;
      return graph;
    }
  }

  showPDFOrQns() {
    if (!this.showPDF) {
      this.showPDF = true;
      this.showQuestion = false;
    }
  }

  splitMultiChoose(val, index) {
    let value = val.split(',');
    for (let i = 0; i < value.length; i++) {
      if (parseInt(value[i]) === parseInt(index)) {
        return true;
      }
    }
  }
  selectAnswerSheet(index) {
    this.blink = false;
    this.sheetIndex = index;
    this.answerSheetPath = this.webhost + '/' + this.uploadAnswerPath[index]?.original_image_url;
    this.sheetInfo = [...this.totalSheetInfo[index]];
    this.showType('2');
  }

  openWorkArea(item) {
    this.workAnnotate = [...item.workarea];
    this.workAnnotatePage = 0;
    if (this.workAnnotate.length != 0) {
      this.workAnnotate.forEach((val) => {
        if (val.pageNumber > this.workAnnotatePage) {
          this.workAnnotatePage = val.pageNumber;
        }
      });
      this.jsPDF = new jsPDF();
      for (let i = 0; i < this.workAnnotatePage - 1; i++) {
        this.jsPDF.addPage();
      }
      this.workAnnotatePDF = this.jsPDF.output('datauristring');
      console.log(this.workAnnotatePDF, 'this.workAnnotatePDF');
    }
    this.modalRef = this.modalService.open(this.workArea, {size: 'xl', backdrop: 'static'});
  }

  showType(id) {
    this.showingType = id;
    if (id == '1') {
      this.buttonName = 'Question pdf';
    } else if (id == '2') {
      this.buttonName = 'Answer sheet';
      setTimeout(() => {
        this.blink = true;
      }, 1000);
    } else if (id == '3') {
      this.buttonName = 'Show answer';
    }
  }
  HideAnswer() {
    this.hideAnswer = !this.hideAnswer;
    if (this.hideAnswer) {
      console.log('in');
      this.AnswerType = 'Show answer';
    } else if (!this.hideAnswer) {
      this.AnswerType = 'Hide answer';
    }
  }
  back() {
    if (this.scoreData.content_type == '2') {
      this.route.navigate(['/studentlogin/assignment']);
    } else if (this.scoreData.content_type == '3') {
      this.route.navigate(['/studentlogin/assessment']);
    }
  }

  changeView(event) {
    if (event.target.value == '1') {
      this.showPDF = true;
      this.showQuestion = false;
    } else if (event.target.value == '0') {
      this.showPDF = false;
      this.showQuestion = false;
    } else if (event.target.value == '2') {
      this.showQuestion = true;
      this.showPDF = false;
    }
  }

  changePDF(event) {
    console.log(event, 'event');
    console.log(event.target.value, 'target');
    if (event.target.value == 'all') {
      this.showType('1');
    } else {
      this.selectAnswerSheet(event.target.value);
    }
  }

  filterQues(event) {
    if (event.target.value == 'all') {
      if (this.correctPdfPath?.length == 0) {
        this.totalAns.forEach((item) => {
          item.isShow = true;
        });
      } else {
        console.log('pdf type');
        this.totalAns.forEach((value) => {
          value.section.forEach((item) => {
            item.isShow = true;
          });
        });
      }
    }
    else if (event.target.value == 'correct') {
      if (this.correctPdfPath?.length == 0) {
        this.totalAns.forEach((item) => {
          item.isShow = item.given_points != '0';
        });
      } else {
        console.log('pdf type');
        this.totalAns.forEach((value) => {
          value.section.forEach((item) => {
            item.isShow = item.given_points != '0';
          });
        });
      }
      console.log(this.totalAns, 'totalAns');
    } else if (event.target.value == 'wrong') {
      if (this.correctPdfPath?.length == 0) {
        this.totalAns.forEach((item) => {
          item.isShow = item.given_points == '0';
        });
      } else {
        console.log('pdf type');
        this.totalAns.forEach((value) => {
          value.section.forEach((item) => {
            item.isShow = item.given_points == '0';
          });
        });
      }
    }
  }
  studentsAnswerList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      content_id: this.scoreData.content_id,
      content_format: this.scoreData.content_format,
      class_id: this.scoreData.class_id,
      student_id: this.studentId,
      student_content_id: this.scoreData.student_content_id
    };
    this.teacher.studentAnswerList(data).subscribe( (successData) => {
          this.answerListSuccess(successData, data);
        },
        (error) => {
          this.answerListFailure(error);
        });
  }

  answerListSuccess(successData, id) {
    if (successData.IsSuccess) {
      //// sidenav closes///
      // this.openmenu = true;
      // this.creator.changeViewList(this.openmenu);
      // this.navServices.collapseSidebar = true;
      //// sidenav closes///

      this.studentAnswer = successData.ResponseObject;
      this.studentName.emit(this.studentAnswer.student_name);
      console.log(this.studentAnswer, 'studentAns');
      this.totalAns = [];
      this.correctPdfPath = this.common.convertBase64(this.studentAnswer?.file_path);
      this.uploadAnswerPath = this.common.convertBase64(this.studentAnswer?.upload_answer);
      if (this.studentAnswer.answer_sheet_annotation.length === 0) {
        this.uploadAnswerPath.forEach((item) => this.totalSheetInfo.push([]));
      } else {
        this.totalSheetInfo = this.studentAnswer.answer_sheet_annotation;
      }
      this.answerSheetPath = this.webhost + '/' + this.uploadAnswerPath[0]?.original_image_url;
      if (this.correctPdfPath.length != 0) {
        this.studentAnswer.annotation.forEach((item) => {
          item.isTeacherCorrection = false;
        });
        this.areaInfo = [...this.studentAnswer.student_annotation,
          ...this.studentAnswer.teacher_annotation, ...this.studentAnswer.annotation];
        console.log(this.areaInfo, 'annotationValue');
        this.dragQuestion = [...this.studentAnswer.question_annotation];
        if(this.correctPdfPath[0].original_image_url != undefined) {
          this.pdfTemplate = this.webhost + '/' + this.correctPdfPath[0]?.original_image_url;
          this.isPdfAvailable = true;
        } else {
          this.isPdfAvailable = false;
        }
        if (this.studentAnswer.answers.length != 0) {
          for (let i = 0; i < this.studentAnswer.answers.length; i++) {
            this.totalAns[i] = {heading: this.studentAnswer.answers[i].heading, section: []};
            for (let x = 0; x < this.studentAnswer.answers[i].section.length; x++) {
              for (let j = 0; j < this.studentAnswer.answers[i].section[x].sub_questions.length; j++) {
                const val = this.studentAnswer.answers[i].section[x].sub_questions[j].match_case === '1';
                this.studentAnswer.answers[i].section[x].sub_questions[j].match_case = val;
                this.totalAns[i].section.push(this.studentAnswer.answers[i].section[x].sub_questions[j]);
              }
              this.totalAns[i].section.forEach((item) => {
                item.maxValErr = false;
                item.isShow = true;
              });
            }
          }
        }
        else {
          this.questionEmpty = true;
          this.hideAnswer = true;
        }
      }
      else {
        this.totalAns = this.studentAnswer.answers;
        this.totalAns.forEach((item) => {
          item.maxValErr = false;
          item.isShow = true;
        });
        setTimeout(() => {
          for (let i = 0; i < this.totalAns.length; i++) {
            if (this.totalAns[i].question_type_id == 7) {
              for (let j = 0; j < this.totalAns[i].heading_option.length; j++) {
                let index = i;
                let row = this.totalAns[i].heading_option[j].correctActive;
                let column = this.totalAns[i].heading_option[j].correctAnswer;
                let final = index.toString() + row.toString() + column.toString();
                document.getElementById('chooseMultipass' + final).setAttribute('checked', 'true');
              }
            }
            else if (this.totalAns[i].question_type_id == 9) {
              for (let j = 0; j < this.totalAns[i].student_answer.length; j++) {
                let val = this.totalAns[i].student_answer[j].isSelected;
                if (val != '') {
                  document.getElementById(i + 'dropdown' + j).innerHTML = this.totalAns[i].student_answer[j].options[val].listOption;
                } else {
                  document.getElementById(i + 'dropdown' + j).innerHTML = 'Student Not Answered';
                }
              }
              for (let j = 0; j < this.totalAns[i].answer.length; j++) {
                for (let k = 0; k < this.totalAns[i].answer[j].options.length; k++) {
                  if (this.totalAns[i].answer[j].options[k].selected == 'true') {
                    document.getElementById(i + 'dropdownCorrect' + j).innerHTML = this.totalAns[i].answer[j].options[k].listOption;
                  }
                }
              }
            }
            else if (this.totalAns[i].question_type_id == 24) {
              for (let j = 0; j < this.totalAns[i].subQuestions.length; j++){
                if (this.totalAns[i].subQuestions[j].question_type_id == '7') {
                  console.log(i, 'indsdas');
                  for (let k = 0; k < this.totalAns[i].subQuestions[j].heading_option.length; k++) {
                    let index1 = i;
                    let id = j;
                    let row1 = this.totalAns[i].subQuestions[j].heading_option[k].correctActive;
                    let column1 = this.totalAns[i].subQuestions[j].heading_option[k].correctAnswer;
                    let final1 = index1.toString() + id.toString() + row1.toString() + column1.toString();
                    document.getElementById('chooseMultipass1' + final1)?.setAttribute('checked', 'true');
                  }
                }
              }
            }
          }
        }, 500);
      }
        // this.studentsData();
      this.functionCalled = true;
      this.clickEvent();
      }
    }

    answerListFailure(error) {
      console.log(error, 'error');
    }
  close() {
    this.modalRef.close();
  }

  closeOverAllFeedback(id) {
    this.modalRef.close(id);
  }
}
