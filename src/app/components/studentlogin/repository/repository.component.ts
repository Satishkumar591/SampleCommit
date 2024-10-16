import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StudentService} from '../../../shared/service/student.service';
import {AuthService} from "../../../shared/service/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConfigurationService} from "../../../shared/service/configuration.service";
import { ColumnMode, SelectionType} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {
  public contentList = [];
  public contentListAlt = [];
  public selectedContent = [];
  public folderList = [];
  public classList = [];
  public searchRepositroy: any = '';
  public deleteDetail: any = '';
  public previewDetail: any = '';
  public folderName: any = '';
  public remarks: any = '';
  public selectedClass: any = '';
  public shareRepositoryDetail: any = '';
  public pdfTemplate: any;
  public webhost: any;
  public selectedFolder: any = '';
  public isShowFolderDropdown = false;
  public modalRef: NgbModalRef;
  selectionType = SelectionType;
  ColumnMode = ColumnMode;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
  @ViewChild('previewRepository') previewRepository: TemplateRef<any>;
  @ViewChild('assignClass') assignClass: TemplateRef<any>;
  @ViewChild('confirmMove') confirmMove: TemplateRef<any>;

  constructor(public student: StudentService, public auth: AuthService, public router: Router, public config: ConfigurationService,
              public modalService: NgbModal, public toastr: ToastrService) {
    this.webhost = this.config.getimgUrl();
  }

  ngOnInit(): void {
    this.repositoryList();
    this.contentFolderList();
    this.studentClassList();
  }
  updateFilter() {
    this.contentList = this.contentListAlt.filter((val) => {
      return val.name.toLowerCase().indexOf(this.searchRepositroy.toLowerCase()) > -1;
    });
  }
  onSelect(event) {
    console.log(event);
    this.selectedContent = [...event.selected];
  }

  repositoryList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
    };
    this.student.contentList(data).subscribe((successData) => {
          this.contentListSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_repositoryList');
        });
  }
  contentListSuccess(successData) {
    if (successData.IsSuccess) {
      successData.ResponseObject.forEach((val) => {
        val.selected = false;
        val.singleMove = false;
        val.isShowClassList = false;
      });
      this.contentList = successData.ResponseObject;
      this.contentListAlt = successData.ResponseObject;
      this.updateFilter();
    }
  }
  contentFolderList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      type: 'active'
    };
    this.student.folderList(data).subscribe((successData) => {
          this.folderListSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_repositoryList');
        });
  }
  folderListSuccess(successData) {
    if (successData.IsSuccess) {
      this.folderList = successData.ResponseObject;
    }
  }
  clearSelected() {
      this.selectedContent = [];
      this.contentList.forEach((items) => {
          items.singleMove = false;
          items.selected = false;
          items.isShowClassList = false;
      });
  }
  moveSingleFolder(detail) {
    this.clearSelected();
    this.selectedContent[0] = detail;
    detail.singleMove = true;
  }
  showClassList(detail) {
      this.clearSelected();
      this.selectedContent[0] = detail;
      this.shareRepositoryDetail = detail;
      detail.isShowClassList = true;
  }
  shareRepository(event) {
    if (event != undefined) {
      this.selectedClass = event.class_id;
      this.modalRef = this.modalService.open(this.assignClass, {size: 'md'});
    } else {
      this.selectedClass = '';
    }
    // this.moveToFolder();
  }
  previewContent(detail) {
    this.previewDetail = detail;
    this.pdfTemplate = this.webhost + '/' + this.previewDetail.file_path[0]?.original_image_url;
    this.modalRef = this.modalService.open(this.previewRepository, {size: 'xl'});
  }
  editContent(data) {
    this.auth.setSessionData('edit-student-content', JSON.stringify(data));
    this.router.navigate(['/studentlogin/repository/content/edit']);
  }
  openDeleteTemplate(detail) {
    this.deleteDetail = detail;
    this.modalRef = this.modalService.open(this.deleteTemplate, {size: 'md'});
  }
  viewAssignedContent(detail, index) {
    detail['index'] = index;
    this.auth.setSessionData('folder-detail', JSON.stringify(detail));
    this.router.navigate(['/studentlogin/content-details']);
  }
  selectFolder(event) {
    if (event != undefined) {
      this.folderName = event.category_name;
      this.selectedFolder = event.category_id;
      this.modalRef = this.modalService.open(this.confirmMove, {size: 'md'});
    } else {
      this.folderName = '';
      this.selectedFolder = '';
    }

  }
  deleteContent() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      repository_id: this.deleteDetail.repository_id,
      status: '3'
    };
    this.student.editContent(data).subscribe((successData) => {
          this.contentDeleteSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_repositoryList');
        });
  }
  contentDeleteSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.modalRef.close();
      this.repositoryList();
    }
  }
  clearSelectedContent() {
    this.selectedContent = [];
    this.isShowFolderDropdown = false;
  }
  showFolderDropdown() {
    this.isShowFolderDropdown = true;
  }
  moveToFolder() {
    if (this.selectedFolder != '') {
      const repositoryId = [];
      this.selectedContent.forEach((item) => {
        repositoryId.push(item.repository_id);
      });
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        student_id: this.auth.getSessionData('rista-userid'),
        category_id: this.selectedFolder,
        repository_id: repositoryId
      };
      console.log(data, 'data');
      this.student.moveRepository(data).subscribe((successData) => {
            this.moveFolderSuccess(successData);
          },
          (error) => {
            console.error(error, 'error_editFolder');
          });
    } else {
      this.toastr.error('Please Select Folder');
    }
  }
  moveFolderSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.selectedContent = [];
      this.selectedFolder = '';
      this.isShowFolderDropdown = false;
      this.modalRef.close();
      this.repositoryList();
    } else {
      this.toastr.error(successData.ErrorObject);
    }
  }
  statusChange(event, detail) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      repository_id: detail.repository_id,
      name: detail.name,
      description: detail.description,
      category_id: detail.category_id,
      status: event.target.checked ? '1' : '2',
      subject_name: detail.subject_name,
      grade_name: detail.grade_name,
      file_path: detail.file_path,
      link: detail.link,
      type: '1',
    };
    this.student.editContent(data).subscribe((successData) => {
          this.statusChangeSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_editFolder');
        });
  }
  statusChangeSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.repositoryList();
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
  assignToContent() {
    if (this.selectedClass != '') {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        student_id: this.auth.getSessionData('rista-userid'),
        repository_id: this.shareRepositoryDetail.repository_id,
        class_id: this.selectedClass,
        // category_id: this.folderDetails.category_id,
        remarks: this.remarks
      };
      this.student.shareRepository(data).subscribe((successData) => {
            this.shareRepositorySuccess(successData);
          },
          (error) => {
            console.error(error, 'error_classList');
            this.shareRepositoryFailure(error);
          });
    } else {
      this.toastr.error('Please Select Class');
    }
  }
  shareRepositorySuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.modalRef.close();
      this.remarks = '';
      this.selectedClass = '';
      this.contentList.forEach((items) => {
        items.isShowClassList = false;
      });
    } else {
      this.shareRepositoryFailure(successData);
    }
  }
  shareRepositoryFailure(error) {
    this.toastr.error(error.ErrorObject);
    this.modalRef.close();
    // this.contentList.forEach((items) => {
    //   items.isShowClassList = false;
    // });
  }

}
