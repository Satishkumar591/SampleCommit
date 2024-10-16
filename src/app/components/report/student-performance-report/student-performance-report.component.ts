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
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {ReportService} from '../../../shared/service/report.service';
import {CommonService} from '../../../shared/service/common.service';
import {dateOptions} from '../../../shared/data/config';

@Component({
    selector: 'app-student-performance-report',
    templateUrl: './student-performance-report.component.html',
    styleUrls: ['./student-performance-report.component.scss']
})
export class StudentPerformanceReportComponent implements OnInit {

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
    areaInfo: AreaInfo[] = [];
    public pdfpath: any;
    public pdfTemplate: any;
    public pageVariable: any;
    public from1Date: any;
    public to1Date: any;
    public studentlisthighlight: any;
    public zoom = 1.0;
    public myDpOptions: IAngularMyDpOptions;
    private modalRef: NgbModalRef;
    @ViewChild('content') viewContent: TemplateRef<any>;
    @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;

    constructor(public auth: AuthService, public report: ReportService, public confi: ConfigurationService, public sanitizer: DomSanitizer, public datePipe: DatePipe,
                public route: Router, public commondata: CommonDataService, public teacher: TeacherService, private modalService: NgbModal, public toastr: ToastrService,
                public validationService: ValidationService, private formBuilder: FormBuilder, public common: CommonService) {
        this.webhost = this.confi.getimgUrl();
        this.studentReport = this.formBuilder.group({
            className: '',
            fromDate: '',
            toDate: ''
        });

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
            your_score: {
                title: 'Min. Score'
            },
            total_score: {
                title: 'Max. Score'
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
            your_score: {
                title: 'Min.Score'
            },
            total_score: {
                title: 'Max.Score'
            },
            percentage: {
                title: 'Avg. Score'
            }
        }
    };

    ngOnInit(): void {
        this.classDetails();
        this.reports();
        // this.commondata.showLoader(false);
    }

    numberValidate(event) {
        this.validationService.numberValidate(event);
    }

    studentList(id) {
        this.studentlisthighlight = id;
    }

    markValidation(event, high, i, j) {
        const val = parseFloat(event.target.value);
        const pt = parseFloat(high);
        if (val > pt) {
            this.totalAns[i].section[j].maxValErr = true;
        } else {
            this.totalAns[i].section[j].maxValErr = false;
        }
    }

    getFeedback(event, i, j) {
        this.totalAns[i].section[j].feedback = event.target.value;
    }

    getPoints(event, index, id) {
        if (event.target.value != '') {
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
        if (type == '1') {
            this.myDpOptions = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                disableUntil: {
                    year: event.singleDate.date.year,
                    month: event.singleDate.date.month,
                    day: event.singleDate.date.day != 1 ? event.singleDate.date.day - 1 : -1,
                },
            };
            this.from1Date = event.singleDate.formatted;
            this.reports();
        } else {
            this.to1Date = event.singleDate.formatted;
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
        if (successData.IsSuccess) {
            this.classList = successData.ResponseObject;
        }
    }

    classDetailsFailure(error) {
        console.log(error, 'error');
    }

    selectClass(event) {
        this.studentReport.controls.className.patchValue(event.target.value);
        this.reports();
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
        if (successData.IsSuccess) {
            this.reportList = successData.ResponseObject;
        }
    }

    reportsFailure(error) {
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

    studentCorrectionDetail(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: event.data.content_id,
            content_format: event.data.content_format,
            class_id: event.data.class_id,
            student_id: event.data.student_id,
            student_content_id: event.data.student_content_id
        };
        this.teacher.studentAnswerList(data).subscribe((successData) => {
                this.answerListSuccess(successData);
            },
            (error) => {
                this.answerListFailure(error);
            });
    }

    answerListSuccess(successData) {
        if (successData.IsSuccess) {
            this.studentAnswer = successData.ResponseObject;
            this.totalAns = [];
            this.totalPoints = '';
            this.totalPointsArray = [];
            this.studentPoints = '';
            this.totalFeedBack = '';
            this.studentPointsArray = [];
            if (this.studentAnswer.status == '5' || this.studentAnswer.status == '3') {
                if (this.studentAnswer.answers.length != 0) {
                    for (let i = 0; i < this.studentAnswer.answers.length; i++) {
                        this.totalAns[i] = {heading: this.studentAnswer.answers[i].heading, section: []};
                        for (let x = 0; x < this.studentAnswer.answers[i].section.length; x++) {
                            for (let j = 0; j < this.studentAnswer.answers[i].section[x].sub_questions.length; j++) {
                                const val = this.studentAnswer.answers[i].section[x].sub_questions[j].match_case === '1';
                                this.studentAnswer.answers[i].section[x].sub_questions[j].match_case = val;
                                if (this.studentAnswer.answers[i].section[x].sub_questions[j].auto_grade == '1') {
                                    const ans = this.studentAnswer.answers[i].section[x].sub_questions[j].answer;
                                    const student_ans = this.studentAnswer.answers[i].section[x].sub_questions[j].student_answer;
                                    if (val == false) {
                                        if (ans.toLowerCase() == student_ans.toLowerCase()) {
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                        }
                                    }
                                    if (ans == student_ans) {
                                        this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                    }
                                }
                                this.totalPointsArray.push({point: parseFloat(this.studentAnswer.answers[i].section[x].sub_questions[j].points)});
                                this.studentPointsArray.push({point: parseFloat(this.studentAnswer.answers[i].section[x].sub_questions[j].given_points)});
                                this.totalAns[i].section.push(this.studentAnswer.answers[i].section[x].sub_questions[j]);
                            }
                        }
                        this.totalAns[i].section.forEach((item) => {
                            item.maxValErr = false;
                        });
                        this.totalFeedBack = this.studentAnswer.feedback;
                        this.totalPoints = this.totalPointsArray.reduce((acc, value) => acc += value.point, 0);
                        this.studentPoints = this.studentPointsArray.reduce((acc, value) => acc += value.point, 0);
                    }
                } else {
                    this.areaInfo = [...this.studentAnswer.annotation, ...this.studentAnswer.student_annotation, ...this.studentAnswer.teacher_annotation];
                    this.dragQuestionsList = [...this.studentAnswer.question_annotation];
                    this.pdfpath = this.studentAnswer.file_path[0];
                    if (this.studentAnswer?.base64_data) {
                        this.pdfTemplate = this.studentAnswer.base64_data == '' ? this.webhost + '/' + this.pdfpath.original_image_url : this.common.convertBase64PdfPath(this.studentAnswer.base64_data);
                    } else {
                        this.pdfTemplate = this.webhost + '/' + this.pdfpath.original_image_url;
                    }
                    this.studentPoints = this.studentAnswer.earned_points;
                    this.totalPoints = this.studentAnswer.points;
                    this.totalFeedBack = this.studentAnswer.feedback;
                }
                this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
            } else if (this.studentAnswer.status == '1' || this.studentAnswer.status == '2') {
                this.toastr.error('Student not answered');
            } else if (this.studentAnswer.status == '6' || this.studentAnswer.status == '4') {
                this.toastr.error('Correction pending');
            }
        }
    }

    answerListFailure(error) {
        console.log(error);
    }
}

interface Rectangle {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    d: string;
    text: any;
    width: number;
    height: number;
}

interface AreaInfo {
    rectangleId: string;
    pageNumber: number;
    rect: Rectangle;
    isDelete?: boolean;
    shape: string;
    color: any;
    fontSize: any;
}
