import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {SchoolService} from '../../../shared/service/School.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {stringify} from 'querystring';
import {CommonService} from '../../../shared/service/common.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-School.component.html',
  styleUrls: ['./add-School.component.scss']
})
export class AddSchoolComponent implements OnInit, OnDestroy {
  public schoolform: FormGroup;
  public type: any;
  public editData: any;
  public status: any;
  public recordBase64Url: any;
  public school_id: any;
  public imagepath: any;
  public webhost: any;
  public imagepaththumb: any;
  public corporatedetails: any;
  public branchSelect: boolean;
  public corporateSchoolControl: boolean;
  public stateListData: any;
  public countryListData: any;

  @ViewChild('myInput') myInputVariable: ElementRef<any>;
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder,
              public commondata: CommonDataService, private toastr: ToastrService,
              public auth: AuthService, public brandservices: SchoolService, public sanitizer: DomSanitizer,
              public router: Router, public validationService: ValidationService, public common: CommonService, public config: ConfigurationService) {
    this.branchSelect = false;
    this.countryList();
    this.corporatedetails = JSON.parse(this.auth.getSessionData('rista_data1'));
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.webhost = this.config.getimgUrl();
    this.imagepath = [];
    this.imagepaththumb = [];
    this.schoolform = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      email_id: [''],
      mobile: [''],
      schoolName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      taxId: '',
      documentUpload: '',
      isgroup1: '',
      isgroup2: '',
      status: ['1', Validators.required],
    });



    if (this.type == 'edit'){
      this.editData = JSON.parse(this.auth.getSessionData('editschool'));
      this.stateList(this.editData.country_id);
      this.school_id = this.editData.school_id;
      this.status = this.editData.status;
      this.schoolform.controls.first_name.patchValue(this.editData.first_name);
      this.schoolform.controls.last_name.patchValue(this.editData.last_name);
      this.schoolform.controls.email_id.patchValue(this.editData.email_id);
      this.schoolform.controls.mobile.patchValue(this.editData.mobile);
      this.schoolform.controls.schoolName.patchValue(this.editData.name);
      this.schoolform.controls.address1.patchValue(this.editData.address_1);
      this.schoolform.controls.address2.patchValue(this.editData.address_2);
      this.schoolform.controls.city.patchValue(this.editData.city);
      this.schoolform.controls.state.patchValue(this.editData.state_id);
      this.schoolform.controls.country.patchValue(this.editData.country_id);
      this.schoolform.controls.postalCode.patchValue(this.editData.postal_code);
      if (this.editData.status == 'Active'){
        this.schoolform.controls.status.patchValue(1);
      }else if (this.editData.status == 'Inactive'){
        this.schoolform.controls.status.patchValue(2);
      }
      if ( this.editData.has_branch == 1){
        this.schoolform.controls.isgroup1.patchValue(true);
        this.branchSelect = true;
      } else if ( this.editData.has_branch == 0){
        this.schoolform.controls.isgroup1.patchValue(false);
        this.branchSelect = false;
      }
      this.schoolform.controls.taxId.patchValue(this.editData.tax_id);
      this.imagepath.push(this.editData.profile_url);
      this.imagepaththumb.push(this.editData.profile_thumb_url);
    } else{
      this.stateList('231');
      this.schoolform.controls.first_name.patchValue('');
      this.schoolform.controls.last_name.patchValue('');
      this.schoolform.controls.email_id.patchValue('');
      this.schoolform.controls.mobile.patchValue('');
      this.schoolform.controls.schoolName.patchValue('');
      this.schoolform.controls.address1.patchValue('');
      this.schoolform.controls.address2.patchValue('');
      this.schoolform.controls.city.patchValue('');
      this.schoolform.controls.state.patchValue(null);
      this.schoolform.controls.country.patchValue('231');
      this.schoolform.controls.postalCode.patchValue('');
      this.schoolform.controls.taxId.patchValue('');
      this.schoolform.controls.isgroup1.patchValue('');
      this.schoolform.controls.status.patchValue('1');
      this.imagepath = '';
      this.imagepaththumb = '';
    }
  }
  ngOnInit() {
    this.commondata.showLoader(false);
    this.corporateSchoolControl = true;
    this.brandservices.changeSideCorporateSchoolList(this.corporateSchoolControl);
  }
  ngOnDestroy(): void {
    this.corporateSchoolControl = false;
    this.brandservices.changeSideCorporateSchoolList(this.corporateSchoolControl);
  }
  list(value){
  }
  deleteImg(){
    this.imagepath = [];
    this.clearUploadfilename();
  }
  clearUploadfilename(){
    this.myInputVariable.nativeElement.value = '';
  }
  addschool(value) {
    if (this.schoolform.valid) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        first_name: this.schoolform.controls.first_name.value,
        last_name: this.schoolform.controls.last_name.value,
        email_id: this.schoolform.controls.email_id.value,
        mobile: this.schoolform.controls.mobile.value,
        name: this.schoolform.controls.schoolName.value,
        address1: this.schoolform.controls.address1.value,
        address2: this.schoolform.controls.address2.value,
        city: this.schoolform.controls.city.value,
        state: this.schoolform.controls.state.value,
        country: this.schoolform.controls.country.value,
        postal_code: this.schoolform.controls.postalCode.value,
        has_branch: this.schoolform.controls.isgroup1.value  == true ? '1' : '0',
        branch_name: this.auth.getSessionData('rista-corporate_id'),
        tax_id: this.schoolform.controls.taxId.value ? this.schoolform.controls.taxId.value : '',
        profile_url: this.imagepath.toString(),
        profile_thumb_url: this.imagepaththumb.toString(),
        school_id: this.school_id ?  this.school_id : '',
        status: this.schoolform.controls.status.value
      };
      if (value == 'add') {
        this.brandservices.brandAdd(data).subscribe((successData) => {
              this.addCategorySuccess(successData);
            },
            (error) => {
              this.addCategoryFailure(error);
            });
      } else  if (value == 'edit') {
        this.brandservices.brandEdit(data).subscribe((successData) => {
              this.addCategorySuccess(successData);
            },
            (error) => {
              this.addCategoryFailure(error);
            });
      }


    } else {
      this.toastr.error('Please fill all the mandatory fields');
      this.validationService.validateAllFormFields(this.schoolform);
    }
  }

  addCategorySuccess(successData){
    if (successData.IsSuccess) {
      this.commondata.showLoader(false);
      this.toastr.success(successData.ResponseObject, 'School');
      this.router.navigate(['/School/list-School']);
    } else{
      this.commondata.showLoader(false);
      this.toastr.error(successData.ErrorObject, 'School');
    }
  }
  addCategoryFailure(error){
    console.log(error, 'error');
  }

  stateList(id) {
    const countryVal = this.schoolform.controls.country.value;
    this.schoolform.controls.state.patchValue(null);
    const data = {
      platform: 'web',
      country_id: id,
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
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
    }
  }
  stateListFailure(error) {
    console.log(error, 'error');
  }


  countryList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid')
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
    }
  }
  countryListFailure(error) {
    console.log(error, 'error');
  }
  public numberPattern(event: any) {
    this.validationService.numberValidate1(event);
  }
  encodeImageFileAsURL(event: any){
    for (let i = 0; i < event.target.files.length; i++) {
      const getUrlEdu = '';
      const imgDetails = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const url = event.target.result;
        const getUrl = url.split(',');
        this.onUploadKYCFinished(getUrl, imgDetails);
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  }
  onUploadKYCFinished(getUrlEdu, imageList){
    this.recordBase64Url =  getUrlEdu[1];
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      image_path: [{
        image: this.recordBase64Url,
        size: imageList.size,
        type: imageList.type,
        name: imageList.name
      }],
      uploadtype: 'school'
    };
    this.common.fileUpload(data).subscribe(
        (successData) => {
          this.uploadSuccess(successData);
        },
        (error) => {
          // this.embryologylistFailure(error);
        }
    );
  }

  uploadSuccess(successData) {
    // this.settings.loadingSpinner = false;
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject.message);
        this.imagepath = [];
      // if (typing == 1) {
        for (let i = 0; i < successData.ResponseObject.imagepath.length; i++) {
          this.imagepath.push(successData.ResponseObject.imagepath[i].original_image_url);
          this.imagepaththumb.push(successData.ResponseObject.imagepath[i].resized_url);

        }
    }
  }



  checkValue(eve){
    if ( eve.target.checked == true) {
      this.branchSelect = true;
      this.schoolform.controls.isgroup1.setValidators([Validators.required]);
      this.schoolform.controls.isgroup1.updateValueAndValidity();

    }else {
      this.schoolform.controls.isgroup1.clearValidators();
      this.schoolform.controls.isgroup1.setValidators(null);
      this.schoolform.controls.isgroup1.updateValueAndValidity();
      setTimeout(() =>{
        this.branchSelect = false;
      }, 500);


    }

    //   this.schoolform.controls.isgroup2.patchValue(false);
    //   this.branchSelect = eve.target.checked;
    // }else if ( type == 'false'){
    //   this.branchSelect = false;
    //   this.unChecked = 'false';
    //   this.schoolform.controls.isgroup1.patchValue(false);
    //   this.schoolform.controls.isgroup2.patchValue(true);
    // }
  }
}
