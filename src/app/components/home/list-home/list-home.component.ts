import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SchoolService} from '../../../shared/service/School.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TeacherService} from '../../../shared/service/teacher.service';
import {CommonService} from '../../../shared/service/common.service';
import {NavService} from '../../../shared/service/nav.service';
import {ToastrService} from 'ngx-toastr';
import {ClassService} from '../../../shared/service/class.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-list-home',
  templateUrl: './list-home.component.html',
  styleUrls: ['./list-home.component.scss']
})
export class ListHomeComponent implements OnInit {
  public listData: any;
  public deleteUser: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public imgUrl: any;
  public webhost: any;
  public viewDetail: any;
  public recordBase64Url: any;
  public classesDetails: any;
  public assessmentDetails: any;
  public assignmentsDetails: any;
  public response: any;
  public pdfpath: any;
  public pdfpaththumb: any;
  public classType: any;
  public classbutton: any;
  public assignType: any;
  public assignButton: any;
  public assessType: any;
  public assessButton: any;
  public classSortType: any;
  public assignSortType: any;
  public assessSortType: any;
  public sortButton: any;
  public assessSortButton: any;
  public assignSortButton: any;
  public openmenu: boolean;
  public schoolListDetails: any;
  public allowAdd: boolean;
  public allowEdit: boolean;
  public allowClass: boolean;
  public detailData: any;
  public previewType: any;
  public classClicked: any;
  public assignClicked: any;
  public assessClicked: any;
  public teacherType: any;
  public schoolID: any;
  public allowDropDown: boolean;
  public schoolStatus: any;
  @ViewChild('content') modalContent: TemplateRef<any>;
  @ViewChild('viewdetails') viewDetailsContent: TemplateRef<any>;
  @ViewChild('addAssetModal') addAsset: TemplateRef<any>;
  @ViewChild('assignment') addAssignment: TemplateRef<any>;

  constructor(public brandservices: SchoolService, public config: NgbModalConfig, public confi: ConfigurationService, public sanitizer: DomSanitizer,
              private modalService: NgbModal, public auth: AuthService, public common: CommonService, public commondata: CommonDataService,
              public teacher: TeacherService, public route: Router,  public navServices: NavService, public toastr: ToastrService,
              public creatorService: CreatorService, public classes: ClassService, public subject: NewsubjectService) {
      this.imgUrl = this.confi.getimgUrl();
      config.backdrop = 'static';
      config.keyboard = false;
      this.allowAdd = true;
      this.allowEdit = true;
      this.allowClass = true;
      this.webhost = this.confi.getimgUrl();
      this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
      this.auth.setSessionData('rista-resourceAccess', false);
      this.auth.setSessionData('rista-browseAll', false);
      this.auth.removeSessionData('rista-classData');
      this.auth.removeSessionData('updatedStudent');
      this.auth.removeSessionData('readonly_data');
      this.auth.removeSessionData('readonly_startdate');
      this.auth.removeSessionData('rista-backOption');
      this.teacherType = this.auth.getSessionData('rista-teacher_type');
      this.schoolID = this.auth.getSessionData('rista-school_id');
      this.subject.schoolChange.subscribe(params => {
          if (params != ''){
              if (this.route.url.includes('list-home')) {
                  this.init(params);
              }
          } else {
              this.init(this.auth.getSessionData('rista-school_id'));
          }
      });
  }

  ngOnInit() {
    this.commondata.showLoader(false);
    this.openmenu = false;
    this.schoolID = this.auth.getSessionData('rista-school_id');
    // this.creatorService.changeViewList(this.openmenu);
    // this.navServices.collapseSidebar = false;
    this.allowDropDown = false;
    this.subject.allowSchoolChange(this.allowDropDown);
  }

