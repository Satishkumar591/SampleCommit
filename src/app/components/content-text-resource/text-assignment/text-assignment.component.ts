import {Component, Injectable, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CreatorService} from '../../../shared/service/creator.service';
import {AuthService} from '../../../shared/service/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {CommonService} from '../../../shared/service/common.service';
import {ClassService} from '../../../shared/service/class.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as inlineEditor from '../../../../assets/ckeditor5/build/ckeditor.js';
import {parse, stringify} from 'flatted';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {
    TreeviewConfig, TreeviewComponent,
    TreeviewEventParser, OrderDownlineTreeviewEventParser
} from 'ngx-treeview';
import { TreeviewContentfolderComponent } from '../../auth/treeview-contentfolder/treeview-contentfolder.component';
@Injectable()
export class ProductTreeviewConfig extends TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = true;
    hasCollapseExpand = false;
    maxHeight = 400;
}
@Component({
    selector: 'app-text-assignment',
    templateUrl: './text-assignment.component.html',
    styleUrls: ['./text-assignment.component.scss'],
    providers: [
        {provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser},
        {provide: TreeviewConfig, useClass: ProductTreeviewConfig}
    ]
})
export class TextAssignmentComponent implements OnInit {
    public assignmentform: FormGroup;
    public contentForm: FormGroup;
    public showPage = false;
    public type: any;
    public assignData: any;
    public assignDataValue: any;
    public editData: any;
    public draftData: any;
    public webhost: any;
    public imagepath: any;
    public recordBase64Url: any;
    public imagepaththumb: any;
    public gradeData: any;
    public subjectData: any;
    public graphValue: any;
    public tagArray: any;
    public username: any;
    public gradeId: any;
    public gradeSplit: any;
    public subjectSplit: any;
    public content: any;
    public editorVal: any = '';
    public textType: any;
    public getTag: any = [];
    public openContent: boolean;
    public showPreview: boolean = true;
    public editDataContent: any;
    public detailData: any = '';
    public answerIndex: any;
    public sortIndex: any;
    public fullData: any;
    public quesId: any;
    public answerGraph: any;
    public contextValue: any;
    public resourceArray: any = [];
    public getNewlinks: any = [];
    public roleid: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public Editor = inlineEditor;
    public allowChange: boolean;
    public contentName: any;
    public mathDelayer = false;
    public passsageQuestion: any;
    public classDetails: any = [];
    public contentCreatedForm = '';
    public viewEdit: any;
    public batchId = [];
    public isEditLink = false;
    public linksType = ['video', 'audio', 'document', 'ppt', 'Others'];

