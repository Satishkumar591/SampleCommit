import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/service/auth.service";
import {CommonService} from "../../../shared/service/common.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../../../shared/service/student.service";

@Component({
  selector: 'app-content-folder-create',
  templateUrl: './content-folder-create.component.html',
  styleUrls: ['./content-folder-create.component.scss']
})
export class ContentFolderCreateComponent implements OnInit {
  public type: any;
  public editData: any = '';
  public folderForm: FormGroup;

  constructor(public route: ActivatedRoute, private router: Router, public auth: AuthService,
              public toastr: ToastrService, private formBuilder: FormBuilder, public student: StudentService) {
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.folderForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['1', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.type == 'edit') {
      this.editData = JSON.parse(this.auth.getSessionData('edit-student-folder'));
      this.folderForm.controls.name.patchValue(this.editData.category_name);
      this.folderForm.controls.status.patchValue(this.editData.status);
    }
  }
  addFolder(type) {
    if (this.folderForm.valid) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        student_id: this.auth.getSessionData('rista-userid'),
        category_name: this.folderForm.controls.name.value,
        status: this.folderForm.controls.status.value
      };
      if (this.type == 'add') {
        this.student.addFolder(data).subscribe((successData) => {
              this.folderSuccess(successData);
            },
            (error) => {
              console.error(error, 'error_addFolder');
            });
      } else {
        data['category_id'] = this.editData.category_id;
        this.student.editFolder(data).subscribe((successData) => {
              this.folderSuccess(successData);
            },
            (error) => {
              console.error(error, 'error_editFolder');
            });
      }
    } else {
      this.toastr.error('Please Enter Mandatory Field');
    }
  }
  folderSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.router.navigate(['studentlogin/content-folder']);
    } else {
      this.toastr.error(successData.ErrorObject);
    }
  }

}
