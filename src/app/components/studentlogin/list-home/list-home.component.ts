import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SchoolService} from '../../../shared/service/School.service';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TeacherService} from '../../../shared/service/teacher.service';
import {NavService} from '../../../shared/service/nav.service';
import {ToastrService} from 'ngx-toastr';
import {ClassService} from '../../../shared/service/class.service';
import {CreatorService} from '../../../shared/service/creator.service';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {StudentService} from '../../../shared/service/student.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {EnvironmentService} from '../../../environment.service';

@Component({
    selector: 'app-list-home',
    templateUrl: './list-home.component.html',
    styleUrls: ['./list-home.component.scss']
})
export class ListHomeComponent implements OnInit {
    private modalRef: NgbModalRef;
    public closeResult: string;
    public imgUrl: any;
    public webhost: any;
    public viewDetail: any;
    public recordBase64Url: any;
    public classesDetails: any;
    public classesDetails1: any;
    public assessmentDetails: any;
    public assessmentDetails1: any;
    public assignmentsDetails: any;
    public assignmentsDetails1: any;
    public response: any;
    public pdfpath: any;
    public classType: any = '3';
    public classbutton: any;
    public assignType: any = '3';
    public assignButton: any;
    public assessType: any = '3';
    public assessButton: any;
    public classSortType: any = '0';
    public assignSortType: any = '0';
    public assessSortType: any = '0';
    public sortButton: any;
    public assessSortButton: any;
    public assignSortButton: any;
    public openmenu: boolean;
    public schoolListDetails: any;
    public detailData: any;
    public previewType: any;
    public classClicked: any;
    public assignClicked: any;
    public assessClicked: any;
    public allowSelect: boolean;
    public searchClass: any = '';
    public searchAssign: any = '';
    public searchAssess: any = '';
    public message: any;
    public enrollCode: any;
    public ErrorTitle: any;
    public mobileView = false;
    @ViewChild('throwError') throwError: TemplateRef<any>;

