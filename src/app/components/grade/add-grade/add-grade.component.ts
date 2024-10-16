import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {GradeService} from '../../../shared/service/grade.service';
import {SchoolService} from '../../../shared/service/School.service';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-grade.component.html',
  styleUrls: ['./add-grade.component.scss']
})
export class AddGradeComponent implements OnInit {
  public gradeform: FormGroup;
  public type: any;
  public editData: any;
  public recordBase64Url: any;
  public selectedSchool: any;
  public schoolData: any;
  public grade_id: any;
  public schoolid: any;
  public allowSelect: boolean;
  public gradeCount: any;

  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder,
              public commondata: CommonDataService, private toastr: ToastrService, public newSubject: NewsubjectService,
              public auth: AuthService, public gradeService: GradeService, public brandservices: SchoolService,
              public router: Router, public validationService: ValidationService, public common: CommonService) {
    this.gradeCount = parseInt(this.auth.getSessionData('gradeCount'));
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.newSubject.schoolChange.subscribe(params => {
      if (params != ''){
        if (this.router.url.includes('create-grade')) {
          this.init(params);
        }
      } else {
        this.init(this.auth.getSessionData('rista-school_id'));

      }
    });
    this.gradeform = this.formBuilder.group({
      gradename: ['', Validators.required],
      description: '',
      sortNo: ['', Validators.required],
      status: ['', Validators.required],
      schoolId: '',
    });


    if ( this.type == 'edit'){
      this.gradeCount = parseInt(this.auth.getSessionData('gradeCount'));
      console.log(this.gradeCount, 'sort');
      this.allowSelect = true;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.editData = JSON.parse(this.auth.getSessionData('editgrade'));
      this.grade_id = this.editData.grade_id;
      this.gradeform.controls.gradename.patchValue(this.editData.grade_name);
      this.gradeform.controls.sortNo.patchValue(this.editData.sorting_no);
      console.log(this.gradeform.controls.sortNo.value, 'sort');
      this.gradeform.controls.description.patchValue(this.editData.description);
      if (this.editData.status == 'Active'){
        this.gradeform.controls.status.patchValue(1);
      }else if (this.editData.status == 'Inactive'){
        this.gradeform.controls.status.patchValue(2);
      }
      if (this.editData.status == 'Suspended'){
        this.gradeform.controls.status.patchValue(3);
      }else if (this.editData.status == 'Deleted'){
        this.gradeform.controls.status.patchValue(4);
      }
      this.gradeform.controls.schoolId.patchValue(this.editData.school_name);
    } else{
      let count = parseInt(this.auth.getSessionData('gradeCount'))
      this.gradeCount = count + 1;
      this.allowSelect = false;
      this.newSubject.allowSchoolChange(this.allowSelect);
      this.gradeform.controls.gradename.patchValue('');
      this.gradeform.controls.description.patchValue('');
      this.gradeform.controls.status.patchValue('1');
      this.gradeform.controls.sortNo.patchValue(this.gradeCount);
      this.gradeform.controls.schoolId.patchValue(this.auth.getSessionData('rista-school_name'));
      console.log(this.gradeform.controls.sortNo.value, 'sort');
    }
  }

  init(id){
   this.schoolid = id;
  }
  ngOnInit() {
  }
  addgrade(valve) {
    if(this.gradeCount >= this.gradeform.controls.sortNo.value) {
    if (this.gradeform.valid) {
      this.commondata.showLoader(false);
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        grade_name: this.gradeform.controls.gradename.value,
        description: this.gradeform.controls.description.value,
        sorting_no: this.gradeform.controls.sortNo.value.toString(),
        status: this.gradeform.controls.status.value,
        school_id: this.schoolid,
        grade_id: this.grade_id ?  this.grade_id : '',
      };
      if (valve == 'add'){
        this.gradeService.gradeAdd(data).subscribe((successData) => {
              this.addgradeSuccess(successData);
            },
            (error) => {
              this.addgradeFailure(error);
            });
      }
      else if (valve == 'edit'){
        this.gradeService.gradeEdit(data).subscribe((successData) => {
              this.addgradeSuccess(successData);
            },
            (error) => {
              this.addgradeFailure(error);
            });
      }
    } else {
      this.validationService.validateAllFormFields(this.gradeform);
      this.toastr.error('Please Fill All The Mandatory Fields');
    }
  } else {
    this.toastr.error('Sort Order is required, Enter ' + this.gradeCount + ' less then or equall value only accepted.')
  }
  }
  addgradeSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject, 'Grade');
      this.router.navigate(['/grade/list-grade']);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, 'Grade');
    }
  }
  addgradeFailure(error) {
    console.log(error, 'error');
  }
  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
}
