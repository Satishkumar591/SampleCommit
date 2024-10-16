import { Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {SchoolService} from '../../../shared/service/School.service';
import {ClassroomService} from '../../../shared/service/classroom.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {NavService} from '../../../shared/service/nav.service';

@Component({
    selector: 'app-list-category',
    templateUrl: './list-classroom.component.html',
    styleUrls: ['./list-classroom.component.scss']
})
export class ListClassroomComponent implements OnInit {
    public listData: any;
    public deleteUser: any;
    private modalRef: NgbModalRef;
    public closeResult: string;
    public filetype: any;
    public roleid: any;
    public allowAdd = true;
    public allowEdit: boolean;
    public teacherschool: any;
    public url: any;
    public getUrl: any;
    public getUrl1: any;
    public schoolData: any;
    public webhost: any;
    public schoolStatus: any;
    public fileUploader: any;
    public schoolDataList: any = 0;
    public allowSelect: boolean;
    public getScreenHeight: any;
    public filterType: any = 'Latest';
    public schoolID: any;
    public settings = {
        hideSubHeader: false,
        columns: {
            batch_name: {
                title: 'Content Folder Name'
            },
            status: {
                title: 'Status',
            },
        },
        actions: {
            custom: [
                {
                    name: 'viewAction',
                    title: '&nbsp;&nbsp;<i class="fa fa-folder-open-o" title="View Resources" aria-hidden="true"></i>'
                },
                {
                    name: 'editAction',
                    title: '<i class="fa  fa-pencil ml-3" title="Edit Classroom"></i>'
                }
            ],
            add: false,
            edit: false,
            delete: false,
            position: 'right',
        },
    };

    @ViewChild('bulkModal') bulkContent: TemplateRef<any>;

    constructor(public config: NgbModalConfig, public confi: ConfigurationService, public navService: NavService,
                public auth: AuthService, public commondata: CommonDataService, private modalService: NgbModal,
                public route: Router, public firstcaps: TitleCasePipe, public toastr: ToastrService, public newSubject: NewsubjectService,
                public common: CommonService, public schoolService: SchoolService, public classroom: ClassroomService) {
        this.webhost = this.confi.getimgUrl();
        config.backdrop = 'static';
        config.keyboard = false;
        this.allowEdit = true;
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('updatedStudent');
        this.auth.removeSessionData('readonly_startdate');
        if (this.schoolStatus.length != 0) {
            this.newSubject.schoolChange.subscribe(params => {
                if (params != '') {
                    if (this.route.url.includes('list-classroom')) {
                        this.schoolID = params;
                        this.init(params);
                    }
                } else {
                    this.init(this.auth.getSessionData('rista-school_id'));
                }
            });
        }
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.navService.MENUITEMS.forEach((items) => {
            if (items.title == 'Content Library') {
                this.newSubject.highListSideBarMenu(items);
            }
        });
    }

    ngOnInit() {
        this.auth.removeSessionData('rista-backOption');
        this.getScreenHeight = window.innerHeight;
    }

    @HostListener('window:resize', ['$event'])
    onResize($event: Event): void {
        this.getScreenHeight = window.innerHeight;
    }

    init(params) {
        if (this.roleid == '4') {
            this.teacherschool = JSON.parse(this.auth.getSessionData('rista_data1'));
            console.log(this.teacherschool, 'teacherSchool')
            if (this.teacherschool.permissions[5]?.allowNav && this.auth.getSessionData('rista-teacher_type') == '0') {
                this.allowAdd = this.teacherschool.permissions[5]?.permission[0]?.status == 1;
                this.allowEdit = this.teacherschool.permissions[5]?.permission[2]?.status == 1;
                // this.getBatchList();
            }
        } else {
            // this.getBatchList();
        }
    }
  
    onCustomAction(event) {
        switch (event.action) {
            case 'editAction':
                if (this.allowEdit == true) {
                    this.auth.setSessionData('editclassroom', JSON.stringify(event.data));
                    this.route.navigate(['/classroom/create-classroom/edit']);
                } else {
                    this.toastr.error('You don\'t have permission to edit classroom', 'Classroom');
                }
                break;

            case 'viewAction':
                this.viewbatchresource(event);
        }
    }

    viewbatchresource(item) {
        const data = item.data;
        this.auth.setSessionData('rista-classbatch', JSON.stringify(data));
        this.route.navigate(['/class/view-assign/2']);
    }

    showBulk() {
        this.filetype = '';
        this.modalRef = this.modalService.open(this.bulkContent);
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

    onSave() {
        this.modalRef.close();
    }

    close() {
        this.modalRef.close();
        this.fileUploader = '';
        this.filetype = '';
    }


    getBatchList() {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            type: '1',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            corporate_id: this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '4' ? '0' : this.auth.getSessionData('rista-corporate_id')
        };
        this.classroom.batchList(data).subscribe((successData) => {
                this.batchListSuccess(successData);
            },
            (error) => {
                this.batchListFailure(error);
            });
    }

    batchListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.listData = successData.ResponseObject;
            this.listData.forEach((value, index, array) => {
                this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
                    'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '';
            });
        }
    }

    batchListFailure(error) {
        this.commondata.showLoader(false);
    }
}
