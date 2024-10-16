import {Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ContentService} from '../../../shared/service/content.service';
import {TitleCasePipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {ViewCell} from 'ng2-smart-table';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
    selector: 'app-list-creator',
    templateUrl: './list-Content.component.html',
    styleUrls: ['./list-Content.component.scss']
})
export class ListContentComponent implements OnInit, OnChanges {
    public contentPassword: FormGroup;
    public listData: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public imgUrl: any;
    public webhost: any;
    public viewdetail: any;
    public filetype: any;
    public contentBlukEmail: any = [];
    public contentBlukEmailValue: any = [];
    public getUrl: any;
    public getUrl1: any;
    public url: any;
    public webHost: any;
    public email: any;
    public schoolData: any;
    public schoolDataList: any = 0;
    public schoolid: any;
    public rows: any;
    public adminschool: any;
    public roleid: any;
    public teacherschool: any;
    public allowEdit: boolean;
    public allowAdd: boolean;
    public allowreset: boolean;
    public validators = [this.must_be_email];
    public errorMessages = {
        'must_be_email': 'Please Enter a valid Email-id'
    };
    public resetPassword: any;
    public passwordValid: boolean;
    public message: any;
    public schoolId: any;
    public conps: boolean;
    public conps1: boolean;
    public allowSelect: boolean;
    public schoolStatus: any;

    constructor(public contentService: ContentService, public config: NgbModalConfig, public confi: ConfigurationService, public newSubject: NewsubjectService,
                private modalService: NgbModal, public auth: AuthService, public commondata: CommonDataService, public route: Router,
                public  firstcaps: TitleCasePipe, public sanitizer: DomSanitizer, public toastr: ToastrService, public common: CommonService,
                public brandservices: SchoolService, public formBuilder: FormBuilder, public loginService: LoginService, public validationService: ValidationService) {
        this.imgUrl = this.confi.getimgUrl();
        config.backdrop = 'static';
        config.keyboard = false;
        this.allowAdd = true;
        this.allowEdit = true;
        this.conps = true;
        this.conps1 = true;
        this.email = [];
        this.contentPassword = this.formBuilder.group({
            email: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: ''
        });
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        console.log(this.schoolStatus, 'schoolStatus')
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.webhost = this.confi.getimgUrl();
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.setSessionData('rista-browseAll', false);
        this.auth.removeSessionData('updatedStudent');
        this.auth.setSessionData('rista-contentType', '');
        this.auth.removeSessionData('readonly_startdate');
        this.auth.removeSessionData('editView');

        // if (this.schoolStatus.length != 0){
        //   this.newSubject.schoolChange.subscribe(params => {
        //     if (params != ''){
        //       if (this.route.url.includes('list-Content')) {
        //         this.init(params);
        //       }
        //     } else {
        //       this.init(this.auth.getSessionData('rista-school_id'));
        //     }
        //   });
        // }else {
        //
        // }
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    @ViewChild('bulkmodal') bulkContent: TemplateRef<any>;
    @ViewChild('emailmodal') emailContent: TemplateRef<any>;
    @ViewChild('content') modalContent: TemplateRef<any>;
    @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
    @Input() page?: any;

  public settings = {
        hideSubHeader: false,
        actions: {
            custom: [
                {
                    name: 'editAction',
                    title: '<i class="fa  fa-pencil" title="Edit Content-Creator"></i>'
                },
                {
                    name: 'resetpassword',
                    title: '&nbsp;<img src="assets/images/Group 17247.png" alt="" title="Reset Password By Mail" aria-hidden="true"></img>'
                },
                {
                    name: 'resetpasswordnow',
                    title: '<img src="assets/images/Group 17248.png" alt="" title="Reset Password Now" aria-hidden="true"></img>'
                }
            ],
            add: false,
            edit: false,
            delete: false,
            position: 'right',
        },


        columns: {
            first_name: {
                title: 'First Name',
                type: 'custom',
                renderComponent: ViewComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.save.subscribe(row => {
                    });
                }
            },
            last_name: {
                title: 'Last Name',
                valuePrepareFunction: (data) => {
                    return this.firstcaps.transform(data);
                }
            },
            email_id: {
                title: 'Email-id'
            },
            mobile: {
                title: 'Contact Number'
            },
            status: {
                title: 'Status',
            }
        },
    };

