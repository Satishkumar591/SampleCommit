import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IAngularMyDpOptions, IMyDateModel} from "angular-mydatepicker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {ConfigurationService} from "../../../shared/service/configuration.service";
import {ValidationService} from "../../../shared/service/validation.service";
import {CommonService} from "../../../shared/service/common.service";
import {CommonDataService} from "../../../shared/service/common-data.service";
import {AuthService} from "../../../shared/service/auth.service";
import {TeacherService} from "../../../shared/service/teacher.service";
import {dateOptions} from "../../../shared/data/config";
import {timeZone} from "../../../shared/data/config";

@Component({
  selector: 'app-parent-registration',
  templateUrl: './parent-registration.component.html',
  styleUrls: ['./parent-registration.component.scss']
})
export class ParentRegistrationComponent implements OnInit {
  public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableUntil: {
      year: new Date(this.setDate).getFullYear(),
      month: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getMonth() + 1 : new Date(this.setDate).getMonth(),
      day: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getDate() - 1 : new Date(this.setDate).getMonth() === 1 || 3 || 5 || 7 || 8 || 10 || 12 ? 31 : 30,
    },
  };
  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableSince: {
      year: new Date(this.setDate).getFullYear(),
      month: new Date(this.setDate).getMonth() + 1,
      day: new Date(this.setDate).getDate() + 1
    },
  };
  public registerForm: FormGroup;
  public webhost: any;
  public type: any;
  public imagepath: any;
  public imagepaththumb: any;
  public editData: any;
  public countryListData: any;
  public stateListData: any;
  public recordBase64Url: any;
  public pageType: any;
  public viewer: any;
  public model: any;
  public showLoader: boolean;

  @ViewChild('myInput') myInputVariable: ElementRef<any>;

  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public teacher: TeacherService,
              private toastr: ToastrService, public common: CommonService, public commondata: CommonDataService, public auth: AuthService,
              public router: Router, private config: ConfigurationService, public validationService: ValidationService,
              public sanitizer: DomSanitizer, public datePipe: DatePipe) {
    this.pageType = 1;
    this.webhost = this.config.getimgUrl();
    // this.route.params.forEach((params) => {
    //   this.type = params.type;
    // });
    this.type = 'add';
    this.model = {isRange: false, singleDate: {jsDate: new Date(this.setDate)}};

    this.imagepath = [];
    this.imagepaththumb = [];
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email_id: ['', Validators.required],
      mobile: ['', Validators.required],
      institution: ['', Validators.required],
      doj: null,
      dob: null,
      gender: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '231',
      postalCode: ['', Validators.required],
      status: ['1', Validators.required],
      addStudent: '',
      updateStudent: '',
      addContent: '',
      updateContent: '',
      addSubject: '',
      updateSubject: '',
      addBooks: '',
      updateBooks: '',
      addContents: '',
      updateContents: '',
      addRoom: '',
      updateRoom: '',
      addClass: '',
      updateClass: '',
    });
    const dr1 = this.datePipe.transform(this.model.singleDate.jsDate, 'yyyy-MM-dd');
    const dropped = dr1.split('-');
    // tslint:disable-next-line:radix
    const droppedObject: IMyDateModel = {
      isRange: false,
      singleDate: {jsDate: new Date(parseInt(dropped[0]), parseInt(dropped[1]) - 1, parseInt(dropped[2]))},
      dateRange: null
    };
    this.registerForm.controls.doj.patchValue(droppedObject);
  }

  ngOnInit(): void {
    this.countryList();
    this.stateList('231');
  }
  onDateChanged(event: IMyDateModel): void {
  }
  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
  public datePattern(event: any) {
    this.validationService.dateValidation(event);
  }
  encodeImageFileAsURL(event: any){
    for (let i = 0; i < event.target.files.length; i++) {
      const getUrlEdu = '';
      const imgDetails = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const url = event.target.result;
        const getUrl = url.split(',');
        const pic = imgDetails.type.split('/');
        if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] ==  'jpg' ){
          this.onUploadKYCFinished(getUrl, imgDetails);
        } else{
          this.toastr.error('JPEG ,PNG & JPG are the required type');
        }
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  }
  onUploadKYCFinished(getUrlEdu, imageList){
    this.recordBase64Url =  getUrlEdu[1];
    const data = {
      platform: 'web',
      role_id: '4',
      user_id: '56',
      image_path: [{
        image: this.recordBase64Url,
        size: imageList.size,
        type: imageList.type,
        name: imageList.name
      }],
      uploadtype: 'teacher'
    };
    this.commondata.showLoader(true);
    this.common.fileUpload(data).subscribe(
        (successData) => {
          this.uploadSuccess(successData);
        },
        (error) => {
          this.uploadFailure(error);
        }
    );
  }
  uploadSuccess(successData) {
    this.commondata.showLoader(false);
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject.message);
      this.imagepath = [];
      this.imagepaththumb = [];
      this.imagepath.push(successData.ResponseObject.imagepath[0].original_image_url);
      this.imagepaththumb.push(successData.ResponseObject.imagepath[0].resized_url);
    } else {
      this.toastr.error('Invalid File Format');
    }
  }
  uploadFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
  deleteImg(){
    this.imagepath = [];
    this.reset();
  }
  reset(){
    this.myInputVariable.nativeElement.value = '';
  }
  pageNav(id) {
    this.pageType = 2;
    this.viewer = id;
    this.registerFormReset();
  }
  countryList() {
    const data = {
      platform: 'web'
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListSuccess(successData);
        },
        (error) => {
          this.countryListFailure(error);
        });
  }
  countryListSuccess(successData) {
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;
      if ( this.type == 'edit') {
        this.stateList(this.editData.country);
      }
    }
  }
  countryListFailure(error) {
    console.log(error, 'error');
  }
  stateList(id) {
    this.registerForm.controls.state.patchValue(null);
    const data = {
      platform: 'web',
      country_id: id,
    };
    this.common.getStateList(data).subscribe( (successData) => {
          this.stateListSuccess(successData);
        },
        (error) => {
          this.stateListFailure(error);
        });
  }
  stateListSuccess(successData) {
    if (successData.IsSuccess) {
      this.stateListData = successData.ResponseObject;
      if ( this.type == 'edit') {
        this.stateListData.forEach((value) => {
          if (value.state_id == this.editData.state) {
            this.registerForm.controls.state.patchValue(value.state_id);
          }
        });
      }
    }
  }
  stateListFailure(error) {
    console.log(error, 'error');
  }
  add() {
    this.showLoader = true;
    if (this.registerForm.valid) {
      let data = {
        platform: 'web',
        // role_id: '4',
        // user_id: '56',
        first_name: this.registerForm.controls.firstName.value,
        last_name: this.registerForm.controls.lastName.value,
        email_id: this.registerForm.controls.email_id.value,
        mobile: this.registerForm.controls.mobile.value,
        institution: this.registerForm.controls.institution.value == null ? this.registerForm.controls.firstName.value : this.registerForm.controls.institution.value,
        doj: this.registerForm.controls.doj.value == null ? '' : this.datePipe.transform(this.registerForm.controls.doj.value.singleDate.jsDate, 'yyyy-MM-dd'),
        birthday: this.registerForm.controls.dob.value == null ? '' : this.datePipe.transform(this.registerForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
        gender: this.registerForm.controls.gender.value,
        address1: this.registerForm.controls.address1.value == null ? '' : this.registerForm.controls.address1.value,
        address2: this.registerForm.controls.address2.value == null ? '' : this.registerForm.controls.address2.value,
        city: this.registerForm.controls.city.value == null ? '' : this.registerForm.controls.city.value,
        state: this.registerForm.controls.state.value ? this.registerForm.controls.state.value : '',
        country: this.registerForm.controls.country.value,
        postal_code: this.registerForm.controls.postalCode.value == null ? '' : this.registerForm.controls.postalCode.value,
        status: this.registerForm.controls.status.value,
        profile_url: this.imagepath.toString(),
        profile_thumb_url: this.imagepaththumb.toString(),
        individual_role: this.viewer == 'Parent' ? 1 : 0,
        permission: [{
          group_id: 1,
          group_name: 'Students',
          permission: [{
            id: 1,
            status: 1
          }, {
            id: 2,
            status: 1
          }, {
            id: 3,
            status: 1
          }]
        }, {
          group_id: 2,
          group_name: 'Content Creator',
          permission: [{
            id: 5,
            status: 1
          }, {
            id: 6,
            status: 1
          }, {
            id: 7,
            status: 1
          }]
        }, {
          group_id: 3,
          group_name: 'Subjects',
          permission: [{
            id: 9,
            status: 1
          }, {
            id: 10,
            status: 1
          }, {
            id: 11,
            status: 1
          }]
        }, {
          group_id: 4,
          group_name: 'Books',
          permission: [{
            id: 13,
            status: 1
          }, {
            id: 14,
            status: 1
          } , {
            id: 15,
            status: 1
          }]
        }, {
          group_id: 5,
          group_name: 'Content',
          permission: [{
            id: 17,
            status: 1
          }, {
            id: 18,
            status: 1
          }, {
            id: 19,
            status: 1
          }]
        }, {
          group_id: 6,
          group_name: 'Content Folder',
          permission: [{
            id: 21,
            status: 1
          }, {
            id: 23,
            status: 1
          }, {
            id: 24,
            status: 1
          }]
        }, {
          group_id: 7,
          group_name: 'Classes',
          permission: [{
            id: 25,
            status: 1
          }, {
            id: 27,
            status: 1
          }, {
            id: 26,
            status: 1
          }]
        }
        ]
      };
      this.teacher.teacherParentAdd(data).subscribe((successData) => {
            this.addTeacherSuccess(successData);
          },
          (error) => {
            this.addTeacherFailure(error);
          });
      // else  if (value == 'edit') {
      //   data['selected_user_id'] = this.editData.user_id;
      //   data['institution_id'] = this.editData.institution_id;
      //   this.teacher.teacherEdit(data).subscribe((successData) => {
      //         this.addTeacherSuccess(successData);
      //       },
      //       (error) => {
      //         this.addTeacherFailure(error);
      //       });
      // }
    } else {
      this.showLoader = false;
      this.validationService.validateAllFormFields(this.registerForm);
      this.toastr.error('Please Fill All The Mandatory Fields');
    }
  }

  addTeacherSuccess(successData) {
    if (successData.IsSuccess) {
      this.showLoader = false;
      this.toastr.success(successData.ResponseObject, this.viewer);
      this.pageType = 3;
    } else {
      this.showLoader = false;
      this.toastr.error(successData.ErrorObject, this.viewer);
    }
  }
  addTeacherFailure(error) {
    this.showLoader = false;
    console.log(error, 'error');
    this.toastr.error(error.ResponseObject, this.viewer);
  }
  schoolAdd() {
    this.showLoader = true;
    if (this.registerForm.valid) {
      let data = {
        platform: 'web',
        first_name: this.registerForm.controls.firstName.value,
        last_name: this.registerForm.controls.lastName.value,
        email_id: this.registerForm.controls.email_id.value,
        mobile: this.registerForm.controls.mobile.value,
        institution_name: this.registerForm.controls.institution.value == null ? this.registerForm.controls.firstName.value : this.registerForm.controls.institution.value,
        country: this.registerForm.controls.country.value,
        postal_code: this.registerForm.controls.postalCode.value == null ? '' : this.registerForm.controls.postalCode.value,
      };
      this.teacher.schoolRegistrationAdd(data).subscribe((successData) => {
            this.addschoolSuccess(successData);
          },
          (error) => {
            this.addschoolFailure(error);
          });
    } else {
      this.showLoader = false;
      this.validationService.validateAllFormFields(this.registerForm);
      this.toastr.error('Please Fill All The Mandatory Fields');
    }
  }
  addschoolSuccess(successData){
    if (successData.IsSuccess) {
      this.showLoader = false;
      this.toastr.success(successData.ResponseObject, this.viewer);
      this.pageType = 4;
    } else {
      this.showLoader = false;
      this.toastr.error(successData.ErrorObject, this.viewer);
    }
  }
  addschoolFailure(error){}
  redirectPage(type){
    if (type == 'web'){
      this.router.navigate(['/auth/login']);
    } else {
      document.location.href = 'https://edquill.com';
    }
  }
  registerFormReset() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email_id: ['', Validators.required],
      mobile: ['', Validators.required],
      institution: ['', Validators.required],
      doj: null,
      dob: null,
      gender: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '231',
      postalCode: ['', Validators.required],
      status: ['1', Validators.required],
      addStudent: '',
      updateStudent: '',
      addContent: '',
      updateContent: '',
      addSubject: '',
      updateSubject: '',
      addBooks: '',
      updateBooks: '',
      addContents: '',
      updateContents: '',
      addRoom: '',
      updateRoom: '',
      addClass: '',
      updateClass: '',
    });
  }
}
