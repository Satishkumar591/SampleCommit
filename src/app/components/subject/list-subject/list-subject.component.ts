import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryService} from '../../../shared/service/category.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {SubjectServices} from '../../../shared/service/subject.services';
import {SchoolService} from '../../../shared/service/School.service';
import {TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-subject.component.html',
  styleUrls: ['./list-subject.component.scss']
})
export class ListSubjectComponent implements OnInit {
  public listData: any;
  public deleteUser: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public imgUrl: any;
  public schoolData: any;
  public schoolDataList: any = 0;
  public roleid: any;
  public adminschool: any;
  public teacherschool: any;
  public schoolid: any;
  public schoolID: any;
  public allowAdd: boolean;
  public allowEdit: boolean;
  public allowSelect: boolean;
  public schoolStatus: any;
  @ViewChild('content') modalContent: TemplateRef<any>;

  constructor(public category: CategoryService, public config: NgbModalConfig, public confi: ConfigurationService, private modalService: NgbModal, public auth: AuthService,
              public commondata: CommonDataService, public route: Router, public subjectservice: SubjectServices, public schoolService: SchoolService,
              public firstcaps: TitleCasePipe, public toastr: ToastrService, public common: CommonService, public newSubject: NewsubjectService) {
    this.imgUrl = this.confi.getimgUrl();
    config.backdrop = 'static';
    config.keyboard = false;
    this.allowAdd = true;
    this.allowEdit = true;
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.adminschool = this.auth.getSessionData('rista-school_id');
    this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
    this.roleid = this.auth.getSessionData('rista-roleid');
    this.auth.setSessionData('rista-resourceAccess', false);
    this.auth.setSessionData('rista-browseAll', false);
    this.auth.removeSessionData('rista-classData');
    this.auth.removeSessionData('readonly_data');
    this.auth.removeSessionData('readonly_startdate');
    this.auth.removeSessionData('updatedStudent');
    this.auth.removeSessionData('editView');
    this.auth.setSessionData('rista-contentType', '');
    if (this.schoolStatus.length != 0){
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.route.url.includes('list-subject')) {
            this.init(params);
          }
        } else {
          this.init(this.auth.getSessionData('rista-school_id'));
        }
      });
    }else {
    }
    this.allowSelect = false;
    this.newSubject.allowSchoolChange(this.allowSelect);
  }

  public settings = {
    hideSubHeader: false,
    actions: {
      custom: [
        {
          name: 'editAction',
          title: '<i class="fa  fa-pencil" title="Edit Subject"></i>'
        },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },


    columns: {
      subject_name: {
        title: 'Subject Name',
      },
      description: {
        title: 'Description',
        type: 'html',
        valuePrepareFunction: (data) => {
          return `<a title="${data}"> <span>${data.length > 20 ? data.substring(0, 20 - 1).concat('…') : data}</a>`;
        }
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (data) => {
          return this.firstcaps.transform(data);
        }
      },
    },
  };

  ngOnInit() {
    this.auth.removeSessionData('rista-backOption');
  }

  init(res){
    this.schoolID = res;
      if (this.roleid == '4'){
        this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
        if (this.teacherschool.permissions[2].allowNav){
          if (this.teacherschool.permissions[2].permission[0].status == 1) {
            this.allowAdd = true;
          }else if (this.teacherschool.permissions[2].permission[0].status == 0) {
            this.allowAdd = false;
          }
          if (this.teacherschool.permissions[2].permission[1].status == 1) {
            this.allowEdit = true;
          }else if (this.teacherschool.permissions[2].permission[1].status == 0) {
            this.allowEdit = false;
          }
          this.subjectList();
        }else {
          this.route.navigate(['/home/list-home']);
        }
      }else {
          this.subjectList();
      }
  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'editAction':
        if (this.allowEdit == true){
        this.auth.setSessionData('editsubject', JSON.stringify(event.data));
        this.route.navigate(['/subject/create-subject/edit']);
        break;
        }else if (this.allowEdit == false){
          this.toastr.error('You don\'t have permission to update the subject details');
        }
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
  subjectList() {
    this.commondata.showLoader(true);
    const data = {
      platform: 'web',
      type: 'list',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.schoolID
    };
    this.subjectservice.getSubjectList(data).subscribe( (successData) => {
          this.subjectListSuccess(successData);
        },
        (error) => {
          this.subjectListFailure(error);
        });
  }
  subjectListSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.listData = successData.ResponseObject;
      this.listData.forEach((value, index, array) => {
        this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
            'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted': '' ;
      });
    }
  }
  subjectListFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }

}

