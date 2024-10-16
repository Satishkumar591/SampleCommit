import {Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BookService} from '../../../shared/service/book.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {ViewCell} from 'ng2-smart-table';
import {DomSanitizer} from '@angular/platform-browser';
import {CreatorService} from '../../../shared/service/creator.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-Books.component.html',
  styleUrls: ['./list-Books.component.scss'],
})
export class ListBooksComponent implements OnInit {
  public listData: any;
  public deleteUser: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public filetype: any;
  public url: any;
  public getUrl: any;
  public getUrl1: any;
  public schoolData: any;
  public schoolId: any;
  public webhost: any;
  public fileUploader: any;
  public schoolDataList: any = 0;
  public roleid: any;
  public adminschool: any;
  public teacherschool: any;
  public schoolid: any;
  public allowAdd: boolean;
  public allowEdit: boolean;
  public pdfTemplate: any;
  public allowDropDown: boolean;
  public schoolStatus: any;
  private viewComponet: ViewComponent;
  // private subscription: Subscription;

  @ViewChild('bulkModal') bulkContent: TemplateRef<any>;
  // @ViewChild('ViewComponent') child: ViewComponent;

  constructor(public bookService: BookService, public config: NgbModalConfig, public confi: ConfigurationService, private modalService: NgbModal,
              public auth: AuthService, public commondata: CommonDataService, public route: Router, public firstcaps: TitleCasePipe,
              public toastr: ToastrService, public common: CommonService, public schoolService: SchoolService, public newSubject: NewsubjectService) {
    this.webhost = this.confi.getimgUrl();
    this.allowAdd = true;
    this.allowEdit = true;
    config.backdrop = 'static';
    config.keyboard = false;
    this.roleid = this.auth.getSessionData('rista-roleid');
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.auth.setSessionData('rista-resourceAccess', false);
    this.auth.setSessionData('rista-browseAll', false);
    this.auth.removeSessionData('rista-classData');
    this.auth.removeSessionData('readonly_data');
    this.auth.removeSessionData('updatedStudent');
    this.auth.removeSessionData('readonly_startdate');
    this.auth.removeSessionData('rista-backOption');
    this.auth.setSessionData('rista-contentType', '');
    if (this.schoolStatus.length != 0){
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.route.url.includes('list-Books')) {
            this.init(params);
          }
        } else {
          this.init(this.auth.getSessionData('rista-school_id'));
        }
      });
    }else {

    }
  }

  public settings = {
    hideSubHeader: false,
    actions: {
      custom: [
        {
          name: 'editAction',
          title: '<i class="fa  fa-pencil" title="Edit Book"></i>'
        },
        // {
        //   name: 'viewAction',
        //   title: '<i class="fa  fa-eye" title="View Answer Key"></i>',
        //   type: 'custom',
        //   renderComponent: ViewComponent,
        //   onComponentInitFunction: (instance: any) =>  {
        //     instance.save.subscribe(row => {
        //     });
        //   }
        // },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },


    columns: {
      name: {
        title: 'Book Name',
        type: 'custom',
        renderComponent: ViewComponent,
        onComponentInitFunction: (instance: any) =>  {
          instance.save.subscribe(row => {
          });
        }
      },
      publication_code: {
        title: 'Publication Code',
      },
      description: {
        title: 'Description',
        type: 'html',
        valuePrepareFunction: (data) => {
          return `<a title="${data}"> <span>${data.length > 20 ? data.substring(0, 20 - 1).concat('…') : data}</a>`;
        }
      },
      access: {
        title: 'Access Type'
      },
      status: {
        title: 'Status'
      },
    },
  };

  ngOnInit() {
    this.allowDropDown = false;
    this.newSubject.allowSchoolChange(this.allowDropDown);
  }
  onCustomAction(event) {
    switch ( event.action) {
      case 'editAction':
        if (this.allowEdit == true){
          if (event.data.access == 'Public'){
            if (this.schoolid == event.data.school_id){
              this.auth.setSessionData('editBook', JSON.stringify(event.data));
              this.route.navigate(['/Books/create-Books/edit']);
            }else {
              this.toastr.error('You don\'t have permission to update book', 'Failed');
            }
          }else {
            this.auth.setSessionData('editBook', JSON.stringify(event.data));
            this.route.navigate(['/Books/create-Books/edit']);
          }
        }else if (this.allowEdit == false){
          this.toastr.error('You don\'t have permission to update book', 'Failed');
        }
        break;
      case 'viewAction':
        // this.viewComponet;
        break;
    }
  }
  showBulk() {
    this.filetype = '';
    this.schoolId = null;
    this.modalRef = this.modalService.open(this.bulkContent);
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
  init(id){
    this.schoolid = id;
    if (this.roleid == '4'){
      this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
      if (this.teacherschool.permissions[3].allowNav){
        if (this.teacherschool.permissions[3].permission[0].status == 1) {
          this.allowAdd = true;
        }else if (this.teacherschool.permissions[3].permission[0].status == 0) {
          this.allowAdd = false;
        }
        if (this.teacherschool.permissions[3].permission[1].status == 1) {
          this.allowEdit = true;
        }else if (this.teacherschool.permissions[3].permission[1].status == 0) {
          this.allowEdit = false;
        }
        this.bookList();
      }else {
        this.route.navigate(['/home/list-home']);
      }
    }else {
      this.bookList();
    }
  }
  onSave() {
    this.modalRef.close();
  }
  close() {
    this.modalRef.close();
    this.schoolId = null;
    this.fileUploader = '';
    this.filetype = '';
  }
  bookList() {
    const data = {
      platform: 'web',
      type: 'list',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.schoolid
    };
    if (this.auth.getRoleId() == '6'){
      data['coporate_id'] = this.auth.getSessionData('rista-corporate_id');
    }
    this.bookService.getBookList(data).subscribe( (successData) => {
          this.bookListSuccess(successData);
        },
        (error) => {
          this.bookListFailure(error);
        });
  }
  bookListSuccess(successData) {
    if (successData.IsSuccess) {
      this.listData = successData.ResponseObject;
      this.listData.forEach((value, index, array) => {
        this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
            'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '' ;
      });
      this.listData.forEach((value, index, array) => {
        this.listData[index].access = this.listData[index].access == 1 ? 'Private(within institution)' : this.listData[index].access == 2 ? 'Private (only you)' :
            this.listData[index].access == 3 ? 'Public' : this.listData[index].access = this.listData[index].access == 4 ? 'Private(within Corporate)' : '' ;
      });
    }
  }
  bookListFailure(error) {
    console.log(error, 'error');
  }

  readUrl(event: any) {
    const file = event.target.files[0];
    this.filetype = event.target.files[0].name.split('.');
    if (event.srcElement.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.srcElement.files[0].type == 'application/vnd.ms-excel') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.getUrl1 = [];
        this.url = event.target.result;
        this.getUrl = this.url.split(',');
        this.getUrl1.push(this.url.split(','));
        this.onUploadFinished1(this.getUrl, event);
      };
      reader.onerror = function(error) {
        console.log('Error: ', error);
      };
      this.toastr.success('Excel Upload Successfully' , 'Success!');
    } else {
      this.toastr.error('Only Excel Format Is Required', 'Failed');
      this.filetype = '';
    }
  }
  onUploadFinished1(event, fileEvent) {
    this.getUrl = event[1];
  }

  onUploadFinished() {
    if (this.schoolId != null ){
      this.commondata.showLoader(true);
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        file: this.getUrl,
        extension: this.filetype[1],
        upload_type: 'Excel',
        user_type: 'Book'
      };
      this.common.excelUpload(data).subscribe(
          (successData) => {
            this.excelUpoadSuccess(successData);
          },
          (error) => {
            this.excelUpoadFailure(error);
          }
      );
      this.commondata.showLoader(true);
    }else {
      this.toastr.error('Select the Institution Name', 'Student');
    }
  }

  excelUpoadSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.getUrl = '';
      this.bulkInsert(successData.ResponseObject.upload_id);
      this.close();
      this.bookList();
      this.toastr.success(successData.ResponseObject.Message , 'Success!');
    } else {
      this.toastr.error(successData.ErrorObject, 'Failed!');
      this.commondata.showLoader(false);
    }
  }

  excelUpoadFailure(error) {
    console.log(error);
  }

  bulkInsert(id) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      upload_id: id,
      school_id: this.schoolId
    };
    this.common.bulkInsert(data).subscribe(
        (successData) => {
          this.bulkInsertSuccess(successData);
        },
        (error) => {
          this.bulkInsertFailure(error);
        }
    );
  }
  bulkInsertSuccess(successData) {
    if (successData.IsSuccess) {
    }
  }
  bulkInsertFailure(error) {
    console.log(error);
  }
  downloadExcel() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      user_type: 'Book'

    };
    this.common.excelDownload(data).subscribe(
        (successData) => {
          this.excelDownloadSuccess(successData);
        },
        (error) => {
          this.excelDownloadFailure(error);
        }
    );
  }
  excelDownloadSuccess(successData) {
    if (successData.IsSuccess) {
      const url = this.webhost + '/' + successData.ResponseObject;
      window.open(url);
    }
  }
  excelDownloadFailure(error) {
    console.log(error);
  }

}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button-toggle',
  template: `
  
    <div class="form-group">
         <span class="text-capitalize font-weight-bold table-name" data-toggle="modal" data-target="#myModal" (click)="viewdetailsList()">{{rowData.name}}</span>
    </div>
    <ng-template #viewPdf let-c="close" let-d="dismiss">
      <div class="modal-body">
        <!-- Container-fluid starts-->
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12 modal-header">
              <h4 class="modal-title">{{pdfName}}</h4>
              <p class="text-right">
                <i class="fa fa-close fa-lg mt-1" aria-hidden="true" style="color:#7F3486; cursor: pointer; float: right;" (click)="close()"></i>
                <!--                        <i class="fa fa-close fa-2x" aria-hidden="true" style="cursor:pointer" (click)="close()"></i>-->
              </p>
            </div>
            <div class="col-md-12">
              <pdf-viewer  [src]="pdfTemplate" style="display: block;"></pdf-viewer>
            </div>
          </div>
        </div>
        <!-- Container-fluid Ends-->
      </div>
    </ng-template>
  `,
  styleUrls: ['./list-Books.component.scss']
})

