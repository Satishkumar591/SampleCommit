import {
    Component,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {
    DefaultTreeviewI18n,
    DropdownTreeviewComponent,
    OrderDownlineTreeviewEventParser,
    TreeviewConfig,
    TreeviewEventParser, TreeviewI18n,
    TreeviewItem
} from 'ngx-treeview';
import {ClassroomService} from '../../../shared/service/classroom.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ProductTreeviewConfig} from '../../repository/add-resources/add-resources.component';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'app-treeview-contentfolder',
    templateUrl: './treeview-contentfolder.component.html',
    styleUrls: ['./treeview-contentfolder.component.scss'],
    providers: [
        {provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser},
        {provide: TreeviewConfig, useClass: ProductTreeviewConfig},
        {
            provide: TreeviewI18n, useValue: Object.assign(new DefaultTreeviewI18n(), {
                getFilterPlaceholder(): string {
                    return 'Search Content Folder';
                }
            })
        }
    ]
})

export class TreeviewContentfolderComponent implements OnInit, OnChanges, OnDestroy {

    public branchForm: FormGroup;
    public items: any;
    public branchListData: any;
    public addItemsData: any;
    public batchid = [];
    private modalRef: NgbModalRef;
    public teacherschool: any;
    public calledValue = '';
    public formSubmitted = true;
    public previousFilterType = 'Latest';
    public newBatchId = '';
    public batchDetails: any = [];
    public selectedBatchForDelete: any;
    public selectedBacthName = [];
    configTree = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: true,
        maxHeight: 370
    });

    ContentFolderConfigTree = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: true,
        decoupleChildFromParent: true,
        maxHeight: 370
    });

    classConfigTree = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: true,
        maxHeight: 370
    });
    public buttonClass = 'treeview-button';
    public addContentFolder = true;
    public classContentFolder = false;
    public contentEdit = true;
    public showLoader = true;
    @Input() type: any;
    @Input() selectedbatch = [];
    @Input() filterType: any = 'Latest';
    @Input() calledForm?: string = '';
    @Input() treeviewHeight?: number = 200;
    @Input() schoolId?: string = '';
    @ViewChild('addBranch') addBranchTemp: TemplateRef<any>;
    @ViewChild('preview') previewContentFolder: TemplateRef<any>;
    @ViewChild('deleteBatch') deleteBatch: TemplateRef<any>;
    @ViewChild(DropdownTreeviewComponent, {static: false}) child: DropdownTreeviewComponent;
    public valueCheckArray = [];
    public totalBatchIds = [];
    public schoolStoredInitially = '';

    constructor(public branchService: ClassroomService, public modalService: NgbModal, private toastr: ToastrService,
                public auth: AuthService, public commondata: CommonDataService, public validationService: ValidationService,
                public formBuilder: FormBuilder, public router: Router) {

        this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
        this.schoolStoredInitially = this.auth.getSessionData('rista-school_id');
        if (this.auth.getRoleId() == '4') {
            this.addContentFolder = this.teacherschool.permissions[5].permission[0].status == 1;
            this.classContentFolder = this.teacherschool.permissions[6].permission[0].status == 0;
            this.contentEdit = this.teacherschool.permissions[5].permission[2].status == 1;
        } else {
            this.addContentFolder = true;
            this.classContentFolder = false;
        }
        this.resetForm();
    }

    ngOnInit(): void {
        this.batchid = this.selectedbatch;
        this.getBranchList();
    }

    resetForm() {
        this.branchForm = this.formBuilder.group({
            batchname: ['', Validators.required]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.calledForm == 'contentFolder') {
            this.showLoader = true;
            this.totalBatchIds = [];
            if (this.previousFilterType != this.filterType) {
                this.previousFilterType = this.filterType;
                this.getBranchList();
            } else if (this.schoolId != this.schoolStoredInitially) {
                this.getBranchList();
                this.schoolStoredInitially = this.schoolId;
            } else {
                this.showLoader = false;
            }
            this.configTree.maxHeight = this.treeviewHeight - 250;
        } else {
            this.configTree.maxHeight = this.treeviewHeight;
        }
    }

    ngOnDestroy(): void {
        sessionStorage.removeItem('selectedbatchId');
        this.selectedbatch = [];
        this.batchid = [];
    }

    close() {
        this.formSubmitted = true;
        this.modalRef.close();
    }

    addItem(item, type, typeOfFunction) {
        this.calledValue = typeOfFunction;
        this.formSubmitted = true;
        this.resetForm();
        if (typeOfFunction == 'add') {
            if (type == 'parent') {
                this.addItemsData = {parent_batch_id: '0', batch_id: item.value};
            } else {
                this.addItemsData = {parent_batch_id: item.value.split('/')[0], batch_id: item.value.split('/')[1]};
            }
        } else {
            this.addItemsData = item;
            this.branchForm.controls.batchname.patchValue(item.text);
        }
        console.log(this.addItemsData, 'addIte');
        console.log(item, 'hh');
        this.modalRef = this.modalService.open(this.addBranchTemp, {size: 'lg', backdrop: 'static'});
    }

    addBranchDetails() {
        if (this.branchForm.valid) {
            this.formSubmitted = true;
            this.commondata.showLoader(false);
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                batch_name: this.branchForm.controls.batchname.value,
                status: '1',
                school_id: this.auth.getSessionData('rista-school_id'),
                batch_id: this.calledValue == 'add' ? this.addItemsData.batch_id : this.addItemsData.value.split('/')[0]
            };

            if (this.auth.getRoleId() == '6') {
                data['corporate_id'] = this.auth.getSessionData('rista-corporate_id');
            }
            if (this.calledValue == 'add') {
                data['parent_batch_id'] = this.addItemsData.parent_batch_id;
                this.branchService.classRoomAdd(data).subscribe((successData) => {
                        this.branchSuccess(successData);
                    },
                    (error) => {
                        console.log(error, 'error');
                    });
            } else {
                this.branchService.classRoomEdit(data).subscribe((successData) => {
                        this.branchSuccess(successData, data);
                    },
                    (error) => {
                        console.log(error, 'error');
                    });
            }
        } else {
            this.validationService.validateAllFormFields(this.branchForm);
            this.formSubmitted = false;
            this.toastr.error('Please Fill All The Mandatory Fields');
        }
    }

    branchSuccess(successData, data?) {
        console.log(successData, 'successData');
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.totalBatchIds = [];
            this.newBatchId = successData.batch_id;
            this.batchDetails = successData.batch_detais[0].children;
            this.showLoader = true;
            if (this.batchDetails.length != 0) {
                this.batchDetails.forEach((items) => {
                    this.findOpenFolderId(items, successData.batch_detais[0]);
                });
            } else {
                this.totalBatchIds = [this.newBatchId];
            }
            if (this.calledValue == 'add') {
                this.toastr.success('Content Folder Added Successfully');
            } else {
                this.toastr.success('Content Folder Updated Successfully');
            }
            this.modalRef.close();
            console.log(this.totalBatchIds, 'totalBatchIds');
            this.branchForm.controls.batchname.patchValue('');
            setTimeout (() => {
                this.getBranchList();
            }, 2000);
        } else {
            this.commondata.showLoader(false);
            this.toastr.error(successData.ErrorObject, 'Content Folder');
        }
    }

    findOpenFolderId(value, parentValue) {
        if (value.batch_id == this.newBatchId) {
            this.totalBatchIds = (parentValue.batch_id + '/' + value.batch_id).split('/');
        } else {
            value.appendedBatchValue = parentValue.batch_id + '/' + value.batch_id;
            if (value.children) {
                value.children.forEach((items) => {
                    if (items.batch_id == this.newBatchId) {
                        this.totalBatchIds = (value.appendedBatchValue + '/' + items.batch_id).split('/');
                    } else {
                        items.appendedBatchValue = value.appendedBatchValue + '/' + items.batch_id;
                        if (items.children) {
                            if (items.children.length != 0) {
                                this.findSecondOpenFolder(items);
                            }
                        }
                    }
                });
            }
        }
    }

    findSecondOpenFolder(secondFolderValue) {
        if (secondFolderValue.batch_id == this.newBatchId) {
            this.totalBatchIds = (secondFolderValue.appendedBatchValue + '/' + secondFolderValue.batch_id).split('/');
        } else {
            if (secondFolderValue.children) {
                secondFolderValue.children.forEach((items1) => {
                    if (items1.batch_id == this.newBatchId) {
                        this.totalBatchIds = (secondFolderValue.appendedBatchValue + '/' + items1.batch_id).split('/');
                    } else {
                        items1.appendedBatchValue = secondFolderValue.appendedBatchValue + '/' + items1.batch_id;
                        if (items1.children) {
                            if (items1.children.length != 0) {
                                this.findSecondOpenFolder(items1);
                            }
                        }
                    }
                });
            }
        }
    }

    batchDeletePopUp(item) {
        this.selectedBatchForDelete = item;
        this.modalRef = this.modalService.open(this.deleteBatch, {size: 'md', backdrop: 'static'});
    }

    deleteBatchService() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            batch_id: this.selectedBatchForDelete.value.split('/')[0],
            parent_batch_id : this.selectedBatchForDelete.value.split('/')[2]
        };
        this.branchService.classRoomDelete(data).subscribe((successData) => {
                this.deleteBranchSuccess(successData);
            },
            (error) => {
                console.log(error, 'error');
            });
    }

    deleteBranchSuccess(successData) {
        if (successData.IsSuccess) {
            this.modalRef.close();
            this.totalBatchIds = [];
            this.newBatchId = successData.batch_id;
            this.batchDetails = successData.batch_detais.length != 0 ? successData.batch_detais[0].children : [];
            this.showLoader = true;
            if (this.batchDetails.length != 0) {
                this.batchDetails.forEach((items) => {
                    this.findOpenFolderId(items, successData.batch_detais[0]);
                });
            } else {
                this.totalBatchIds = [this.newBatchId];
            }
            setTimeout (() => {
                this.getBranchList();
            }, 2000);
            this.toastr.success('Content Folder Deleted Successfully');
        }
    }

    getBranchList() {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            type: '1',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            sort_type: this.filterType == 'Latest' ? '1' : this.filterType == 'Oldest' ? '2' : this.filterType == 'A - Z' ? '3' : '4',
            corporate_id: this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '4' ? '0' : this.auth.getSessionData('rista-corporate_id')
        };
        this.branchService.batchList(data).subscribe((successData) => {
                this.branchListSuccess(successData);
            },
            (error) => {
                this.commondata.showLoader(false);
            });
    }

    branchListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.branchListData = successData.ResponseObject;
            this.items = [];
            this.branchListData.forEach((item) => {
                this.items.push(new TreeviewItem(item));
                this.valueCheckArray.push(new TreeviewItem(item));
            });
            this.items.forEach((item) => {
                this.selectChildren(item, item);
            });
            this.showLoader = false;
        }
    }

    checkForFolderType(items) {
        let returnValue = true;
        if (items.children && this.calledForm == 'class') {
            returnValue = false;
        } else if (items.children && this.calledForm != 'contentFolder') {
            items.children.every((children) => {
                const value = children.value.split('/');
                if (value[1] == 'folder') {
                    returnValue = false;
                    return false;
                }
                return true;
            });

        } else if (!items.children) {
            returnValue = true;
        } else if (items.children && this.calledForm == 'contentFolder') {
            returnValue = false;
        }
        return returnValue;
    }

    onSelectedChange(event) {

        if (this.batchid.length == 0) {
            this.child.buttonLabel = 'Select Content Folder';
        } else {
            this.child.buttonLabel = this.batchid.length + ' ' + 'Content Folder Selected';
        }
    }

    selectCheckBox(value, event) {
        if (this.calledForm == 'class') {
            this.selectChildren(value, 'classCheck', value, event.target.checked);
        } else {
            this.items.forEach(item => {
                this.selectChildren(item, 'check', value, event.target.checked);
            });
        }
    }

    selectChildren(i: TreeviewItem, selectedForm?, value?, checked?) {
        if (selectedForm == 'check') {
            i.checked = value.value == i.value ? checked : i.checked;
            if (checked && value.value == i.value) {
                const batchValue = value.value.split('/');
                this.batchid.push(batchValue[0]);
                this.selectedBacthName.push(' ' + ' ' + value.text + ' ' + ' ');
                if (this.calledForm == 'contentLibrary' || this.calledForm == 'confirmPopUp') {
                    this.auth.setSessionData('selectedbatchId', JSON.stringify(this.batchid));
                }
            } else if (!checked && value.value == i.value) {
                this.batchid.forEach((batch, index) => {
                    const batchValue = value.value.split('/');
                    if (batch == batchValue[0]) {
                        this.batchid.splice(index, 1);
                        this.selectedBacthName.splice(index, 1);
                        if (this.calledForm == 'contentLibrary' || this.calledForm == 'confirmPopUp') {
                            this.auth.setSessionData('selectedbatchId', JSON.stringify(this.batchid));
                        }
                    }
                });
            }
        } else if (selectedForm == 'classCheck') {
            i.checked = checked;
            const batchValue = value.value.split('/');
            if (checked && batchValue[1] == 'folder') {
                this.batchid.push(batchValue[0]);
                this.selectedBacthName.push(' ' + ' ' + value.text + ' ' + ' ');
            } else if (!checked && batchValue[1] == 'folder') {
                this.batchid.forEach((batch, index) => {
                    if (batch == batchValue[0]) {
                        this.batchid.splice(index, 1);
                        this.selectedBacthName.splice(index, 1);
                    }
                });
            }
        } else {
            i.checked = false;
            if (this.calledForm == 'contentFolder' && this.totalBatchIds.length == 0) {
                i.collapsed = true;
            } else if (this.calledForm == 'contentFolder' && this.totalBatchIds.length != 0) {
                const batchValue = i.value.split('/');
                const valueAvailableOrNot = this.totalBatchIds.some((code) => code === batchValue[0]);
                i.collapsed = !valueAvailableOrNot;
            }
            if (this.type == 'edit') {
                this.selectCheckBoxFromList(i);
            }
        }
        if (i.children) {
            this.selectInsideChildren(i, selectedForm, value, checked);
        }
    }

    selectInsideChildren(item: TreeviewItem, selectedForm, value, checked) {
        item.children.forEach((i: TreeviewItem) => {
            if (selectedForm == 'check') {
                i.checked = value.value == i.value ? checked : i.checked;
                if (checked && value.value == i.value) {
                    const batchValue = value.value.split('/');
                    if (batchValue[0] != '' && batchValue[0] != '0') {
                        this.batchid.push(batchValue[0]);
                        this.selectedBacthName.push(' ' + ' ' + i.text + ' ' + ' ');
                        if (this.calledForm == 'contentLibrary' || this.calledForm == 'confirmPopUp') {
                            this.auth.setSessionData('selectedbatchId', JSON.stringify(this.batchid));
                        }
                    }
                } else if (!checked && value.value == i.value) {
                    this.batchid.forEach((batch, index) => {
                        const batchValue = value.value.split('/');
                        if (batch == batchValue[0]) {
                            this.batchid.splice(index, 1);
                            this.selectedBacthName.splice(index, 1);
                            if (this.calledForm == 'contentLibrary' || this.calledForm == 'confirmPopUp') {
                                this.auth.setSessionData('selectedbatchId', JSON.stringify(this.batchid));
                            }
                        }
                    });
                }
            } else if (selectedForm == 'classCheck') {
                i.checked = checked;
                const batchValue = i.value.split('/');
                if (checked && batchValue[1] == 'folder') {
                    this.batchid.push(batchValue[0]);
                    this.selectedBacthName.push(' ' + ' ' + i.text + ' ' + ' ');
                } else if (!checked && batchValue[1] == 'folder') {
                    this.batchid.forEach((batch, index) => {
                        if (batch == batchValue[0]) {
                            this.batchid.splice(index, 1);
                            this.selectedBacthName.splice(index, 1);
                        }
                    });
                }
            } else {
                i.collapsed = this.calledForm != 'contentFolder';
                if (this.calledForm == 'contentFolder' && this.totalBatchIds.length == 0) {
                    i.collapsed = true;
                } else if (this.calledForm == 'contentFolder' && this.totalBatchIds.length != 0) {
                    const batchValue = i.value.split('/');
                    const valueAvailableOrNot = this.totalBatchIds.some((code) => code === batchValue[0]);
                    i.collapsed = !valueAvailableOrNot;
                }
                i.checked = false;
                if (this.type == 'edit') {
                    this.selectCheckBoxFromList(i);
                }
            }
            if (i.children) {
                this.selectInsideChildren(i, selectedForm, value, checked);
            }
        });
    }

    selectCheckBoxFromList(value) {
        const batchValue = value.value.split('/');
        this.batchid.every((items) => {
            if (items == batchValue[0]) {
                value.checked = true;
                this.selectedBacthName.push(' ' + ' ' + value.text + ' ' + ' ');
                return false;
            }
            return true;
        });
    }

    listDetails(event) {
        if (this.calledForm != 'class') {
            const contentValue = event.value.split('/');
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                content_id: contentValue[0],
                content_type: contentValue[2],
                content_format: contentValue[3],
                school_id: this.auth.getSessionData('rista-school_id'),
            };
            this.auth.setSessionData('rista-editor', JSON.stringify(data));
            if (contentValue[2] == '1') {
                this.auth.setSessionData('preview_page', contentValue[3] == '1' ? 'create_resources' : 'text_resources');
            } else if (contentValue[2] == '2') {
                this.auth.setSessionData('preview_page', contentValue[3] == '1' ? 'create_assignments' : 'text_assignments');
            } else if (contentValue[2] == '3') {
                this.auth.setSessionData('preview_page', contentValue[3] == '1' ? 'create_assessments' : 'text_assessments');
            }
            this.auth.setSessionData('rista-preview', 'content-folder');
            this.router.navigate(['repository/preview']);
        }
    }
}