  searchUpdate(){
      this.classType = '2';
      this.classbutton = 'In Progress';
      this.assignType = '2';
      this.assignButton = 'In Progress';
      this.assessType = '2';
      this.assessButton = 'In Progress';
      this.classSortType = '1';
      this.assignSortType = '1';
      this.assessSortType = '1';
      this.classClicked = '0';
      this.assignClicked = '0';
      this.assessClicked = '0';
      this.sortButton = 'Earliest';
      this.assignSortButton = 'Earliest';
      this.assessSortButton = 'Earliest';
  }
  close() {
    this.modalRef.close();
  }
    init(id){
        this.schoolID = this.auth.getSessionData('rista-school_id');
        this.searchUpdate();
        if (this.auth.getRoleId() == '6' && this.auth.getSessionData('rista-school_name') == ''){

        }else {
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        }
        this.dashboardClassList();
        this.dashboardAssignmentList();
        this.dashboardAssessmentList();
        if ((this.auth.getRoleId() == '4') && this.auth.getSessionData('rista-teacher_type') == '0'){
            if (this.schoolListDetails.permissions[4].permission[0].status == 1) {
                this.allowAdd = true;
            } else if (this.schoolListDetails.permissions[4].permission[0].status == 0) {
                this.allowAdd = false;
            }
            if (this.schoolListDetails.permissions[4].permission[1].status == 1) {
                this.allowEdit = true;
            } else if (this.schoolListDetails.permissions[4].permission[1].status == 0) {
                this.allowEdit = false;
            }
            if (this.schoolListDetails.permissions[6].permission[0].status == 1){
                this.allowClass = true;
            }else if (this.schoolListDetails.permissions[6].permission[0].status == 0){
                this.allowClass = false;
            }
        }else {
            this.allowAdd = true;
            this.allowEdit = true;
            this.allowClass = true;
        }
    }
  showAddAsset(){
    this.modalRef = this.modalService.open(this.addAsset, { size: 'lg', backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
    classFilter(type){
      this.classClicked = '1';
      if (type == '0'){
          this.classType = '0';
          this.classbutton = 'All';
      }else if (type == '1'){
          this.classType = '1';
          this.classbutton = 'Upcoming';
      }else if (type == '2'){
          this.classType = '2';
          this.classbutton = 'In Progress';
      } else if (type == '3'){
          this.classType = '3';
          this.classbutton = 'Completed';
      }
      this.dashboardClassList();
    }
    classSort(type){
      if (type == '1'){
          this.classSortType = '1';
          this.sortButton = 'Earliest';
      }else if (type == '2'){
          this.classSortType = '2';
          this.sortButton = 'Name A-Z';
      }else if (type == '3'){
          this.classSortType = '3';
          this.sortButton = 'Name Z-A';
      }
      this.dashboardClassList();
    }
    assignmentFilter(type){
        this.assignClicked = '1';
        if (type == '0'){
            this.assignType = '0';
            this.assignButton = 'All ';
        }else if (type == '1'){
            this.assignType = '1';
            this.assignButton = 'Upcoming';
        }else if (type == '2'){
            this.assignType = '2';
            this.assignButton = 'In Progress';
        }else if (type == '3'){
            this.assignType = '3';
            this.assignButton = 'Completed';
        }
        this.dashboardAssignmentList();
    }
    assignmentSort(type){
        if (type == '1'){
            this.assignSortType = '1';
            this.assignSortButton = 'Earliest';
        }else if (type == '2'){
            this.assignSortType = '2';
            this.assignSortButton = 'Name A-Z';
        }else if (type == '3'){
            this.assignSortType = '3';
            this.assignSortButton = 'Name Z-A';
        }
        this.dashboardAssignmentList();
    }
    assessmentFilter(type){
        this.assessClicked = '1';
        if (type == '0'){
            this.assessType = '0';
            this.assessButton = 'All';
        }else if (type == '1'){
            this.assessType = '1';
            this.assessButton = 'Upcoming';
        }else if (type == '2'){
            this.assessType = '2';
            this.assessButton = 'In Progress';
        }else if (type == '3'){
            this.assessType = '3';
            this.assessButton = 'Completed';
        }
        this.dashboardAssessmentList();
    }
    assessmentSort(type){
        if (type == '1'){
            this.assessSortType = '1';
            this.assessSortButton = 'Earliest';
        }else if (type == '2'){
            this.assessSortType = '2';
            this.assessSortButton = 'Name A-Z';
        }else if (type == '3'){
            this.assessSortType = '3';
            this.assessSortButton = 'Name Z-A';
        }
        this.dashboardAssessmentList();
    }
    upload(){
            this.modalRef = this.modalService.open(this.addAssignment, { size: 'lg', backdrop: 'static' });
            this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

  showModal() {
    this.modalRef = this.modalService.open(this.modalContent);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  open(content) {
    this.modalService.open(content);
  }

  onSave() {
    this.modalRef.close();
  }
    openText(type){
        if (type == 'assignment'){
            this.auth.setSessionData('rista-textType', 'assignment');
            this.route.navigate(['content-text-resource/text-assignment/add']);
            this.close();
        }else if (type == 'assessment'){
            this.auth.setSessionData('rista-textType', 'assessment');
            this.route.navigate(['content-text-resource/text-assignment/add']);
            this.close();
        }
    }

  deleteConfirm(){
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      selected_user_id: this.deleteUser.user_id,
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.brandservices.getSchoolList(data).subscribe( (successData) => {
          this.deleteConfirmSuccess(successData);
        },
        (error) => {
          this.deleteConfirmFailure(error);
        });
  }

  deleteConfirmSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.onSave();
    }
  }
  deleteConfirmFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
    dashboardClassList() {
        let teacherid = '';
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6'){
            teacherid = '0';
        }else if (this.auth.getSessionData('rista-roleid') == '4') {
            teacherid = this.auth.getSessionData('rista-userid');
        }
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolID,
            teacher_id: teacherid,
            type: this.classType,
            sort: this.classSortType
        };
        this.teacher.classDashboardList(data).subscribe( (successData) => {
                this.dashboardClassListSuccess(successData);
            },
            (error) => {
                this.dashboardClassListFailure(error);
            });
    }
    dashboardClassListSuccess(successData) {
        if (successData.IsSuccess) {
            this.classesDetails = successData.ResponseObject;
            if (this.classClicked == '1'){
            }else {
                if (this.classType == '2' && this.classesDetails.length == 0){
                    this.classType = '1';
                    this.classbutton = 'Upcoming';
                    this.dashboardClassList();
                }else if (this.classType == '1' && this.classesDetails.length == 0){
                    this.classType = '0';
                    this.classbutton = 'All';
                    this.dashboardClassList();
                }
            }
        }
    }
    dashboardClassListFailure(error) {
        console.log(error, 'error');
    }
    dashboardAssignmentList() {
        let teacherid = '';
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6'){
            teacherid = '0';
        }else if (this.auth.getSessionData('rista-roleid') == '4') {
            teacherid = this.auth.getSessionData('rista-userid');
        }
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolID,
            teacher_id: teacherid,
            type: this.assignType,
            sort: this.assignSortType
        };
        this.teacher.assignmentDashboardList(data).subscribe( (successData) => {
                this.dashboardAssignmentSuccess(successData);
            },
            (error) => {
                this.dashboardAssignmentFailure(error);
            });
    }
    dashboardAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.assignmentsDetails = successData.ResponseObject;
            if (this.assignClicked == '1'){
            }else {
                if (this.assignType == '2' && this.assignmentsDetails.length == 0){
                    this.assignType = '1';
                    this.assignButton = 'Upcoming';
                    this.dashboardAssignmentList();
                }else if (this.assignType == '1' && this.assignmentsDetails.length == 0){
                    this.assignType = '0';
                    this.assignButton = 'All';
                    this.dashboardAssignmentList();
                }
            }
        }
    }
    dashboardAssignmentFailure(error) {
        console.log(error, 'error');
    }
    dashboardAssessmentList() {
        let teacherid = '';
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6'){
            teacherid = '0';
        }else if (this.auth.getSessionData('rista-roleid') == '4') {
            teacherid = this.auth.getSessionData('rista-userid');
        }
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolID,
            teacher_id: teacherid,
            type: this.assessType,
            sort: this.assessSortType
        };
        this.teacher.assessmentDashboardList(data).subscribe( (successData) => {
                this.dashboardAssessmentSuccess(successData);
            },
            (error) => {
                this.dashboardAssessmentFailure(error);
            });
    }
    dashboardAssessmentSuccess(successData) {
        this.assessmentDetails = successData.ResponseObject;
        if (successData.IsSuccess) {
            if (this.assessClicked == '1'){
            }else{
                if (this.assessType == '2' && this.assessmentDetails.length == 0){
                    this.assessType = '1';
                    this.assessButton = 'Upcoming';
                    this.dashboardAssessmentList();
                }else if (this.assessType == '1' && this.assessmentDetails.length == 0){
                    this.assessType = '0';
                    this.assessButton = 'All';
                    this.dashboardAssessmentList();
                }
            }
        }
    }
    dashboardAssessmentFailure(error) {
        console.log(error, 'error');
    }
    encodePdfFileAsURL(event: any, type) {
        let images = [];
        let imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const pdfDetails = event.target.files[i];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                let uploadTypeList = event.target.result.split(',');
                images.push({image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name});
                const pic = pdfDetails.type.split('/');
                if (pic[1] == 'pdf' ){
                    if (imageLength == images.length) {
                        this.onUploadKYCFinishedpdf(images, type);
                    }
                } else {
                    this.toastr.error('PDF are the required file format');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }

    }
    onUploadKYCFinishedpdf(getUrlEdu, type){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: 'content'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData, type);
            },
            (error) => {
                this.pdfuploadFailure(error);
            }
        );
    }
    pdfuploadSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.pdfpath = [];
            this.pdfpaththumb = [];
            this.response = successData.ResponseObject;
            for (let i = 0; i < this.response.imagepath.length; i++) {
                this.pdfpath.push(this.response.imagepath[i]);
                this.pdfpaththumb.push(this.response.imagepath[i].resized_url);
            }
            this.auth.setSessionData('pdf', JSON.stringify(this.pdfpath));
            this.auth.setSessionData('pdf_thumb', JSON.stringify(this.pdfpaththumb));
            if (type == 'assessment') {
            this.route.navigate(['repository/create-assessment/add']);
            this.auth.setSessionData('rista-upload-type', 'assessment');
            }
            else if (type == 'assignment') {
                this.route.navigate(['repository/create-assessment/add']);
                this.auth.setSessionData('rista-upload-type', 'assignment');
            }
            this.modalRef.close();
        } else {
            this.toastr.error('Invalid File Format');
        }
    }
    pdfuploadFailure(error) {
        console.log(error, 'error');
    }
    enterList(id) {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolID,
            class_id: this.classesDetails[id].class_id,
            grade: [this.classesDetails[id].grade]
        };
        this.classes.classDetails(data).subscribe( (successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                this.enterListFailure(error);
            });
    }
    enterListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('classView', true );
            this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
            this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('updatedStudent' , 1);
            if (this.detailData[0].classDate_status == '2' || this.detailData[0].classDate_status == '5'){
                if (this.allowClass == false){
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    this.auth.setSessionData('readonly_data', 'true');
                }else{
                    this.auth.removeSessionData('readonly_startdate');
                    this.auth.removeSessionData('readonly_data');
                }
                if (this.detailData[0].class_status != '1'){
                    this.route.navigate(['/class/create-class/edit']);
                }else {
                    this.route.navigate(['/class/create-class/addEdit']);
                    this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                    this.auth.setSessionData('updatedStudent', 1);
                }
            }
            else if (this.detailData[0].classDate_status == '4') {
                this.route.navigate(['/class/list-class']);
            }
            else if (this.detailData[0].classDate_status == '3'){
                if (this.detailData[0].class_status == '1'){
                    this.auth.removeSessionData('readonly_startdate');
                    this.auth.removeSessionData('readonly_data');
                }else {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    if (this.auth.getSessionData('rista-roleid') == '4' && this.teacherType == '0'){
                        this.auth.setSessionData('readonly_data', 'true');
                    }else {
                        this.auth.removeSessionData('readonly_data');
                    }
                }
                this.route.navigate(['/class/create-class/edit']);
            }
        }
    }
    enterListFailure(error) {
        console.log(error, 'error');
    }
    Preview(event, type){
      if (event.content_format == 1){
          this.previewType = 'pdf';
      }else if (event.content_format == 3){
          this.previewType = 'text';
      }
      this.auth.setSessionData('editresources', JSON.stringify(event));
      this.listDetails(event, type);
    }
    listDetails(event, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: event.school_id
        };
        this.auth.setSessionData('rista-editor', JSON.stringify(data));
        if (this.previewType == 'pdf') {
            this.auth.setSessionData('rista-preview', 'home');
            if (type == '1'){
                this.auth.setSessionData('preview_page', 'create_resources');
            }else if (type == '2'){
                this.auth.setSessionData('preview_page', 'create_assignments');
            }else if (type == '3'){
                this.auth.setSessionData('preview_page', 'create_assessments');
            }
            this.route.navigate(['repository/preview']);
        }
        else if (this.previewType == 'text') {
            this.auth.setSessionData('rista-preview', 'home');
            this.auth.setSessionData('rista-backOption', 'home');
            if (type == '1'){
                this.auth.setSessionData('preview_page', 'text_resources');
            }else if (type == '2'){
                this.auth.setSessionData('preview_page', 'text_assignments');
            }else if (type == '3'){
                this.auth.setSessionData('preview_page', 'text_assessments');
            }
            this.route.navigate(['repository/preview']);
            // this.route.navigate(['student-scratch/' + this.auth.getAccessToken() + '/' + this.auth.getUserId() + '/' + event.school_id + '/' + event.content_id + '/' + event.content_format + '/' + event.class_id + '/' + event.student_content_id + '/' + event.class_content_id + '/' + event.student_content_status]);
        }
    }
}