    private must_be_email(control: FormControl) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
        if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
            return {"must_be_email": true};
        }
        return null;
    }

    ngOnInit() {
        this.auth.removeSessionData('rista-backOption');
    }

    ngOnChanges() {
      this.init(this.auth.getSessionData('rista-school_id'));
    }

    init(res) {
        this.schoolId = res;
        if (this.roleid == '4' && this.auth.getSessionData('rista-teacher_type') == '0') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.allowreset = this.auth.getSessionData('rista-teacher_type') == '0';
            if (this.teacherschool.permissions[1].allowNav) {
                this.allowAdd = this.teacherschool.permissions[1].permission[0].status == 1;
                this.allowEdit = this.teacherschool.permissions[1].permission[1].status == 1;
                // if (this.teacherschool.permissions[1].permission[0].status == 1) {
                //     this.allowAdd = true;
                // } 
                // if (this.teacherschool.permissions[1].permission[1].status == 1) {
                //     this.allowEdit = true;
                // }
                this.contentList();
            } else {
                this.route.navigate(['/home/list-home']);
            }
        } else if (this.roleid == '4' && this.auth.getSessionData('rista-teacher_type') == '1') {
            this.route.navigate(['/home/list-home']);
        } else {
            this.contentList();
        }
    }

    contentList() {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.contentService.contentList(data).subscribe((successData) => {
                this.contentListSuccess(successData);
            },
            (error) => {
                this.contentListFailure(error);
            });
    }

    contentListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.listData = successData.ResponseObject;
            this.listData.forEach((value, index, array) => {
                this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
                    'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '';
            });
        }
    }

    contentListFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }


    onCustomAction(event) {
        switch (event.action) {
            case 'editAction':
                this.editAction(event);
                break;
            case 'resetpassword':
                this.resetPassword = event.data;
                this.showModal('mail');
                break;
            case 'resetpasswordnow':
                this.resetPassword = event.data;
                this.showModal('now');
        }
    }

    bulkModal() {
        this.filetype = '';
        this.modalRef = this.modalService.open(this.bulkContent);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    emailModal() {
        this.contentBlukEmail = [];
        this.modalRef = this.modalService.open(this.emailContent);
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


    open(content) {
        this.modalService.open(content);
    }

    close() {
        this.modalRef.close();
        this.getUrl = '';
        this.filetype = '';
        this.contentBlukEmail = '';
    }

    editAction(rows) {
        if (this.allowEdit == true) {
            this.auth.setSessionData('UsersRedirection', 'Creator');
            this.auth.setSessionData('editContent', JSON.stringify(rows.data));
            this.route.navigate(['/Content-Creator/create-Content/edit']);
            this.close();
        } else if (this.allowEdit == false) {
            this.toastr.error('You don\'t have permission to update content-creator details');
        }
    }

    readUrl(event: any) {
        const file = event.target.files[0];
        this.filetype = event.target.files[0].name.split('.');
        if (event.srcElement.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.srcElement.files[0].type == 'application/vnd.ms-excel') {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: any) => {
                this.getUrl1 = [];
                this.url = event.target.result;
                this.getUrl = this.url.split(',');
                this.getUrl1.push(this.url.split(','));
                this.onUploadFinished1(this.getUrl, event);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
            this.toastr.success('Excel Upload Successfully', 'Success!');
        } else {
            this.toastr.error('Only Excel Format Is Required', 'Failed');
            this.filetype = '';
        }
    }

    onUploadFinished1(event, fileEvent) {
        this.getUrl = event[1];
    }

    onUploadFinished(type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            file: this.getUrl,
            extension: this.filetype[1] ? this.filetype[1] : '',
            upload_type: 'Excel',
            user_type: 'Contentcreator',
        };
        this.common.excelUpload(data).subscribe(
            (successData) => {
                this.excelUpoadSuccess(successData, type);
            },
            (error) => {
                this.excelUpoadFailure(error);
            }
        );
    }

    excelUpoadSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.getUrl = '';
            // fileEvent = null;
            this.bulkInsert(type, successData.ResponseObject.upload_id);
            // this.fileUploader.nativeElement.value = '';
            this.toastr.success(successData.ResponseObject.Message, 'Success!');
        } else {
            this.toastr.error('Excel upload failed', 'Failed!');
        }
    }

    excelUpoadFailure(error) {
        this.commondata.showLoader(false);
        console.log(error);
    }

    bulkInsert(type, id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            upload_id: id,
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.common.bulkInsert(data).subscribe(
            (successData) => {
                this.bulkInsertSuccess(successData, type);
            },
            (error) => {
                this.bulkInsertFailure(error);
            }
        );
    }

    bulkInsertSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.close();
            this.contentList();
            if (type == 'upload') {
                this.toastr.success(successData.ResponseObject, 'ContentCreator');
            } else if (type == 'email') {
                this.toastr.success(successData.ResponseObject, 'ContentCreator');
            }
        } else if (!successData.IsSuccess) {
            if (type == 'upload') {
                this.toastr.error(successData.ErrorObject, 'Failure');
            } else if (type == 'email') {
                this.toastr.error('Email Not Sent', 'Failure');
            }
        }
    }

    bulkInsertFailure(error) {
        this.contentList();
        this.toastr.error('Excel upload failed', 'Failed!');
    }

    emailInviteUpload(type) {
        this.contentBlukEmail;
        for (let i = 0; i < this.contentBlukEmail.length; i++) {
            this.contentBlukEmailValue.push(this.contentBlukEmail[i].value);
        }
        if (this.contentBlukEmail.length != 0) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                email_id: this.contentBlukEmailValue,
                format: 'Email',
                user_type: 'Contentcreator'
            };
            this.common.emailInviteUpload(data).subscribe((successData) => {
                    this.emailInviteUploadSuccess(successData, type);
                },
                (error) => {
                    this.emailInviteUploadFailure(error);
                });
        } else {
            this.toastr.error('Enter Your Email Id', 'Failed!');
        }
    }

    emailInviteUploadSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.bulkInsert(type, successData.ResponseObject.upload_id);
            this.toastr.success('E-mail Invite Sent Sucessfully', 'Success!');
        } else {
            this.toastr.error(successData.ResponseObject, 'Failed!');
        }
    }

    emailInviteUploadFailure(error) {
    }

    downloadExcel() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            user_type: 'Contentcreator'

        };
        this.common.excelDownload(data).subscribe(
            (successData) => {
                this.excelDownloadSuccess(successData);
            },
            (error) => {
                this.excelDownloadFailure(error);
            }
        );
    }

    excelDownloadSuccess(successData) {
        if (successData.IsSuccess) {
            const url = this.webhost + '/' + successData.ResponseObject;
            window.open(url);
        }
    }

    excelDownloadFailure(error) {
        console.log(error);
    }

    checkPasswords() {
        const pass = this.contentPassword.controls.password.value;
        const confirmPass = this.contentPassword.controls.confirmpassword.value;
        if (pass === confirmPass) {
            this.passwordValid = false;
        } else {
            this.passwordValid = true;
        }
        return this.passwordValid;
    }

    cancel() {
        this.modalRef.close();
        this.contentPassword.reset();
    }

    change(type) {
        const data = {
            platform: 'web',
            role_id: this.resetPassword.role_id,
            email_id: this.resetPassword.email_id,
        };
        if (type == 1) {
            this.loginService.forgotPassword(data).subscribe((successData) => {
                    this.changeSuccess(successData, type);
                },
                (error) => {
                    this.changeFailure(error);
                });
        } else {
            if (this.contentPassword.valid) {
                if (this.passwordValid == false) {
                    this.commondata.showLoader(true);
                    data['password'] = this.contentPassword.controls.confirmpassword.value;
                    this.loginService.forgotPassword(data).subscribe((successData) => {
                            this.changeSuccess(successData, type);
                        },
                        (error) => {
                            this.changeFailure(error);
                        });
                } else {
                    this.toastr.error('Please enter same password in new and confirm password');
                }
            } else {
                this.validationService.validateAllFormFields(this.contentPassword);
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }
    }

    changeSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.message = successData.ResponseObject.message;
            this.route.navigate(['/users/user-list']);
            if (type == 1) {
                this.toastr.success('E-mail invite sent successfully for reset password ', 'Content-Creator');
            } else {
                this.contentPassword.reset();
                this.toastr.success(successData.ResponseObject.message, 'Content-Creator');
            }
            this.close();
        } else {
            this.commondata.showLoader(false);
        }
    }

    changeFailure(error) {
        console.log(error, 'error');
    }

    showModal(type) {
        if (this.allowreset) {
            this.toastr.error('You don\'t have permission to reset password for Content-Creator');
        } else {
            if (type == 'mail') {
                this.modalRef = this.modalService.open(this.modalContent);
            } else if (type == 'now') {
                this.modalRef = this.modalService.open(this.modalContentnow);
                this.contentPassword.controls.email.patchValue(this.resetPassword.email_id);
            }
            this.modalRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }
}


