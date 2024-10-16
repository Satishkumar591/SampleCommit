import {Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { userListDB } from 'src/app/shared/tables/list-users';
import {BookService} from '../../../shared/service/book.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {IAngularMyDpOptions, IMyDateModel} from "angular-mydatepicker";
import {ValidationService} from '../../../shared/service/validation.service';
import {dateOptions} from "../../../shared/data/config";

@Component({
  selector: 'app-list-category',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss']
})
export class ListSettingsComponent implements OnInit {
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    firstDayOfWeek: 'su',
    dateFormat: 'mm-dd-yyyy',
  };
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
  public roleid: any;
  public schoolid: any;
  public pdfTemplate: any;
  public schoolStatus: any;
  public settingsform: FormGroup;
  public allowSelect: boolean;
  public dateFormatList = [];
  public timeZoneList = [];
  public userEmailList = [];

  @ViewChild('content') content: TemplateRef<any>;

  constructor(public bookService: BookService, public config: NgbModalConfig, public confi: ConfigurationService, private modalService: NgbModal, public datePipe: DatePipe,
              public auth: AuthService, public commondata: CommonDataService, public route: Router, public firstcaps: TitleCasePipe, public validationService: ValidationService,
              public toastr: ToastrService, public common: CommonService, public schoolService: SchoolService, public formBuilder: FormBuilder, public newSubject: NewsubjectService) {
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.getDateFormat();
    this.getTimeZone();
    if (this.schoolStatus.length != 0) {
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.route.url.includes('list-Settings')) {
            this.init(params);
          }
        } else {
          this.init(this.auth.getSessionData('rista-school_id'));
        }
      });
    } else {

    }
    this.webhost = this.confi.getimgUrl();
    config.backdrop = 'static';
    config.keyboard = false;
    this.roleid = this.auth.getSessionData('rista-roleid');
    this.auth.setSessionData('rista-resourceAccess', false);
    this.auth.setSessionData('rista-browseAll', false);
    this.auth.removeSessionData('rista-classData');
    this.auth.removeSessionData('readonly_data');
    this.auth.removeSessionData('updatedStudent');
    this.auth.removeSessionData('readonly_startdate');
    this.auth.removeSessionData('rista-backOption');
    this.auth.setSessionData('rista-contentType', '');
    this.settingsform = this.formBuilder.group({
      name: [''],
      description: [''],
      value: ['', Validators.required],
      id: ''
    });
  }

  public settings = {
    hideSubHeader: false,
    actions: {
      custom: [
        {
          name: 'editAction',
          title: '<i class="fa  fa-pencil" title="Edit Book"></i>',
          width: '10%'
        },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },


    columns: {
      name: {
        title: 'Name',
        type: 'html',
        width: '30%',
        valuePrepareFunction: (data) => {
          return `<a title="${data}"> <span>${data}</a>`;
        }
      },

      description: {
        title: 'Description',
        type: 'html',
        width: '30%',
        valuePrepareFunction: (data) => {
          return `<a title="${data}"> <span>${data}</a>`;
        }
      },
      value: {
        title: 'Value',
        width: '30%'
      },
    },
  };

  ngOnInit() {
    this.allowSelect = false;
    this.newSubject.allowSchoolChange(this.allowSelect);
  }

  init(id){
    this.schoolid = id;
    this.settingList();
  }
  onCustomAction(event) {
    console.log(event.data, 'eve arae');
    switch ( event.action) {
      case 'editAction':
        this.modalRef = this.modalService.open(this.content);
        this.settingsform.controls.name.patchValue(event.data.name);
        this.settingsform.controls.description.patchValue(event.data.description);
        if (event.data.name == 'file_size_restriction') {
          let split = event.data.value.split(' ');
          this.settingsform.controls.value.patchValue(parseInt(split[0]));
        }
        else if (event.data.name == 'date_format') {
          this.dateFormatList.forEach((item) => {
            if (item.date_format == event.data.value) {
              this.settingsform.controls.value.patchValue(item.date_id);
            }
          });
        }
        else if (event.data.name == 'timezone') {
          this.timeZoneList.forEach((item) => {
            if (item.time_zone == event.data.value) {
              console.log(item.id, 'item.id')
              this.settingsform.controls.value.patchValue(item.id);
            }
          });
        } else if (event.data.name == 'zoom_user_email') {
          this.settingsform.controls.value.patchValue('');
          // this.userEmailList = [...event.data.value];
          this.userEmailList = [];
          event.data.value.forEach((item) => {
            this.userEmailList.push({value: item});
          });
          console.log(this.userEmailList, 'this.userEmailList before');
        }  else if (event.data.name == 'student_zoom_view' || event.data.name == 'teacher_zoom_view') {
          let val = event.data.value == 'In-App' ? '0' : event.data.value == 'New Tab' ? '1' : '2';
          this.settingsform.controls.value.patchValue(val);
        } else if (event.data.name == 'upgrade_date') {
          if (event.data.value != '') {
            console.log(event.data.value, 'event.data.value');
            const split = event.data.value.split('-');
            const date = new Date(parseInt(split[2]), parseInt(split[0]) - 1, parseInt(split[1]));
            console.log(date, 'date');
            const dobObject: IMyDateModel = {isRange: false, singleDate: {jsDate: date, formatted: 'MM-dd-yyyy'}, dateRange: null};
            console.log(dobObject , 'dobObject');
            this.settingsform.controls.value.patchValue(dobObject);
          } else {
            this.settingsform.controls.value.patchValue('');
          }
        }
        else {
          this.settingsform.controls.value.patchValue(event.data.value);
        }
        this.settingsform.controls.id.patchValue(event.data.id);

        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        break;
    }
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

  onSave() {
    this.modalRef.close();
  }
  close() {
    this.modalRef.close();
    this.schoolId = null;
    this.fileUploader = '';
    this.filetype = '';
  }
  getDateFormat() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.dateFormat(data).subscribe( (successData) => {
          this.dateFormatSuccess(successData);
        },
        (error) => {
          this.listFailure(error);
        });
  }
  dateFormatSuccess(successData) {
    if (successData.IsSuccess) {
      this.dateFormatList = successData.ResponseObject;
    }
  }
  getTimeZone() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.timeZone(data).subscribe( (successData) => {
          this.timeZoneSuccess(successData);
        },
        (error) => {
          this.listFailure(error);
        });
  }
  timeZoneSuccess(successData) {
    if (successData.IsSuccess) {
      this.timeZoneList = successData.ResponseObject;
    }
  }
  settingList() {
    const data = {
      platform: 'web',
      type: 'list',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.schoolid
    };
    this.common.settingsDetails(data).subscribe( (successData) => {
          this.listSuccess(successData);
        },
        (error) => {
          this.listFailure(error);
        });
  }
  listSuccess(successData) {
    if (successData.IsSuccess) {
      this.listData = successData.ResponseObject;
      this.auth.setSessionData('settingList', JSON.stringify(this.listData));
      this.listData.forEach((item) => {
        if (item.name == 'file_size_restriction') {
          item.value = item.value.toString() + ' MB';
        } else if (item.name == 'answer_key_upload' || item.name == 'allow_autograde_settings' || item.name == 'allow_autoassign_student_for_class') {
          item.value = item.value == '1' ? 'Active' : 'Inactive';
        } else if (item.name == 'date_format') {
          this.dateFormatList.forEach((data) => {
            if (item.value == data.date_id) {
              item.value = data.date_format;
            }
          });
        } else if (item.name == 'timezone') {
          this.timeZoneList.forEach((data) => {
            if (item.value == data.id) {
              item.value = data.time_zone;
            }
          });
        } else if (item.name == 'zoom_user_email') {

        } else if (item.name == 'student_zoom_view' || item.name == 'teacher_zoom_view') {
          item.value = item.value == '0' ? 'In-App' : item.value == '1' ? 'New Tab' : 'Both In-App and New Tab';
        } else if (item.name == 'upgrade_date') {
          if (item.value != '') {
            item.value = this.datePipe.transform(item.value, 'MM-dd-yyyy');
          }
        }
      });
    }
  }
  listFailure(error) {
    console.log(error, 'error');
  }
  editsettings() {
    let emailCheck = true;
    let settingName = this.settingsform.controls.name.value;
    if (settingName == 'zoom_user_email') {
      this.userEmailList.forEach((item) => {
        if (item.value == '') {
          emailCheck = false;
        }
      });
    }
    if ((this.settingsform.controls.value.value != '' || settingName == 'zoom_user_email') && emailCheck) {
      let value = this.settingsform.controls.value.value;
      if (settingName == 'answer_key_upload' || settingName == 'allow_autoassign_student_for_class' || settingName == 'allow_autograde_settings') {
        value = value == 'Active' ? '1' : '0';
      } else if (settingName == 'zoom_user_email') {
        value = [];
        this.userEmailList.forEach((item) => {
          value.push(item.value);
        });
        // value = this.userEmailList;
      } else if (settingName == 'upgrade_date') {
        value = this.datePipe.transform(this.settingsform.controls.value.value.singleDate.formatted, 'yyyy-MM-dd');
      }
      const data = {
        platform: 'web',
        type: 'list',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        description: this.settingsform.controls.description.value,
        value,
        id: this.settingsform.controls.id.value,
      };
      this.common.editsettings(data).subscribe((successData) => {
            this.editSuccess(successData);
          },
          (error) => {
            this.editFailure(error);
          });
    } else {
      this.toastr.error('Kindly fill Required Fields');
    }
  }
  editSuccess(successData) {
    if (successData.IsSuccess) {
      if (this.settingsform.controls.name.value == 'date_format') {
        const index = this.dateFormatList.findIndex((item) =>
        { return item.date_id === this.settingsform.controls.value.value;
        });
        this.newSubject.changeDateFormat(this.dateFormatList[index].date_format);
      } else if (this.settingsform.controls.name.value == 'timezone') {
        this.timeZoneList.forEach((items) => {
          if (this.settingsform.controls.value.value == items.id) {
            let split = items.time_zone.split('(');
            this.newSubject.changeTimeZone(split[0]);
          }
        });
      }
      this.close();
      this.toastr.success(successData.ResponseObject);
      this.settingList();
    }
  }
  editFailure(error) {
    console.log(error, 'error');
  }
  patchEmailVal(event, index) {
    this.userEmailList[index].value = event.target.value;
  }
  deleteEmail(index) {
    this.userEmailList.splice(index, 1);
  }
  addEmail() {
    this.userEmailList.push({value: ''});
  }
  public datePattern(event: any) {
    this.validationService.dateValidation(event);
  }
  onDateChanged(event) {

  }
}