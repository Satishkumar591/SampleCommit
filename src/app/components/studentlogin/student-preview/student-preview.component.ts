import {Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {StudentService} from '../../../shared/service/student.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {CreatorService} from '../../../shared/service/creator.service';
import {NavService} from '../../../shared/service/nav.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-preview',
    templateUrl: './student-preview.component.html',
    styleUrls: ['./student-preview.component.scss']
})
export class StudentPreviewComponent implements OnInit {
    areaInfo: AreaInfo[] = [];
    public questionData: any;
    public getData: any;
    public webhost: any;
    public pdfTemplate: any;
    public detailData: any;
    public openmenu: boolean;
    public functionCalled: boolean;
    public delAnnotation: boolean;
    public totalAns: any = [];
    public isPdfAvailable: boolean = true;
    public userType = 'student';
    public allowSelect: boolean;
    public linkdata: any;
    public pdfPath: any;
    public showcontent: any;
    public downloadTemplateName: any;
    private modalRef: NgbModalRef;
    @ViewChild('content') link: TemplateRef<any>;

    constructor(public auth: AuthService, public common: CommonService , public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer, private modalService: NgbModal,
                public route: Router, public creator: CreatorService, public navServices: NavService, public toastr: ToastrService, public newSubject: NewsubjectService) {
        this.getData = JSON.parse(this.auth.getSessionData('rista-classDetails'));
        this.functionCalled = false;
        this.studentsAnswerList();
        this.delAnnotation = false;
        this.webhost = this.confi.getimgUrl();
    }

    ngOnInit(): void {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }
    OnDestroy(): void {
        this.auth.removeSessionData('rista-classDetails');
    }
    getAreaInfo(event) {
        this.areaInfo = event;
        this.saveAnnotationDetails();
    }
    getDeleteAction(event) {
        this.delAnnotation = event;
    }
    backAction(){
            let classid: any;
            classid = this.auth.getSessionData('class-id');
            this.auth.setSessionData('class-id', classid);
            this.saveAnnotationDetails();
            this.route.navigate(['/studentlogin/class-detail']);
    }
    studentsAnswerList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            content_id: this.getData.content_id,
            content_format: this.getData.content_format,
            class_id: this.auth.getSessionData('class-id'),
            student_id: this.auth.getSessionData('rista-userid'),
            student_content_id : this.getData?.student_content_id ? this.getData?.student_content_id : ''
        };
        this.student.questionList(data).subscribe( (successData) => {
                this.questionListSuccess(successData);
            },
            (error) => {
                this.questionListFailure(error);
            });
    }

    questionListSuccess(successData) {
        if (successData.IsSuccess) {

            //// sidenav closes///
            // this.openmenu = true;
            // this.creator.changeViewList(this.openmenu);
            // this.navServices.collapseSidebar = true;
            //// sidenav closes///

            this.questionData = successData.ResponseObject;
            this.linkdata = this.questionData?.links;
            this.totalAns = [];
            this.areaInfo = [...this.questionData.annotation];
            this.pdfPath = this.common.convertBase64(this.questionData.file_path);
            if(this.pdfPath[0]?.original_image_url != undefined) {
                this.pdfTemplate = this.webhost + '/' + this.pdfPath[0]?.original_image_url;
                this.isPdfAvailable = true;
            } else {
                this.isPdfAvailable = false;
            }
            this.downloadTemplateName = this.questionData.name + '.pdf';
            this.showcontent = this.questionData?.file_text;
            this.getStudentDetails();
        }
    }

    questionListFailure(error) {
        console.log(error, 'error');
    }

    onSave(){
        this.modalRef.close();
    }
    getStudentDetails() {
        var decodedStringBtoA = this.auth.getAccessToken() + '|' + this.auth.getSessionData('rista-userid') + '|' + this.getData.content_id  + '|' + this.auth.getSessionData('class-id');
        var encodedStringBtoA = btoa(decodedStringBtoA);
        var encodedStringBtoA1 = btoa(encodedStringBtoA);
        const data = {
            platform: 'web',
            authorization_key: encodedStringBtoA1,
            student_content_id: this.getData.student_content_id ? this.getData.student_content_id : ''
        };
        this.creator.getStudDetail(data).subscribe( (successData) => {
                this.getStudDetailSuccess(successData);
            },
            (error) => {
                this.getStudDetailFailure(error);
            });
    }
    getStudDetailSuccess(successData) {
        if (successData.IsSuccess) {
            this.detailData = successData.ResponseObject;
            this.areaInfo = [...this.detailData.annotation];
            this.functionCalled = true;
        }
    }
    getStudDetailFailure(error) {
        console.log(error, 'error');
    }
    saveAnnotationDetails() {
        let annotationValues = this.areaInfo;
        annotationValues = annotationValues.filter(f => f.isDelete === false);
        const data = {
            platform: 'web',
            student_id: this.auth.getSessionData('rista-userid'),
            annotation: annotationValues,
            content_id: this.getData.content_id,
            student_content_id: this.detailData.student_content_id,
            class_id: this.auth.getSessionData('class-id')
        };
        this.creator.saveAnnotation(data).subscribe( (successData) => {
                this.saveAnnotationSuccess(successData);
            },
            (error) => {
                this.saveAnnotationFailure(error);
        });
    }
    saveAnnotationSuccess(successData) {
        if (successData.IsSuccess) {

        }
    }
    saveAnnotationFailure(error) {
        console.log(error, 'error');
    }
    otherlink(){
        this.modalRef = this.modalService.open(this.link);
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
    isTeacherCorrection?: boolean;
    shape: string;
    color: any;
    fontSize: any;
}
