import {Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ContentService} from '../../../shared/service/content.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../shared/service/admin.service';
import {LoginService} from '../../../shared/service/login.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {ViewCell} from 'ng2-smart-table';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {TitleCasePipe} from '@angular/common';

@Component({
    selector: 'app-list-admin',
    templateUrl: './list-admin.component.html',
    styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit, OnChanges {
    public listData: any;
    public adminPassword: FormGroup;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public imgUrl: any;
    public webhost: any;
    public viewdetail: any;
    public filetype: any;
    public schoolId: any;
    public contentBlukEmail: any = [];
    public getUrl: any;
    public getUrl1: any;
    public url: any;
    public webHost: any;
    public email: any;
    public schoolData: any;
    public schoolDataList: any = 0;
    public rows: any;
    public resetPassword: any;
    public validators = [this.must_be_email];
    public conps: boolean;
    public conps1: boolean;
    public passwordValid: boolean;
    public errorMessages = {
        'must_be_email': 'Please Enter a valid email format only allowed'
    };
    public message: any;
    public schoolStatus: any;
    public showSchoolSearch: boolean = true;

    private must_be_email(control: FormControl) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
        if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
            return {"must_be_email": true};
        }
        return null;
    }

    @ViewChild('bulkmodal') bulkContent: TemplateRef<any>;
    @ViewChild('emailmodal') emailContent: TemplateRef<any>;
    @ViewChild('content') modalContent: TemplateRef<any>;
    @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
    @Input() page?: any;

    constructor(public contentService: ContentService, public config: NgbModalConfig, public confi: ConfigurationService, public validationService: ValidationService,
                private modalService: NgbModal, public auth: AuthService, public commondata: CommonDataService, public route: Router, public newSubject: NewsubjectService,
                public firstcaps: TitleCasePipe, public sanitizer: DomSanitizer, public toastr: ToastrService, public common: CommonService,
                public brandservices: SchoolService, public admin: AdminService, public loginService: LoginService, private formBuilder: FormBuilder) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        console.log(this.schoolStatus, 'this.schoolStatus');
        console.log(this.schoolStatus.length, 'this.schoolStatus');
        this.conps = true;
        this.conps1 = true;
        this.adminPassword = this.formBuilder.group({
            email: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: ''
        });
        // if (this.schoolStatus.length != 0) {
        //     this.newSubject.schoolChange.subscribe((params) => {
        //         if (params != '') {
        //             if (this.route.url.includes('list-admin')) {
        //                 this.init(params);
        //             }
        //         } else {
        //             this.init(params);
        //         }
        //     });
        // } else {
        // }
        // this.schoolSelect.searchSchool.subscribe((params) => {
        //   let schoolid: any;
        //   schoolid = this.auth.getSessionData('rista-school_id');
        //   if (schoolid != 0){
        //     this.showSchoolSearch = false;
        //   }else if (schoolid == 0){
        //     this.showSchoolSearch = true;
        //     this.schoolDataList = 0;
        //   }
        // });
    }

    public settings = {
        hideSubHeader: false,
        actions: {
            custom: [
                {
                    name: 'editAction',
                    title: '&nbsp;<i class="fa  fa-pencil" title="Edit Admin"></i>'
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
            school_name: {
                title: 'Institution Name',
                type: 'html',
                valuePrepareFunction: (data) => {
                    return `<span class="text-capitalize">${data}</span>`;
                }
            },
            status: {
                title: 'Status'
            },

        },
    };

    ngOnInit() {
    }

    ngOnChanges() {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    init(data) {
        this.listAdmin('inst');
        this.schoolList();
    }

    checkPasswords() {
        const pass = this.adminPassword.controls.password.value;
        const confirmPass = this.adminPassword.controls.confirmpassword.value;
        this.passwordValid = pass !== confirmPass;
        return this.passwordValid;
    }

    listAdmin(type) {
        console.log(type, 'type');
        let schoolid: any;
        if (type == 'inst') {
            schoolid = this.auth.getSessionData('rista-school_id');
        } else {
            schoolid = this.schoolDataList;
        }
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            type: 'list',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: schoolid
        };
        this.admin.adminList(data).subscribe((successData) => {
                this.adminListSuccess(successData);
            },
            (error) => {
                this.adminListFailure(error);
            });
    }

    adminListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.listData = successData.ResponseObject;
            this.listData.forEach((value, index, array) => {
                this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
                    'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '';
            });
        }
    }

    adminListFailure(error) {
        this.commondata.showLoader(false);
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

    open(content) {
        this.modalService.open(content);
    }

    close() {
        this.modalRef.close();
        this.schoolId = null;
        this.getUrl = '';
        this.filetype = '';
        this.contentBlukEmail = '';
    }

    cancel() {
        this.modalRef.close();
        this.adminPassword.reset();
    }

    editAction(rows) {
        this.auth.setSessionData('editAdmin', JSON.stringify(rows.data));
        this.route.navigate(['/admin/create-admin/edit']);
        this.close();
    }

    schoolList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid')
        };
        this.brandservices.getSchoolList(data).subscribe((successData) => {
                this.schoolListSuccess(successData);
            },
            (error) => {
                this.schoolListFailure(error);
            });
    }

    schoolListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.schoolData = successData.ResponseObject;
            this.schoolData.unshift({school_name: 'All Institution', school_id: 0});
        }
    }

    schoolListFailure(error) {
        this.commondata.showLoader(false);
    }

    change(type) {
        const data = {
            platform: 'web',
            role_id: this.resetPassword.role,
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
            if (this.adminPassword.valid) {
                if (this.passwordValid == false) {
                    data['password'] = this.adminPassword.controls.confirmpassword.value
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
                this.validationService.validateAllFormFields(this.adminPassword);
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        }
    }

    changeSuccess(successData, type) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.message = successData.ResponseObject.message;
            this.route.navigate(['/users/list-user']);
            if (type == 1) {
                this.toastr.success('E-mail invite sent successfully for reset password ', 'Admin');
            } else {
                this.adminPassword.reset();
                this.conps = true;
                this.conps1 = true;
                this.toastr.success(successData.ResponseObject.message, 'Admin');
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
        if (type == 'mail') {
            this.modalRef = this.modalService.open(this.modalContent);
        } else if (type == 'now') {
            this.modalRef = this.modalService.open(this.modalContentnow);
            this.adminPassword.controls.email.patchValue(this.resetPassword.email_id);
        }
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
}

@Component({
    selector: 'button-toggle',
    template: `

        <div class="form-group">
            <span class="text-capitalize font-weight-bold table-name" data-toggle="modal" data-target="#myModal"
                  (click)="viewdetailsList()">{{viewdetail.first_name}}</span>
        </div>
        <ng-template #viewdetails let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title col-11 text-center" id="modal-basic-title"><b>Admin details</b></h4>
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
                                        <img *ngIf="viewdetail.profile_url != ''"
                                             [src]="sanitizer.bypassSecurityTrustResourceUrl(webhost + '/' + viewdetail.profile_url)"
                                             alt="">
                                        <img *ngIf="viewdetail.profile_url == '' && viewdetail.gender.toLowerCase().trim() == 'male'"
                                             src="assets/images/ristaschool/male.png" alt="">
                                        <img *ngIf="viewdetail.profile_url == '' && viewdetail.gender.toLowerCase().trim() == 'female'"
                                             src="assets/images/ristaschool/female1.png" alt="">
                                        <img *ngIf="viewdetail.profile_url == '' && viewdetail.gender.toLowerCase().trim() == 'n/a'"
                                             src="assets/images/ristaschool/Do not want to disclose.png" alt="">
                                        <img *ngIf="viewdetail.profile_url == '' && viewdetail.gender == ''"
                                             src="assets/images/ristaschool/Do not want to disclose.png" alt="">
                                    </div>
                                    <table>
                                        <tr>
                                            <td class="pl-4 capital"><b>First Name:</b></td>
                                            <td>{{viewdetail.first_name}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4 capital"><b>Last Name:</b></td>
                                            <td>{{viewdetail.last_name}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4"><b>E-mail id:</b></td>
                                            <td>{{viewdetail.email_id}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4 capital"><b>Contact Number:</b></td>
                                            <td>{{viewdetail.mobile}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4 capital"><b>Institution Name:</b></td>
                                            <td>{{viewdetail.school_name}}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-4"><b>Status:</b></td>
                                            <td class="badge badge-success" *ngIf="viewdetail.status == 'Active'">
                                                Active
                                            </td>
                                            <span class="badge  badge-danger" *ngIf="viewdetail.status == 'Inactive'">In-Active</span>
                                            <span class="badge badge-warning" *ngIf="viewdetail.status  == 'Suspended'">Suspended</span>
                                            <span class="badge badge-danger" *ngIf="viewdetail.status  == 'Deleted'">In-Active</span>
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

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();
    @ViewChild('viewdetails') viewDetailsContent: TemplateRef<any>;

    constructor(private modalService: NgbModal, public route: Router, public config: NgbModalConfig,
                public sanitizer: DomSanitizer, public confi: ConfigurationService, public auth: AuthService) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.webhost = this.confi.getimgUrl();
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
        this.auth.setSessionData('editAdmin', JSON.stringify(rows));
        this.route.navigate(['/admin/create-admin/edit']);
        this.close();
    }
}
