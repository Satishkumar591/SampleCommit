import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {ToastrService} from 'ngx-toastr';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {CommonService} from '../../../shared/service/common.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-assessment',
    templateUrl: './assingments.component.html',
    styleUrls: ['./assingments.component.scss']
})
export class AssingmentsComponent implements OnInit {
    public answerKeyPath: any;
    public listData: any = [];
    public listData1: any;
    public filterType: any;
    public webhost: any;
    public sortButton: any;
    public allowSelect: boolean;
    public searchAssign: any;
    @ViewChild('answerKey') answerKey: TemplateRef<any>;
    private modalRef: NgbModalRef;
    public mobileView = false;

    constructor(public auth: AuthService, public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer, private modalService: NgbModal,
                public route: Router, public newSubject: NewsubjectService, public toastr: ToastrService,
                public common: CommonService, public env: EnvironmentService) {
        this.webhost = this.confi.getimgUrl();
        this.mobileView = this.env.mobileView;
        this.newSubject.schoolChange.subscribe((params) => {
            if (params != '') {
                if (this.route.url.includes('assignment')) {
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
        this.assignmentList(this.filterType);
    }

    onSave() {
        this.modalRef.close();
    }

    assessmentSearch() {
        if (this.searchAssign != '') {
            this.updateFilter(this.searchAssign);
        }
    }

    sendRequest(list, val) {
        list.answer_request = val;
        this.request(list);
    }

    updateFilter(event) {
        const val = event.toLowerCase();
        const temp = this.listData1.filter(function (d) {
            return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.listData = temp;
        this.setSearch_Filter(this.filterType);
    }
    downloadPdf(list) {
        console.log(list);
        let path = this.common.convertBase64(list.file_path);
        console.log(path, 'path');
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', path.original_image_url);
        link.setAttribute('download', path.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    openAnswerKey(list) {
        // this.modalRef = this.modalService.open(this.answerKey, {size: 'xl'});
        console.log(list.downloadPDF[0].original_image_url, 'list.downloadPDF[0].original_image_url')
        this.answerKeyPath = this.webhost + '/' + list.downloadPDF[0].original_image_url;
        console.log(this.answerKeyPath, 'answer')
    }

    checkFunction(event) {
        event.stopPropagation();
    }

    answerPage(id) {
        this.auth.setSessionData('rista-ContentType', 'Assignments');
        if (id.student_content_status != 3) {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(id));
            this.route.navigate(['/studentlogin/answering']);
        } else {
            this.auth.setSessionData('rista-student-card', JSON.stringify(id));
            this.route.navigate(['/studentlogin/score-card']);
        }
    }

    assignmentList(id) {
        this.setSearch_Filter(id);
        this.filterType = id;
        let data;
        data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            type: this.filterType,
        };
        this.student.assingmentList(data).subscribe((successData) => {
                this.assingmentListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_assignmentList');
            });
    }

    assingmentListSuccess(successData) {
        if (successData.IsSuccess) {
            successData.ResponseObject.forEach((val) => {
                val.downloadPDF = this.common.convertBase64(val.answerkey_path);
            });
            this.listData1 = successData.ResponseObject;
            this.listData = successData.ResponseObject;
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
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentAssignmentSearch));
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                    items.assignmentDateStatus = id;
                    items.assignmentName = this.searchAssign;
                } else {
                    const searchData = {
                        assignmentName: this.searchAssign,
                        assignmentDateStatus: id,
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
            this.auth.setSessionData(SessionConstants.studentAssignmentSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentAssignmentSearch));
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                this.filterType = items.assignmentDateStatus;
                this.searchAssign = items.assignmentName;
                return false;
            } else {
                this.searchAssign = '';
                this.filterType = '3';
            }
            return true;
        });
    }
}
