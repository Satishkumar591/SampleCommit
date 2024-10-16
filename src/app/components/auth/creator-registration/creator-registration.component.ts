import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IAngularMyDpOptions, IMyDateModel} from "angular-mydatepicker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigurationService} from "../../../shared/service/configuration.service";
import {CommonDataService} from "../../../shared/service/common-data.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../../../shared/service/auth.service";
import {StudentService} from "../../../shared/service/student.service";
import {CommonService} from "../../../shared/service/common.service";
import {ValidationService} from "../../../shared/service/validation.service";
import {SchoolService} from "../../../shared/service/School.service";
import {DatePipe} from "@angular/common";
import {ClassroomService} from "../../../shared/service/classroom.service";
import {dateOptions} from "../../../shared/data/config";

@Component({
  selector: 'app-registration',
  templateUrl: './creator-registration.component.html',
  styleUrls: ['./creator-registration.component.scss']
})
export class CreatorRegistrationComponent implements OnInit {
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    // other options are here...
  };
  public registrationform: FormGroup;
  public type: any;
  public editData: any;
  public recordBase64Url: any;
  public stateListData: any;
  public token: any;
  public stateListData1: any;
  public countryListData: any;
  public schoolData: any;
  public gradeData: any;
  public maxDate: any;
  public imagepath: any;
  public imagepaththumb: any;
  public webhost: any;
  public schoolId: any;
  public schoolid: any;
  public responseDetail: any;
  public showBatch: any;
  public forgotList: boolean;

  @ViewChild('myInput') myInputVariable: ElementRef<any>;
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public config: ConfigurationService,
              public commondata: CommonDataService, private toastr: ToastrService,  public sanitizer: DomSanitizer,
              public auth: AuthService, public student: StudentService, public common: CommonService,
              public router: Router, public validationService: ValidationService, public brandservices: SchoolService,
              public datePipe: DatePipe, public classroom: ClassroomService) {
    this.webhost = this.config.getimgUrl();
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.registrationform = this.formBuilder.group({
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      schoolId: '',
      email_id: '',
      mobile: '',
      password: ['', Validators.required],
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    });
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.imagepath = [];
    this.imagepaththumb = [];
    this.getDetail();
  }

  onDateChanged(event: IMyDateModel): void {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.registrationform.controls.email_id.patchValue(this.responseDetail.email_id);
      this.registrationform.controls.schoolId.patchValue(this.responseDetail.school_name);
      this.countryList();
    }, 500);
  }

  stateList(event) {
    this.stateListData = '';
    const countryVal = event;
    console.log(this.registrationform.controls.country.value, 'jhkj');
    const data = {
      platform: 'web',
      country_id: countryVal,
      role_id: '3',
      user_id: this.responseDetail.user_id,
    };
    this.common.getStateList(data).subscribe( (successData) => {
          this.stateListSuccess(successData);
        },
        (error) => {
          this.stateListFailure(error);
        });
  }
  stateListSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.stateListData = successData.ResponseObject;

    }
  }
  stateListFailure(error) {
    console.log(error, 'error');
  }

  countryList() {

    const data = {
      platform: 'web',
      role_id: '3',
      user_id: this.responseDetail.user_id,
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListSuccess(successData);
        },
        (error) => {
          this.countryListFailure(error);
        });
  }
  countryListSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;

    }
  }
  countryListFailure(error) {
    console.log(error, 'error');
  }
  getDetail() {
    const data = {
      platform: 'web',
      role_id: '3',
      user_id: this.type
    };
    this.common.studentRegis(data).subscribe( (successData) => {
          this.detailSuccess(successData);
        },
        (error) => {
          this.detailFailure(error);
        });
  }
  detailSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      console.log(successData.ResponseObject);
      this.responseDetail = successData.ResponseObject[0];
    }
  }
  detailFailure(error) {
    console.log(error, 'error');
  }
  save() {
    if (this.registrationform.valid) {
      const data = {
        platform: 'web',
        role_id: '3',
        user_id: this.responseDetail.user_id,
        email_id: this.registrationform.controls.email_id.value,
        school_name: this.registrationform.controls.schoolId.value,
        school_id: this.responseDetail.school_id,
        password: this.registrationform.controls.password.value,
        first_name: this.registrationform.controls.first_name.value,
        last_name: this.registrationform.controls.last_name.value,
        profile_url: this.imagepath,
        profile_thumb_url: this.imagepaththumb,
        birthday: this.registrationform.controls.dob.value == '' ? '' : this.datePipe.transform(this.registrationform.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
        gender: this.registrationform.controls.gender.value,
        school_idno: this.responseDetail.school_idno,
        grade_id: this.responseDetail.grade_id,
        // address: [{
        //
        // }]
        address1: this.registrationform.controls.address1.value,
        address2: this.registrationform.controls.address2.value,
        state: this.registrationform.controls.state.value,
        city: this.registrationform.controls.city.value,
        country: this.registrationform.controls.country.value,
        postal_code: this.registrationform.controls.postalCode.value,
        mobile: this.registrationform.controls.mobile.value
      };
      this.common.saveRegistration(data).subscribe( (successData) => {
            this.saveSuccess(successData);
          },
          (error) => {
            this.saveFailure(error);
          });
    }
  }
  saveSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      console.log(successData.ResponseObject, 'csdv');
      this.toastr.success(successData.ResponseObject);

      let path = this.config.webHost + '/#/auth/login/content-creator';
      window.open(path, '_self');
    }
  }
  saveFailure(error) {
    this.toastr.error(error);
    console.log(error, 'error');
  }



  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
  public datePattern(event: any) {
    this.validationService.dateValidation(event);
  }
  encodeImageFileAsURL(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      const getUrlEdu = '';
      const imgDetails = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const url = event.target.result;
        const getUrl = url.split(',');
        console.log(getUrl, 'geturl');
        const pic = imgDetails.type.split('/');
        console.log(pic, 'Type');

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
      role_id: '3',
      user_id: this.responseDetail.user_id,
      image_path: [{
        image: this.recordBase64Url,
        size: imageList.size,
        type: imageList.type,
        name: imageList.name
      }],
      uploadtype: 'student'
    };
    this.common.fileUpload(data).subscribe(
        (successData) => {
          this.uploadSuccess(successData);
          console.log(successData, 'successData');
        },
        (error) => {
          this.uploadFailure(error);
          console.log(error, 'wrongFormat');
        }
    );
  }
  uploadSuccess(successData) {
    // this.settings.loadingSpinner = false;
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject.message);
      this.imagepath = [];
      this.imagepaththumb = [];
      this.imagepath.push(successData.ResponseObject.imagepath[0].original_image_url);
      this.imagepaththumb.push(successData.ResponseObject.imagepath[0].resized_url);
      // if (typing == 1) {
      // for (let i = 0; i < successData.ResponseObject.imagepath.length; i++) {
      //   this.imagepath.push(successData.ResponseObject.imagepath[i].original_image_url);
      //   this.imagepaththumb.push(successData.ResponseObject.imagepath[i].resized_url);
      //
      // }
    } else {
      this.toastr.error('Invalid File Format');
    }
  }
  uploadFailure(error) {
    // this.toastr.error('Invalid File Format');
    console.log(error, 'error');
  }
  deleteImg(){
    this.imagepath = [];
    this.clearUploadfilename();
  }
  clearUploadfilename(){
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    console.log(this.myInputVariable.nativeElement.files);
  }
}
