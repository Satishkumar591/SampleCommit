import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {Router} from '@angular/router';
import {NgbModalConfig, NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TeacherService} from '../../../shared/service/teacher.service';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {CommonService} from '../../../shared/service/common.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {ClassService} from '../../../shared/service/class.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {dateOptions} from '../../../shared/data/config';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-list-correction',
    templateUrl: './list-correction.component.html',
    styleUrls: ['./list-correction.component.scss']
})
export class ListCorrectionComponent implements OnInit {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        // other options are here...
    };
    public listData: any;
    public listData1: any;
    public deleteUser: any;
    public closeResult: string;
    public imgUrl: any;
    public webhost: any;
    public viewDetail: any;
    public recordBase64Url: any;
    public detailData: any;
    public sortButton: any;
    public sortType: any;
    public filterType: any;
    public schoolId: any;
    public allowSelect: boolean;
    public searchAssignment: any = '';
    private modalRef: NgbModalRef;
    public schoolStatus: any;
    public selectContent: any;
    public contentNameValue: any;
    public teacherListData: any;
    public selectTeacher: any;
    public searchClass: any = '';
    public searchStudent: any = '';
    public selectClassRoom: any;
    public classData: any;
    public batchData: any;
    public reportData: any;
    public classInfo: any;
    public showLoader: boolean;
    public buttonSelect: boolean;
    @ViewChild('reports') reports: TemplateRef<any>;
    @ViewChild('itemsReports') itemsReports: TemplateRef<any>;
    @ViewChild('showInform') showInform: TemplateRef<any>;

    constructor(public classService: ClassService, public teacher: TeacherService, public config: NgbModalConfig,
                public confi: ConfigurationService, public sanitizer: DomSanitizer, public toastr: ToastrService,
                private modalService: NgbModal, public auth: AuthService, public commondata: CommonDataService, public route: Router,
                public common: CommonService, public newSubject: NewsubjectService) {
        this.imgUrl = this.confi.getimgUrl();
        this.reportData = JSON.parse(this.auth.getSessionData('Individual-items-Report'));
        config.backdrop = 'static';
        config.keyboard = false;
        this.webhost = this.confi.getimgUrl();
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        if (this.schoolStatus.length != 0) {
            this.newSubject.schoolChange.subscribe(params => {
                if (params != '') {
                    if (this.route.url.includes('assignment-correction')) {
                        this.init(params);
                    }
                } else {
                    this.init(this.auth.getSessionData('rista-school_id'));
                }
            });
        } else {
        }
    }

    ngOnInit() {
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('rista-backOption');
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
    }

    init(res) {
        this.showLoader = false;
        this.buttonSelect = true;
        this.schoolId = res;
        this.getSearch_Filter();
        this.teacherList();
        // this.classList();       // class list not used if any issue go through this
        this.batchDataList();
        this.assignmentList(this.filterType, this.sortType);
    }

    assignmentSearch() {
        if (this.searchAssignment != '') {
            this.updateFilter(this.searchAssignment);
        }else if (this.searchClass != ''){
            this.updateFilter(this.searchClass);
        }else if (this.searchStudent != '') {
            this.updateFilter(this.searchStudent);
        }
    }

    onSave() {
        this.modalRef.close();
    }

    classList() {
        const data = {
            platform: 'web',
            type: '9',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : this.selectTeacher ? this.selectTeacher : '0',
        };
        this.classService.classesList(data).subscribe((successData) => {
                this.classListSuccess(successData);
            },
            (error) => {
                this.classListFailure(error);
            });
    }

    classListSuccess(successData) {
        if (successData.IsSuccess) {
            this.classData = successData.ResponseObject;
        }
    }

    classListFailure(error) {
        console.log(error, 'error');
    }

    batchDataList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: '2',
            list_type: 'list'
        };
        this.classService.batchList(data).subscribe((successData) => {
                this.batchListSuccess(successData);
            },
            (error) => {
                this.batchListFailure(error);
            });
    }

    batchListSuccess(successData) {
        if (successData.IsSuccess) {
            this.batchData = successData.ResponseObject;
        }
    }

    batchListFailure(error) {
        console.log(error, 'error');
    }

    teacherList() {
        this.commondata.showLoader(false);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id')
        };
        this.classService.individualTeacherList(data).subscribe((successData) => {
                this.teacherListSuccess(successData);
            },
            (error) => {
                this.teacherListFailure(error);
            });
    }

    teacherListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.teacherListData = successData.ResponseObject;
        }
    }

    teacherListFailure(error) {
        this.commondata.showLoader(false);
        console.log(error, 'error');
    }

    previewPage(id) {
        if (id.status != '1') {
            this.auth.setSessionData('rista-classDetails', JSON.stringify(id));
            this.route.navigate(['/assignment-correction/correction-page']);
        } else {
            this.toastr.error('Assignment not Started');
        }
    }

    classSort(type) {
        if (type == '1') {
            this.sortButton = 'Recent';
            this.assignmentList(this.filterType, type);
        } else if (type == '2') {
            this.sortButton = 'Name A-Z';
            this.assignmentList(this.filterType, type);
        } else if (type == '3') {
            this.sortButton = 'Name Z-A';
            this.assignmentList(this.filterType, type);
        } else if (type == '4') {
            this.sortButton = 'Oldest';
            this.assignmentList(this.filterType, type);
        }
    }

    updateFilter(event) {
        const val = event.toLowerCase();
        let temp: any;
        let classKey = this.searchClass.toLowerCase();
        let assessmentKey = this.searchAssignment.toLowerCase();
        let studentKey = this.searchStudent.toLowerCase();
        temp = this.listData1.filter( (d, index) => {
            let access = false;
            if (d.total_students_Name.length != 0) {
                // return d.student_name?.toLowerCase().indexOf(this.searchStudent) !== -1;
                d.total_students_Name.forEach((arr) => {
                    if (arr.toLowerCase().indexOf(studentKey) !== -1) {
                        access = true;
                    }
                });
            }
            if (studentKey == '') {
                access = true;
            }
            if (d.class_name != null && d.content_name != null) {
                return (d.content_name.toLowerCase().indexOf(assessmentKey) !== -1 && d.class_name.toLowerCase().indexOf(classKey) !== -1 && access);
            }
            else if (studentKey != '') {
                return access;
            }
        });
        this.listData = temp;
        this.setSearch_Filter(this.filterType, this.sortType);
    }
    // studentSearch() {
    //     let temp = this.listData1.filter((d, index) => {
    //         if (d.student_name.length != 0) {
    //             const access = false;
    //             // return d.student_name?.toLowerCase().indexOf(this.searchStudent) !== -1;
    //             d.student_name.forEach((arr) => {
    //                 if (arr.toLowerCase().indexOf(this.searchStudent) !== -1) {
    //                     access = true;
    //                 }
    //             });
    //             return access;
    //         }
    //     });
    // }

    assignmentList(id, type) {
        this.filterType = id;
        this.sortType = type;
        this.showLoader = true;
        this.buttonSelect = false;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolId,
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : this.selectTeacher ? this.selectTeacher : '0',
            type: this.filterType,
            sort: this.sortType,
            class_id: '0',
            batch_id: this.selectClassRoom ? this.selectClassRoom : '0'
        };
        this.teacher.assignmentDashboardList(data).subscribe((successData) => {
                this.assignmentListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_assignmentList');
            });
    }

    assignmentListSuccess(successData) {
        if (successData.IsSuccess) {
            this.listData = this.listData1 = successData.ResponseObject;
            this.assignmentSearch();
            this.buttonSelect = true;
            this.showLoader = false;
        }
    }

    listDetails(event) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: event.content_id,
            content_format: event.content_format,
            content_type: event.content_type,
            school_id: this.schoolId,
        };
        this.auth.setSessionData('rista-editor', JSON.stringify(data));
        if (event.content_format == '1') {
            this.auth.setSessionData('preview_page', 'create_assignments');
        } else if (event.content_format == '3') {
            this.auth.setSessionData('preview_page', 'text_assignments');
        }
        this.auth.setSessionData('rista-preview', 'assignment-correction');
        this.route.navigate(['/repository/preview']);
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

    reportDetails(type, value) {
        this.selectContent = type;
        this.contentNameValue = value.content_id;
        console.log(value);
        // let data: any;
        // data = JSON.parse(this.auth.getSessionData('card-data'));
        this.auth.setSessionData('Individual-Class-Report', JSON.stringify(value));
        this.auth.setSessionData('Individual-student-Report', JSON.stringify(value));
        this.modalRef = this.modalService.open(this.reports, {size: 'xl'});
    }

    itemsReportDetails(data) {
        console.log(data, 'itemsReport');
        this.auth.setSessionData('Individual-items-Report', JSON.stringify(data));
        this.reportData = JSON.parse(this.auth.getSessionData('Individual-items-Report'));
        this.modalRef = this.modalService.open(this.itemsReports, {size: 'xl'});
    }

    showInformation(item) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: item.content_id,
            class_id: item.class_id,
            school_id: this.schoolId
        };
        this.teacher.studentCorrectionInfo(data).subscribe((successData) => {
                this.infoSuccess(successData);
            },
            (error) => {
                console.log(error);
            });

    }
    infoSuccess(successData) {
        if (successData.IsSuccess) {
            this.classInfo = successData.ResponseObject[0];
            this.modalRef = this.modalService.open(this.showInform, {size: 'sm'});
        }
    }

    setSearch_Filter(id, type){
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.assignSearch));
        if (data != null){
            data.forEach((items) => {
                if (items.school_id == this.auth.getSessionData('rista-school_id')){
                    items.className = this.searchClass;
                    items.teacher = this.selectTeacher;
                    items.curriculum_Folder = this.selectClassRoom;
                    items.assignmentDateStatus = id;
                    items.sortType = type;
                    items.sortButton = this.sortButton;
                    items.assignmentName = this.searchAssignment;
                    items.studentName = this.searchStudent;
                }else {
                    const searchData = {
                        teacher: this.selectTeacher,
                        className: this.searchClass,
                        curriculum_Folder: this.selectClassRoom,
                        school_id: this.auth.getSessionData('rista-school_id'),
                        assignmentDateStatus: this.filterType,
                        sortType: this.sortType,
                        sortButton: this.sortButton,
                        assignmentName: this.searchAssignment,
                        studentName: this.searchStudent,
                    };
                    data.push(searchData);
                }
            });
            data = data.filter((test, index, array) =>
                index === array.findIndex((findTest) =>
                findTest.school_id === test.school_id
                )
            );
            this.auth.setSessionData(SessionConstants.assignSearch, JSON.stringify(data));
        }
    }

    getSearch_Filter(){
        let data = JSON.parse(this.auth.getSessionData(SessionConstants.assignSearch));
        data.every((items) => {
            if (items.school_id == this.auth.getSessionData('rista-school_id')){
                this.searchClass = items.className;
                this.selectTeacher = items.teacher;
                this.selectClassRoom = items.curriculum_Folder;
                this.filterType = items.assignmentDateStatus;
                this.sortType = items.sortType;
                this.sortButton = items.sortButton;
                this.searchAssignment = items.assignmentName;
                this.searchStudent = items.studentName;
                return false;
            }else {
                this.searchClass = '';
                this.searchStudent = '';
                this.selectTeacher = undefined;
                this.selectClassRoom = undefined;
                this.filterType = 2;
                this.sortType = 1;
                this.sortButton = 'Sort by';
                this.searchAssignment = '';
            }
            return true;
        });
    }
}