    constructor(public brandservices: SchoolService, public config: NgbModalConfig, public confi: ConfigurationService, public sanitizer: DomSanitizer,
                private modalService: NgbModal, public auth: AuthService, public common: CommonService, public commondata: CommonDataService,
                public teacher: TeacherService, public route: Router, public navServices: NavService, public toastr: ToastrService, public env: EnvironmentService,
                public creatorService: CreatorService, public classes: ClassService, public newSubject: NewsubjectService, public student: StudentService) {
        this.imgUrl = this.confi.getimgUrl();
        config.backdrop = 'static';
        this.mobileView = this.env.mobileView;
        console.log(this.mobileView, 'mobileView');
        config.keyboard = false;
        this.webhost = this.confi.getimgUrl();

        this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        this.newSubject.schoolChange.subscribe(params => {
            if (params != '') {
                if (this.route.url.includes('list-home')) {
                    this.init(params);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
        });
    }

    ngOnInit() {
        this.commondata.showLoader(false);
        // this.openmenu = false;
        // this.creatorService.changeViewList(this.openmenu);
        // this.navServices.collapseSidebar = true;
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    init(id) {
        this.getSearch_Filter();
        this.dashboardClassList();
        this.dashboardAssignmentList();
        this.dashboardAssessmentList();
    }

    close() {
        this.modalRef.close();
    }

    classFilter(type) {
        this.classClicked = '1';
        this.classType = type;
        if (type == '1') {
            this.classbutton = 'All';
        } else if (type == '2') {
            this.classbutton = 'Upcoming';
        } else if (type == '3') {
            this.classbutton = 'In Progress';
        } else if (type == '4') {
            this.classbutton = 'Completed';
        }
        this.dashboardClassList();
    }

    classSort(type) {
        this.classSortType = type;
        if (type == '1') {
            this.sortButton = 'End Date';
        } else if (type == '2') {
            this.sortButton = 'Assignee';
        } else if (type == '3') {
            this.sortButton = 'Alphabetical';
        }
        this.dashboardClassList();
    }

    assignmentFilter(type) {
        this.assignClicked = '1';
        this.assignType = type;
        if (type == '1') {
            this.assignButton = 'All ';
        } else if (type == '2') {
            this.assignButton = 'Upcoming';
        } else if (type == '3') {
            this.assignButton = 'In Progress';
        } else if (type == '4') {
            this.assignButton = 'Completed';
        }
        console.log(this.assignClicked, 'assignClicked');
        this.dashboardAssignmentList();
    }

    assignmentSort(type) {
        this.assignSortType = type;
        if (type == '1') {
            this.assignSortButton = 'End Date';
        } else if (type == '2') {
            this.assignSortButton = 'Assignee';
        } else if (type == '3') {
            this.assignSortButton = 'Alphabetical';
        }
        this.dashboardAssignmentList();
    }

    assessmentFilter(type) {
        this.assessClicked = '1';
        this.assessType = type;
        if (type == '1') {
            this.assessButton = 'All';
        } else if (type == '2') {
            this.assessButton = 'Upcoming';
        } else if (type == '3') {
            this.assessButton = 'In Progress';
        } else if (type == '4') {
            this.assessButton = 'Completed';
        }
        this.dashboardAssessmentList();
    }

    assessmentSort(type) {
        this.assessSortType = type;
        if (type == '1') {
            this.assessSortButton = 'End Date';
        } else if (type == '2') {
            this.assessSortButton = 'Assignee';
        } else if (type == '3') {
            this.assessSortButton = 'Alphabetical';
        }
        this.dashboardAssessmentList();
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

    updateFilter(event, type) {
        const val = event.toLowerCase();
        console.log(val, 'val');
        if (type == 'class') {
            const temp = this.classesDetails1.filter(function (d) {
                return d.class_name.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.classesDetails = temp;
        } else if (type == 'assign') {
            const temp1 = this.assignmentsDetails1.filter(function (d) {
                return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.assignmentsDetails = temp1;
        } else if (type == 'assess') {
            const temp2 = this.assessmentDetails1.filter(function (d) {
                return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.assessmentDetails = temp2;
        }
        this.setSearch_Filter();
    }

    checkContentTime(selectedData, type) {
        console.log(selectedData, 'val');
        let data;
        data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: selectedData.class_id,
            content_id: selectedData.content_id,
        };
        this.student.checkTime(data).subscribe((successData) => {
                this.checkContentTimeSuccess(successData, selectedData, type);
            },
            (error) => {
                this.checkContentTimeFailure(error);
            });
    }

    checkContentTimeSuccess(successData, selectedData, type) {
        if (successData.IsSuccess) {
            if (type == 'assign') {
                this.assignmentPage(selectedData);
            } else if (type == 'assess') {
                this.assessmentPage(selectedData);
            }
        } else {
            this.message = successData.ResponseObject;
            this.ErrorTitle = selectedData.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        }
    }

    checkContentTimeFailure(error) {
        console.error(error);
    }

    assessmentPage(detail) {
        if (detail.status == 1) {
            console.log(detail, 'assessment1');
            // this.toastr.error('Assignment not started');
            this.message = detail.content_name + ' ' + 'is assignment not started';
            this.ErrorTitle = detail.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        // } else if (detail.status == 3 && (detail.student_content_status == 1 || detail.student_content_status == 2)) {
        //     console.log(detail, 'assessment321');
        //     // this.toastr.error('Assessment End date is over');
        //     this.message = detail.content_name + ' ' + 'is assessment End date is over';
        //     this.ErrorTitle = detail.class_name;
        //     this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        } else if (detail.student_content_status == 3) {
            this.auth.setSessionData('rista-student-card', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/score-card']);
        } else {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/answering']);
        }
    }

    assignmentPage(detail) {
        if (detail.status == 1) {
            console.log(detail, 'assignment1');
            // this.toastr.error('Assignment not started');
            this.message = detail.content_name + ' ' + 'is assignment not started';
            this.ErrorTitle = detail.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        } else if (detail.student_content_status != 3) {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/answering']);
        } else {
            this.auth.setSessionData('rista-student-card', JSON.stringify(detail));
            this.route.navigate(['/studentlogin/score-card']);
        }
    }

    dashboardClassList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            type: this.classType,
            sort: this.classSortType
        };
        this.teacher.studentClassDashboardList(data).subscribe((successData) => {
                this.dashboardClassListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_ClassList');
            });
    }

    dashboardClassListSuccess(successData) {
        if (successData.IsSuccess) {
            this.classesDetails = successData.ResponseObject;
            this.classesDetails1 = successData.ResponseObject;
            if (this.classClicked == '1') {
            } else {
                if (this.classType == '3' && this.classesDetails.length == 0) {
                    this.classType = '2';
                    this.classbutton = 'Upcoming';
                    this.dashboardClassList();
                } else if (this.classType == '2' && this.classesDetails.length == 0) {
                    this.classType = '1';
                    this.classbutton = 'All';
                    this.dashboardClassList();
                }
            }
            this.setSearch_Filter();
        }
    }

    dashboardAssignmentList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            type: this.assignType,
            sort: this.assignSortType
        };
        this.teacher.studentAssignmentDashboardList(data).subscribe((successData) => {
                this.dashboardAssignmentSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_AssignmentList');
            });
    }

    dashboardAssignmentSuccess(successData) {
        if (successData.IsSuccess) {
            this.assignmentsDetails = successData.ResponseObject;
            this.assignmentsDetails1 = successData.ResponseObject;
            if (this.assignClicked == '1') {
            } else {
                if (this.assignType == '3' && this.assignmentsDetails.length == 0) {
                    this.assignType = '1';
                    this.assignButton = 'All';
                    this.dashboardAssignmentList();
                }
            }
            this.setSearch_Filter();
        }
    }

    dashboardAssessmentList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            student_id: this.auth.getSessionData('rista-userid'),
            type: this.assessType,
            sort: this.assessSortType
        };
        this.teacher.studentAssessmentDashboardList(data).subscribe((successData) => {
                this.dashboardAssessmentSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_AssessmentList');
            });
    }

    dashboardAssessmentSuccess(successData) {
        this.assessmentDetails = successData.ResponseObject;
        this.assessmentDetails1 = successData.ResponseObject;
        if (successData.IsSuccess) {
            if (this.assessClicked == '1') {
                console.log(this.assessClicked, 'asses');
            } else {
                if (this.assessType == '3' && this.assessmentDetails.length == 0) {
                    this.assessType = '1';
                    this.assessButton = 'All';
                    this.dashboardAssessmentList();
                }
            }
            this.setSearch_Filter();
        }
    }

    enterList(id, event) {
        if (event.status == '3') {
            // this.toastr.error('This Class has already completed');
            console.log(event, 'enterEvent');
            this.message = 'This Class has already completed';
            this.ErrorTitle = event.class_name;
            this.modalRef = this.modalService.open(this.throwError, {size: 'md'});
        } else {
            this.auth.setSessionData('class-id', this.classesDetails[id].class_id);
            this.auth.setSessionData('schedule_id', this.classesDetails[id].schedule_id);
            this.route.navigate(['/studentlogin/class-detail']);
        }
    }

    Preview(event, type) {
        if (event.content_format == 1) {
            this.previewType = 'pdf';
        } else if (event.content_format == 3) {
            this.previewType = 'text';
        }
        this.auth.setSessionData('editresources', JSON.stringify(event));
        this.listDetails(event, type);
    }

    listDetails(event, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: event.school_id
        };
        this.creatorService.repositoryDetail(data).subscribe((successData) => {
                this.detailsSuccess(successData, event, type);
            },
            (error) => {
                console.error(error, 'error_details');
            });
    }

    detailsSuccess(successData, event, type) {
        if (successData.IsSuccess) {
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('rista-editor', JSON.stringify(this.detailData));
            if (this.previewType == 'pdf') {
                this.auth.setSessionData('rista-preview', 'home');
                if (type == '1') {
                    this.auth.setSessionData('preview_page', 'create_resources');
                } else if (type == '2') {
                    this.auth.setSessionData('preview_page', 'create_assignments');
                } else if (type == '3') {
                    this.auth.setSessionData('preview_page', 'create_assessments');
                }
                this.route.navigate(['repository/preview']);
            } else if (this.previewType == 'text') {
                this.auth.setSessionData('rista-preview', 'home');
                this.auth.setSessionData('rista-backOption', 'home');
                if (type == '1') {
                    this.auth.setSessionData('preview_page', 'text_resources');
                } else if (type == '2') {
                    this.auth.setSessionData('preview_page', 'text_assignments');
                } else if (type == '3') {
                    this.auth.setSessionData('preview_page', 'text_assessments');
                }
                this.route.navigate(['repository/preview']);
            }
        }
    }

    setSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentHomeSearch));
        if (data != null) {
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')) {

                    // Class Data //
                    items.classDateStatus = this.classType;
                    items.className = this.searchAssign;
                    items.classButton = this.classbutton;
                    items.classSortType = this.classSortType;
                    items.classSortButton = this.sortButton;

                    // Assignment Data //
                    items.assignmentDateStatus = this.assignType;
                    items.assignmentName = this.searchAssign;
                    items.assignButton = this.assignButton;
                    items.assignSortType = this.assignSortType;
                    items.assignSortButton = this.assignSortButton;

                    // Assessment Data //
                    items.assessmentDateStatus = this.assessType;
                    items.assessmentName = this.searchAssign;
                    items.assessButton = this.assessButton;
                    items.assessSortType = this.assessSortType;
                    items.assessSortButton = this.assessSortButton;
                } else {
                    const searchData = {

                        // Class Data //
                        classDateStatus: this.classType,
                        className: this.searchClass,
                        classButton: this.classbutton,
                        classSortType: this.classSortType,
                        classSortButton: this.sortButton,

                        // Assignment Data //
                        assignmentDateStatus: this.assignType,
                        assignmentName: this.searchAssign,
                        assignButton: this.assignButton,
                        assignSortType: this.assignSortType,
                        assignSortButton: this.assignSortButton,

                        // Assessment Data //
                        assessmentDateStatus: this.assessType,
                        assessmentName: this.searchAssess,
                        assessButton: this.assessButton,
                        assessSortType: this.assessSortType,
                        assessSortButton: this.assessSortButton,
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
            this.auth.setSessionData(SessionConstants.studentHomeSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter() {
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentHomeSearch));
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')) {

                // class Data //
                this.classType = items.classDateStatus;
                this.searchClass = items.className;
                this.sortButton = items.classSortButton;
                this.classSortType = items.classSortType;
                this.classbutton = items.classButton;

                // Assignment Data //
                this.assignType = items.assignmentDateStatus;
                this.searchAssign = items.assignmentName;
                this.assignSortButton = items.assignSortButton;
                this.assignSortType = items.assignSortType;
                this.assignButton = items.assignButton;

                // Assessment Data
                this.assessType = items.assessmentDateStatus;
                this.searchAssess = items.assessmentName;
                this.assessSortButton = items.assessSortButton;
                this.assessSortType = items.assessSortType;
                this.assessButton = items.assessButton;

                return false;
            } else {
                this.classType = this.assignType = this.assessType = '3';
                this.classbutton = this.assignButton = this.assessButton = 'In Progress';
                this.searchClass = this.searchAssign = this.searchAssess = '';
                this.classSortType = this.assignSortType = this.assessSortType = '0';
                this.sortButton = this.assignSortButton = this.assessSortButton = 'Sort';
            }
            return true;
        });
    }
}

