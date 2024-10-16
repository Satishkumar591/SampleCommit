import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {ClassService} from '../../../shared/service/class.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {AuthService} from '../../../shared/service/auth.service';
import {SchoolService} from '../../../shared/service/School.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ValidationService} from '../../../shared/service/validation.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe} from '@angular/common';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {CreatorService} from '../../../shared/service/creator.service';
import {dateOptions} from '../../../shared/data/config';

@Component({
    selector: 'app-add-assignment',
    templateUrl: './add-assignment.component.html',
    styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent implements OnInit {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        // other options are here...
    };
    public assignmentForm: FormGroup;
    public type: any;
    public editData: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public recordBase64Url: any;
    public imagepath: any;
    public imagepaththumb: any;
    public pdfpath: any;
    public pdfpaththumb: any;
    public getpdfpath: any;
    public getpdfpaththumb: any;
    public getlinks: any;
    public pdflinks: any = [];
    public repeatlink: FormArray;
    public webhost: any;
    public filetype: any;
    public url: any;
    public getUrl: any;
    public getUrl1: any;
    public meridian: boolean;
    public spinner: boolean;
    public gradeData: any;
    public tagData: any;
    public gradeSplit: any;
    public subjectSplit: any;
    public subjectData: any;
    public gradeId: any;
    public username: any;
    public draftData: any;
    public assignData: any;
    public response: any;
    public getTag: any = [];
    public tagArray: any = [];
    public classDetails: any = [];
    public contentCreatedForm = '';

    @ViewChild('myInput') myInputVariable: ElementRef<any>;
    @ViewChild('pdf') Content: ElementRef<any>;
    @ViewChild('assignContentToClass') assignContentToClass: TemplateRef<any>;
    @ViewChild('assignTemplate') assignTemplate: TemplateRef<any>;

    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public classService: ClassService, public creator: CreatorService,
                public commondata: CommonDataService, private toastr: ToastrService, public common: CommonService,
                public auth: AuthService, public brandservices: SchoolService, public sanitizer: DomSanitizer,
                public router: Router, public validationService: ValidationService, public config: ConfigurationService,
                public modalService: NgbModal, public datePipe: DatePipe) {
        this.webhost = this.config.getimgUrl();
        this.username = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        this.pdfpath = [];
        this.pdfpaththumb = [];
        this.getpdfpath = JSON.parse(this.auth.getSessionData('pdf_path'));
        this.getlinks = JSON.parse(this.auth.getSessionData('pdf-links'));
        this.getpdfpaththumb = this.auth.getSessionData('pdf_path_thumb');
        console.log(this.getpdfpath, 'getpdfpath');
        console.log(this.getlinks, 'getlinks');
        if (this.getpdfpath != null) {
            for (let i = 0; i < this.getpdfpath.length; i++) {
                // this.getpdfpath[i].
                this.pdfpath.push(this.getpdfpath[i]);
                this.pdflinks = [];
            }
        }
        if (this.getlinks != null) {
            for (let i = 0; i < this.getlinks.length; i++) {
                this.pdflinks.push(this.getlinks[i]);
                this.pdfpath = [];
            }
        }
        // if (this.getpdfpath.length)
        // const pdf = this.getpdfpath.split(',');
        console.log(this.pdfpath, 'pdfpath');

        this.route.params.forEach((params) => {
            this.type = params.type;
        });
        this.assignmentForm = this.formBuilder.group({
            created: ['', Validators.required],
            resourceName: ['', Validators.required],
            grade: ['', Validators.required],
            subject: ['', Validators.required],
            description: ['', Validators.required],
            tag: ['', Validators.required],
            access: ['', Validators.required],
            repeatlink: this.formBuilder.array([this.addlink()]),
        });
        if (this.type == 'edit') {
            this.editData = JSON.parse(this.auth.getSessionData('editresources'));
            this.gradeId = this.editData.grade_id;
            this.assignmentForm.controls.created.patchValue(this.editData.created_by);
            this.assignmentForm.controls.resourceName.patchValue(this.editData.name);
            if (this.editData.grade.length >= 3) {
                this.gradeSplit = [];
                const grade = this.editData.grade.split(',');
                for (let i = 0; i < grade.length; i++) {
                    this.gradeSplit.push(grade[i]);
                }
            } else {
                this.gradeSplit = [this.editData.grade];
            }
            if (this.editData.subject.length >= 3) {
                this.subjectSplit = [];
                const subject = this.editData.subject.split(',');
                for (let i = 0; i < subject.length; i++) {
                    this.subjectSplit.push(subject[i]);
                }
            } else {
                this.subjectSplit = [this.editData.subject];
            }
            this.assignmentForm.controls.grade.patchValue(this.gradeSplit);
            this.assignmentForm.controls.subject.patchValue(this.subjectSplit);
            this.assignmentForm.controls.description.patchValue(this.editData.description);
            this.assignmentForm.controls.access.patchValue(this.editData.access);
            if (this.editData.tags.length > 1) {
                // const tag = this.editData.tags.split(',');
                for (let i = 0; i < this.editData.tags.length; i++) {
                    // this.getTag[j].display.tag[i];
                    // this.getTag[j].value.tag[i];
                    this.getTag.push({display: this.editData.tags[i], value: this.editData.tags[i]});
                }
            } else {
                this.getTag = [{
                    display: this.assignmentForm.controls.tag.value,
                    value: this.assignmentForm.controls.tag.value
                }];
            }
            console.log(this.getTag, 'taggg');
            this.assignmentForm.controls.tag.patchValue(this.getTag);
            this.pdfpath = this.editData.file_path;
            this.pdflinks = this.editData.links;

            if (this.editData.profile_url != '') {
                this.imagepath = this.editData.profile_url;
            }
            this.imagepaththumb = this.editData.profile_thumb_url;

        } else {
            this.assignmentForm.controls.created.patchValue(this.username);
            this.assignmentForm.controls.resourceName.patchValue('');
            this.assignmentForm.controls.grade.patchValue(null);
            this.assignmentForm.controls.subject.patchValue(null);
            this.assignmentForm.controls.description.patchValue('');
            this.assignmentForm.controls.access.patchValue('');
            this.assignmentForm.controls.tag.patchValue('');
        }
    }

    ngOnInit(): void {
        this.gradeList();
        this.subjectList();
    }

    addlink(): FormGroup {
        return this.formBuilder.group({
            link: ''
        });
    }

    addarray(): void {
        this.repeatlink = this.assignmentForm.get('repeatlink') as FormArray;
        this.repeatlink.push(this.addlink());
    }

    submitlink() {
        let list;
        for (let i = 0; i < this.assignmentForm['controls'].repeatlink.value.length; i++) {
            list = {
                options: this.assignmentForm['controls'].repeatlink['controls'][i]['controls']['link'].value,
            };
            this.pdflinks.push(list.options);
        }
        console.log(this.pdflinks);
    }

    createlink(): FormGroup {
        return this.formBuilder.group({
            addlink: ''
        });
    }

    subjectList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.classService.subjectList(data).subscribe((successData) => {
                this.subjectListSuccess(successData);
            },
            (error) => {
                this.subjectListFailure(error);
            });
    }

    subjectListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;

        }
    }

    subjectListFailure(error) {
        console.log(error, 'error');
    }

    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.classService.gradeList(data).subscribe((successData) => {
                this.gradeListSuccess(successData);
            },
            (error) => {
                this.gradeListFailure(error);
            });
    }

    gradeListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
    }

    gradeListFailure(error) {
        console.log(error, 'error');
    }

    tagList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.common.tagList(data).subscribe((successData) => {
                this.tagListSuccess(successData);
            },
            (error) => {
                this.tagListFailure(error);
            });
    }

    tagListSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.tagData = successData.ResponseObject;
        }
    }

    tagListFailure(error) {
        console.log(error, 'error');
    }

    assign(value) {
        console.log(this.assignmentForm, 'valueee');
        console.log(this.assignmentForm.valid, 'validdd');
        if (this.assignmentForm.valid) {
            this.tagArray = [];
            const tags = this.assignmentForm.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                name: this.assignmentForm.controls.resourceName.value,
                description: this.assignmentForm.controls.description.value,
                grade: this.assignmentForm.controls.grade.value,
                subject: this.assignmentForm.controls.subject.value,
                access: this.assignmentForm.controls.access.value,
                file_path: this.pdfpath,
                tags: this.tagArray,
                profile_url: this.imagepath,
                profile_thumb_url: this.imagepaththumb,
                content_format: '1',
                content_type: '1',
                status: '1',
                answers: [],
                file_text: '',
                links: this.pdflinks,
                annotation: [],
                assign: '0',
                classdetails: [],
                editor_type: ''
            };
            console.log(data, 'dataaaaam');
            if (value != 'edit') {
                this.creator.addAssignResourse(data).subscribe((successData) => {
                        this.assignSuccess(successData);
                    },
                    (error) => {
                        this.assignFailure(error);
                    });
            } else if (value == 'edit') {
                console.log(value, 'valueee');
                data['content_id'] = this.editData.content_id;
                this.creator.editAssignResourse(data).subscribe((successData) => {
                        this.assignSuccess(successData);
                    },
                    (error) => {
                        this.assignFailure(error);
                    });
            }
        } else {
            this.validationService.validateAllFormFields(this.assignmentForm);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    assignSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.assignData = successData.ResponseObject;
            console.log(this.assignData, 'this.assignData');
            // this.router.navigate(['/repository/content-home']);
            this.toastr.success(successData.ResponseObject);
            this.auth.removeSessionData('pdf-links');
            this.auth.removeSessionData('pdf-path');
            this.modalRef = this.modalService.open(this.assignContentToClass, {size: 'md', backdrop: 'static'});
        }
    }

    assignFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject);
    }

    assignContent() {
        this.modalRef.close();
        this.classDetails = JSON.parse(this.auth.getSessionData('card-data'));
        this.modalRef = this.modalService.open(this.assignTemplate, {size: 'lg', backdrop: 'static'});
    }

    draft(value) {
        console.log(this.assignmentForm.controls.tag.value, 'before');
        if (this.assignmentForm.valid) {
            this.tagArray = [];
            const tags = this.assignmentForm.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
            console.log(this.tagArray, 'afterrr');
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                name: this.assignmentForm.controls.resourceName.value,
                description: this.assignmentForm.controls.description.value,
                grade: this.assignmentForm.controls.grade.value,
                subject: this.assignmentForm.controls.subject.value,
                access: this.assignmentForm.controls.access.value,
                file_path: this.pdfpath,
                tags: this.tagArray,
                profile_url: this.imagepath,
                profile_thumb_url: this.imagepaththumb,
                content_format: '1',
                content_type: '1',
                status: '5',
                answers: [],
                file_text: '',
                links: this.pdflinks,
                annotation: [],
                assign: '0',
                classdetails: [],
                editor_type: ''
            };
            if (value != 'edit') {
                this.creator.addDraftResourse(data).subscribe((successData) => {
                        this.draftSuccess(successData);
                    },
                    (error) => {
                        this.draftFailure(error);
                    });
            } else if (value == 'edit') {
                data['content_id'] = this.editData.content_id;
                this.creator.editDraftResourse(data).subscribe((successData) => {
                        this.draftSuccess(successData);
                    },
                    (error) => {
                        this.draftFailure(error);
                    });
            }
        } else {
            this.validationService.validateAllFormFields(this.assignmentForm);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    draftSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.draftData = successData.ResponseObject;
            this.router.navigate(['/repository/content-home']);
            this.toastr.success(successData.ResponseObject);
            this.auth.removeSessionData('pdf-links');
            this.auth.removeSessionData('pdf-path');
        }
    }

    draftFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject);
    }

    encodeImageFileAsURL(event: any) {
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const imgDetails = event.target.files[0];
            console.log(imgDetails, 'IMGDETAILS');
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const url = event.target.result;
                const getUrl = url.split(',');
                console.log(getUrl, 'geturl');
                const pic = imgDetails.type.split('/');
                console.log(pic, 'Type');

                if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] == 'jpg') {
                    this.onUploadKYCFinished(getUrl, imgDetails);
                } else {
                    this.toastr.error('JPEG ,PNG & JPG are the required type');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }
    }

    onUploadKYCFinished(getUrlEdu, imageList) {
        this.recordBase64Url = getUrlEdu[1];
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
            uploadtype: 'teacher'
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
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            console.log(this.imagepath, 'This image');
            this.imagepath = successData.ResponseObject.imagepath[0].original_image_url;
            this.imagepaththumb = successData.ResponseObject.imagepath[0].resized_url;

        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    encodePdfFileAsURL(event: any) {
        let images = [];
        let imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const pdfDetails = event.target.files[i];
            console.log(pdfDetails, 'IMGDETAILS');
            const reader = new FileReader();
            reader.onload = (event: any) => {
                let uploadTypeList = event.target.result.split(',');
                images.push({
                    image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name
                });
                const pic = pdfDetails.type.split('/');
                console.log(pic, 'Type');
                if (pic[1] == 'pdf') {
                    if (imageLength == images.length) {
                        this.onUploadKYCFinishedpdf(images);
                    }
                } else {
                    this.toastr.error('PDF are the required file format');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }

    }

    onUploadKYCFinishedpdf(getUrlEdu) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: 'content'
        };
        console.log(data, 'dataaa');

        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData);
                console.log(successData, 'successData');
            },
            (error) => {
                this.pdfuploadFailure(error);
                console.log(error, 'wrongFormat');
            }
        );
    }

    pdfuploadSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            console.log(this.pdfpath, 'This imagepath');
            this.response = successData.ResponseObject;
            console.log(this.response.imagepath, 'imagge');
            for (let i = 0; i < this.response.imagepath.length; i++) {
                this.pdfpath.push(this.response.imagepath[i].original_image_url);
            }
            console.log(this.pdfpath, 'dtfyyff');
            this.modalRef.close('Content');
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    pdfuploadFailure(error) {
        console.log(error, 'error');
    }

    uploadFailure(error) {
        console.log(error, 'error');
    }

    onsave() {
        this.modalRef.close();
    }

    deleteImg() {
        this.imagepath = '';
        this.clearUploadfilename();
    }

    deletePdf(id) {
        this.pdfpath.splice(id, 1);
        console.log(this.pdfpath, 'pdfpath');
    }

    deleteLink(id) {
        this.pdflinks.splice(id, 1);
        console.log(this.pdflinks, 'pdfpath');
    }

    clearUploadfilename() {
        console.log(this.myInputVariable.nativeElement.files);
        this.myInputVariable.nativeElement.value = '';
        console.log(this.myInputVariable.nativeElement.files);
    }

    showModal() {
        this.modalRef = this.modalService.open(this.Content, {size: 'md', backdrop: 'static'});
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    closeAssignPopUp() {
        this.auth.removeSessionData('rista-assignedForm');
        this.modalRef.close();
    }

    dontAssign() {
        this.modalRef.close();
        if (this.auth.getSessionData('rista-assignedForm') == 'class') {
            this.router.navigate(['class/topicsAndCurriculum/1']);
        } else if (this.auth.getSessionData('rista-assignedForm') == 'content-Folder') {
            this.router.navigate(['class/view-assign/2']);
        } else {
            this.router.navigate(['repository/content-home']);
        }
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('rista-assignedForm');
    }
}
