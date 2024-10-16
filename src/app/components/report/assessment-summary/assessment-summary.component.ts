import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ChartComponent} from 'ng-apexcharts';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexAxisChartSeries,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip
} from 'ng-apexcharts';
import {ReportService} from '../../../shared/service/report.service';
import {AuthService} from '../../../shared/service/auth.service';
import {ToastrService} from 'ngx-toastr';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {TeacherService} from '../../../shared/service/teacher.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {parse} from 'flatted';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {CommonService} from '../../../shared/service/common.service';
import {Router} from '@angular/router';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import * as $ from 'jquery';
import {dateOptions} from '../../../shared/data/config';

@Component({
    selector: 'app-assessment-summary',
    templateUrl: './assessment-summary.component.html',
    styleUrls: ['./assessment-summary.component.scss']
})
export class AssessmentSummaryComponent implements OnInit, OnDestroy {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1}
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableSince: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1},
    };
    public assessmentForm: FormGroup;
    private modalRef: NgbModalRef;
    public classDetails: any;
    public assessmentShow = false;
    public assessmentReportShow = false;
    public assessmentDetails: any;
    public assessmentReportDetails: any;
    public assignmentDetails: any;
    public assignmentReportDetails: any;
    public assignmentReportShow = false;
    public listData: any;
    public listData1: any;
    public listData2: any;
    public chartOptions: any;
    public chartOptions1: any;
    public chartOptions2: any;
    public viewStudentList: any;
    public studentContentDetails: any;
    public message: any = 'Select a Class List.';
    public teacherID: any;
    public assessmentValue: any;
    public assignmentValue: any;
    public studentAnswer: any;
    public totalAns: any;
    public totalPoints: any;
    public studentPoints: any;
    public totalFeedBack: any;
    public totalPointsArray: any;
    public studentPointsArray: any;
    public correctionData: any = false;
    public allowSelect: boolean;
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive[];
    labels: any;
    csv: any;
    csv1: any;
    csv2: any;
    rect: Rectangle = {x1: 0, y1: 0, x2: 0, y2: 0, d: '', text: '', width: 0, height: 0};
    public elem: any;
    areaInfo: AreaInfo[] = [];
    public rectElem: any;
    public svgColor: any;
    public zoom = 1.0;
    public globalPdfViewerPath: any;
    public originalSize = false;
    public dragButton: any;
    public dragQuestionsList: any = [];
    public pageVariable: any;
    public pdfTemplate: any;
    public webhost: any;
    public dateFormat: any;
    public pdfpath: any;
    public schoolId: any;
    public schoolStatus: any;
    public from1Date = '';
    public to1Date = '';
    public dateCount: any;

    @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
    @ViewChild('studentCorrection') studentCorrection: TemplateRef<any>;

    constructor(public commondata: CommonDataService, public firstcaps: TitleCasePipe, public confi: ConfigurationService, public teacher: TeacherService, private formBuilder: FormBuilder, public report: ReportService, public auth: AuthService,
                public toastr: ToastrService, public common: CommonService, public modalService: NgbModal, public datePipe: DatePipe,
                public validationService: ValidationService, public router: Router, public newSubject: NewsubjectService) {
        this.dateFormat = localStorage.getItem('currentFormat');
        // this.selectTab = 'assessment';
        this.webhost = this.confi.getimgUrl();
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        this.assessmentForm = this.formBuilder.group({
            class: null,
            assessment: null,
            assignment: null,
            fromDate: '',
            toDate: ''
        });
        if (this.schoolStatus.length != 0) {
            this.newSubject.schoolChange.subscribe(params => {
                if (params != '') {
                    if (this.router.url.includes('assessment-summary')) {
                        this.init(params);
                        this.assessmentShow = false;
                        this.assessmentReportShow = false;
                        this.assignmentReportShow = false;
                        this.assessmentForm.reset();
                    }
                } else {
                    this.init(this.auth.getSessionData('rista-school_id'));
                }
            });
        } else {

        }
        if (this.auth.getSessionData('rista-roleid') == '2') {
            this.teacherID = '0';
        } else {
            this.teacherID = this.auth.getSessionData('rista-userid');
        }
    }

    public settings = {
        hideSubHeader: false,
        actions: false,
        columns: {
            content_name: {
                title: 'Assessment Name',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
                }
            },
            average_student_score: {
                title: 'Avg. Student Score(%)',
            },
            assigned: {
                title: 'Assigned',
            },
            graded: {
                title: 'Graded'
            },
            absent: {
                title: 'Absent'
            },
            assessment_date: {
                title: 'Assessment Date'
            },
            min_score: {
                title: 'Min. Score'
            },
            max_score: {
                title: 'Max. Score'
            },
            average_score: {
                title: 'Percentage Score'
            }
        }
    };
    public settings1 = {
        hideSubHeader: false,
        actions: false,
        columns: {
            content_name: {
                title: 'Assignment Name',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
                }
            },
            average_student_score: {
                title: 'Avg. Student Score(%)',
            },
            assigned: {
                title: 'Assigned',
            },
            graded: {
                title: 'Graded'
            },
            absent: {
                title: 'Absent'
            },
            assignment_date: {
                title: 'Assignment Date'
            },
            min_score: {
                title: 'Min. Score'
            },
            max_score: {
                title: 'Max. Score'
            },
            average_score: {
                title: 'Avg. Score'
            }
        }
    };
    public settings2 = {
        hideSubHeader: false,
        actions: false,
        columns: {
            student_name: {
                title: 'Student Name',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="text-capitalize font-weight-bold table-name">${data}</span>`;
                }
            },
            student_average_score: {
                title: 'Avg. Student Score(%)',
            },
            assigned: {
                title: 'Assigned',
            },
            graded: {
                title: 'Graded'
            },
            absent: {
                title: 'Absent'
            },
            student_score: {
                title: 'Student Score'
            },
            total_score: {
                title: 'Total Score'
            }
        }
    };

    init(id) {
        this.schoolId = id;
        this.classReport();
    }

    ngOnInit() {
        // this.classReport();
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('rista-backOption');
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.dateCountDetails();
    }

    ngOnDestroy(): void {
        // this.close();
    }

    close() {
        this.modalRef.close();
    }

    back() {
        this.correctionData = false;
    }

    numberValidate(event) {
        this.validationService.numberValidate(event);
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

    classReport() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            teacher_id: this.teacherID
        };
        this.report.classReport(data).subscribe((successData) => {
                this.classReportSuccess(successData);
            },
            (error) => {
                console.error(error, 'classReport');
            });
    }

    classReportSuccess(successData) {
        if (successData.IsSuccess) {
            this.classDetails = successData.ResponseObject;
            if (this.classDetails.length != 0) {
              this.assessmentForm.controls.class.patchValue(this.classDetails[0].class_id);
              this.assessmentReport();
              this.assignmentReport();
            }
        }
    }

    onDateChanged1(event: any, type): void {
        if (type == '1') {
            let localCurrentDate = new Date().toISOString();
            const maxDate = localCurrentDate;
            let min = new Date(event.singleDate.formatted);
            let min1 = new Date(event.singleDate.formatted);
            let validTo = new Date(min.setDate(min.getDate() + (this.dateCount - 1))).toISOString();
            if (maxDate >= validTo) {
                let minToDate = new Date(event.singleDate.formatted);
                let maxToDate1 = new Date(min1.setDate(min1.getDate() + (this.dateCount - 1)));
                this.myDpOptions1 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: new Date(minToDate).getFullYear(),
                        month: new Date(minToDate).getMonth(),
                        day: new Date(minToDate).getDate()
                    },
                    disableSince: {
                        year: new Date(maxToDate1).getFullYear(),
                        month: new Date(maxToDate1).getMonth() + 1,
                        day: new Date(maxToDate1).getDate()
                    },
                };
                this.from1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
                const dObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(maxToDate1)},
                    dateRange: null
                };
                this.assessmentForm.controls.toDate.patchValue(dObject);
                this.to1Date = this.datePipe.transform(this.assessmentForm.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                this.assessmentReport();
                this.assignmentReport();
            } else {
                this.myDpOptions1 = {
                    dateRange: false,
                    dateFormat: dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: event.singleDate.date.year,
                        month: event.singleDate.date.month,
                        day: event.singleDate.date.day - 1
                    },
                    disableSince: {
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1,
                        day: new Date().getDate() + 1
                    },
                };
                this.from1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
                const cObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date()}, dateRange: null};
                this.assessmentForm.controls.toDate.patchValue(cObject);
                this.to1Date = this.datePipe.transform(this.assessmentForm.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                this.assessmentReport();
                this.assignmentReport();
            }
        } else {
            if (event.singleDate.formatted != '' && event.singleDate.formatted != null) {
                this.to1Date = this.datePipe.transform(event.singleDate.formatted, 'yyyy-MM-dd');
            } else {
                this.to1Date = '';
            }
            this.assessmentReport();
            this.assignmentReport();
        }
    }

    assessmentReport() {
        if (this.assessmentForm.get('class').value != null) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolId,
                class_id: this.assessmentForm.get('class').value,
                from_date: this.from1Date == '' ? '' : this.datePipe.transform(this.from1Date, 'yyyy-MM-dd'),
                to_date: this.to1Date == '' ? '' : this.datePipe.transform(this.to1Date, 'yyyy-MM-dd')
            };
            this.report.assessmentReport(data).subscribe((successData) => {
                    this.assessmentReportSuccess(successData);
                },
                (error) => {
                   console.error(error, 'assessmentReport');
                });
        } else {
            this.message = 'Class Id should not be empty';
            this.assessmentShow = false;
            this.assessmentReportShow = false;
        }
    }

    assessmentReportSuccess(successData) {
        if (successData.IsSuccess) {
            this.assessmentDetails = successData.ResponseObject;
            this.assessmentValue = this.assessmentDetails.map(item => item.content_id);
            this.assessmentShow = true;
            this.assessmentDetailReport();
        } else {
            this.message = 'Class Id should not be empty';
            this.assessmentShow = false;
            this.assessmentReportShow = false;
        }
    }

    assessmentDetailReport() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            class_id: this.assessmentForm.get('class').value,
            content_id: ((this.assessmentForm.get('assessment').value && this.assessmentForm.get('assessment').value.length > 0) ? this.assessmentForm.get('assessment').value : this.assessmentValue)
        };
        this.report.assessmentDetailReport(data).subscribe((successData) => {
                this.assessmentDetailReportSuccess(successData);
            },
            (error) => {
                console.error(error, 'assessmentDetailReport');
            });
    }

    assessmentDetailReportSuccess(successData) {
        if (successData.IsSuccess) {
            this.assessmentReportDetails = successData.ResponseObject;
            this.listData = this.assessmentReportDetails.contentList;
            this.listData.forEach((item) => {
                if (item.assessment_date != '00-00-0000') {
                    item.assessment_date = this.datePipe.transform(item.assessment_date, dateOptions.dateFormat);
                } else {
                    item.assessment_date = '';
                }
            });
            this.chartOptions = {
                series: [this.assessmentReportDetails.chartValues[0].Master, this.assessmentReportDetails.chartValues[0].Excellent, this.assessmentReportDetails.chartValues[0].Proficient, this.assessmentReportDetails.chartValues[0].Average, this.assessmentReportDetails.chartValues[0].belowAverage],
                chart: {
                    width: 480,
                    type: "pie"
                },
                labels: ["Master(90% and above)", "Excellent(80% - 89.99%)", "Proficient(70% - 79.99%)", "Average(50% - 69.99%)", "Below Average(less than 50%)"],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 400
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
            this.assessmentReportShow = true;
        } else {
            this.assessmentReportShow = false;
            this.message = 'No Records found';
        }
    }

    assignmentReport() {
        if (this.assessmentForm.get('class').value != null) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolId,
                class_id: this.assessmentForm.get('class').value,
                from_date: this.from1Date == '' ? '' : this.datePipe.transform(this.from1Date, 'yyyy-MM-dd'),
                to_date: this.to1Date == '' ? '' : this.datePipe.transform(this.to1Date, 'yyyy-MM-dd')
                // from_date: this.assessmentForm.get('fromDate').value == '' ? '' : this.datePipe.transform(this.assessmentForm.get('fromDate').value.singleDate.jsDate, 'yyyy-MM-dd'),
                // to_date: this.assessmentForm.get('toDate').value == '' ? '' : this.datePipe.transform(this.assessmentForm.get('toDate').value.singleDate.jsDate, 'yyyy-MM-dd')
            };
            this.report.assignmentReport(data).subscribe((successData) => {
                    this.assignmentReportSuccess(successData);
                },
                (error) => {
                    console.error(error, 'assignmentReport');
                });
        } else {
            this.message = 'Class Id should not be empty';
            this.assessmentShow = false;
            this.assignmentReportShow = false;
        }
    }

    assignmentReportSuccess(successData) {
        if (successData.IsSuccess) {
            this.assignmentDetails = successData.ResponseObject;
            this.assignmentValue = this.assignmentDetails.map(item => item.content_id);
            this.assessmentShow = true;
            // this.assignmentReportShow = true;
            this.assignmentDetailReport();
        } else {
            this.message = 'Class Id should not be empty';
            this.assessmentShow = false;
            this.assignmentReportShow = false;
        }
    }

    assignmentDetailReport() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            class_id: this.assessmentForm.get('class').value,
            content_id: ((this.assessmentForm.get('assignment').value && this.assessmentForm.get('assignment').value.length > 0) ? this.assessmentForm.get('assignment').value : this.assignmentValue)
        };
        this.report.assignmentDetailReport(data).subscribe((successData) => {
                this.assignmentDetailReportSuccess(successData);
            },
            (error) => {
                this.assignmentDetailReportFailure(error);
            });
    }

    assignmentDetailReportSuccess(successData) {
        if (successData.IsSuccess) {
            this.assignmentReportDetails = successData.ResponseObject;
            this.listData1 = this.assignmentReportDetails.contentList;
            this.listData1.forEach((item) => {
                if (item.assignment_date != '00-00-0000') {
                    item.assignment_date = this.datePipe.transform(item.assignment_date, dateOptions.dateFormat);
                } else {
                    item.assignment_date = '';
                }
            });
            this.chartOptions1 = {
                series: [this.assignmentReportDetails.chartValues[0].Master, this.assignmentReportDetails.chartValues[0].Excellent, this.assignmentReportDetails.chartValues[0].Proficient, this.assignmentReportDetails.chartValues[0].Average, this.assignmentReportDetails.chartValues[0].belowAverage],
                chart: {
                    width: 480,
                    type: "pie"
                },
                labels: ["Master(90% and above)", "Excellent(80% - 89.99%)", "Proficient(70% - 79.99%)", "Average(50% - 69.99%)", "Below Average(less than 50%)"],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 400
                            },
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                ]
            };
            this.assignmentReportShow = true;
        } else {
            this.assignmentReportShow = false;
            this.message = 'No Records found';
        }
    }

    assignmentDetailReportFailure(error) {
    }

    studentCorrectionDetail(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
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
                                    if (this.studentAnswer.answers[i].section[x].sub_questions[j].question_type_id != '54') {
                                        if (val == false) {
                                            if (ans.toLowerCase() == student_ans.toLowerCase()) {
                                                this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                            }
                                        }
                                        if (ans == student_ans) {
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                        }
                                    } else {
                                        let allCorrect = true;
                                        for (let y = 0; y < ans.length; y++) {
                                            if (this.matchcase(ans[y].value, val) != this.matchcase(student_ans[y], val)) {
                                                allCorrect = false;
                                            }
                                        }
                                        if (allCorrect) {
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].given_points = this.studentAnswer.answers[i].section[x].sub_questions[j].points;
                                            this.studentAnswer.answers[i].section[x].sub_questions[j].correction_status = '1';
                                        }
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
                    this.dragQuestionsList = [...this.studentAnswer.question_annotation];
                    this.areaInfo = [...this.studentAnswer.annotation, ...this.studentAnswer.student_annotation, ...this.studentAnswer.teacher_annotation];
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
                this.correctionData = true;
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

    matchcase(val, match) {
        let value;
        if (val != '' && val != undefined && val != 'undefined' && val != null) {
            if (match) {
                value = val.trim();
            } else {
                value = val.trim().toLowerCase().split(' ').join('');
            }
        } else {
            value = val;
        }
        return value;
    }

    viewDetail(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            class_id: event.data.class_id,
            content_id: event.data.content_id
        };
        this.report.studentContentReport(data).subscribe((successData) => {
                this.viewDetailReportSuccess(successData);
            },
            (error) => {
                this.viewDetailReportFailure(error);
            });
    }

    viewDetailReportSuccess(successData) {
        this.chartOptions2 = {
            series: [
                {
                    name: "Master(90% and above)",
                    data: []
                },
                {
                    name: "Excellent(80% - 89.99%)",
                    data: []
                },
                {
                    name: "Proficient(70% - 79.99%)",
                    data: []
                },
                {
                    name: "Average(50% - 69.99%)",
                    data: []
                },
                {
                    name: "Below Average(less than 50%)",
                    data: []
                }
            ],
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                type: "category",
                categories: []
            },
            legend: {
                position: "right",
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        };
        this.viewStudentList = successData.ResponseObject;
        this.listData2 = this.viewStudentList.studentList;
        this.studentContentDetails = this.viewStudentList.chart;
        const categoriesList = [];
        for (let i = 0; i < this.studentContentDetails.length; i++) {
            let datalist = this.studentContentDetails[i].data;
            let dataBelow = datalist.filter(function (val) {
                return Number(val) < 50;
            });
            let dataAverage = datalist.filter(function (val) {
                return Number(val) >= 50 && Number(val) <= 70;
            });
            let dataProficient = datalist.filter(function (val) {
                return Number(val) > 70 && Number(val) <= 80;
            });
            let dataExcellent = datalist.filter(function (val) {
                return Number(val) > 80 && Number(val) <= 90;
            });
            let dataMaster = datalist.filter(function (val) {
                return Number(val) > 90;
            });
            this.chartOptions2.xaxis.categories.push(this.studentContentDetails[i].name == null ? '' : this.studentContentDetails[i].name);
            for (var a = 0; a < dataMaster.length; a++) {
                if (dataMaster[a]) {
                    this.chartOptions2.series[0]['data'].push(dataMaster[a] + '%');
                    this.chartOptions2.series[1]['data'].push(0);
                    this.chartOptions2.series[2]['data'].push(0);
                    this.chartOptions2.series[3]['data'].push(0);
                    this.chartOptions2.series[4]['data'].push(0);
                }
            }
            for (var b = 0; b < dataExcellent.length; b++) {
                if (dataExcellent[b]) {
                    this.chartOptions2.series[0]['data'].push(0);
                    this.chartOptions2.series[1]['data'].push(dataProficient[b] + '%');
                    this.chartOptions2.series[2]['data'].push(0);
                    this.chartOptions2.series[3]['data'].push(0);
                    this.chartOptions2.series[4]['data'].push(0);
                }
            }
            for (var c = 0; c < dataProficient.length; c++) {
                if (dataProficient[c]) {
                    this.chartOptions2.series[0]['data'].push(0);
                    this.chartOptions2.series[1]['data'].push(0);
                    this.chartOptions2.series[2]['data'].push(dataProficient[c] + '%');
                    this.chartOptions2.series[3]['data'].push(0);
                    this.chartOptions2.series[4]['data'].push(0);
                }
            }
            for (var d = 0; d < dataAverage.length; d++) {
                if (dataAverage[d]) {
                    this.chartOptions2.series[0]['data'].push(0);
                    this.chartOptions2.series[1]['data'].push(0);
                    this.chartOptions2.series[2]['data'].push(0);
                    this.chartOptions2.series[3]['data'].push(dataAverage[d] + '%');
                    this.chartOptions2.series[4]['data'].push(0);
                }
            }
            for (var e = 0; e < dataBelow.length; e++) {
                if (dataBelow[e]) {
                    this.chartOptions2.series[0]['data'].push(0);
                    this.chartOptions2.series[1]['data'].push(0);
                    this.chartOptions2.series[2]['data'].push(0);
                    this.chartOptions2.series[3]['data'].push(0);
                    this.chartOptions2.series[4]['data'].push(dataBelow[e] + '%');
                }
            }
            /*dataMaster.forEach(val => {
                  this.chartOptions2.series[0]['data'].push(val ? val + '%' : 0);
            });
            dataExcellent.forEach(val => {
              this.chartOptions2.series[1]['data'].push(val ? val + '%' : 0);
            });
            dataProficient.forEach(val => {
              this.chartOptions2.series[2]['data'].push(val ? val + '%' : 0);
            });
            dataAverage.forEach(val => {
              this.chartOptions2.series[3]['data'].push(val ? val + '%' : 0);
            });
            dataBelow.forEach(val => {
              this.chartOptions2.series[4]['data'].push(val ? val + '%' : 0);
            });*/
        }
        this.modalRef = this.modalService.open(this.viewStudentDetails, {size: "xl"});
    }

    viewDetailReportFailure(error) {
    }

    downloadExcelData() {
        // let fileName = `EnergyData_${this.downloadDate}.csv`;
        // let fileName = `transaction_${this.form.controls.fromDate.value}-${this.form.controls.toDate.value}.csv`;
        let requiredColumnNames = [
            'Assessment Name',
            'Avg. Student Score(%)',
            'Assigned',
            'Graded',
            'Absent',
            'Assessment Date',
            'Min. Score',
            'Max. Score',
            'Avg. Score'
        ];
        let columnNames = requiredColumnNames;
        let header = columnNames.join(',');
        this.csv = header;
        this.csv += '\r\n';
        for (let i = 0; i < this.listData.length; i++) {
            this.csv += [
                this.listData[i].content_name,
                this.listData[i].average_student_score,
                this.listData[i].assigned,
                this.listData[i].graded,
                this.listData[i].absent,
                this.listData[i].assessment_date,
                this.listData[i].min_score,
                this.listData[i].max_score,
                this.listData[i].average_score,
            ].join(',');
            this.csv += '\r\n';
        }

        var blob = new Blob([this.csv], {type: 'text/csv;charset=utf-8;'});
        var link = document.createElement('a');

        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Assessment-Report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadAssignmentExcelData() {
        // let fileName = `EnergyData_${this.downloadDate}.csv`;
        // let fileName = `transaction_${this.form.controls.fromDate.value}-${this.form.controls.toDate.value}.csv`;
        let requiredColumnNames1 = [
            'Assignment Name',
            'Avg. Student Score(%)',
            'Assigned',
            'Graded',
            'Absent',
            'Assignment Date',
            'Min. Score',
            'Max. Score',
            'Avg. Score'
        ];
        let columnNames1 = requiredColumnNames1;
        let header1 = columnNames1.join(',');
        this.csv1 = header1;
        this.csv1 += '\r\n';
        for (let i = 0; i < this.listData1.length; i++) {
            this.csv1 += [
                this.listData1[i].content_name,
                this.listData1[i].average_student_score,
                this.listData1[i].assigned,
                this.listData1[i].graded,
                this.listData1[i].absent,
                this.listData1[i].assignment_date,
                this.listData1[i].min_score,
                this.listData1[i].max_score,
                this.listData1[i].average_score,
            ].join(',');
            this.csv1 += '\r\n';
        }

        var blob1 = new Blob([this.csv1], {type: 'text/csv1;charset=utf-8;'});
        var link1 = document.createElement('a');

        var url1 = URL.createObjectURL(blob1);
        link1.setAttribute('href', url1);
        link1.setAttribute('download', 'Assignment-Report.csv');
        document.body.appendChild(link1);
        link1.click();
        document.body.removeChild(link1);
    }

    downloadStudentExcelData() {
        // let fileName = `EnergyData_${this.downloadDate}.csv`;
        // let fileName = `transaction_${this.form.controls.fromDate.value}-${this.form.controls.toDate.value}.csv`;
        let requiredColumnNames2 = [
            'Student Name',
            'Avg. Student Score(%)',
            'Assigned',
            'Graded',
            'Absent',
            'student Score',
            'Total Score',
        ];
        let columnNames2 = requiredColumnNames2;
        let header2 = columnNames2.join(',');
        this.csv2 = header2;
        this.csv2 += '\r\n';
        for (let i = 0; i < this.listData2.length; i++) {
            this.csv2 += [
                this.listData2[i].student_name,
                this.listData2[i].student_average_score,
                this.listData2[i].assigned,
                this.listData2[i].graded,
                this.listData2[i].absent,
                this.listData2[i].student_score,
                this.listData2[i].total_score,
            ].join(',');
            this.csv2 += '\r\n';
        }

        var blob2 = new Blob([this.csv2], {type: 'text/csv1;charset=utf-8;'});
        var link2 = document.createElement('a');

        var url2 = URL.createObjectURL(blob2);
        link2.setAttribute('href', url2);
        link2.setAttribute('download', 'Student-Report.csv');
        document.body.appendChild(link2);
        link2.click();
        document.body.removeChild(link2);
    }

    assessmentPrint(): void {
        let printContents, popupWin;
        printContents = document.getElementById('assessmentPrint').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
                <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <style>
          @media print {    
          body{
          font-family: 'Roboto', sans-serif;
          }
          .card-body{
          display: none;
          }
          .form-group {
           display: none;
          }
          .group-btn {
           display: none;
          }
          .bg-secondary-assessment{
            background: #f3f3f3;
            color: #adb3b8;
          }
          .text-secondary-assessment{
            color: #adb3b8;
          }
          .letter{
            color: #7F3486;
          }
          h3{
            font-size: 16px;
            color: #adb3b8;
          }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
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
            console.log(this.dateCount, 'datecount');
            const a = new Date();
            const b = new Date();
            a.setDate(a.getDate() - this.dateCount);
            const aObject: IMyDateModel = {isRange: false, singleDate: {jsDate: a}, dateRange: null};
            const bObject: IMyDateModel = {isRange: false, singleDate: {jsDate: b}, dateRange: null};
            this.assessmentForm.controls.fromDate.patchValue(aObject);
            const aa = this.assessmentForm.controls.fromDate.value.singleDate.jsDate;
            this.myDpOptions1 = {
                dateRange: false,
                dateFormat: dateOptions.pickerFormat,
                firstDayOfWeek: 'su',
                disableUntil: {
                    year: new Date(aa).getFullYear(),
                    month: new Date(aa).getMonth() + 1,
                    day: new Date(aa).getDate() - 1,
                },
            };
            this.assessmentForm.controls.toDate.patchValue(bObject);
            this.from1Date = this.datePipe.transform(this.assessmentForm.controls.fromDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            this.to1Date = this.datePipe.transform(this.assessmentForm.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            this.assessmentReport();
            this.assignmentReport();
        }
    }

    dateCountFailure(error) {
        console.log(error, 'error');
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
