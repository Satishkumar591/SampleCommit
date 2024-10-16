import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { userListDB } from 'src/app/shared/tables/list-users';
import {SchoolService} from '../../../shared/service/School.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {Image} from '@ks89/angular-modal-gallery';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  public listData: any;
  public deleteUser: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public imgUrl: any;
  public webhost: any;
  public viewDetail: any;
  searchedKeyword: string;
  public recordBase64Url: any;
  @ViewChild('jxgbox') jxgbox: any;
  @ViewChild('content') modalContent: TemplateRef<any>;
  @ViewChild('viewdetails') viewDetailsContent: TemplateRef<any>;

  constructor(public brandservices: SchoolService, public config: NgbModalConfig, public confi: ConfigurationService, public sanitizer: DomSanitizer,
              private modalService: NgbModal, public auth: AuthService, public commondata: CommonDataService, public route: Router) {
    this.imgUrl = this.confi.getimgUrl();
    this.categoryList();
    config.backdrop = 'static';
    config.keyboard = false;
    this.webhost = this.confi.getimgUrl();


  }

  public settings = {
      hideSubHeader: false,
      actions: {
        custom: [
          {
            name: 'editAction',
            title: '<i class="fa  fa-pencil"></i>'
          },
          {
            name: 'deleteAction',
            title: '&nbsp;&nbsp;<i class="fa fa-trash" aria-hidden="true"></i>'
          }
        ],
        add: false,
        edit: false,
        delete: false,
        position: 'right',
      },


    columns: {
      name: {
        title: 'Institution Name',
      },
      address1: {
        title: 'Address1',
      },
      address2: {
        title: 'Address2',
      },
      email_id: {
        title: 'Email-id',
      },
      mobile: {
        title: 'Mobile'
      },
      status: {
        title: 'Status'
      }
    },
  };

  ngOnInit() {
    this.commondata.showLoader(false);

  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'editAction':
       this.auth.setSessionData('editBrand', JSON.stringify(event.data));
       this.route.navigate(['/School/create-School/edit']);
       break;

      case 'deleteAction':
        this.deleteUser = event.data;
        this.showModal();
    }
  }

  showModal() {
    this.modalRef = this.modalService.open(this.modalContent);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewDetails(item) {
    this.viewDetail = [];
    this.viewDetail = item;
    this.modalRef = this.modalService.open(this.viewDetailsContent);
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
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.onSave();
    }
  }
  deleteConfirmFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }


  categoryList() {
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.brandservices.getSchoolList(data).subscribe( (successData) => {
          this.categoryListSuccess(successData);
        },
        (error) => {
          this.categoryListFailure(error);
        });
  }
  categoryListSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.listData = successData.ResponseObject;
      this.listData.forEach((value, index, array) => {
        this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
            'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted': '' ;
      });
    }
  }
  categoryListFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
    // encodeImageFileAsURL(event: any){
    //     for (let i = 0; i < event.target.files.length; i++) {
    //         const getUrlEdu = '';
    //         const imgDetails = event.target.files[0];
    //         const reader = new FileReader();
    //         reader.onload = (event: any) => {
    //             const url = event.target.result;
    //             const getUrl = url.split(',');
    //             this.onUploadKYCFinished(getUrl, imgDetails);
    //         };
    //         reader.readAsDataURL(event.target.files[i]);
    //     }
    // }
    // onUploadKYCFinished(getUrlEdu, data){
    //     this.recordBase64Url =  getUrlEdu[1];
    //     const imgData = [{
    //         image: this.recordBase64Url,
    //         size: data.size,
    //         type: data.type,
    //         name: data.name
    //     }];
  editschool(rows){
    this.auth.setSessionData('editschool', JSON.stringify(rows));
    this.route.navigate(['/School/create-School/edit']);
  }
}

