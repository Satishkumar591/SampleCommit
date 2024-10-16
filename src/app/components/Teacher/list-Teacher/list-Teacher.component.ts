import {Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {CategoryService} from '../../../shared/service/category.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {TitleCasePipe} from '@angular/common';
import {TeacherService} from '../../../shared/service/teacher.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import {LoginService} from '../../../shared/service/login.service';
import {ValidationService} from '../../../shared/service/validation.service';
import {ViewCell} from 'ng2-smart-table';
import {NewsubjectService} from '../../../shared/service/newsubject.service';

@Component({
    selector: 'app-list-teacher',
    templateUrl: './list-Teacher.component.html',
    styleUrls: ['./list-Teacher.component.scss']
})
export class ListTeacherComponent implements OnInit, OnChanges {
    public ntPassword: FormGroup;
    public listData: any;
    public deleteUser: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public viewdetail: any;
    public rows: any;
    public webhost: any;
    public imgUrl: any;
    public teacherBlukEmail: any = [];
    public teacherBlukEmailValue: any = [];
    public getUrl: any;
    public getUrl1: any;
    public url: any;
    public email: any;
    public conps: boolean;
    public conps1: boolean;
    public resetPassword: any;
    public message: any;
    public passwordValid: boolean;
    public allowSelect: boolean;
    public filetype: any;
    public schoolId: any;
    public schoolStatus: any;
    public validators = [this.must_be_email];
    public errorMessages = {
        'must_be_email': 'Please Enter a valid email format only allowed'
    };

    private must_be_email(control: FormControl) {
        var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
        if (control.value.length != "" && !EMAIL_REGEXP.test(control.value)) {
            return {"must_be_email": true};
        }
        return null;
    }

    @ViewChild('content') modalContent: TemplateRef<any>;
    @ViewChild('bulkmodal') bulkContent: TemplateRef<any>;
    @ViewChild('emailmodal') emailContent: TemplateRef<any>;
    @ViewChild('content1') modalContent1: TemplateRef<any>;
    @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
    @Input() page?: any;


    constructor(public category: CategoryService, public configurationService: ConfigurationService, public common: CommonService, public newSubject: NewsubjectService,
                public toastr: ToastrService, public teacher: TeacherService, public sanitizer: DomSanitizer, public firstcaps: TitleCasePipe,
                public config: NgbModalConfig, public confi: ConfigurationService, private modalService: NgbModal, public auth: AuthService,
                public commondata: CommonDataService, public route: Router, public formBuilder: FormBuilder, public loginService: LoginService, public validationService: ValidationService) {
        this.imgUrl = this.confi.getimgUrl();
        config.backdrop = 'static';
        config.keyboard = false;
        this.conps = true;
        this.conps1 = true;
        this.webhost = this.configurationService.getimgUrl();
        this.auth.removeSessionData('updatedStudent');
        this.auth.removeSessionData('readonly_startdate');
        this.auth.removeSessionData('editView');
        this.schoolId = this.auth.getSessionData('rista-school_id');
        this.ntPassword = this.formBuilder.group({
            email: [''],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            confirmpassword: ''
        });
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));

        // if (this.schoolStatus != 0) {
        //     this.newSubject.schoolChange.subscribe(params => {
        //         if (params != '') {
        //             if (this.route.url.includes('list-Teacher')) {
        //                 this.init(params);
        //             }
        //         } else {
        //             this.init(this.auth.getSessionData('rista-school_id'));
        //         }
        //     });
        // } else {
        //
        // }

        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    public settings = {
        hideSubHeader: false,
        actions: {
            custom: [
                {
                    name: 'editAction',
                    title: '<i class="fa  fa-pencil" title="Edit Teacher"></i>'
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
                        console.log(row, 'rowwww');
                    });

                },
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
                title: 'Contact Number',
            },
            grade_name: {
                title: 'Grade',
            },
            subject_name: {
                title: 'Subject',
            },
            status: {
                title: 'Status',
            }
        },
    };

    ngOnInit() {
        this.auth.removeSessionData('rista-backOption');
    }

    ngOnChanges() {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    teacherList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId
        };
        this.teacher.teacherList(data).subscribe((successData) => {
                this.teacherListSuccess(successData);
            },
            (error) => {
                this.teacherListFailure(error);
            });
    }

    teacherListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.listData = successData.ResponseObject;
            this.listData.forEach((value, index, array) => {
                this.listData[index].status = this.listData[index].status == '1' ? 'Active' : this.listData[index].status == '2' ?
                    'Inactive' : this.listData[index].status == '3' ? 'Suspended' : this.listData[index].status == '4' ? 'Deleted' : '';
            });
        }
    }

    teacherListFailure(error) {
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

    editAction(rows) {
        this.auth.setSessionData('UsersRedirection', 'Teacher');
        this.auth.setSessionData('editTeacher', JSON.stringify(rows.data));
        this.route.navigate(['/Teacher/create-Teacher/edit']);
    }

    init(id) {
        console.log(id, 'isddd');
        this.schoolId = id;
        this.teacherList();

    }

    close() {
        this.modalRef.close();
    }

    open(content) {
        this.modalService.open(content);
    }

    onSave() {
        this.modalRef.close();
    }

    deleteConfirm() {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            selected_user_id: this.deleteUser.user_id,
            role_id: this.auth.getSessionData('go-roleid'),
            user_id: this.auth.getSessionData('go-userid')
        };
        this.category.deleteUser(data).subscribe((successData) => {
                this.deleteConfirmSuccess(successData);
            },
            (error) => {
                this.deleteConfirmFailure(error);
            });
    }

    readUrl(event: any) {
        const file = event.target.files[0];
        if (event.srcElement.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || event.srcElement.files[0].type == 'application/vnd.ms-excel') {
            this.filetype = event.target.files[0].name.split('.');
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
            };
            this.toastr.success('Excel Upload Successfully', 'Success!');
        } else {
            this.toastr.error('Only Excel Format is required', 'Failed');
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
            school_id: this.schoolId,
            file: this.getUrl,
            extension: this.filetype[1],
            upload_type: 'Excel',
            user_type: 'Teacher'
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
            this.bulkInsert(type, successData.ResponseObject.upload_id);
            this.toastr.success(successData.ResponseObject.Message, 'Success!');
        } else {
            this.commondata.showLoader(false);
            this.toastr.error('Excel upload failed', 'Failed!');
        }
    }

    excelUpoadFailure(error) {
        console.log(error);
    }

    bulkInsert(type, id) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            upload_id: id,
            school_id: this.schoolId
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
            this.teacherList();
            if (type == 'upload') {
                this.toastr.success(successData.ResponseObject, 'Teacher');
            } else if (type == 'email') {
                this.toastr.success(successData.ResponseObject, 'Teacher');
            }
        } else if (!successData.IsSuccess) {
            if (type == 'upload') {
                this.toastr.error(successData.ErrorObject, 'Failure');
            } else if (type == 'email') {
                this.toastr.error('Email not sent', 'Failure');
            }
        }
    }

    bulkInsertFailure(error) {
        this.teacherList();
        this.toastr.error('Excel upload failed', 'Failed!');
        console.log(error);
    }

    emailInviteUpload(type) {
        this.teacherBlukEmail;
        for (let i = 0; i < this.teacherBlukEmail.length; i++) {
            this.teacherBlukEmailValue.push(this.teacherBlukEmail[i].value);
        }
        if (this.teacherBlukEmail.length != 0) {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.schoolId,
                email_id: this.teacherBlukEmailValue,
                format: 'Email',
                user_type: 'Teacher'
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
        } else {
            this.toastr.error(successData.ResponseObject, 'Failed!');
        }
    }

    emailInviteUploadFailure(error) {
    }

    deleteConfirmSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.onSave();
        }
    }

    deleteConfirmFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    downloadExcel() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            user_type: 'Teacher'

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
        this.teacherBlukEmail = [];
        this.modalRef = this.modalService.open(this.emailContent);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    checkPasswords() {
        const pass = this.ntPassword.controls.password.value;
        const confirmPass = this.ntPassword.controls.confirmpassword.value;
        this.passwordValid = pass !== confirmPass;
        return this.passwordValid;
    }

    cancel() {
        this.modalRef.close();
        this.ntPassword.reset();
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
            if (this.ntPassword.valid) {
                if (this.passwordValid == false) {
                    this.commondata.showLoader(true);
                    data['password'] = this.ntPassword.controls.confirmpassword.value;
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
                this.validationService.validateAllFormFields(this.ntPassword);
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
                this.toastr.success('E-mail invite sent successfully for reset password ', 'Teacher');
            } else {
                this.ntPassword.reset();
                this.toastr.success(successData.ResponseObject.message, 'Teacher');
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
            this.modalRef = this.modalService.open(this.modalContent1);
        } else if (type == 'now') {
            this.modalRef = this.modalService.open(this.modalContentnow);
            this.ntPassword.controls.email.patchValue(this.resetPassword.email_id);
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


// view content

@Component({
    selector: 'button-toggle',
    template: `

        <div class="form-group">
            <span class="text-capitalize font-weight-bold table-name" data-toggle="modal" data-target="#myModal"
                  (click)="viewdetailsList()">{{viewdetail.first_name}}</span>
        </div>
        <ng-template #viewdetails let-c="close" let-d="dismiss">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-basic-title">Teacher details</h4>
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
        this.auth.setSessionData('editTeacher', JSON.stringify(rows));
        this.route.navigate(['/Teacher/create-Teacher/edit']);
        this.close();
    }
}
