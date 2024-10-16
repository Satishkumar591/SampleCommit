import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TeacherService} from '../../../shared/service/teacher.service';
import {ToastrService} from 'ngx-toastr';
import {parse} from 'flatted';
import {ValidationService} from '../../../shared/service/validation.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {CommonService} from '../../../shared/service/common.service';
import {dateOptions} from "../../../shared/data/config";
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-assessment',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
    public studentReport: FormGroup;
    public listData: any;
    public viewData: any;
    public webhost: any;
    public sortButton: any;
    public reportList: any = [];
    public type: any;
    public studentAnswer: any;
    public totalAns: any;
    public totalPoints: any;
    public studentPoints: any;
    public totalFeedBack: any;
    public currentGrade: any = '';
    public totalPointsArray: any;
    public studentPointsArray: any;
    public elem: any;
    public globalPdfViewerPath: any;
    public rectElem: any;
    public dragButton: any;
    public dragQuestionsList: any = [];
    public studentGradeList: any = [];
    public pdfpath: any;
    public pdfTemplate: any;
    public pageVariable: any;
    public from1Date = '';
    public to1Date = '';
    public myDpOptions: IAngularMyDpOptions;
    public zoom = 1.0;
    public studentName: any;
    public contentId: any;
    public contentFormat: any;
    public classId: any;
    public studentId: any;
    public allowSelect: boolean ;
    private modalRef: NgbModalRef;
    @ViewChild('content') viewContent: TemplateRef<any>;
    @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
    DpOptions: IAngularMyDpOptions = {
        dateFormat:dateOptions.pickerFormat,
    };
    public studentContentId: any;
    constructor(public auth: AuthService, public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer,
                public datePipe: DatePipe, public route: Router, public commondata: CommonDataService, public teacher: TeacherService,
                private modalService: NgbModal, public toastr: ToastrService, public validationService: ValidationService,
                private formBuilder: FormBuilder, public env: EnvironmentService,
                public newSubject: NewsubjectService, public common: CommonService) {
        this.webhost = this.confi.getimgUrl();
        this.studentReport = this.formBuilder.group({
            grade: '',
            fromDate: '',
            toDate: ''
        });
        // this.gradeList();
        this.newSubject.schoolChange.subscribe(params => {
            if (params != ''){
                if (this.route.url.includes('reports')) {
                    this.init(params);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
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
                title: 'Answered'
            },
            absent: {
                title: 'Absent'
            },
            start_date: {
                title: 'Assignment Date',
                valuePrepareFunction : (data) => {
                    if (data != '00-00-0000'){
                        return data;
                    }else {

                    }
                }
            },
            your_score: {
                title: 'Min.Score'
            },
            total_score: {
                title: 'Max.Score'
            },
            percentage: {
                title: 'Percentage Score'
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
                title: 'Answered'
            },
            absent: {
                title: 'Absent'
            },
            start_date: {
                title: 'Assessment Date',
                valuePrepareFunction : (data) => {
                    if (data != '00-00-0000'){
                        return data;
                    }else {

                    }
                }
            },
            your_score: {
                title: 'Min.Score'
            },
            total_score: {
                title: 'Max.Score'
            },
            percentage: {
                title: 'Percentage Score'
            }
        }
    };

    ngOnInit(): void {
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }
    ngOnDestroy(): void {
        // this.close();
    }
    init(data){
        this.gradeList();
        this.studentReport.controls.fromDate.patchValue('');
        this.studentReport.controls.toDate.patchValue('');
        // this.reports();
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
        if (type == '1'){
            this.myDpOptions = {
                dateRange: false,
                dateFormat:dateOptions.pickerFormat,
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
    changeGrade(event) {
        this.currentGrade = event.target.value;
        this.reports();
    }
    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
        };
        this.student.studentGradeList(data).subscribe((successData) => {
                this.gradeSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    gradeSuccess(successData) {
        if (successData.IsSuccess) {
            this.studentGradeList = successData.ResponseObject;
            if (this.studentGradeList.length != 0) {
                this.currentGrade = this.studentGradeList[0].grade_id;
                this.studentReport.controls.grade.patchValue(this.currentGrade);
                this.reports();
            } else {
                this.reportList = [];
            }
        }
    }
    reports() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            grade_id: this.currentGrade,
            from_date: this.from1Date == '' ? '' : this.datePipe.transform(this.from1Date, 'yyyy-MM-dd'),
            to_date: this.to1Date == '' ? '' : this.datePipe.transform(this.to1Date, 'yyyy-MM-dd'),
        };
        console.log(data, 'data');
        this.student.getReports(data).subscribe((successData) => {
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
    onSave() {
        this.modalRef.close('viewStudentDetails');
    }
    studentCorrectionDetail(event) {
        if (this.env.deviceType()) {
            this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl', windowClass: 'report-card-web'});
        } else {
            this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
        }
        console.log(event, 'ccccc');
        // this.studentName = event;
        this.contentId = event.data.content_id;
        this.contentFormat = event.data.content_format;
        this.classId = event.data.class_id;
        this.studentId = event.data.student_id;
        this.studentContentId = event.data.student_content_id;
    }
}
