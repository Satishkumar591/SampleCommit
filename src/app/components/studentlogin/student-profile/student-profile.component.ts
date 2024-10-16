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
import {dateOptions, timeZone} from '../../../shared/data/config';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: dateOptions.pickerFormat,
      disableSince: {
          year: new Date(this.setDate).getFullYear(),
          month: new Date(this.setDate).getMonth() + 1,
          day: new Date(this.setDate).getDate() + 1
      },
  };
  public firstname: any;
  public lastname: any;
  public mobile: any;
  public role: any;
  public email: any;
  public birthday: any = '';
  public address1: any;
  public address2: any;
  public city: any;
  public state: any;
  public country: any;
  public teacherid: any;
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
  public editView: boolean;
  public listCheck: boolean;
  public accountForm: FormGroup;
  public countryListData: any;
  public stateListData: any;
  public userVerification: any;
  public rolId: any;
  public profiledetail: any;
  public p1name: any;
  public p2name: any;
  public p1address1: any;
  public p2address1: any;
  public p1address2: any;
  public p2address2: any;
  public p2city: any;
  public p1city: any;
  public p1state: any;
  public p2state: any;
  public p1statename: any;
  public p2statename: any;
  public p1country: any;
  public p2country: any;
  public p1countryname: any;
  public p2countryname: any;
  public p1postalCode: any;
  public p2postalCode: any;
  public stateListData1: any;
  @ViewChild('carousel')
  carousel: any;
  constructor(public commondata: CommonDataService, public subjectList: SubjectServices, public route: ActivatedRoute,
              private formBuilder: FormBuilder, public subject: SubjectServices, public config: ConfigurationService,
              private toastr: ToastrService, public auth: AuthService, public category: CategoryService, public router: Router,
              public validation: ValidationService, public env: EnvironmentService, public subjectservice: SubjectServices, public datePipe: DatePipe, public common: CommonService) {
    this.imgUrl = this.config.getimgUrl();
    this.myProfile();
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
    this.firstname = this.auth.getSessionData('rista-firstname');
    this.lastname = this.auth.getSessionData('rista-lastname');
    this.role = this.auth.getSessionData('rista-user_role');
    this.email = this.auth.getSessionData('rista-email_id');
    this.gender = this.auth.getSessionData('rista-gender');
    this.profile = this.auth.getSessionData('rista-profile_url');
    // if (this.auth.getSessionData('rista-birthday') != '0000-00-00' && this.auth.getSessionData('rista-birthday') != null && this.auth.getSessionData('rista-birthday') != ''){
    //   this.birthday = this.auth.getSessionData('rista-birthday');
    // }
    // else{
    //   this.birthday = '';
    // }
    // this.p1name = this.auth.getSessionData('p1fname');
    // this.p2name = this.auth.getSessionData('p1fname');
    // this.p1address1 = this.auth.getSessionData('p1address1');
    // this.p1address2 = this.auth.getSessionData('p1address2');
    // this.p2address1 = this.auth.getSessionData('p2address1');
    // this.p2address2 = this.auth.getSessionData('p2address2');
    // this.p1city = this.auth.getSessionData('p1city');
    // this.p2city = this.auth.getSessionData('p2city');
    // this.p1state = this.auth.getSessionData('p1state');
    // this.p2state = this.auth.getSessionData('p2state');
    // this.p1statename = this.auth.getSessionData('p1state_name');
    // this.p2statename = this.auth.getSessionData('p2state_name');
    // this.p1country = this.auth.getSessionData('p1country');
    // this.p2country = this.auth.getSessionData('p2country');
    // this.p1countryname = this.auth.getSessionData('p1country_name');
    // this.p2countryname = this.auth.getSessionData('p2country_name');
    // this.p1postalCode = this.auth.getSessionData('p1postal_code');
    // this.p2postalCode = this.auth.getSessionData('p2postal_code');
    // this.mobile = this.auth.getSessionData('rista-mobile');

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
      mobile: '',
      gender: '',
      dob: '',
      p1fname: '',
      p1address1: '',
      p1address2: '',
      p1city: '',
      p1state: '',
      p1country: '231',
      p2fname: '',
      p2address1: '',
      p2address2: '',
      p2city: '',
      p2state: '',
      p2country: '231',
      postalCode1: '',
      postalCode2: ''
    });

    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    // this.imgUrl + '/' + this.assetList.media_image[i].c
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
  }
  updateUserProfile(){
    //when the profile-url changes, update the user service

  }
  ngOnInit() {
    this.commondata.showLoader(false);
  }
  onDateChanged(event: IMyDateModel): void {
  }

  myProfile() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id')
    };
    this.category.Profile(data).subscribe( (successData) => {
          this.myProfileListSuccess(successData);
        },
        (error) => {
          this.myProfileListFailure(error);
        });
  }
  myProfileListSuccess(successData) {
    console.log(successData, 'successData')
    this.profiledetail = successData.ResponseObject[0].address;
    this.mobile = successData.ResponseObject[0].mobile;
    this.p1name = successData.ResponseObject[0].parent1_name;
    this.p2name = successData.ResponseObject[0].parent2_name;
    if (successData.ResponseObject[0].birthday != '0000-00-00' && successData.ResponseObject[0].birthday != null) {
      this.birthday = successData.ResponseObject[0].birthday;
    }
    this.p1address1 = this.profiledetail[0].address1;
    this.p1address2 = this.profiledetail[0].address2;
    this.p2address1 = this.profiledetail[1].address1;
    this.p2address2 = this.profiledetail[1].address2;
    this.p1city = this.profiledetail[0].city;
    this.p2city = this.profiledetail[1].city;
    this.p1state = this.profiledetail[0].state;
    this.p2state = this.profiledetail[1].state;
    this.p1statename = this.profiledetail[0].state_name;
    this.p2statename = this.profiledetail[1].state_name;
    this.p1country = this.profiledetail[0].country;
    this.p2country = this.profiledetail[1].country;
    this.p1countryname = this.profiledetail[0].country_name;
    this.p2countryname = this.profiledetail[1].country_name;
    this.p1postalCode = this.profiledetail[0].postal_code;
    this.p2postalCode = this.profiledetail[1].postal_code;
    this.auth.setSessionData('p1fname', successData.ResponseObject[0].parent1_name);
    this.auth.setSessionData('p2fname', successData.ResponseObject[0].parent2_name);
    this.auth.setSessionData('rista-mobile', successData.ResponseObject[0].mobile);
    this.auth.setSessionData('p1address1', this.profiledetail[0].address1);
    this.auth.setSessionData('p1address2', this.profiledetail[0].address2);
    this.auth.setSessionData('p2address1', this.profiledetail[1].address1);
    this.auth.setSessionData('p2address2', this.profiledetail[1].address2);
    this.auth.setSessionData('p1city', this.profiledetail[0].city);
    this.auth.setSessionData('p2city', this.profiledetail[1].city);
    this.auth.setSessionData('p1state', this.profiledetail[0].state);
    this.auth.setSessionData('p2state', this.profiledetail[1].state);
    this.auth.setSessionData('p1state_name', this.profiledetail[0].state_name);
    this.auth.setSessionData('p2state_name', this.profiledetail[1].state_name);
    this.auth.setSessionData('p1country', this.profiledetail[0].country);
    this.auth.setSessionData('p2country', this.profiledetail[1].country);
    this.auth.setSessionData('p1postal_code', this.profiledetail[0].postal_code);
    this.auth.setSessionData('p2postal_code', this.profiledetail[1].postal_code);
    // this.auth.setSessionData('rista-birthday', this.profiledetail[1].postal_code);
  }
  myProfileListFailure(error) {
    console.log(error, 'error');
  }

  editPage(){
    this.editView = true;
    this.accountForm.controls.fname.patchValue(this.firstname == 'null' ? '' : this.firstname);
    this.accountForm.controls.lname.patchValue(this.lastname == 'null' ? '' : this.lastname);
    this.accountForm.controls.email.patchValue(this.email == 'null' ? '' : this.email);
    this.accountForm.controls.mobile.patchValue(this.mobile == 'null' ? '' : this.mobile);
    this.accountForm.controls.gender.patchValue(this.gender == 'null' ? '' : this.gender.toLowerCase());
    this.accountForm.controls.p1fname.patchValue(this.p1name == 'null' ? '' : this.p1name);
    this.accountForm.controls.p1address1.patchValue(this.p1address1 == 'null' ? '' : this.p1address1);
    this.accountForm.controls.p1address2.patchValue(this.p1address2 == 'null' ? '' : this.p1address2);
    this.accountForm.controls.p1city.patchValue(this.p1city == null ? '' : this.p1city == 'null' ? '' : this.p1city);
    this.accountForm.controls.p2fname.patchValue(this.p2name == 'null' ? '' : this.p2name);
    this.accountForm.controls.p2address1.patchValue(this.p2address1 == 'null' ? '' : this.p2address1);
    this.accountForm.controls.p2address2.patchValue(this.p2address2 == 'null' ? '' : this.p2address2);
    this.accountForm.controls.p2city.patchValue(this.p2city == null ? '' : this.p2city == 'null' ? '' : this.p2city);
    this.accountForm.controls.p1country.patchValue(this.p1country == 'null' ? '231' : this.p1country);
    this.countryList(this.p1country, 1);
    this.accountForm.controls.p2country.patchValue(this.p2country == 'null' ? '231' : this.p2country);
    this.countryList(this.p2country, 2);
    if (this.birthday != '0000-00-00' && this.birthday != null && this.birthday != ''){
      const dob = this.birthday.split('-');
      const dobObject1: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(dob[0]), parseInt(dob[1]) - 1, parseInt(dob[2]))}, dateRange: null};
      this.accountForm.controls.dob.patchValue(dobObject1);
    }
    // else {
    //   this.accountForm.controls.dob.patchValue(null);
    // }
    this.accountForm.controls.postalCode1.patchValue(this.p1postalCode == null ? '' : this.p1postalCode == 'null' ? '' : this.p1postalCode);
    this.accountForm.controls.postalCode2.patchValue(this.p2postalCode == null ? '' : this.p2postalCode == 'null' ? '' : this.p2postalCode);
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
    const addresslist = [];
    addresslist.push({
          address1: this.accountForm.controls.p1address1.value,
          address2: this.accountForm.controls.p1address2.value,
          city: this.accountForm.controls.p1city.value,
          state: this.accountForm.controls.p1state.value,
          country: this.accountForm.controls.p1country.value,
          postal_code: this.accountForm.controls.postalCode1.value,
        },
        {
          address1: this.accountForm.controls.p2address1.value,
          address2: this.accountForm.controls.p2address2.value,
          city: this.accountForm.controls.p2city.value,
          state: this.accountForm.controls.p2state.value,
          country: this.accountForm.controls.p2country.value,
          postal_code: this.accountForm.controls.postalCode2.value,
        }
    );
    if (this.accountForm.valid){
      console.log(this.accountForm.controls.dob.value, 'dob');
      const data = {
        platform: 'web',
        role_id: this.auth.getRoleId(),
        user_id: this.auth.getUserId(),
        uploadtype: 'profile',
        first_name: this.accountForm.controls.fname.value,
        last_name: this.accountForm.controls.lname.value,
        gender: this.accountForm.controls.gender.value,
        mobile: this.accountForm.controls.mobile.value,
        birthday: this.accountForm.controls.dob.value == null || this.accountForm.controls.dob.value == '' ? '' : this.datePipe.transform(this.accountForm.controls.dob.value.singleDate.jsDate, 'yyyy-MM-dd'),
        school_id: this.auth.getSessionData('rista-school_id'),
        parent1_name: this.accountForm.controls.p1fname.value,
        parent2_name: this.accountForm.controls.p2fname.value,
        address: addresslist
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
      this.mobile = data.mobile;
      if (data.birthday != '' && data.birthday != '0000-00-00' && data.birthday != null){
        this.birthday = data.birthday;
      }else{
        this.birthday = null;
      }
      this.p1name = data.parent1_name;
      this.p2name = data.parent2_name;
      this.gender = data.gender;
      this.p1address1 = data.address[0].address1;
      this.p1address2 = data.address[0].address2;
      this.p2address1 = data.address[1].address1;
      this.p2address2 = data.address[1].address2;
      this.p1city = data.address[0].city;
      this.p2city = data.address[1].city;
      this.p1state = data.address[0].state;
      this.p2state = data.address[1].state;
      this.p1country = data.address[0].country;
      this.p2country = data.address[1].country;
      this.stateListEdit(data.address[0].country, 1);
      this.stateListEdit(data.address[1].country, 2);
      this.countryListEdit(data.address[0].country, 1);
      this.countryListEdit(data.address[1].country, 2);
      this.p1postalCode = data.address[0].postal_code;
      this.p2postalCode = data.address[1].postal_code;
      this.auth.setSessionData('rista-mobile', data.mobile);
      this.auth.setSessionData('rista-birthday', this.birthday);
      this.auth.setSessionData('rista-gender', data.gender);
      this.auth.setSessionData('rista-firstname', data.first_name);
      this.auth.setSessionData('rista-lastname', data.last_name);
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
  countryList(value , id) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListSuccess(successData, value, id);
        },
        (error) => {
          this.countryListFailure(error);
        });
  }
  countryListSuccess(successData, value, id) {
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;
    }
    if (this.editView == true ){
        if (id == 1){
            this.stateList(value);
        }
        if (id == 2){
            this.stateList1(value);
        }
    }
  }
  countryListFailure(error) {
    console.log(error, 'error');
  }
  countryListEdit(value, id) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getCountryList(data).subscribe( (successData) => {
          this.countryListEditSuccess(successData, value, id);
        },
        (error) => {
          this.countryListEditFailure(error);
        });
  }
  countryListEditSuccess(successData, value, id) {
    console.log(value, 'Countrylist');
    if (successData.IsSuccess) {
      this.countryListData = successData.ResponseObject;
      if ( id == 1){
        this.countryListData.forEach((id1) => {
          if (id1.country_id == value) {
            this.p1countryname = id1.name;
            this.auth.setSessionData('p1country_name', this.p1countryname);
          }
        });
      }else {
        this.countryListData.forEach((id1) => {
          if (id1.country_id == value) {
            this.p2countryname = id1.name;
            this.auth.setSessionData('p2country_name', this.p2countryname);
          }
        });
      }

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
      // this.stateListData1 = successData.ResponseObject;
      this.accountForm.controls.p1state.patchValue(null);
      // this.accountForm.controls.p2state.patchValue(null);
      if (this.editView == true) {
        this.stateListData.forEach((value) => {
            if (value.state_id == this.p1state) {
              this.accountForm.controls.p1state.patchValue(value.state_id);
            }
          });
      }
    }
  }
  stateListFailure(error) {
    console.log(error, 'error');
  }
    stateList1(id) {
        const data = {
            platform: 'web',
            country_id: id,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid')
        };
        this.common.getStateList(data).subscribe( (successData) => {
                this.stateListSuccess1(successData, id);
            },
            (error) => {
                this.stateListFailure1(error);
            });
    }
    stateListSuccess1(successData, id) {
        if (successData.IsSuccess) {
            this.stateListData1 = successData.ResponseObject;
            this.accountForm.controls.p2state.patchValue(null);
            if (this.editView == true) {
                this.stateListData1.forEach((value) => {
                    if (value.state_id == this.p2state) {
                        this.accountForm.controls.p2state.patchValue(value.state_id);
                    }
                });
            }
        }
    }
    stateListFailure1(error) {
        console.log(error, 'error');
    }
  stateListEdit(id , valve) {
    const data = {
      platform: 'web',
      country_id: id,
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
    };
    this.common.getStateList(data).subscribe( (successData) => {
          this.stateListEditSuccess(successData, id, valve);
        },
        (error) => {
          this.stateListEditFailure(error);
        });
  }
  stateListEditSuccess(successData, id, valve) {
    if (successData.IsSuccess) {
      if (valve == 1){
        this.stateListData = successData.ResponseObject;
        this.stateListData.forEach((value) => {
          if (this.p1state != null){
            if (value.state_id == this.p1state) {
              this.p1statename = value.name;
            }
          }else {
            this.p1statename = 'null';
          }
        });
      }else {
        this.stateListData1 = successData.ResponseObject;
        this.stateListData1.forEach((value1) => {
          if (this.p2state != null){
            if (value1.state_id == this.p2state) {
              this.p2statename = value1.name;
            }
          }else {
            this.p2statename = 'null';
          }
        });
      }
    }
  }
  stateListEditFailure(error) {
    console.log(error, 'error');
  }

  public numberPattern(event: any) {
    this.validation.numberValidate1(event);
  }

}
