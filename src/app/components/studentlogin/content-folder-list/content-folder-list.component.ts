import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StudentService} from '../../../shared/service/student.service';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import { ColumnMode, SelectionType} from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-content-folder-list',
  templateUrl: './content-folder-list.component.html',
  styleUrls: ['./content-folder-list.component.scss']
})
export class ContentFolderListComponent implements OnInit {
  public folderList = [];
  public folderListAlt = [];
  public selectedFolder = [];
  public classList = [];
  public assignedContentDetails: any;
  public repositoryDetails: any;
  public remarks: any = '';
  public searchFolder: any = '';
  public selectedClass: any = '';
  public deleteDetail: any = '';
  public folderDetails: any;
  selectionType = SelectionType;
  columnMode = ColumnMode;
  @ViewChild('viewContents') viewContents: TemplateRef<any>;
  @ViewChild('assignClass') assignClass: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
  public modalRef: NgbModalRef;
  public modalRefAlt: NgbModalRef;

  constructor(public student: StudentService, public modalService: NgbModal, public auth: AuthService,
              private router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.contentFolderList();
    this.studentClassList();
  }

  updateFilter() {
      this.folderList = this.folderListAlt.filter((val) => {
          return val.category_name.toLowerCase().indexOf(this.searchFolder.toLowerCase()) > -1;
      });
  }

  contentFolderList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid')
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
        successData.ResponseObject.forEach((items) => {
            items.selected = false;
        });
        this.folderList = successData.ResponseObject;
        this.folderListAlt = successData.ResponseObject;
        this.updateFilter();
    }
  }

  viewAssignedContent(detail) {
    this.auth.setSessionData('folder-detail', JSON.stringify(detail));
    this.router.navigate(['/studentlogin/content-details']);
  }

  editFolder(data) {
    this.auth.setSessionData('edit-student-folder', JSON.stringify(data));
    this.router.navigate(['/studentlogin/content-folder/edit']);
  }
    openDeleteTemplate(detail) {
        this.deleteDetail = detail;
        this.modalRef = this.modalService.open(this.deleteTemplate, {size: 'md'});
    }
    openAssignTemplate(detail, row) {
      console.log(detail, 'details');
      this.folderDetails = row;
      this.selectedClass = detail.class_id;
      this.modalRef = this.modalService.open(this.assignClass, {size: 'md'});
    }
    deleteContent() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            category_id: this.deleteDetail.category_id,
            status: '3'
        };
        this.student.editFolder(data).subscribe((successData) => {
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
            this.contentFolderList();
        }
    }
    selectClass(event) {
      this.selectedClass = event.class_id;
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
              class_id: this.selectedClass,
              category_id: this.folderDetails.category_id,
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
          this.folderList.forEach((items) => {
              items.selected = false;
          });
          this.remarks = '';
          this.selectedClass = '';
      } else {
          this.shareRepositoryFailure(successData);
      }
    }
    shareRepositoryFailure(error) {
        this.toastr.error(error.ErrorObject);
        this.modalRef.close();
        this.folderList.forEach((items) => {
            items.selected = false;
        });
    }
    closeModalRefAlt() {
        this.modalRefAlt.close();
        this.remarks = '';
        this.selectedClass = '';
    }
    statusChange(event, detail) {
        console.log(event, 'event value');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            category_name: detail.category_name,
            category_id: detail.category_id,
            status: event.target.checked ? '1' : '2'
        };
        this.student.editFolder(data).subscribe((successData) => {
                this.statusChangeSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_editFolder');
            });
    }
    statusChangeSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject);
            this.contentFolderList();
        }
    }
    shareToClass(detail) {
      this.folderList.forEach((items) => {
          items.selected = false;
      });
      detail.selected = true;
        // this.modalRef = this.modalService.open(this.assignClass, { size: 'md', backdrop: 'static' });
    }

}