// view content

@Component({
    selector: 'button-toggle',
    template: `

        <div class="form-group">
            <!--<label class="mb-1">Featured</label><br>-->
            <span class="text-capitalize font-weight-bold table-name" data-toggle="modal" data-target="#myModal"
                  (click)="viewdetailsList()">{{viewdetail.first_name}}</span>
        </div>
        <ng-template #viewdetails let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-basic-title">Content-Creator details</h4>
                <i class="fa fa-close fa-lg mt-1" aria-hidden="true"
                   style="color:#7F3486; cursor: pointer; float: right;" (click)="close()"></i>
            </div>
            <div class="modal-body">
                <!-- Container-fluid starts-->
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card-body pt-2">
                                <div class="row d-flex flex-column">
                                    <div class="mb-5 fit-image">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && viewdetail.gender.toLowerCase() == 'male'"
                                             src="assets/images/ristaschool/male.png" alt="">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && viewdetail.gender.toLowerCase() == 'female'"
                                             src="assets/images/ristaschool/female1.png" alt="">
                                        <img *ngIf="(viewdetail.profile_url == '' || viewdetail.profile_url == null) && (viewdetail.gender.toLowerCase() == 'n/a'|| viewdetail.gender == '')"
                                             src="assets/images/ristaschool/Do not want to disclose.png" alt="">
                                        <img *ngIf="viewdetail.profile_url != ''" class="card-img-top img-thumbnail"
                                             [src]="sanitizer.bypassSecurityTrustResourceUrl(webhost + '/' + viewdetail.profile_url)"
                                             alt="">
                                    </div>
                                    <table class="capital">
                                        <tr>
                                            <td class="pl-4"><b>Status:</b></td>
                                            <td class="badge badge-success" *ngIf="viewdetail.status == 'Active'">
                                                Active
                                            </td>
                                            <span class="badge  badge-danger" *ngIf="viewdetail.status == 'Inactive'">In-Active</span>
                                            <span class="badge badge-warning" *ngIf="viewdetail.status  == 'Suspended'">Suspended</span>
                                            <span class="badge badge-danger" *ngIf="viewdetail.status  == 'Deleted'">In-Active</span>
                                        </tr>
                                        <tr>
                                            <td class="pl-4"><b>Contact Number:</b></td>
                                            <td>{{viewdetail.mobile}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4" style="width: 150px"><b>Address:</b></td>
                                            <td *ngIf="viewdetail.address1 != '' && viewdetail.address1 != null">{{viewdetail.address1}}</td>
                                        </tr>
                                        <tr *ngIf="viewdetail.address2 != ''">
                                            <td></td>
                                            <td>{{viewdetail.address2}}</td>
                                        </tr>
                                        <tr *ngIf="viewdetail.city != '' && viewdetail.city != null && viewdetail.state_name != ''">
                                            <td></td>
                                            <td>{{viewdetail.city}}<br>
                                                {{viewdetail.state_name}}<br>
                                                {{viewdetail.country_name}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Container-fluid Ends-->

            </div>
            <div class="modal-footer">
                <!--        <button type="button" class="btn btn-primary" (click)="editAction(rows)" > Edit </button>-->
                <button type="button" class="btn cancel" (click)="close()">Cancel</button>
                <button type="button" class="btn btn-primary" (click)="editAction(viewdetail)">Edit</button>
            </div>
        </ng-template>

    `
})

