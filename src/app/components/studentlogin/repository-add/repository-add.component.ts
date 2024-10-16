import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonDataService} from "../../../shared/service/common-data.service";
import {CommonService} from "../../../shared/service/common.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../shared/service/auth.service";
import {ConfigurationService} from "../../../shared/service/configuration.service";
import set = Reflect.set;
import {StudentService} from "../../../shared/service/student.service";

@Component({
  selector: 'app-repository-add',
  templateUrl: './repository-add.component.html',
  styleUrls: ['./repository-add.component.scss']
})
export class RepositoryAddComponent implements OnInit {
  public type: any;
  public webhost: any;
  public editData: any = '';
  public newCategoryAdd: any;
  public response: any = [];
  public pdfpath = [];
  public files = [];
  public multiPdf = [];
  public categoryList = [];
  public showCategoryInput = false;
  public uploadType: any = 'single';
  public contentForm: FormGroup;

  @ViewChild('attachments') attachment: any;

  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public modalService: NgbModal, public router: Router,
              public commondata: CommonDataService, public common: CommonService, public toastr: ToastrService,
              public auth: AuthService, public config: ConfigurationService, public student: StudentService) {
    this.webhost = this.config.getimgUrl();
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.contentForm = this.formBuilder.group({
      name: this.uploadType == 'single' ? ['', Validators.required] : '',
      description: '',
      status: ['1', Validators.required],
      grade: '',
      subject: '',
      resourcesLink: '',
      category: '',
    });
    this.contentFolderList('init', 0);
  }

  ngOnInit(): void {
      if (this.type == 'edit') {
          this.editData = JSON.parse(this.auth.getSessionData('edit-student-content'));
          this.contentForm.controls.name.patchValue(this.editData.name);
          this.contentForm.controls.description.patchValue(this.editData.description);
          this.contentForm.controls.category.patchValue(this.editData.category_id);
          this.contentForm.controls.status.patchValue(this.editData.status);
          this.contentForm.controls.grade.patchValue(this.editData.grade_name);
          this.contentForm.controls.subject.patchValue(this.editData.subject_name);
          this.contentForm.controls.resourcesLink.patchValue(this.editData.links);
          this.pdfpath = this.editData.file_path;
      }
  }

  contentFolderList(type, index) {
      // index param only used for multi upload new folder creation //
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      type: 'active'
    };
    this.student.folderList(data).subscribe((successData) => {
            this.folderListSuccess(successData, type, index);
        },
          (error) => {
              console.error(error, 'error_assignmentList');
    });
  }
  folderListSuccess(successData, type, index) {
      if (successData.IsSuccess) {
          this.categoryList = successData.ResponseObject;
          if (type == 'updateList') {
              if (this.uploadType == 'single') {
                  this.categoryList.forEach((val) => {
                      if (val.category_name == this.newCategoryAdd) {
                          if (this.contentForm.controls.category.value == '') {
                              this.contentForm.controls.category.patchValue([val.category_id]);
                          } else {
                              const arr = [...this.contentForm.controls.category.value];
                              arr.push(val.category_id);
                              this.contentForm.controls.category.patchValue(arr);
                              console.log(arr, 'arr');
                          }
                          // this.contentForm.controls.category.patchValue(val.category_id);
                      }
                  });
                  $('#newFolder').val('');
              } else {
                  this.categoryList.forEach((val) => {
                      if (val.category_name == this.newCategoryAdd) {
                          this.multiPdf[index].category_id = val.category_id;
                          this.multiPdf.forEach((items) => {
                              if (items.category_id === '') {
                                  items.category_id = val.category_id;
                              }
                          });
                      }
                  });
                  $('#folderInput' + index).val('');
                  document.getElementById('multiFolder' + index).style.display = 'none';
              }
              this.showCategoryInput = false;
          }
      }
  }

  showNewFolderInput(index) {
      this.showCategoryInput = true;
      document.getElementById('multiFolder' + index).style.display = 'flex';
      console.log(document.getElementById('multiFolder' + index).style, 'set style');
  }

    closeNewFolderInput(index) {
        document.getElementById('multiFolder' + index).style.display = 'none';
        this.showCategoryInput = false;
    }

  addNewFolder(index) {
      if (this.uploadType == 'single') {
          this.newCategoryAdd = $('#newFolder').val();
      } else {
          this.newCategoryAdd = $('#folderInput' + index).val();
      }
      this.addFolder(index);
  }
  addFolder(index) {
      if (this.newCategoryAdd != '') {
          const data = {
              platform: 'web',
              role_id: this.auth.getSessionData('rista-roleid'),
              user_id: this.auth.getSessionData('rista-userid'),
              school_id: this.auth.getSessionData('rista-school_id'),
              student_id: this.auth.getSessionData('rista-userid'),
              category_name: this.newCategoryAdd,
              status: '1'
          };
          this.student.addFolder(data).subscribe((successData) => {
                  this.addFolderSuccess(successData, index);
              },
              (error) => {
                  this.toastr.error(error.ErrorObject);
                  console.error(error, 'error_assignmentList');
              });
      } else {
          this.toastr.error('Please Enter Folder Name');
      }
  }
  addFolderSuccess(successData, index) {
      if (successData.IsSuccess) {
          this.toastr.success(successData.ResponseObject);
          this.contentFolderList('updateList', index);
      } else {
          this.toastr.error(successData.ErrorObject);
      }
  }

    validateMultiPdf() {
      let validate = true;
      this.multiPdf.every((items) => {
          items.category_id = items.category_id === '' ? 0 : items.category_id;
          if (items.name == '') {
              validate = false;
          }
      });
      return validate;
    }

  addContent(type) {
      let allow = true;
      if (this.uploadType == 'multi') {
          allow = this.validateMultiPdf();
      }
      if (this.contentForm.valid && this.pdfpath.length != 0 && allow) {
          let data;
          if (this.uploadType == 'single') {
              data = {
                  platform: 'web',
                  role_id: this.auth.getSessionData('rista-roleid'),
                  user_id: this.auth.getSessionData('rista-userid'),
                  school_id: this.auth.getSessionData('rista-school_id'),
                  student_id: this.auth.getSessionData('rista-userid'),
                  name: this.contentForm.controls.name.value,
                  description: this.contentForm.controls.description.value,
                  category_id: this.contentForm.controls.category.value == '' ? [] : this.contentForm.controls.category.value,
                  status: this.contentForm.controls.status.value,
                  subject_name: this.contentForm.controls.subject.value,
                  grade_name: this.contentForm.controls.grade.value,
                  file_path: this.pdfpath,
                  link: this.contentForm.controls.resourcesLink.value == '' ? [] : this.contentForm.controls.resourcesLink.value,
                  type: '1',
              };
              console.log(data, 'data single');
          } else {
              data = {
                  platform: 'web',
                  role_id: this.auth.getSessionData('rista-roleid'),
                  user_id: this.auth.getSessionData('rista-userid'),
                  school_id: this.auth.getSessionData('rista-school_id'),
                  student_id: this.auth.getSessionData('rista-userid'),
                  // description: this.contentForm.controls.description.value,
                  status: this.contentForm.controls.status.value,
                  subject_name: this.contentForm.controls.subject.value,
                  grade_name: this.contentForm.controls.grade.value,
                  type: '2',
                  contents: this.multiPdf
              };
          }
          if (type == 'add') {
              this.student.addContent(data).subscribe((successData) => {
                      this.addContentSuccess(successData);
                  },
                  (error) => {
                      console.error(error, 'error_addContent');
                      this.toastr.error(error.ErrorObject);
                  });
          } else {
              data['repository_id'] = this.editData.repository_id;
              this.auth.removeSessionData('edit-student-content');
              this.student.editContent(data).subscribe((successData) => {
                      this.addContentSuccess(successData);
                  },
                  (error) => {
                      this.toastr.error(error.ErrorObject);
                      console.error(error, 'error_editContent');
                  });
          }
      } else {
          this.toastr.error('Please Enter all the Mandatory Fields');
      }
  }
  addContentSuccess(successData) {
      if (successData.IsSuccess) {
          this.toastr.success(successData.ResponseObject);
          this.router.navigate(['/studentlogin/repository']);
      } else {
          this.toastr.error(successData.ErrorObject);
      }
  }
  onSelectNewFolder() {
      this.showCategoryInput = true;
      setTimeout(() => {
          document.getElementById('newFolder').focus();
      }, 200);
  }
  multiCategorySelection(event, index) {
      console.log(event, 'event change dropdown');
      this.multiPdf.forEach((item, i) => {
          if (index == i) {
              item.category_id = event.target.value;
          } else if (item.category_id === '') {
              item.category_id = event.target.value;
          }
      });
      // console.log(this.multiPdf, 'multiPdf');
  }
    patchName(event, index) {
      this.multiPdf[index].name = event.target.value;
    }
  resetForm() {
    this.contentForm.reset();
    this.pdfpath = [];
    this.attachment.nativeElement.value = '';
    this.contentForm.controls.status.patchValue('1');
    if (this.uploadType == 'multi') {
        this.contentForm.controls.name.setValidators([]);
        // this.contentForm.controls.category.setValidators([]);
    } else {
        this.contentForm.controls.name.setValidators([Validators.required]);
        // this.contentForm.controls.category.setValidators([Validators.required]);
    }
  }

    deletePdf(index, type) {
      if (type == 'multi') {
          this.multiPdf.splice(index, 1);
          this.pdfpath.splice(index, 1);
      } else {
          this.pdfpath.splice(index, 1);
          this.attachment.nativeElement.value = '';
      }
    }

  // Multi upload //
  onFileChange(pFileList: File[]){
    console.log(pFileList , 'pFileList');
    this.files = [...pFileList];
    this.files.forEach((val) => {
      let split = val.image.split(',');
      val.image = split[1];
    });
    console.log(this.files, 'files');
    this.onUploadKYCFinishedpdf(this.files, 3);
  }

  // Single upload //
  encodePdfFileAsURL(event: any, type) {
    let images = [];
    let imageLength = event.target.files.length;
    for (let i = 0; i < event.target.files.length; i++) {
      const getUrlEdu = '';
      const pdfDetails = event.target.files[i];
      console.log(pdfDetails, 'pdfDetails');
      const reader = new FileReader();
      reader.onload = (event: any) => {
        let uploadTypeList = event.target.result.split(',');
        images.push({image: uploadTypeList[1],
          size: pdfDetails.size,
          type: pdfDetails.type,
          name: pdfDetails.name});
        const pic = pdfDetails.type.split('/');
        if (pic[1] == 'pdf' ){
          if (imageLength == images.length) {
            this.onUploadKYCFinishedpdf(images, type);
          }
        } else {
          this.toastr.error('PDF are the required file format');
        }
      };
      reader.readAsDataURL(event.target.files[i]);
    }

  }
  onUploadKYCFinishedpdf(getUrlEdu, type){
    // let pdftype: any;
    // if (type == '1'){
    //   pdftype = 'content';
    // }else {
    //   pdftype = 'answerkey';
    // }
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      image_path: getUrlEdu,
      uploadtype: 'studentrepository'
    };
    this.common.fileUpload(data).subscribe(
        (successData) => {
          this.pdfuploadSuccess(successData, type);
        },
        (error) => {
          this.pdfuploadFailure(error);
        }
    );
  }
  pdfuploadSuccess(successData, type) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject.message);
      this.response = successData.ResponseObject;
      console.log(this.response, 'response');
      if (type == '1'){
        this.pdfpath = [];
        this.pdfpath.push(this.response.imagepath[0]);
      } else if (type == '3') {
        // this.response.imagepath.forEach((item) => {
        //   item.resource_type = this.resourceType;
        // });
        this.pdfpath = [...this.pdfpath, ...this.response.imagepath];
        const length = this.multiPdf.length;
        this.pdfpath.forEach((items, index) => {
            if (index >= length) {
                const splitName = items.image.split('.');
                const pdfName = splitName[0];
                this.multiPdf.push({
                    name: pdfName,
                    category_id: '',
                    file_path: [items]
                });
            }
        });
      }
    } else {
      this.toastr.error('Invalid File Format');
    }
  }
  pdfuploadFailure(error) {
    this.toastr.error('Invalid File Format');
  }

}
