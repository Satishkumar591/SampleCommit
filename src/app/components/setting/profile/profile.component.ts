import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from '../../../shared/service/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationService} from '../../../shared/service/validation.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {SubjectServices} from '../../../shared/service/subject.services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {CommonService} from '../../../shared/service/common.service';
import {dateOptions} from "../../../shared/data/config";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
      disableSince: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate() + 1
      },
  };
  public firstname: any;
  public lastname: any;
  public mobile: any;
  public role: any;
  public email: any;
  public birthday: any;
  public address1: any;
  public address2: any;
  public city: any;
  public state: any;
  public country: any;
  public teacherid: any;
  public schooldetails: any;
  public schoolname: any;
  public designation: any;
  public editData: any;
  public contentschool: any;
  public status: any;
  public Active: any;
  public Inactive: any;
  public recordBase64Url: any;
  public profile: any;
  public  profile1: any;
  public imgUrl: any;
  public type: any;
  public gender: any;
  public location: any;
  public imageObject: any;
  public webhost: any;
  public image: any;
  public userList: any;
  public maxDate: any;
  public minDate: any;
  public editView: boolean;
  public listCheck: boolean;
  public accountForm: FormGroup;
  public countryListData: any;
  public stateListData: any;
  public stateId: any;
  public userVerification: any;
  public countryId: any;
  public stateName: any;
  public countryName: any;
  public normalTeacher: boolean;
  public corporateName: any;
  public rolId: any;
  @ViewChild('carousel')
  carousel: any;
  private authService: any;
  constructor(public commondata: CommonDataService, public subjectList: SubjectServices, public route: ActivatedRoute,
              private formBuilder: FormBuilder, public subject: SubjectServices, public config: ConfigurationService,
              private toastr: ToastrService, public auth: AuthService, public category: CategoryService, public router: Router,
              public validation: ValidationService, public subjectservice: SubjectServices, public datePipe: DatePipe, public common: CommonService) {
    this.imgUrl = this.config.getimgUrl();
    this.recordBase64Url = '';
    this.subjectList.profileList.subscribe((res: any) => {
      this.profile = res;
      this.rolId = this.auth.getRoleId();
      let profilepic = this.profile.split('/');
      if (profilepic[0] ==  'assets'){
        this.listCheck = true;
      } else if (profilepic[0] == 'uploads'){
        this.listCheck = false;
      }
    });
    this.contentschool = this.auth.getSessionData('rista-schooldetails');
    this.normalTeacher = this.auth.getSessionData('rista-roleid') == '4' && this.auth.getSessionData('rista-teacher_type') == '0' || this.auth.getSessionData('rista-roleid') == '2';
    this.firstname = this.auth.getSessionData('rista-firstname');
    this.lastname = this.auth.getSessionData('rista-lastname');
    this.role = this.auth.getSessionData('rista-user_role');
    this.mobile = this.auth.getSessionData('rista-mobile');
    this.email = this.auth.getSessionData('rista-email_id');
    this.gender = this.auth.getSessionData('rista-gender');
    this.profile = this.auth.getSessionData('rista-profile_url');
    if (this.auth.getSessionData('rista-birthday') != '0000-00-00' && this.auth.getSessionData('rista-birthday') != null && this.auth.getSessionData('rista-birthday') != ''){
      this.birthday = this.auth.getSessionData('rista-birthday');
    }else{
      this.birthday = null;
    }
    if (this.auth.getSessionData('rista-roleid') == '3') {
    this.userVerification = 'contentCreator';
    this.normalTeacher = true;
    this.address1 = this.auth.getSessionData('rista-address1') == 'null' ? '' : this.auth.getSessionData('rista-address1');
    this.address2 = this.auth.getSessionData('rista-address2') == 'null' ? '' : this.auth.getSessionData('rista-address2');
    this.city = this.auth.getSessionData('rista-city') == 'null' ? '' : this.auth.getSessionData('rista-city');
    this.state = this.auth.getSessionData('rista-statename');
    this.stateId = this.auth.getSessionData('rista-state');
    this.country = this.auth.getSessionData('rista-countryname');
    this.countryId = this.auth.getSessionData('rista-country');
    this.teacherid = this.auth.getSessionData('rista-teacher_id');
    this.schoolname = this.auth.getSessionData('rista-schooldetails');
    this.designation = this.auth.getSessionData('rista-designation');
    if (this.auth.getSessionData('rista-status') == '1'){
    this.status = 'Active';
    }else if (this.auth.getSessionData('rista-status') == '2'){
      this.status = 'Inactive';
    }
    }
    else if (this.auth.getSessionData('rista-roleid') == '4'){
      this.userVerification = 'teacher';
      this.address1 = this.auth.getSessionData('rista-address1') == 'null' ? '' : this.auth.getSessionData('rista-address1');
      this.address2 = this.auth.getSessionData('rista-address2') == 'null' ? '' : this.auth.getSessionData('rista-address2');
      this.city = this.auth.getSessionData('rista-city') == 'null' ? '' : this.auth.getSessionData('rista-city');
      this.state = this.auth.getSessionData('rista-statename');
      this.stateId = this.auth.getSessionData('rista-state');
      this.country = this.auth.getSessionData('rista-countryname');
      this.countryId = this.auth.getSessionData('rista-country');
      this.teacherid = this.auth.getSessionData('rista-teacher_id');
      this.schooldetails = JSON.parse(this.auth.getSessionData('rista_data1'));
      this.schoolname = this.schooldetails.name;
      if (this.auth.getSessionData('rista-teacher_type') == '0'){
        this.designation = this.schooldetails.designation;
      }
      if (this.auth.getSessionData('rista-status') == '1'){
        this.status = 'Active';
      }else if (this.auth.getSessionData('rista-status') == '2'){
        this.status = 'Inactive';
      }
    }else if (this.auth.getSessionData('rista-roleid') == '2'){
        this.userVerification = 'admin';
    }else if (this.auth.getSessionData('rista-roleid') == '5'){
      this.userVerification = 'student';
    } else if (this.auth.getSessionData('rista-roleid') == '6') {
      this.userVerification = 'corporates';
      this.corporateName = this.auth.getSessionData('rista-corporate_name');
    }
    let profilepic = this.profile.split('/');
    if (profilepic[0] ==  'assets'){
      this.listCheck = true;
    } else if (profilepic[0] == 'uploads'){
      this.listCheck = false;
    }
    this.updateUserProfile();
    this.editView = false;
    this.profile1 = [];
    this.accountForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      role: ['', Validators.required],
      gender: '',
      dob: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '231',
      teacherId: this.teacherid,
      designation: '',
      schoolId: '',
      status: '',
      corporate: ''
    });

    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.imageObject = [{thumbImage: 'assets/images/Avatar1.png', id: '0'},
      {thumbImage: 'assets/images/Avatar2.png', id: '1'},
      {thumbImage: 'assets/images/Avatar3.png', id: '2'},
      {thumbImage: 'assets/images/Avatar4.png', id: '3'},
      {thumbImage: 'assets/images/Avatar5.png', id: '4'},
      {thumbImage: 'assets/images/Avatar6.png', id: '5'},
      {thumbImage: 'assets/images/Avatar7.png', id: '6'},
      {thumbImage: 'assets/images/Avatar8.png', id: '7'},
      {thumbImage: 'assets/images/Avatar9.png', id: '8'},
    ];
    if (this.editView){
      let editData = JSON.parse(this.auth.getSessionData('editUser'));
      this.accountForm.controls.fname.patchValue(editData.first_name);
      this.accountForm.controls.lname.patchValue(editData.last_name);
      this.accountForm.controls.email.patchValue(editData.email_id);
      this.accountForm.controls.mobile.patchValue(editData.mobile);
      this.accountForm.controls.gender.patchValue(editData.gender);
      this.accountForm.controls.location.patchValue(editData.location);
      this.accountForm.controls.role.patchValue(this.role == 'User' ? 1 : 2);
      this.accountForm.controls.address1.patchValue(editData.address1);
      this.accountForm.controls.address2.patchValue(editData.address2);
      this.accountForm.controls.city.patchValue(editData.city);
      this.accountForm.controls.country.patchValue(editData.country);
      this.accountForm.controls.state.patchValue(editData.state);
      if (editData.birthday != '0000-00-00' && editData.birthday != null && editData.birthday != ''){
        let dob = editData.birthday.split('-');
        const dobObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(dob[0]), parseInt(dob[1]) - 1, parseInt(dob[2]))}, dateRange: null};
        this.accountForm.controls.dob.patchValue(dobObject);
      } else {
        this.accountForm.controls.dob.patchValue(null);
      }
    }
  }
  updateUserProfile(){
    //when the profile-url changes, update the user service

  }
  ngOnInit() {
    this.commondata.showLoader(false);
  }
  onDateChanged(event: IMyDateModel): void {
  }

  editPage(){
    this.editView = true;
    this.accountForm.controls.fname.patchValue(this.firstname == 'null' ? '' : this.firstname);
    this.accountForm.controls.lname.patchValue(this.lastname == 'null' ? '' : this.lastname);
    this.accountForm.controls.email.patchValue(this.email == 'null' ? '' : this.email);
    this.accountForm.controls.mobile.patchValue(this.mobile == 'null' ? '' : this.mobile);
    this.accountForm.controls.gender.patchValue(this.gender == 'null' ? '' : this.gender);
    this.accountForm.controls.role.patchValue(this.role == 'User' ? 1 : 2);
    this.accountForm.controls.corporate.patchValue(this.corporateName == 'null' ? '' : this.corporateName);
    this.accountForm.controls.address1.patchValue(this.address1 == 'null' ? '' : this.address1);
    this.accountForm.controls.address2.patchValue(this.address2 == 'null' ? '' : this.address2);
    this.accountForm.controls.city.patchValue(this.city == null ? '' : this.city == 'null' ? '' : this.city);
    this.accountForm.controls.country.patchValue(this.countryId == 'null' ? '231' : this.countryId);
    this.countryList(this.countryId);
    this.accountForm.controls.schoolId.patchValue(this.schoolname == 'null' ? '' : this.schoolname);
    this.accountForm.controls.teacherId.patchValue(this.teacherid == 'null' ? '' : this.teacherid);
    this.accountForm.controls.designation.patchValue(this.designation == 'null' ? '' : this.designation);
    if (this.birthday != '0000-00-00' && this.birthday != null && this.birthday != ''){
      const dob = this.birthday.split('-');
      const dobObject1: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(dob[0]), parseInt(dob[1]) - 1, parseInt(dob[2]))}, dateRange: null};
      this.accountForm.controls.dob.patchValue(dobObject1);
    } else {
      this.accountForm.controls.dob.patchValue(null);
    }
    if (this.auth.getRoleId() == '3' || this.auth.getRoleId() == '4') {
      if (this.auth.getSessionData('rista-status') == '1' ){
        this.accountForm.controls.status.patchValue('Active');
      } else if (this.auth.getSessionData('rista-status') == '2' ){
        this.accountForm.controls.status.patchValue('InActive');
      }
    }
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
  onUploadKYCFinished(getUrlEdu, data){
    this.recordBase64Url =  getUrlEdu[1];
    let imgData = [{
      image: this.recordBase64Url,
      size: data.size,
      type: data.type,
      name: data.name
    }];
    this.getUrlImage(imgData);
  }
  saveProfile(){
    if (this.accountForm.valid){
      const data = {
        platform: 'web',
        role_id: this.auth.getRoleId(),
        user_id: this.auth.getUserId(),
        uploadtype: 'profile',
        first_name: this.accountForm.controls.fname.value,
        last_name: this.accountForm.controls.lname.value,
        gender: this.accountForm.controls.gender.value,
        mobile: this.accountForm.controls.mobile.value,
        birthday: this.accountForm.controls.dob.value == null ? '' : this.datePipe.transform(this.accountForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
        designation: this.accountForm.controls.designation.value,
        address1: this.accountForm.controls.address1.value,
        address2: this.accountForm.controls.address2.value,
        city: this.accountForm.controls.city.value,
        state: this.accountForm.controls.state.value,
        country: this.accountForm.controls.country.value
      };
      this.category.editProfile(data).subscribe(
          (successData) => {
            this.getEditSuccess(successData, data);
          },
          (error) => {
            this.getEditFailure(error);
          }
      );
    }else{
      this.toastr.error('Please Fill all Mandatory Field');
    }
  }
  adminProfile(){
    const firstname = this.accountForm.controls.fname.value;
    const lastname = this.accountForm.controls.lname.value;
    const mobile = this.accountForm.controls.mobile.value;
    if (firstname != '' && lastname != '' && mobile != ''){
      const data = {
        platform: 'web',
        role_id: this.auth.getRoleId(),
        user_id: this.auth.getUserId(),
        uploadtype: 'profile',
        first_name: this.accountForm.controls.fname.value,
        last_name: this.accountForm.controls.lname.value,
        gender: this.accountForm.controls.gender.value,
        mobile: this.accountForm.controls.mobile.value,
        birthday: this.accountForm.controls.dob.value == null ? '' : this.datePipe.transform(this.accountForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
      };
      this.category.editProfile(data).subscribe(
          (successData) => {
            this.getEditSuccess(successData, data);
          },
          (error) => {
            this.getEditFailure(error);
          }
      );
    }else{
      this.toastr.error('Please Fill all Mandatory Field');
    }
  }

  getEditSuccess(successData, data){
    if (successData.IsSuccess) {
      this.editView = false;
      this.firstname = data.first_name;
      this.lastname = data.last_name;
      this.role = this.role == 'User' ? 1 : 2;
      this.mobile = data.mobile;
      if (data.birthday != '' && data.birthday != '0000-00-00' && data.birthday != null){
        this.birthday = data.birthday;
      }else{
        this.birthday = null;
      }
      this.gender = data.gender;
      this.address1 = data.address1;
      this.address2 = data.address2;
      this.designation = data.designation;
      this.city = data.city;
      this.stateId = data.state;
      this.countryId = data.country;
      this.stateListEdit(data.country);
      this.countryListEdit(data.country);
      this.auth.setSessionData('rista-mobile', data.mobile);
      this.auth.setSessionData('rista-birthday', this.birthday);
      this.auth.setSessionData('rista-gender', data.gender);
      this.auth.setSessionData('rista-firstname', data.first_name);
      this.auth.setSessionData('rista-lastname', data.last_name);
      this.auth.setSessionData('rista-designation', data.designation);
      this.auth.setSessionData('rista-address1', data.address1);
      this.auth.setSessionData('rista-address2', data.address2);
      this.auth.setSessionData('rista-city', data.city);
      this.auth.setSessionData('rista-state', data.state);
      this.auth.setSessionData('rista-country', data.country);
      this.toastr.success(successData.ResponseObject);
    }
  }
  getEditFailure(error){

  }
  getUrlImage(imgData) {
    const data = {
      platform: 'web',
      role_id: this.auth.getRoleId(),
      user_id: this.auth.getUserId(),
      image_path: imgData,
      uploadtype: 'profile'
    };
    this.category.getImgUrl(data).subscribe(
        (successData) => {
          this.getUrlImageSuccess(successData);
        },
        (error) => {
          this.getUrlImageFailure(error);
        }
    );
  }


  public  getUrlImageSuccess(successData) {
    if (successData.IsSuccess) {
      this.uploadImage(successData.ResponseObject.imagepath[0].original_image_url);
      this.auth.setSessionData('go-profile_url', successData.ResponseObject.imagepath[0].original_image_url);
      this.profile = successData.ResponseObject.imagepath[0].original_image_url;
      this.subject.changeProfile(successData.ResponseObject.imagepath[0].original_image_url);
    } else{
      this.toastr.error(successData.ErrorObject, '');
    }
  }
  public  getUrlImageFailure(error) {
    console.log(error);
  }

  getImage(image, value){
    this.profile = [];
    this.profile = value.thumbImage;
    this.listCheck = true;
    this.auth.setSessionData('avatarimg', this.profile);
    this.uploadImage(value.thumbImage);
  }
  uploadImage(imgData) {
    this.commondata.showLoader(true);
    const data = {
      platform: 'web',
      role_id: this.auth.getRoleId(),
      user_id: this.auth.getUserId(),
      uploadtype: 'profile',
      imagepath: [{
        original_image_url: imgData,
        resized_url: ''
      }]

    };
    this.category.updateImgUrl(data).subscribe(
        (successData) => {
          this.uploadImageSuccess(successData, imgData);
        },
        (error) => {
          this.uploadImageFailure(error);
        }
    );
  }


  public  uploadImageSuccess(successData, imgData) {
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject, '');
      this.subjectservice.changeProfile(this.profile);
      this.auth.setSessionData('rista-profile_url', imgData);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, '');
    }
  }
  public  uploadImageFailure(error) {
    console.log(error);
  }
  countryList(value) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListSuccess(successData, value);
        },
        (error) => {
          this.countryListFailure(error);
        });
  }
  countryListSuccess(successData, value) {
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;
    }
    if (this.editView == true ){
        this.stateList(value);
        this.accountForm.controls.state.patchValue(value.state_id);
    }
  }
  countryListFailure(error) {
    console.log(error, 'error');
  }
  countryListEdit(value) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListEditSuccess(successData, value);
        },
        (error) => {
          this.countryListFailure(error);
        });
  }
  countryListEditSuccess(successData, value) {
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;
      this.countryListData.forEach((id) => {
        if (id.country_id == value) {
          this.country = id.name;
          this.auth.setSessionData('rista-countryname', this.country);
        }
      });
    }
  }


  countryListEditFailure(error) {
    console.log(error, 'error');
  }
  stateList(id) {
    const data = {
      platform: 'web',
      country_id: id,
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getStateList(data).subscribe( (successData) => {
          this.stateListSuccess(successData, id);
        },
        (error) => {
          this.stateListFailure(error);
        });
  }
  stateListSuccess(successData, id) {
    if (successData.IsSuccess) {
      this.stateListData = successData.ResponseObject;
      this.accountForm.controls.state.patchValue(null);
      if (this.editView == true) {
        this.stateListData.forEach((value) => {
          if (value.state_id == this.stateId) {
            this.accountForm.controls.state.patchValue(value.state_id);
          }
        });
      }
    }
  }
  stateListFailure(error) {
    console.log(error, 'error');
  }

  stateListEdit(id) {
    const data = {
      platform: 'web',
      country_id: id,
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getStateList(data).subscribe( (successData) => {
          this.stateListEditSuccess(successData, id);
        },
        (error) => {
          this.stateListEditFailure(error);
        });
  }
  stateListEditSuccess(successData, id) {
    if (successData.IsSuccess) {
      this.stateListData = successData.ResponseObject;
      this.stateListData.forEach((value) => {
        if (this.stateId != null){
          if (value.state_id == this.stateId) {
            this.state = value.name;
          }
        }else {
          this.state = 'null';
        }
      });
    }
  }
  stateListEditFailure(error) {
    console.log(error, 'error');
  }

  public numberPattern(event: any) {
    this.validation.numberValidate1(event);
  }

}