export class ViewComponent implements ViewCell, OnInit {
  status: any;
  private modalRef: NgbModalRef;
  viewdetail: any;
  webhost: any;
  pdfName: any;
  pdfTemplate: any;
  renderValue: string;
  public bookBase64data: any;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @ViewChild('viewPdf') viewPdf: TemplateRef<any>;

  constructor(private modalService: NgbModal, public route: Router, public config: NgbModalConfig, public auth: AuthService ,
              public sanitizer: DomSanitizer, public confi: ConfigurationService , public commonservice: CommonService, public creatorService: CreatorService) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.webhost = this.confi.getimgUrl();
  }
  ngOnInit() {
  }
  viewdetailsList() {
    this.base64Books();
  }
  base64Books(){
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      content_id: this.rowData.content_id
    };
    this.creatorService.detaillist(data).subscribe( (successData) => {
          this.contentDetailsSuccess(successData);
        },
        (error) => {
          this.contentDetailsFailure(error);
        });
  }
  contentDetailsSuccess(successData) {
    if (successData.IsSuccess) {
      this.bookBase64data = successData.ResponseObject;
      this.pdfName = '';
      let pdfdata: any;
      pdfdata = this.commonservice.convertBase64(this.bookBase64data.file_path);
      this.pdfName = pdfdata[0]?.image;
      this.pdfTemplate = this.webhost + '/' + pdfdata[0]?.original_image_url;
      this.modalRef = this.modalService.open(this.viewPdf, {size: 'xl'});
    }
  }
  contentDetailsFailure(error) {
    console.log(error, 'error');
  }
  open(content) {
    this.modalService.open(content);
  }
  close() {
    this.modalRef.close();
  }
  cancel(){
    this.modalRef.close();
  }

}

