import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {CorporateService} from '../../../shared/service/corporate.service';
import {ToastrService} from 'ngx-toastr';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {SchoolService} from '../../../shared/service/School.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {dateOptions} from "../../../shared/data/config";


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableUntil: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() - 1
    },
  };
  public listData: any;
  public noRecord = false;
  public message: any;
  public requestCode: any;
  public totalrecords: any;
  pageOffSet: any;
  recordsperpage: any;
  pageno: any;
  private modalRef: NgbModalRef;
  public corporatePage: any;
  public adminPage: any;
  public schoolName: any;
  public schoolId: any;
  public corporateStatuts: any;
  public corporateId: any;
  public schoolStatus: any;
  public selectApproved = false;
  public corporateSchoolControl: boolean;
  public codeform: FormGroup;


  @ViewChild('content') requestContent: TemplateRef<any>;
  @ViewChild('editSchool') editSchool: TemplateRef<any>;
  constructor(public auth: AuthService, private modalService: NgbModal, public route: Router, public commondata: CommonDataService, public corporate: CorporateService,
              private toastr: ToastrService, public datePipe: DatePipe, public brandservices: SchoolService, private formBuilder: FormBuilder,
              public newSubject: NewsubjectService) {
    this.codeform = this.formBuilder.group({
      date: ''
    });
    if (this.auth.getSessionData('rista-roleid') == '2'){
      this.adminPage = true;
    } else if (this.auth.getSessionData('rista-roleid') == '6'){
      this.corporatePage = true;
    }
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    if (this.schoolStatus.length != 0){
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.route.url.includes('request')) {
            this.init(params);
          }
        } else {
          this.init(this.auth.getSessionData('rista-school_id'));
        }
      });
    }else {

    }
  }
  ngOnInit() {
    this.corporateSchoolControl = true;
    this.brandservices.changeSideCorporateSchoolList(this.corporateSchoolControl);
  }
  ngOnDestroy(): void {
    this.corporateSchoolControl = false;
    this.brandservices.changeSideCorporateSchoolList(this.corporateSchoolControl);
  }

  init(id){
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.recordsperpage = 10;
    this.pageOffSet = 0;
    this.pageno = 1;
    this.corporateStatuts = '';
    this.requestList();
  }
  addRequest() {
    this.modalRef = this.modalService.open(this.requestContent);
  }
  editRequest(eve){
    this.modalRef = this.modalService.open(this.editSchool);
    this.schoolName = eve.school_name;
    this.schoolId = eve.school_id;
    this.corporateId = eve.corporate_id;
    this.corporateStatuts = eve.status;
    this.editStatus(this.corporateStatuts);
    if (eve.validity != '0000-00-00'){
      const ed = eve.validity.split('-');
      const edObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(ed[0]), parseInt(ed[1]) - 1, parseInt(ed[2]))}, dateRange: null};
      this.codeform.controls.date.patchValue(edObject);
    }else {
      this.codeform.controls.date.patchValue(null);
    }
  }
  close() {
    this.modalRef.close();
  }
  setPage(pageInfo) {
    console.log(pageInfo, 'inside');
    this.pageno = pageInfo.offset + 1;
    this.pageOffSet = pageInfo.offset;
  }
  onCustomAction(event) {
    switch ( event.action) {
      case 'editAction':
        this.auth.setSessionData('editgrade', JSON.stringify(event.data));
        this.route.navigate(['/grade/create-grade/edit']);
        break;

        // case 'deleteAction':
        //   this.deleteUser = event.data;
        //   this.showModal();
    }
  }
  selectStatus(eve){
    this.selectApproved = eve.target.value == '1';
  }
  editStatus(value){
    this.selectApproved = value == '1';
  }
  onDateChanged1(event: any): void {
  }
  requestList() {
    this.commondata.showLoader(true);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
    };
    if (this.auth.getSessionData('rista-roleid') == '2'){
      data['school_id'] = this.auth.getSessionData('rista-school_id');
      this.corporate.getRequestList(data).subscribe( (successData) => {
            this.requestListSuccess(successData);
          },
          (error) => {
            this.requestListFailure(error);
          });
    }
    else if (this.auth.getSessionData('rista-roleid') == '6'){
      data['corporate_id'] = this.auth.getSessionData('rista-corporate_id');
      this.corporate.getRequestList(data).subscribe( (successData) => {
            this.requestListSuccess(successData);
          },
          (error) => {
            this.requestListFailure(error);
          });
    }

  }
  requestListSuccess(successData) {
    if (successData.IsSuccess) {
      this.noRecord = true;
      this.listData = successData.ResponseObject.data;
      this.totalrecords = successData.ResponseObject.count;
    }else {
      this.noRecord = false;
      this.message = successData.ResponseObject;
    }
  }
  requestListFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
  addRequestCode() {
    this.commondata.showLoader(true);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      corporate_code: this.requestCode,
    };
    this.corporate.setRequestCode(data).subscribe( (successData) => {
      this.requestCodeSuccess(successData);
      },
        (error) => {
      this.requestCodeFailure(error);
    });
  }
  requestCodeSuccess(successData) {
    if (successData.IsSuccess) {
      this.close();
      this.toastr.success(successData.ResponseObject);
      this.noRecord = true;
      this.requestList();
    }
  }
  requestCodeFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
  editRequestDetail() {
    if (this.selectApproved){
      if (this.codeform.controls.date.value == null){
        this.toastr.error('Please Fill the mandatory field');
        return false;
      }
    }
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.schoolId,
      corporate_id: this.corporateId,
      status: this.corporateStatuts,
      validity: this.codeform.controls.date.value == null ? '' : this.datePipe.transform(this.codeform.controls.date.value.singleDate.jsDate, 'yyyy-MM-dd')
    };
    this.corporate.editRequestDetails(data).subscribe( (successData) => {
      this.editRequestSuccess(successData);
      },
        (error) => {
      this.editRequestFailure(error);
    });
  }
  editRequestSuccess(successData) {
    if (successData.IsSuccess) {
      this.close();
      this.toastr.success(successData.ResponseObject);
      this.noRecord = true;
      this.requestList();
    }
  }
  editRequestFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
}
