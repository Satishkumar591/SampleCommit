import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StudentService} from '../../../shared/service/student.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-assigned-content',
  templateUrl: './assigned-content.component.html',
  styleUrls: ['./assigned-content.component.scss']
})
export class AssignedContentComponent implements OnInit {
  public assignedContentDetails: any = [];
  public assignedContentDetailsAlt: any = [];
  public folderDetail: any;
  public shareContentDetail: any;
  public shareClassDetail: any;
  public previewDetail: any;
  public pdfTemplate: any;
  public webhost: any;
  public remarks: any = '';
  public searchContent: any = '';
  public classList = [];
  public modalRef: NgbModalRef;

  @ViewChild('preview') preview: TemplateRef<any>;
  @ViewChild('shareTemplate') shareTemplate: TemplateRef<any>;

  constructor(public student: StudentService, public modalService: NgbModal, public auth: AuthService, public env: EnvironmentService,
              private router: Router, public toastr: ToastrService, public config: ConfigurationService) {
    this.folderDetail = JSON.parse(this.auth.getSessionData('folder-detail'));
    this.webhost = this.config.getimgUrl();
    console.log(this.folderDetail, 'folderDeatil');
  }

  ngOnInit(): void {
    this.viewAssignedContent();
    this.studentClassList();
  }
  previewContent(detail) {
    this.previewDetail = detail;
    this.pdfTemplate = this.webhost + '/' + this.previewDetail.file_path[0]?.original_image_url;
    this.modalRef = this.modalService.open(this.preview, {size: 'xl'});
  }
  showClassDropdown(detail) {
    this.assignedContentDetails.forEach((items) => {
      items.isShowClass = false;
    });
    detail.isShowClass = true;
    this.shareContentDetail = detail;
  }
  openShareTemplate(event) {
    if (event == undefined) {
      this.shareClassDetail = this.shareContentDetail = '';
    } else {
      this.shareClassDetail = event;
      this.modalRef = this.modalService.open(this.shareTemplate, {size: 'md'});
    }
  }
  viewAssignedContent() {
    let category;
    if (this.folderDetail.index == undefined) {
      category = this.folderDetail.category_id;
    } else {
      category = this.folderDetail.category_id[this.folderDetail.index];
    }
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      category_id: category
    };
    this.student.folderContent(data).subscribe((successData) => {
          this.viewContentSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_folderContent');
        });
  }
  viewContentSuccess(successData) {
    if (successData.IsSuccess) {
      successData.ResponseObject.forEach((items) => {
        items.isShowClass = false;
      });
      this.assignedContentDetails = successData.ResponseObject;
      this.assignedContentDetailsAlt = JSON.parse(JSON.stringify(successData.ResponseObject));
    }
  }
  studentClassList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      type: '1'
    };
    this.student.classList(data).subscribe((successData) => {
          this.classListSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_classList');
        });
  }
  classListSuccess(successData) {
    if (successData.IsSuccess) {
      this.classList = successData.ResponseObject;
    }
  }
  assignToClass() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      repository_id: this.shareContentDetail.repository_id,
      class_id: this.shareClassDetail.class_id,
      remarks: this.remarks
    };
    this.student.shareRepository(data).subscribe((successData) => {
          this.shareRepositorySuccess(successData);
        },
        (error) => {
          console.error(error, 'error_classList');
          this.shareRepositoryFailure(error);
        });
  }
  shareRepositorySuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.modalRef.close();
      this.assignedContentDetails.forEach((items) => {
        items.isShowClass = false;
      });
    } else {
      this.shareRepositoryFailure(successData);
    }
  }
  shareRepositoryFailure(error) {
    this.toastr.error(error.ErrorObject);
    this.modalRef.close();
  }
  updateFilter() {
    this.assignedContentDetails = this.assignedContentDetailsAlt.filter((val) => {
      return val.name.toLowerCase().indexOf(this.searchContent.toLowerCase()) > -1;
    });
  }

  back() {
    this.auth.removeSessionData('folder-detail');
    if (this.folderDetail.name == undefined) {
      this.router.navigate(['studentlogin/content-folder']);
    } else {
      this.router.navigate(['studentlogin/repository']);
    }
  }
}
