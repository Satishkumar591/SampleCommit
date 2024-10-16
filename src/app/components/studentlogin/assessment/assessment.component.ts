import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {CommonService} from "../../../shared/service/common.service";
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-assessment',
    templateUrl: './assessment.component.html',
    styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
    private modalRef: NgbModalRef;
    public listData: any = [];
    public listData1: any;
    public sortType: any;
    public filterType: any;
    public webhost: any;
    public sortButton: any;
    public requestId: any = 1;
    public allowSelect: boolean;
    public searchAssess: any;
    public checkTime: any;
    public message: any;
    public answerKeyPath: any;
    public ErrorTitle: any;
    public mobileView = false;
    @ViewChild('throwError') throwError: TemplateRef<any>;
    @ViewChild('answerKey') answerKey: TemplateRef<any>;

    constructor(public auth: AuthService, public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer,
                public route: Router, public toastr: ToastrService, public newSubject: NewsubjectService,
                private modalService: NgbModal, public common: CommonService, public env: EnvironmentService) {
        this.webhost = this.confi.getimgUrl();
        this.mobileView = this.env.mobileView;
        this.newSubject.schoolChange.subscribe((params) => {
            if (params != '') {
                if (this.route.url.includes('assessment')) {
                    this.init(params);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
        });
    }

    ngOnInit(): void {
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    init(data) {
        this.getSearch_Filter();
        this.assessmentList(this.filterType);
    }

    onSave() {
        this.modalRef.close();
    }

    assessmentSearch() {
        if (this.searchAssess != '') {
            this.updateFilter(this.searchAssess);
        }
    }

    answerPage(list) {
        this.checkContentTime(list);
    }
    sendRequest(list, val) {
        console.log(list, 'list');
        list.answer_request = val;
        this.request(list);
    }
    downloadPdf(list) {
        console.log(list);
        let path = this.common.convertBase64(list.file_path);
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', path.original_image_url);
        link.setAttribute('download', path.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    openAnswerKey(list) {
        this.modalRef = this.modalService.open(this.answerKey, {size: 'xl'});
        this.answerKeyPath = this.webhost + '/' + list.downloadPDF[0].original_image_url;
    }

    checkFunction(event) {
        event.stopPropagation();
    }
    
    checkContentTime(selectedData) {
        let data;
        data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: selectedData.class_id,
            content_id: selectedData.content_id,
        };
        this.student.checkTime(data).subscribe((successData) => {
                this.checkContentTimeSuccess(successData, selectedData);
            },
            (error) => {
                this.checkContentTimeFailure(error);
            });
    }

    checkContentTimeSuccess(successData, selectedData) {
        if (successData.IsSuccess) {
            this.checkTime = successData.ResponseObject;
            // if (selectedData.status == 3 && (selectedData.student_content_status == 1 || selectedData.student_content_status == 2)) {
            //     // this.toastr.error('Assessment End date is over');
            //     // this.message = selectedData.content_name + ' ' + 'is assessment End date is over';
            //     // this.ErrorTitle = selectedData.class_name;
            //     // this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
            //
            // } else
            this.auth.setSessionData('rista-ContentType', 'Assessments');
            if (selectedData.student_content_status == 3) {
                this.auth.setSessionData('rista-student-card', JSON.stringify(selectedData));
                this.route.navigate(['/studentlogin/score-card']);
            } else {
                this.auth.setSessionData('rista-classDetails', JSON.stringify(selectedData));
                this.route.navigate(['/studentlogin/answering']);
            }
        } else {
            // this.toastr.error(successData.ResponseObject);
            this.message = successData.ResponseObject;
            this.ErrorTitle = selectedData.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        }
    }

    checkContentTimeFailure(error) {
        console.log(error, 'error');
    }

    updateFilter(event) {
        const val = event.toLowerCase();
        const temp = this.listData1.filter(function (d) {
            return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.listData = temp;
        this.setSearch_Filter(this.filterType);
    }

    assessmentList(id) {
        this.setSearch_Filter(id);
        this.filterType = id;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            type: this.filterType,
        };
        this.student.assessmentList(data).subscribe((successData) => {
                this.assessmentListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_assessmentList');
            });
    }

    assessmentListSuccess(successData) {
        if (successData.IsSuccess) {
            successData.ResponseObject.forEach((val) => {
                val.downloadPDF = this.common.convertBase64(val.answerkey_path);
            });
            this.listData = successData.ResponseObject;
            this.listData1 = successData.ResponseObject;
            this.listData.forEach((items) => {
               items.overdueStatus = true;
               if (items.overdue < 0){
                   items.overdueStatus = false;
                   Math.abs(items.overdue);
                   items.overdue = Math.abs(items.overdue);
               }
            });
            this.assessmentSearch();
        }
    }

    request(list) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: this.auth.getSessionData('rista-userid'),
            content_id: list.content_id,
            class_id: list.class_id
        };
        this.student.answerKeyRequest(data).subscribe((successData) => {
                this.answerKeyRequestSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_assessmentList');
            });
    }
    answerKeyRequestSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success('Download request sent');
        }
    }

    setSearch_Filter(id) {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentAssessmentSearch));
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                    items.assessmentDateStatus = id;
                    items.assessmentName = this.searchAssess;
                } else {
                    const searchData = {
                        assessmentName: this.searchAssess,
                        assessmentDateStatus: id,
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
            this.auth.setSessionData(SessionConstants.studentAssessmentSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentAssessmentSearch));
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                this.filterType = items.assessmentDateStatus;
                this.searchAssess = items.assessmentName;
                return false;
            } else {
                this.searchAssess = '';
                this.filterType = '3';
            }
            return true;
        });
    }
}
