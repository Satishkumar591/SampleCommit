import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {SchoolService} from '../../../shared/service/School.service';
import {ClassroomService} from '../../../shared/service/classroom.service';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-classroom.component.html',
  styleUrls: ['./add-classroom.component.scss']
})
export class AddClassroomComponent implements OnInit {
  public classroomform: FormGroup;
  public roleid: any;
  public type: any;
  public editData: any;
  public recordBase64Url: any;
  public selectedSchool: any;
  public schoolData: any;
  public schoolid: any;
  public batch_id: any;
  public allowSelect: boolean;
  public teacherType: any;
  public schoolName: any;
  public schooldetails: any;
  public allowAdd: boolean;
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder,
              public commondata: CommonDataService, private toastr: ToastrService, public newSubject: NewsubjectService,
              public auth: AuthService, public classroom: ClassroomService, public brandservices: SchoolService,
              public router: Router, public validationService: ValidationService, public common: CommonService) {
    this.roleid = this.auth.getRoleId();
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.classroomform = this.formBuilder.group({
      batchname: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.newSubject.schoolChange.subscribe(params => {
      if (params != ''){
        if (this.router.url.includes('create-classroom')) {
          this.init(params);
        }
      } else {
        this.init(this.auth.getSessionData('rista-school_id'));
      }
    });
    if ( this.type == 'edit'){
      this.allowSelect = true;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.editData = JSON.parse(this.auth.getSessionData('editclassroom'));
      this.batch_id = this.editData.batch_id;
      this.classroomform.controls.batchname.patchValue(this.editData.batch_name);
      if (this.editData.status == 'Active'){
        this.classroomform.controls.status.patchValue(1);
      }else if (this.editData.status == 'Inactive'){
        this.classroomform.controls.status.patchValue(2);
      }
      if (this.editData.status == 'Suspended'){
        this.classroomform.controls.status.patchValue(3);
      }else if (this.editData.status == 'Deleted'){
        this.classroomform.controls.status.patchValue(4);
      }
    } else{
      this.allowSelect = false;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.classroomform.controls.batchname.patchValue('');
      this.classroomform.controls.status.patchValue('1');
    }
  }
  ngOnInit() {
  }

  init(id){
    this.teacherType = this.auth.getSessionData('rista-teacher_type');
    this.schoolName = this.auth.getSessionData('rista-school_name');
    this.schooldetails = JSON.parse(this.auth.getSessionData('rista_data1'));
    if (this.roleid == '4' && this.teacherType == '0'){
      this.allowAdd = this.schooldetails.permissions[3].permission[0].status == 1;
    }else {
      this.allowAdd = !(this.roleid == '4' && this.teacherType == '1');
    }
    this.schoolid = id;
  }

  backAction(){
    if (this.teacherType == '0'){
      this.router.navigate(['/classroom/list-classroom']);
    }else {
      this.router.navigate(['/home/list-home']);
    }
  }

  addClassRoom(valve) {
    if (this.classroomform.valid) {
      this.commondata.showLoader(false);
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        batch_name: this.classroomform.controls.batchname.value,
        status: this.classroomform.controls.status.value,
        school_id: this.schoolid,
        batch_id: this.batch_id ?  this.batch_id : '',
      };
      if (valve == 'add'){
        this.classroom.classRoomAdd(data).subscribe((successData) => {
              this.classRoomSuccess(successData);
            },
            (error) => {
              this.classRoomFailure(error);
            });
      }
      else if (valve == 'edit'){
        this.classroom.classRoomEdit(data).subscribe((successData) => {
              this.classRoomSuccess(successData);
            },
            (error) => {
              this.classRoomFailure(error);
            });
      }
    }else {
      this.validationService.validateAllFormFields(this.classroomform);
      this.toastr.error('Please Fill All The Mandatory Fields');
    }
  }
  classRoomSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      if (this.type == 'add'){
        this.toastr.success('Content Folder Added Successfully');
      }else {
        this.toastr.success('Content Folder Updated Successfully');
      }
      this.router.navigate(['/classroom/list-classroom']);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, 'Content Folder');
    }
  }
  classRoomFailure(error) {
    console.log(error, 'error');
  }
  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
}
