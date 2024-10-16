import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../shared/service/common.service';
import {FormBuilder} from '@angular/forms';
import {ClassService} from '../../../shared/service/class.service';
import {DomSanitizer} from '@angular/platform-browser';
import {NavService} from '../../../shared/service/nav.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-list-category',
    templateUrl: './studentlist-class.component.html',
    styleUrls: ['./studentlist-class.component.scss']
})
export class StudentlistClassComponent implements OnInit {
    private modalRef: NgbModalRef;
    public closeResult: string;
    public webhost: any;
    public choosedData: any;
    public choosedData1: any;
    public classlisthighlight: any;
    public allowSelect: any;
    public searchClass: any;
    public message: any;
    public ErrorTitle: any;
    @ViewChild('throwError') throwError: TemplateRef<any>;

    constructor(private formBuilder: FormBuilder, public config: NgbModalConfig, public confi: ConfigurationService, public navServices: NavService,
                public auth: AuthService, public commondata: CommonDataService, private modalService: NgbModal, public sanitizer: DomSanitizer,
                public route: Router, public firstcaps: TitleCasePipe, public toastr: ToastrService, public newSubject: NewsubjectService,
                public common: CommonService, public classes: ClassService, public datePipe: DatePipe, public env: EnvironmentService) {
        this.webhost = this.confi.getimgUrl();
        config.backdrop = 'static';
        config.keyboard = false;
        this.newSubject.schoolChange.subscribe(params => {
            if (params != '') {
                if (this.route.url.includes('list-class')) {
                    this.init(params);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
        });
    }

    ngOnInit() {
        this.navServices.collapseSidebar = true;
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    init(id) {
        this.getSearch_Filter();
        this.classList(this.classlisthighlight);
    }

    open(content) {
        this.modalService.open(content);
    }

    classSearch() {
        if (this.searchClass != '') {
            this.updateFilter(this.searchClass);
        }
    }

    onSave() {
        this.modalRef.close();
    }

    close() {
        this.modalRef.close();
    }

    classList(id) {
        this.setSearch_Filter(id);
        this.classlisthighlight = id;
        const data = {
            platform: 'web',
            type: id,
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
        };
        this.classes.studentClassDashboardList(data).subscribe((successData) => {
                this.classListSuccess(successData);
            },
            (error) => {
                this.classListFailure(error);
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            this.choosedData = successData.ResponseObject;
            this.choosedData1 = successData.ResponseObject;
            this.classSearch();
        }
    }

    classListFailure(error) {
        console.log(error, 'error');
    }

    updateFilter(event) {
        const val = event.toLowerCase();
        const temp = this.choosedData1.filter(function (d) {
            return d.class_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.choosedData = temp;
        this.setSearch_Filter(this.classlisthighlight);
    }

    enterList(id, event) {
        if (event.status == '3') {
            // this.toastr.error('This Class has already completed');
            this.message = 'This Class has already completed';
            this.ErrorTitle = event.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        } else if (event.status == '1') {
            this.toastr.info('This Class Not Started');
        } else {
            this.auth.setSessionData('class-id', this.choosedData[id].class_id);
            this.auth.setSessionData('schedule_id', this.choosedData[id].schedule_id);
            this.route.navigate(['/studentlogin/class-detail']);
        }
    }
    dayFromInt(val) {
        return val == 1 ? 'MON' : val == 2 ? 'TUE' : val == 3 ? 'WED' : val == 4 ? 'THU' : val == 5 ? 'FRI' : val == 6 ? 'SAT' : 'SUN'
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

    setSearch_Filter(id) {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentClassSearch));
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                    items.classDateStatus = id;
                    items.className = this.searchClass;
                } else {
                    const searchData = {
                        className: this.searchClass,
                        classDateStatus: id,
                        school_id: this.auth.getSessionData('rista-school_id')
                    };
                    data.push(searchData);
                }
            });
            data = data.filter((test, index, array) =>
                index === array.findIndex((findTest) =>
                findTest.school_id === test.school_id
                )
            );
            this.auth.setSessionData(SessionConstants.studentClassSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentClassSearch));
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {
                this.classlisthighlight = items.classDateStatus;
                this.searchClass = items.className;
                return false;
            } else {
                this.searchClass = '';
                this.classlisthighlight = '3';
            }
            return true;
        });
    }
}
