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
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: FormGroup;
  public type: any;
  model: NgbDateStruct;

  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public commondata: CommonDataService, private toastr: ToastrService, public auth: AuthService, public category: CategoryService, public router: Router, public validation: ValidationService, public datePipe: DatePipe) {
    this.accountForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      role: ['', Validators.required],
      gender: '',
      location: ['', Validators.required],
      dob: ''
    });



  }


  ngOnInit() {
    this.commondata.showLoader(false);
  }





  addUser() {
    if(this.accountForm.valid) {
      this.commondata.showLoader(true);
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('go-roleid'),
        user_id: this.auth.getSessionData('go-userid'),
        first_name: this.accountForm.controls.fname.value,
        last_name: this.accountForm.controls.lname.value,
        email_id: this.accountForm.controls.email.value,
        mobile: this.accountForm.controls.mobile.value,
        user_type: this.accountForm.controls.role.value,
        location: this.accountForm.controls.location.value,
        birthday: this.accountForm.controls.dob.value == null ? '' : this.datePipe.transform(this.accountForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
        gender: this.accountForm.controls.gender.value
      };
      this.category.getAddUser(data).subscribe((successData) => {
            this.addUserSuccess(successData);
          },
          (error) => {
            this.addUserFailure(error);
          });
    } else {
      this.validation.validateAllFormFields(this.accountForm);
    }
  }
  addUserSuccess(successData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject, 'User');
      this.router.navigate(['/users/list-user']);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, 'User');
    }
  }
  addUserFailure(error) {
    console.log(error, 'error');
  }


}
