import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {stringify} from 'querystring';
import {SchoolService} from '../../../shared/service/School.service';
import {SubjectServices} from '../../../shared/service/subject.services';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {
  public subjectform: FormGroup;
  public type: any;
  public editData: any;
  public recordBase64Url: any;
  public selectedSchool: any;
  public schoolData: any;
  public subject_id: any;
  public roleid: any;
  public schooldetails: any;
  public schoolid: any;
  public allowSelect: boolean;
  public allowAdd: boolean;
  public schoolName: any;
  public teacherType: any;
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder,
              public commondata: CommonDataService, private toastr: ToastrService, public subjectservice: SubjectServices,
              public auth: AuthService, public category: CategoryService, public brandservices: SchoolService, public common: CommonService,
              public router: Router, public validationService: ValidationService, public newSubject: NewsubjectService) {
    this.roleid = this.auth.getSessionData('rista-roleid');
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.newSubject.schoolChange.subscribe(params => {
      if (params != ''){
        if (this.router.url.includes('create-subject')) {
          this.init(params);
        }
      } else {
        this.init(this.auth.getSessionData('rista-school_id'));
      }
    });
    this.subjectform = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
      status: ['', Validators.required],
      schoolId: '',
    });


    if (this.type == 'edit'){
      this.allowSelect = true;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.editData = JSON.parse(this.auth.getSessionData('editsubject'));
      this.subject_id = this.editData.subject_id;
      this.subjectform.controls.name.patchValue(this.editData.subject_name);
      this.subjectform.controls.description.patchValue(this.editData.description);
      if (this.editData.status == 'Active'){
        this.subjectform.controls.status.patchValue(1);
      }else if (this.editData.status == 'Inactive'){
        this.subjectform.controls.status.patchValue(2);
      }
      if (this.editData.status == 'Suspended'){
        this.subjectform.controls.status.patchValue(3);
      }else if (this.editData.status == 'Deleted'){
        this.subjectform.controls.status.patchValue(4);
      }
      this.subjectform.controls.schoolId.patchValue(this.editData.school_name);

    } else{
      this.allowSelect = false;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.subjectform.controls.name.patchValue('');
      this.subjectform.controls.description.patchValue('');
      this.subjectform.controls.status.patchValue('1');
      if (this.roleid == '2'){
      this.subjectform.controls.schoolId.patchValue(this.auth.getSessionData('rista-school_name'));
      } else if (this.roleid == '4'){
        this.subjectform.controls.schoolId.patchValue(this.schooldetails.name);
      }
    }
  }

  ngOnInit() {
  }
  init(id){
    this.teacherType = this.auth.getSessionData('rista-teacher_type');
    this.schoolName = this.auth.getSessionData('rista-school_name');
    this.schooldetails = JSON.parse(this.auth.getSessionData('rista_data1'));
    if (this.roleid == '4' && this.teacherType == '0'){
      this.allowAdd = this.schooldetails.permissions[2].permission[0].status == 1;
    }else {
      this.allowAdd = true;
    }
    this.schoolid = id;
    this.schoolList();
  }

  backAction(){
    this.router.navigate(['/subject/list-subject']);
  }

  addsubject(value) {
    if (this.subjectform.valid) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        subject_name: this.subjectform.controls.name.value,
        description: this.subjectform.controls.description.value,
        status: this.subjectform.controls.status.value,
        school_id: this.schoolid,
        subject_id: this.subject_id ?  this.subject_id : '',
      };
      if (value == 'add'){
        this.subjectservice.subjectAdd(data).subscribe((successData) => {
              this.addSubjectSuccess(successData);
            },
            (error) => {
              this.addSubjectFailure(error);
            });
      }else if (value == 'edit'){
        this.subjectservice.subjectEdit(data).subscribe((successData) => {
              this.addSubjectSuccess(successData);
            },
            (error) => {
              this.addSubjectFailure(error);
            });
      }
    }
    else {
      this.validationService.validateAllFormFields(this.subjectform);
      this.toastr.error('Please Fill All The Mandatory Fields');
    }
  }
  addSubjectSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject, 'Subject');
      this.router.navigate(['/subject/list-subject']);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, 'Subject');
    }
  }
  addSubjectFailure(error) {
    console.log(error, 'error');
  }
  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
  schoolList() {
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.brandservices.getSchoolList(data).subscribe( (successData) => {
          this.schoolListSuccess(successData);
        },
        (error) => {
          this.schoolListFailure(error);
        });
  }
  schoolListSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.schoolData = successData.ResponseObject;
    }
  }
  schoolListFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
}