export class ViewComponent implements ViewCell, OnInit {
    status: any;
    private modalRef: NgbModalRef;
    viewdetail: any;
    webhost: any;
    renderValue: string;
    teacherschool: any;
    allowAdd: boolean;
    allowEdit: boolean;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();
    @ViewChild('viewdetails') viewDetailsContent: TemplateRef<any>;

    constructor(private modalService: NgbModal, public route: Router, public config: NgbModalConfig, public sanitizer: DomSanitizer,
                public auth: AuthService, public toastr: ToastrService, public confi: ConfigurationService) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.webhost = this.confi.getimgUrl();
        if (this.auth.getSessionData('rista-roleid') == '4') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            if (this.teacherschool.permissions[0].permission[0].status == 1) {
                this.allowAdd = true;
            } else if (this.teacherschool.permissions[0].permission[0].status == 0) {
                this.allowAdd = false;
            }
            if (this.teacherschool.permissions[0].permission[1].status == 1) {
                this.allowEdit = true;
            } else if (this.teacherschool.permissions[0].permission[1].status == 0) {
                this.allowEdit = false;
            }
        } else {
            this.allowAdd = true;
            this.allowEdit = true;
        }
    }

    ngOnInit() {
        this.viewdetail = this.rowData;
    }

    viewdetailsList() {
        this.modalRef = this.modalService.open(this.viewDetailsContent);
    }

    open(content) {
        this.modalService.open(content);
    }

    close() {
        this.modalRef.close();
    }

    cancel() {
        this.modalRef.close();
    }

    editAction(rows) {
        if (this.allowEdit == true) {
            this.auth.setSessionData('editContent', JSON.stringify(rows));
            this.route.navigate(['/Content-Creator/create-Content/edit']);
            this.close();
        } else if (this.allowEdit == false) {
            this.toastr.error('You don\'t have permission to update student details', 'Failed');
        }
    }
}
