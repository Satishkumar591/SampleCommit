import {Component, Injectable, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {CreatorService} from '../../../shared/service/creator.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {dateOptions} from '../../../shared/data/config';
import {
    TreeviewItem, TreeviewConfig, TreeviewHelper, TreeviewComponent, DefaultTreeviewI18n,
    TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewI18n, TreeviewSelection
} from 'ngx-treeview';
import {ClassroomService} from 'src/app/shared/service/classroom.service';
import {TreeviewContentfolderComponent} from '../../auth/treeview-contentfolder/treeview-contentfolder.component';

@Injectable()
export class ProductTreeviewConfig extends TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = true;
    hasCollapseExpand = false;
    maxHeight = 400;
}

@Component({
    selector: 'app-add-resources',
    templateUrl: './add-resources.component.html',
    styleUrls: ['./add-resources.component.scss'],
    providers: [
        {provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser},
        {provide: TreeviewConfig, useClass: ProductTreeviewConfig}
    ]
})
export class AddResourcesComponent implements OnInit {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        // other options are here...
    };
    public resourceform: FormGroup;
    public branchForm: FormGroup;
    public type: any;
    public draftType: any;
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
    public pdfName: any;
    public answerpdfpath: any = [];
    public pdfTemplate: any;
    public response: any;
    public resourceArray = [];
    public roleid: any;
    public getTag: any = [];
    public tagArray: any = [];
    public getNewlinks: any = [];
    public allowSelect: boolean;
    public contentName: boolean;
    public classDetails: any = [];
    public contentCreatedForm = '';
    public items: any;
    rows: string[];
    public branchListData: any;
    public addItemsData: any;
    public batchid = [];
    public showPage = false;
    value = 11;
    configTree = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
    });
    public buttonClass = 'treeview-button';
    public isEditLink = false;
    public linksType = ['video', 'audio', 'document', 'ppt', 'Others'];

    @ViewChild(TreeviewComponent, {static: false}) treeviewComponent: TreeviewComponent;
    @ViewChild('linkArray') addLink: TemplateRef<any>;
    @ViewChild('myInput') myInputVariable: ElementRef<any>;
    @ViewChild('pdf') Content: ElementRef<any>;
    @ViewChild('viewPdf') viewPdf: TemplateRef<any>;
    @ViewChild('attachments') attachment: any;
    @ViewChild('attachments1') attachment1: any;
    @ViewChild('uploadPdf') uploadPdf: TemplateRef<any>;
    @ViewChild('assignContentToClass') assignContentToClass: TemplateRef<any>;
    @ViewChild('assignTemplate') assignTemplate: TemplateRef<any>;
    @ViewChild('addBranch') addBranchTemp: TemplateRef<any>;
    @ViewChild(TreeviewContentfolderComponent, {static: false}) treeviewCompoent: TreeviewContentfolderComponent;
    @ViewChild(TreeviewComponent, {static: false}) child: TreeviewComponent;


    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public classService: ClassService, public creator: CreatorService,
                public commondata: CommonDataService, private toastr: ToastrService, public common: CommonService,
                public auth: AuthService, public brandservices: SchoolService, public sanitizer: DomSanitizer,
                public router: Router, public validationService: ValidationService, public config: ConfigurationService,
                public modalService: NgbModal, public datePipe: DatePipe, public newSubject: NewsubjectService,
                public branchService: ClassroomService) {
        this.draftType = 'update';
        this.webhost = this.config.getimgUrl();
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.username = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        this.pdfpath = [];
        this.answerpdfpath = [];
        this.pdfpaththumb = [];
        this.getpdfpath = JSON.parse(this.auth.getSessionData('pdf'));
        this.getlinks = JSON.parse(this.auth.getSessionData('links'));
        this.getpdfpaththumb = this.auth.getSessionData('pdf_path_thumb');
        this.contentCreatedForm = this.auth.getSessionData('rista-assignedForm');
        if (this.getpdfpath != null) {
            for (let i = 0; i < this.getpdfpath.length; i++) {
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
        this.route.params.forEach((params) => {
            this.type = params.type;
        });
        this.resourceform = this.formBuilder.group({
            created: [''],
            resourceName: ['', Validators.required],
            grade: ['', Validators.required],
            subject: ['', Validators.required],
            description: '',
            resourcesLink: '',
            tag: '',
            access: ['1', Validators.required],
            downloadContent: '',
            repeatlink: this.formBuilder.array([this.addlink()]),
        });
        this.branchForm = this.formBuilder.group({
            batchname: ['', Validators.required]
        });
        if (this.type == 'edit') {
            const detail = JSON.parse(this.auth.getSessionData('rista-editor'));
            this.listDetails(detail);
        } else {
            this.showPage = true;
            this.resourceform.controls.created.patchValue(this.username);
            this.resourceform.controls.resourceName.patchValue('');
            this.resourceform.controls.grade.patchValue(null);
            this.resourceform.controls.subject.patchValue(null);
            this.resourceform.controls.description.patchValue('');
            this.resourceform.controls.resourcesLink.patchValue('');
            this.resourceform.controls.access.patchValue('');
            this.resourceform.controls.tag.patchValue('');
        }
    }

    ngOnInit(): void {
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.gradeList();
        this.subjectList();
    }

    filterEmptyArrayValue() {
        this.resourceArray = this.resourceArray.filter((item) => item.link !== '');
        this.resourceArray.forEach((list) => {
            list.link = list.link.includes('http') ? list.link : 'https://' + list.link;
        });
    }

    deleteArray(index) {
        this.resourceArray.splice(index, 1);
    }

    addLinkArray() {
        this.isEditLink = true;
        this.resourceArray.push({
            type: 'document',
            name: '',
            link: ''
        });
        console.log(this.resourceArray, 'resource');
    }

    listDetails(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: event.school_id
        };
        this.creator.repositoryDetail(data).subscribe((successData) => {
                this.detailsSuccess(successData);
            },
            (error) => {
                this.detailsFailure(error);
            });
    }

    detailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.editData = successData.ResponseObject;
            console.log(this.editData, 'editData');

            if (this.editData.details == 'Draft') {
                this.draftType = 'publish';
            }
            this.gradeId = this.editData.grade_id;
            this.contentName = this.editData.name;
            this.resourceform.controls.created.patchValue(this.editData.created_by);
            this.resourceform.controls.resourceName.patchValue(this.editData.name);
            if (this.editData.tags != '') {
                const tag = this.editData.tags.split(',');
                for (let i = 0; i < tag.length; i++) {
                    this.getTag.push({display: tag[i], value: tag[i]});
                }
            }
            if (this.editData.grade != '') {
                this.gradeSplit = [];
                const grade = this.editData.grade.split(',');
                for (let i = 0; i < grade.length; i++) {
                    this.gradeSplit.push(grade[i]);
                }
            }
            if (this.editData.subject != '') {
                this.subjectSplit = [];
                const subject = this.editData.subject.split(',');
                for (let i = 0; i < subject.length; i++) {
                    this.subjectSplit.push(subject[i]);
                }
            }
            if (this.editData.links != '') {
                const links = this.editData.links;
                for (let i = 0; i < links.length; i++) {
                    this.getNewlinks.push({display: links[i], value: links[i]});
                }
            }
            this.resourceform.controls.resourcesLink.patchValue(this.getNewlinks);

            if (this.editData.download == '1') {
                this.resourceform.controls.downloadContent.patchValue(true);
            } else if (this.editData.download == '0') {
                this.resourceform.controls.downloadContent.patchValue(false);
            }
            this.resourceform.controls.grade.patchValue(this.gradeSplit);
            this.resourceform.controls.subject.patchValue(this.subjectSplit);
            this.resourceform.controls.description.patchValue(this.editData.description);
            this.resourceform.controls.access.patchValue(this.editData.access);
            this.resourceform.controls.tag.patchValue(this.getTag);
            this.pdfpath = this.editData.file_path != '' ? this.common.convertBase64(this.editData.file_path) : [];
            this.resourceArray = this.pdfpath[0].links ? this.pdfpath[0].links : [];
            console.log(this.pdfpath, 'pafPath');
            // this.answerpdfpath = this.editData.answerKey_path != '' ? this.common.convertBase64(this.editData.answerKey_path) : [];
            this.pdflinks = this.editData.file_path;
            if (this.editData.profile_url != '') {
                this.imagepath = this.editData.profile_url;
                this.imagepaththumb = this.editData.profile_thumb_url;
            }
            this.showPage = true;
        }
    }

    detailsFailure(error) {
        console.log(error);
    }

    addlink(): FormGroup {
        return this.formBuilder.group({
            link: ''
        });
    }

    addarray(): void {
        this.repeatlink = this.resourceform.get('repeatlink') as FormArray;
        this.repeatlink.push(this.addlink());
    }

    submitlink() {
        let list;
        for (let i = 0; i < this.resourceform['controls'].repeatlink.value.length; i++) {
            list = {
                options: this.resourceform['controls'].repeatlink['controls'][i]['controls']['link'].value,
            };
            if (list.options != '') {
                this.pdflinks.push(list.options);
            }
        }
        this.modalRef.close();
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
            type: 'active'
        };
        this.classService.subjectList(data).subscribe((successData) => {
                this.subjectListSuccess(successData);
            },
            (error) => {
                this.subjectListFailure(error);
            });
    }

    subjectListSuccess(successData) {
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
            type: 'active'
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
        if (successData.IsSuccess) {
            this.tagData = successData.ResponseObject;
        }
    }

    tagListFailure(error) {
        console.log(error, 'error');
    }

    assign(value) {
        console.log(this.treeviewCompoent, 'treeviewCompoent');
        const batchId = this.treeviewCompoent.batchid;

        if (this.resourceform.valid) {
            if (this.pdfpath != '' && this.pdfpath != 0) {
                this.tagArray = [];
                const tags = this.resourceform.controls.tag.value;
                for (let i = 0; i < tags.length; i++) {
                    this.tagArray.push(tags[i].value);
                }

                const updatedResourceLink = this.resourceArray.filter((item) => item.link != '');

                let nameNotEntered = false;
                updatedResourceLink.every((items) => {
                    if (items.name == '') {
                        nameNotEntered = true;
                        return false;
                    }
                    return true;
                });

                if (!nameNotEntered) {
                    this.pdfpath[0].links = updatedResourceLink;
                    const data = {
                        platform: 'web',
                        role_id: this.auth.getSessionData('rista-roleid'),
                        user_id: this.auth.getSessionData('rista-userid'),
                        school_id: this.auth.getSessionData('rista-school_id'),
                        name: this.resourceform.controls.resourceName.value,
                        description: this.resourceform.controls.description.value,
                        grade: this.resourceform.controls.grade.value,
                        subject: this.resourceform.controls.subject.value,
                        access: this.resourceform.controls.access.value,
                        file_path: this.pdfpath,
                        tags: this.tagArray,
                        profile_url: this.imagepath,
                        profile_thumb_url: this.imagepaththumb,
                        content_format: this.pdfpath != null ? '1' : '2',
                        content_type: '1',
                        status: '1',
                        answers: [],
                        file_text: '',
                        links: this.resourceArray,
                        annotation: [],
                        assign: '0',
                        classdetails: [],
                        editor_type: '',
                        corporate_id: this.roleid == 6 ? this.auth.getSessionData('rista-corporate_id') : undefined,
                        download: this.resourceform.controls.downloadContent.value == true ? '1' : '0',
                        batch_id: batchId
                    };
                    if (value != 'edit') {
                        this.creator.addAssignResourse(data).subscribe((successData) => {
                                this.assignSuccess(successData);
                            },
                            (error) => {
                                this.assignFailure(error);
                            });
                    } else if (value == 'edit') {
                        data['content_id'] = this.editData.content_id;
                        this.creator.editAssignResourse(data).subscribe((successData) => {
                                this.assignSuccess(successData);
                            },
                            (error) => {
                                this.assignFailure(error);
                            });
                    }
                } else {
                    this.toastr.error('Name is mandatory for each additional resource links');
                }
            } else {
                this.toastr.error('Please Upload Pdf to add resource', 'Resource');
            }
        } else {
            this.validationService.validateAllFormFields(this.resourceform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    assignSuccess(successData) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.assignData = successData.Contentdetails;
            // const assignedForm = this.auth.getSessionData('rista-assignedForm');

            this.toastr.success(successData.ResponseObject);
            this.auth.removeSessionData('links');
            this.auth.removeSessionData('pdf');
            this.auth.removeSessionData('editresources');
            this.modalRef = this.modalService.open(this.assignContentToClass, {size: 'md', backdrop: 'static'});
        } else if (!successData.IsSuccess) {
            this.toastr.error(successData.ResponseObject);
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
        console.log(this.treeviewCompoent, 'treeviewCompoent');
        const batchId = this.treeviewCompoent.batchid;

        if (this.resourceform.valid) {
            if (this.pdfpath != '' && this.pdfpath != 0) {
                this.tagArray = [];
                const tags = this.resourceform.controls.tag.value;
                for (let i = 0; i < tags.length; i++) {
                    this.tagArray.push(tags[i].value);
                }

                if (this.resourceArray.length != 0) {
                    this.pdfpath[0].links = this.resourceArray;
                } else {
                    this.pdfpath[0].links = [];
                }
                this.pdfpath[0].links = this.pdfpath[0]?.links.filter((item) => item.link !== '');

                let nameNotEntered = false;
                this.pdfpath[0]?.links.every((items) => {
                    if (items.name == '') {
                        nameNotEntered = true;
                        return false;
                    }
                    return true;
                });

                if (!nameNotEntered) {
                    const data = {
                        platform: 'web',
                        role_id: this.auth.getSessionData('rista-roleid'),
                        user_id: this.auth.getSessionData('rista-userid'),
                        school_id: this.auth.getSessionData('rista-school_id'),
                        name: this.resourceform.controls.resourceName.value,
                        description: this.resourceform.controls.description.value,
                        grade: this.resourceform.controls.grade.value,
                        subject: this.resourceform.controls.subject.value,
                        access: this.resourceform.controls.access.value,
                        file_path: this.pdfpath,
                        tags: this.tagArray,
                        profile_url: this.imagepath,
                        profile_thumb_url: this.imagepaththumb,
                        content_format: this.pdfpath != null ? '1' : '2',
                        content_type: '1',
                        status: '5',
                        answers: [],
                        file_text: '',
                        links: this.resourceform.controls.resourcesLink.value != '' ? this.resourceArray : [],
                        annotation: [],
                        assign: '0',
                        classdetails: [],
                        editor_type: '',
                        corporate_id: this.roleid == 6 ? this.auth.getSessionData('rista-corporate_id') : undefined,
                        batch_id: batchId

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
                        this.toastr.error('Name is mandatory for each additional resource links');
                    }
                } else {
                    this.toastr.error('Please Upload Pdf to add resource', 'Resource');
            }
        } else {
            this.validationService.validateAllFormFields(this.resourceform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    draftSuccess(successData) {
        if (successData.IsSuccess) {
            this.draftData = successData.ResponseObject;
            this.router.navigate(['/repository/content-home']);
            this.toastr.success(successData.ResponseObject);
            this.auth.removeSessionData('links');
            this.auth.removeSessionData('pdf');
            this.auth.removeSessionData('editresources');
        } else if (!successData.IsSuccess) {
            this.toastr.error(successData.ResponseObject);
        }
    }

    draftFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject);
    }

    pdfUpload() {
        this.modalRef = this.modalService.open(this.uploadPdf, {size: 'md'});
    }

    encodeImageFileAsURL(event: any) {
        event.target.files = null;
        for (let i = 0; i < event.target.files.length; i++) {
            const imgDetails = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const url = event.target.result;
                const getUrl = url.split(',');
                const pic = imgDetails.type.split('/');

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
            uploadtype: 'profile'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.uploadSuccess(successData);
            },
            (error) => {
                console.log(error, 'error');
            }
        );
    }

    uploadSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.imagepath = successData.ResponseObject.imagepath[0].original_image_url;
            this.imagepaththumb = successData.ResponseObject.imagepath[0].resized_url;
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    encodePdfFileAsURL(event: any, type) {
        let images = [];
        const imageLength = event.target.files.length;
        for (let i = 0; i < event.target.files.length; i++) {
            const pdfDetails = event.target.files[i];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const uploadTypeList = event.target.result.split(',');
                images.push({
                    image: uploadTypeList[1],
                    size: pdfDetails.size,
                    type: pdfDetails.type,
                    name: pdfDetails.name
                });
                const pic = pdfDetails.type.split('/');
                if (pic[1] == 'pdf') {
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

    onUploadKYCFinishedpdf(getUrlEdu, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: getUrlEdu,
            uploadtype: 'content'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.pdfuploadSuccess(successData, type);
            },
            (error) => {
                console.log(error, 'error');
            }
        );
    }

    pdfuploadSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.response = successData.ResponseObject;
            this.pdfpath = [];
            for (let i = 0; i < this.response.imagepath.length; i++) {
                this.pdfpath.push(this.response.imagepath[i]);
            }
            this.modalRef.close('Content');
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    onsave() {
        this.modalRef.close();
    }

    deleteImg() {
        this.imagepath = '';
        this.clearUploadfilename();
    }

    deletePdf(id, type) {
        this.pdfpath.splice(id, 1);
        this.pdflinks = [];
        this.attachment.nativeElement.value = '';
    }

    clearUploadfilename() {
        this.myInputVariable.nativeElement.value = '';
    }

    uploadlink() {
        this.modalRef.close('Content');
        this.modalRef = this.modalService.open(this.addLink, {size: 'md', backdrop: 'static'});
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    viewDetail(value) {
        this.pdfName = value.image;
        this.pdfTemplate = this.webhost + '/' + value.original_image_url;
        this.modalRef = this.modalService.open(this.viewPdf, {size: 'xl'});
    }

    close() {
        this.modalRef.close();
    }

    closeAssignPopUp() {
        this.auth.removeSessionData('rista-assignedForm');
        this.modalRef.close();
    }

    dontAssign() {
        this.close();
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