    @ViewChild('myInput') myInputVariable: ElementRef<any>;
    @ViewChild('multiChoiceDetail') multiChoiceDetail: TemplateRef<any>;
    @ViewChild('matchTableDetail') matchTableDetail: TemplateRef<any>;
    @ViewChild('dropDownDetail') dropDownDetail: TemplateRef<any>;
    @ViewChild('text') textDetail: TemplateRef<any>;
    @ViewChild('highlight') highlightDetail: TemplateRef<any>;
    @ViewChild('matchOrder') matchOrderDetail: TemplateRef<any>;
    @ViewChild('deleteQuestion') deleteQuestion: TemplateRef<any>;
    @ViewChild('passage') passage: TemplateRef<any>;
    @ViewChild('graphDetail') graphDetail: TemplateRef<any>;
    @ViewChild('assignContentToClass') assignContentToClass: TemplateRef<any>;
    @ViewChild('assignTemplate') assignTemplate: TemplateRef<any>;
    @ViewChild(TreeviewComponent, {static: false}) treeviewComponent: TreeviewComponent;
    @ViewChild(TreeviewContentfolderComponent, {static: false}) treeviewCompoent: TreeviewContentfolderComponent;
    @ViewChild(TreeviewComponent, {static: false}) child: TreeviewComponent;
    @ViewChild('addBranch') addBranchTemp: TemplateRef<any>;
    editorConfig: any = {
        toolbar: {
            items: [
                "blockQuote", "bold", "imageTextAlternative", "link", "ckfinder", "selectAll", "undo", "redo", "heading", "imageStyle:full", "imageStyle:side", "uploadImage", "imageUpload", "indent", "outdent", "italic", "numberedList", "bulletedList", "MathType", "ChemType", "mediaEmbed", "specialCharacters", "insertTable", "tableColumn", "tableRow", "mergeTableCells"
            ]
        },
        image: {
            toolbar: [
                'imageStyle:full',
                'imageStyle:side',
                '|',
                'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        // This value must be kept in sync with the language defined in webpack.config.js.
        language: 'en'
    };

    constructor(public commondata: CommonDataService, public router: Router, public route: ActivatedRoute, public creator: CreatorService, public auth: AuthService,
                private formBuilder: FormBuilder, private toastr: ToastrService, public sanitizer: DomSanitizer, public newSubject: NewsubjectService,
                public config: ConfigurationService, public common: CommonService, public classService: ClassService, public validationService: ValidationService, private modalService: NgbModal) {
        this.webhost = this.config.getimgUrl();
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.username = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        this.textType = this.auth.getSessionData('rista-textType');
        this.openContent = false;
        this.route.params.forEach((params) => {
            this.type = params.type;
        });
        this.assignmentform = this.formBuilder.group({
            created: ['', Validators.required],
            resourceName: ['', Validators.required],
            grade: ['', Validators.required],
            subject: ['', Validators.required],
            description: '',
            tag: '',
            access: ['1', Validators.required],
        });
        this.allowChange = true;
        this.newSubject.allowSchoolChange(this.allowChange);
        if (this.type == 'edit') {
            const data = JSON.parse(this.auth.getSessionData('rista-editor'));
            this.listDetails(data);
        } else if (this.type == 'qEdit') {
            this.showPage = true;
            this.editData = JSON.parse(this.auth.getSessionData('rista-textAssignValue'));
            this.contentName = this.editData.name;
            this.type = 'edit';
            this.openContent = true;
            this.gradeId = this.editData.grade_id;
            this.assignmentform.controls.created.patchValue(this.editData.created_by);
            this.batchId = this.editData.batch_id;
            this.assignmentform.controls.resourceName.patchValue(this.editData.name);
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
            this.assignmentform.controls.grade.patchValue(this.gradeSplit);
            this.assignmentform.controls.subject.patchValue(this.subjectSplit);
            this.assignmentform.controls.description.patchValue(this.editData.description);
            this.assignmentform.controls.access.patchValue(this.editData.access);
            if (this.editData.tags != null) {
                for (let i = 0; i < this.editData.tags.length; i++) {
                    this.getTag.push({display: this.editData.tags[i], value: this.editData.tags[i]});
                }
            }
            this.assignmentform.controls.tag.patchValue(this.getTag);

            if (this.editData.profile_url != '') {
                this.imagepath = this.editData.profile_url;
            }
            this.imagepaththumb = this.editData.profile_thumb_url;
            this.listDetails(this.editData);
        } else {
            this.showPage = true;
            this.assignmentform.controls.created.patchValue(this.username);
            this.assignmentform.controls.resourceName.patchValue('');
            this.assignmentform.controls.grade.patchValue(null);
            this.assignmentform.controls.subject.patchValue(null);
            this.assignmentform.controls.description.patchValue('');
            this.batchId = [];
            this.resourceArray = [];
            this.assignmentform.controls.access.patchValue(this.auth.getRoleId() == '6' ? '4': '1');
            this.assignmentform.controls.tag.patchValue('');
        }
        this.contentCreatedForm = this.auth.getSessionData('rista-assignedForm');
    }

    ngOnInit(): void {
        this.commondata.showLoader(false);
        this.gradeList();
        this.subjectList();
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
                console.error(error, 'error');
            });
    }

    gradeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
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
                console.log(error, 'error_Subject');
            });
    }

    subjectListSuccess(successData) {
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;
        }
    }

    encodeImageFileAsURL(event: any) {
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
            uploadtype: 'teacher'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.uploadSuccess(successData);
            },
            (error) => {
                console.log(error, 'wrongFormat');
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

    addLink() {
        this.isEditLink = true;
        this.resourceArray.push({
            type: 'document',
            name: '',
            link: ''
        });
        console.log(this.resourceArray, 'resource');
    }

    filterEmptyArrayValue() {
        this.resourceArray = this.resourceArray.filter((item) => item.link !== '' && item.name !== '');
        this.resourceArray.forEach((list) => {
            list.link = list.link.includes('http') ? list.link : 'https://' + list.link;
        });
    }

    deleteArray(index) {
        this.resourceArray.splice(index, 1);
    }

    assign(value) {
        if (this.assignmentform.valid) {
            this.editorVal = this.content?.content;
            this.tagArray = [];
            const tags = this.assignmentform.controls.tag.value;
            console.log(tags, 'tags');
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
            const filteredResourceLink = this.resourceArray.filter((item) => item.link !== '');

            let nameNotEntered = false;
            filteredResourceLink.every((items) => {
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
                    name: this.assignmentform.controls.resourceName.value,
                    description: this.assignmentform.controls.description.value,
                    grade: this.assignmentform.controls.grade.value,
                    subject: this.assignmentform.controls.subject.value,
                    access: this.assignmentform.controls.access.value,
                    file_path: [],
                    tags: this.tagArray,
                    profile_url: this.imagepath,
                    profile_thumb_url: this.imagepaththumb,
                    content_format: '3',
                    content_type: this.textType == 'assignment' ? '2' : '3',
                    status: '1',
                    answers: [],
                    file_text: this.editorVal ? this.editorVal : '',
                    links: filteredResourceLink,
                    annotation: [],
                    assign: '0',
                    classdetails: [],
                    editor_type: '',
                    corporate_id: this.roleid == 6 ? this.auth.getSessionData('rista-corporate_id') : undefined,
                    batch_id: this.viewEdit
                };
                if (value == 'add') {
                    const editData = JSON.parse(this.auth.getSessionData('editresources'));
                    data['content_id'] = editData.content_id;
                    this.creator.editAssignResourse(data).subscribe((successData) => {
                            this.assignSuccess(successData);
                        },
                        (error) => {
                            console.log(error, 'error_assign');
                        });
                } else if (value == 'edit') {
                    data['content_id'] = this.editData.content_id;
                    this.creator.editAssignResourse(data).subscribe((successData) => {
                            this.assignSuccess(successData);
                        },
                        (error) => {
                            console.log(error, 'error_assign');
                        });
                }
            } else {
                this.toastr.error('Name is mandatory for each additional resource links');
            }
        } else {
            this.validationService.validateAllFormFields(this.assignmentform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    assignSuccess(successData) {
        if (successData.IsSuccess) {
            this.assignData = successData.Contentdetails;
            console.log(this.assignData, 'assign');
            this.modalRef = this.modalService.open(this.assignContentToClass, {size: 'md', backdrop: 'static'});
            this.toastr.success('Content added successfully');
            this.auth.removeSessionData('editresources');
        } else {
            this.toastr.error(successData.ResponseObject);
        }
    }

    draft(value) {
        const batchId = this.viewEdit;
        let corporate: any;
        if (this.roleid == 6) {
            corporate = this.auth.getSessionData('rista-corporate_id');
        } else {
            corporate = undefined;
        }
        if (this.assignmentform.valid) {
            this.editorVal = this.content?.content;
            this.tagArray = [];
            const tags = this.assignmentform.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
            console.log(tags, 'tags');
            const filteredResourceLink = this.resourceArray.filter((item) => item.link !== '' && item.name !== '');

            let nameNotEntered = false;
            filteredResourceLink.every((items) => {
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
                    name: this.assignmentform.controls.resourceName.value,
                    description: this.assignmentform.controls.description.value,
                    grade: this.assignmentform.controls.grade.value,
                    subject: this.assignmentform.controls.subject.value,
                    access: this.assignmentform.controls.access.value,
                    file_path: [],
                    tags: this.tagArray,
                    profile_url: this.imagepath,
                    profile_thumb_url: this.imagepaththumb,
                    content_format: '3',
                    content_type: this.textType == 'assignment' ? '2' : '3',
                    status: '5',
                    answers: [],
                    file_text: this.editorVal ? this.editorVal : '',
                    links: filteredResourceLink,
                    annotation: [],
                    assign: '0',
                    classdetails: [],
                    editor_type: '',
                    corporate_id: corporate,
                    batch_id: batchId
                };
                if (value != 'edit') {
                    const editData = JSON.parse(this.auth.getSessionData('editresources'));
                    data['content_id'] = editData.content_id;
                    this.creator.editDraftResourse(data).subscribe((successData) => {
                            this.draftSuccess(successData);
                        },
                        (error) => {
                            console.log(error, 'error_draft');
                        });
                } else if (value == 'edit') {
                    data['content_id'] = this.editData.content_id;
                    this.creator.editDraftResourse(data).subscribe((successData) => {
                            this.draftSuccess(successData);
                        },
                        (error) => {
                            console.log(error, 'error_draft');
                        });
                }
            } else {
                this.toastr.error('Name is mandatory for each additional resource links');
            }
        } else {
            this.validationService.validateAllFormFields(this.assignmentform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    draftSuccess(successData) {
        if (successData.IsSuccess) {
            this.draftData = successData.ResponseObject;
            this.router.navigate(['/repository/content-home']);
            this.toastr.success('Draft Added');
            this.auth.removeSessionData('editresources');
        }
    }

    saveAndExit() {
        const getDetails = JSON.parse(this.auth.getSessionData('editresources'));
        this.viewEdit = this.treeviewCompoent.batchid;
        console.log(this.viewEdit, 'view');
        console.log(getDetails, 'dasda');
        if (getDetails.status == '1') {
            this.assign('edit');
        } else if (getDetails.status == '5') {
            this.draft('edit');
        }
    }

    assignNext(type, buttonClickedFrom) {
        this.viewEdit = buttonClickedFrom == 'nextButton' ? this.treeviewCompoent.batchid : this.editData.batch_id;
        let corporates: any;
        if (this.roleid == 6) {
            corporates = this.auth.getSessionData('rista-corporate_id');
        } else {
            corporates = undefined;
        }
        if (this.assignmentform.valid) {
            if (buttonClickedFrom != 'nextButton') {
                this.editorVal =  this.content?.content;
            }
            this.tagArray = [];
            const tags = this.assignmentform.controls.tag.value;
            for (let i = 0; i < tags.length; i++) {
                this.tagArray.push(tags[i].value);
            }
            const filteredResourceLink = this.resourceArray.filter((item) => item.link !== '');

            let nameNotEntered = false;
            filteredResourceLink.every((items) => {
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
                    name: this.assignmentform.controls.resourceName.value,
                    description: this.assignmentform.controls.description.value,
                    grade: this.assignmentform.controls.grade.value,
                    subject: this.assignmentform.controls.subject.value,
                    access: this.assignmentform.controls.access.value,
                    file_path: [],
                    tags: this.tagArray,
                    profile_url: this.imagepath,
                    profile_thumb_url: this.imagepaththumb,
                    content_format: '3',
                    content_type: this.textType == 'assignment' ? '2' : '3',
                    status: '1',
                    answers: [],
                    file_text: this.editorVal ? this.editorVal : '',
                    links: filteredResourceLink,
                    annotation: [],
                    assign: '0',
                    classdetails: [],
                    editor_type: '',
                    corporate_id: corporates,
                    batch_id: this.viewEdit
                };
                if (type != 'edit') {
                    this.creator.addAssignResourse(data).subscribe((successData) => {
                            this.assignNextSuccess(successData, buttonClickedFrom);
                        },
                        (error) => {
                            console.error(error, 'assign_Error');
                        });
                } else if (type == 'edit') {
                    data['content_id'] = this.editData.content_id;
                    this.creator.editAssignResourse(data).subscribe((successData) => {
                            this.assignNextSuccess(successData, buttonClickedFrom);
                        },
                        (error) => {
                            console.error(error, 'assign_Error');
                        });
                }
            } else {
                this.toastr.error('Name is mandatory for each additional resource links');
            }
        } else {
            this.validationService.validateAllFormFields(this.assignmentform);
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    assignNextSuccess(successData, buttonClickedFrom) {
        if (successData.IsSuccess) {
            this.assignDataValue = successData.Contentdetails;
            console.log(this.assignDataValue, 'this.assignDataValue');
            if (buttonClickedFrom == 'backButton') {
                this.back();
            } else if (buttonClickedFrom == 'nextButton') {
                this.openContent = true;
                this.auth.setSessionData('rista-textAssignValue', JSON.stringify(this.assignDataValue));
                this.auth.setSessionData('editresources', JSON.stringify(this.assignDataValue));
                this.listDetails(this.assignDataValue);
            } else if (buttonClickedFrom == 'addQuestion') {
                this.selectQuestion();
            }
            this.showpre();
        } else {
            this.toastr.error(successData.ResponseObject);
        }

    }

    back() {
        this.router.navigate(['content-text-resource/text-assignment/edit']);
        this.editData = JSON.parse(this.auth.getSessionData('editresources'));
        this.editorVal = this.content?.content;
        this.openContent = false;
    }

    clickEvent() {
        if (!this.mathDelayer) {
            this.mathDelayer = true;
            setTimeout(() => {
                document.getElementById('myDiv').click();
            }, 1000);
        }
        setTimeout(() => {
            this.mathDelayer = false;
        }, 1500);
    }

    selectQuestion() {
        this.editorVal = this.content?.content;
        this.auth.setSessionData('rista-textAssignContent', JSON.stringify(this.editorVal));
        this.router.navigate(['content-text-resource/add-questions/add']);
    }

    listDetails(val) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: val.content_id,
            content_format: '3',
            content_type: val.content_type,
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.creator.repositoryDetail(data).subscribe((successData) => {
                this.detailsSuccess(successData);
            },
            (error) => {
                console.log(error, 'error_contentDetails');
            });
    }

    detailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.editData = successData.ResponseObject;
            this.detailData = successData.ResponseObject.questions;
            this.showPage = true;
            if (this.type == 'edit') {
                this.batchId = this.editData.batch_id;
                this.contentName = this.editData.name;
                this.gradeId = this.editData.grade_id;
                this.assignmentform.controls.created.patchValue(this.editData.created_by);
                this.assignmentform.controls.resourceName.patchValue(this.editData.name);
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
                this.assignmentform.controls.grade.patchValue(this.gradeSplit);
                this.assignmentform.controls.subject.patchValue(this.subjectSplit);
                this.assignmentform.controls.description.patchValue(this.editData.description);
                this.assignmentform.controls.access.patchValue(this.editData.access);
                if (this.editData.file_text != '') {
                    this.editorVal = this.editData.file_text;
                }
                console.log(this.editorVal, 'dasdass');
                if (this.editData.tags != null && this.editData.tags != '') {
                    this.getTag = [];
                    const tagValue = this.editData.tags.split(',');
                    for (let i = 0; i < tagValue.length; i++) {
                        this.getTag.push({display: tagValue[i], value: tagValue[i]});
                    }
                } else {
                    this.getTag = [];
                }
                console.log(this.getTag, 'getTag');
                this.assignmentform.controls.tag.patchValue(this.getTag);

                if (this.editData.profile_url != '') {
                    this.imagepath = this.editData.profile_url;
                }
                this.imagepaththumb = this.editData.profile_thumb_url;
                this.detailData = this.editData.questions;
                this.resourceArray = this.editData.links ? this.editData.links : []; 
            }
            console.log(this.editData, 'editData');
            this.editorVal = this.editData.file_text != '' ? this.editData.file_text : '';
            setTimeout(() => {
                for (let i = 0; i < this.detailData.length; i++) {
                    if (this.detailData[i].question_type_id != '24') {
                        document.getElementById('question' + i).innerHTML = this.detailData[i].question;
                    } else if (this.detailData[i].question_type_id == '24') {
                        document.getElementById('question' + i).innerHTML = this.detailData[i].editor_context;
                    }
                }
            }, 1000);
            this.showpre();
            this.clickEvent();
        }
    }

    deleteImg() {
        this.imagepath = [];
        this.myInputVariable.nativeElement.value = '';
    }

    editdetail(data) {
        this.auth.setSessionData('rista-questionID', data.question_type_id);
        this.auth.setSessionData('rista-questionData', JSON.stringify(data));
        this.router.navigate(['content-text-resource/question-paper/edit']);
    }

    deleteContent(id, data) {
        if (data.question_type_id != '24') {
            this.fullData = [id];
        } else {
            let subQuestion: any;
            subQuestion = data.subQuestions;
            this.passsageQuestion = [];
            subQuestion.forEach((item) => {
                this.passsageQuestion.push(item.question_id);
            });
            this.fullData = this.passsageQuestion;
        }
        this.modalRef = this.modalService.open(this.deleteQuestion);
    }

    questionDelete() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            question_id: this.fullData
        };
        this.creator.contentDelete(data).subscribe((successData) => {
                this.deleteContentSuccess(successData);
            },
            (error) => {
                console.error(error, 'delete_question')
            });
    }

    deleteContentSuccess(successData) {
        this.fullData = '';
        this.toastr.success(successData.ResponseObject);
        this.listDetails(this.editData);
        this.modalRef.close();
    }

    viewdetail(id, data) {
        if (id == '1' || id == '2') {
            this.answerIndex = [];
            this.fullData = data;
            this.quesId = id;
            for (let i = 0; i < this.fullData.options.length; i++) {
                this.answerIndex.push({options: this.fullData.options[i].options, active: this.fullData.answer[i].correctActive});
            }
            for (let j = 0; j < this.fullData.answer.length; j++) {
                    this.answerIndex[j].active = this.fullData.answer[j].correctActive;
            }
            setTimeout(() => {
                for (let i = 0; i < this.fullData.options.length; i++) {
                    document.getElementById('optionId' + i).innerHTML = this.fullData.options[i].options;
                }
            }, 100);
            this.modalRef = this.modalService.open(this.multiChoiceDetail, data);
        } else if (id == '5' || id == '7') {
            this.fullData = data;
            this.quesId = id;
            setTimeout(() => {
                for (let i = 0; i < this.fullData.answer.length; i++) {
                    document.getElementById('answerId' + i).innerHTML = this.fullData.answer[i];
                }
                for (let i = 0; i < this.fullData.options.length; i++) {
                    document.getElementById('optionId' + i).innerHTML = this.fullData.options[i].options;
                }
                if (id == '7') {
                    for (let i = 0; i < this.fullData.heading_option.length; i++) {
                        let row = this.fullData.heading_option[i].correctActive;
                        let column = this.fullData.heading_option[i].correctAnswer;
                        let id = row.toString() + column.toString();
                        document.getElementById('check' + id).setAttribute('checked', 'true');
                    }
                }
            }, 100);
            this.modalRef = this.modalService.open(this.matchTableDetail, data);
        } else if (id == '9' || id == '10') {
            this.fullData = data;
            this.quesId = id;
            this.modalRef = this.modalService.open(this.dropDownDetail, data);
            setTimeout(() => {
                for (let i = 0; i < this.fullData.answer.length; i++) {
                    for (let j = 0; j < this.fullData.answer[i].options.length; j++) {
                        if (this.fullData.answer[i].options[j].selected == 'true') {
                            // document.getElementById('dropdown' + i).setAttribute('innerHTML', this.fullData.answer[i].options[j].listOption);
                            document.getElementById('dropdown' + i).innerHTML = this.fullData.answer[i].options[j].listOption;
                        }
                    }
                }
            }, 500);
        } else if (id == '24') {
            this.fullData = data;
            this.quesId = id;
            this.modalRef = this.modalService.open(this.passage, data);
            setTimeout(() => {
                for (let i = 0; i < this.fullData.subQuestions.length; i++) {
                    if (this.fullData.subQuestions[i].question_type_id == 7) {
                        for (let j = 0; j < this.fullData.subQuestions[i].heading_option.length; j++) {
                            let index = i;
                            let row = this.fullData.subQuestions[i].heading_option[j].correctActive;
                            let column = this.fullData.subQuestions[i].heading_option[j].correctAnswer;
                            let final = index.toString() + row.toString() + column.toString();
                            document.getElementById('checkPassage' + final).setAttribute('checked', 'true');
                        }
                    }
                }
            }, 100);
        } else if (id == '20' || id == '21' || id == '22') {
            this.fullData = data;
            this.quesId = id;
            this.modalRef = this.modalService.open(this.textDetail, data);
        } else if (id == '28') {
            this.fullData = data;
            this.quesId = id;
            this.modalRef = this.modalService.open(this.highlightDetail, data);
        } else if (id == '40' || id == '41') {
            this.fullData = data;
            this.quesId = id;
            this.answerGraph = data.editor_answer;
            this.graphValue = parse(data.answer[0].correctAnswer);
            this.modalRef = this.modalService.open(this.graphDetail, {size: "lg"});
        } else if (id == '16') {
            this.sortIndex = [];
            this.fullData = data;
            this.quesId = id;
            // for (let j = 0; j < this.fullData.answer.length; j++) {
            //   if (this.fullData.answer[j].correctAnswer != '') {
            //     this.sortIndex[j].active = j;
            //   }
            // }
            // setTimeout( () => {
            //   for (let i = 0; i < this.fullData.options.length; i++) {
            //     document.getElementById('optionId' + i).innerHTML = this.fullData.answer[i].correctAnswer;
            //   }
            // } , 100);
            this.modalRef = this.modalService.open(this.matchOrderDetail, data);
        }
        this.clickEvent();
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

    close() {
        this.modalRef.close();
        this.clickEvent();
    }

    closeQuestion() {
        this.modalRef.close();
        this.fullData = '';
    }

    parseVal(value) {
        this.graphValue = parse(value[0].correctAnswer);
        return this.graphValue;
    }

    getEditorValue(event) {
        this.content = event;
    }

    assignContent() {
        this.modalRef.close();
        this.classDetails = JSON.parse(this.auth.getSessionData('card-data'));
        this.modalRef = this.modalService.open(this.assignTemplate, {size: 'lg', backdrop: 'static'});
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

    showpre() {
        // this.showPreview = !this.showPreview;
        if (this.showPreview == false) {
            setTimeout(() => {
                for (let i = 0; i < this.detailData.length; i++) {
                    if (this.detailData[i].question_type_id != '24') {
                        document.getElementById('question' + i).innerHTML = this.detailData[i].question;
                    } else if (this.detailData[i].question_type_id == '24') {
                        document.getElementById('question' + i).innerHTML = this.detailData[i].editor_context;
                    }
                }
                this.clickEvent();
            }, 100);

        } else {
            setTimeout(() => {
                for (let i = 0; i < this.detailData.length; i++) {
                    if (this.detailData[i].question_type_id == 7) {
                        for (let j = 0; j < this.detailData[i].heading_option.length; j++) {
                            const index = i;
                            const row = this.detailData[i].heading_option[j].correctActive;
                            const column = this.detailData[i].heading_option[j].correctAnswer;
                            const id = index.toString() + row.toString() + column.toString();
                            document.getElementById('checkMulti' + id).setAttribute('checked', 'true');
                        }
                    } else if (this.detailData[i].question_type_id == 24) {
                        for (let j = 0; j < this.detailData[i].subQuestions.length; j++) {
                            if (this.detailData[i].subQuestions[j].question_type_id == 7) {
                                for (let k = 0; k < this.detailData[i].subQuestions[j].heading_option.length; k++) {
                                    const index = i;
                                    const id = j;
                                    const row = this.detailData[i].subQuestions[j].heading_option[k].correctActive;
                                    const column = this.detailData[i].subQuestions[j].heading_option[k].correctAnswer;
                                    const final = index.toString() + id.toString() + row.toString() + column.toString();
                                    document.getElementById('checkMultiPassage' + final).setAttribute('checked', 'true');
                                }
                            }
                        }
                    } else if (this.detailData[i].question_type_id == 9) {
                        for (let j = 0; j < this.detailData[i].answer.length; j++) {
                            for (let k = 0; k < this.detailData[i].answer[j].options.length; k++) {
                                console.log(this.detailData[i].answer[j].options[k].selected, 'selected');
                                if (this.detailData[i].answer[j].options[k].selected == 'true') {
                                    console.log(i, j, i + 'dropdownPreview' + j, 'dropdownPreview');
                                    document.getElementById(i + 'dropdownPreview' + j).innerHTML = this.detailData[i].answer[j].options[k].listOption;
                                }
                            }
                        }
                    }
                }
                this.clickEvent();
            }, 500);
        }
    }
}
