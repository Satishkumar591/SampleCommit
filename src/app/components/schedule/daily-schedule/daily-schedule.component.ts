import {Component, Input, OnChanges, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {ClassService} from '../../../shared/service/class.service';
import {DatePipe} from '@angular/common';
import {stringify} from 'querystring';
import {ToastrService} from 'ngx-toastr';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {StudentService} from '../../../shared/service/student.service';
import {dateOptions, timeZone} from '../../../shared/data/config';
import {ZoomServiceService} from '../../../shared/service/zoom-service.service';
import {Router} from '@angular/router';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {split} from 'ts-node';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';

@Component({
    selector: 'app-daily-schedule',
    templateUrl: './daily-schedule.component.html',
    styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit, OnChanges {
    public setDate = new Date().toLocaleString('en-US', {timeZone: timeZone.location});
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        calendarAnimation: {
            in: 4,
            out: 4
        }
    };
    public gradeData = [];
    public subjectData = [];
    public scheduleData = [];
    public scheduleDataAlt = [];
    public notesList = [];
    public classNotesList = [];
    public searchClass: any = '';
    public searchStudent: any = '';
    public searchTeacher: any = '';
    public contentNameValue: any = '';
    public classNotes: any = '';
    public customLoader = false;
    public studentEmailForm: FormGroup;
    public searchDate: IMyDateModel = {
        isRange: false,
        singleDate: {jsDate: new Date(this.setDate)}
    };
    public searchDate1: any;
    public currentDate: any;
    public viewdetail: any;
    public studentName: any;
    public classId: any;
    public selectedClass: any;
    public schoolListDetails: any;
    public scheduleDetail: any;
    public studentDetail: any;
    public detailData: any;
    public schoolStatus: any;
    public allowClass: boolean = true;
    public teacherType: any;
    public settingValue = '0';
    public settingList = [];
    public emailList: any = [];
    removable = true;
    validationEmail = false;
    public separatorKeysCodes = [ENTER, COMMA];
    public blukEmailValue: any = [];
    public selectClassData: any;
    public classInfo: any;
    public roleId: any;

    @ViewChild('viewoveralldetails') viewoveralldetails: TemplateRef<any>;
    @ViewChild('zoomDialog') zoomDialog: TemplateRef<any>;
    @ViewChild('zoomDialog1') zoomDialog1: TemplateRef<any>;
    @ViewChild('meetingSelection') meetingSelection: TemplateRef<any>;
    @ViewChild('recordinglist') recordinglist: TemplateRef<any>;
    @ViewChild('reports') reports: TemplateRef<any>;
    @ViewChild('notes') notes: TemplateRef<any>;
    @ViewChild('writeNoteOpen') writeNoteOpen: TemplateRef<any>;
    @ViewChild('addMultipleEmailDialog') addMultipleEmailDialog: TemplateRef<any>;
    @ViewChild('showInform') showInform: TemplateRef<any>;
    public modalRef: NgbModalRef;
    allowEditCompleted = true;
    @Input() page?: any;
    public editorValue: any;

    constructor(public auth: AuthService, public commondata: CommonDataService, public classes: ClassService, public formBuilder: FormBuilder, public content: ContentdetailService,
                public datePipe: DatePipe, public toastr: ToastrService, public zoomService: ZoomServiceService,
                private modalService: NgbModal, public student: StudentService, public route: Router, public newService: NewsubjectService) {
        this.roleId = this.auth.getRoleId();
        if (this.roleId != '5') {
            this.settingList = JSON.parse(this.auth.getSessionData('settingList'));
            this.settingList.forEach((items) => {
                if (items.name == 'teacher_zoom_view') {
                    this.settingValue = items.value;
                }
            });
        }
        const date = new Date(this.setDate);
        this.searchDate1 = {
            isRange: false,
            singleDate: {jsDate: new Date(this.setDate)}
        };
        this.searchDate1 = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.currentDate = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        // if (this.schoolStatus.length != 0) {
        //     this.newService.schoolChange.subscribe((res: any) => {
        //         if (res != '') {
        //             if (this.route.url.includes('list-class')) {
        //                 this.init(res);
        //             }
        //         } else {
        //             this.init(this.auth.getSessionData('rista-school_id'));
        //         }
        //     });
        // }
        this.studentEmailForm = this.formBuilder.group({
            emails: this.formBuilder.array([], [this.validateArrayNotEmpty]),
        });
    }

    ngOnInit(): void {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    ngOnChanges() {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    cardNavigation(item) {
        if (this.roleId == '5') {
            this.enterList(item);
        }
    }

    enterList(item) {
        if (item.status == '1') {
            this.toastr.info('This Class Not Started');
        } else {
            this.auth.setSessionData('class-id', item.class_id);
            this.auth.setSessionData('schedule_id', item.schedule_id);
            this.route.navigate(['/studentlogin/class-detail']);
        }
    }

    editClass(value) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: value.class_id,
            grade: [value.grade_id],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.commondata.showLoader(true);
        this.classes.classDetails(data).subscribe((successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                // this.enterListFailure(error);
            });
    }

    enterListSuccess(successData) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('classView', true);
            this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
            this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
            this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('updatedStudent', 1);
            this.auth.removeSessionData('enterThroughSchedule');
            if (this.detailData[0].classDate_status == '2' || this.detailData[0].classDate_status == '5') {
                if (this.allowClass == false) {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    this.auth.setSessionData('readonly_data', 'true');
                } else {
                    this.auth.removeSessionData('readonly_startdate');
                    this.auth.removeSessionData('readonly_data');
                }
                if (this.detailData[0].class_status != '1') {
                    this.route.navigate(['/class/create-class/edit']);
                } else {
                    this.route.navigate(['/class/create-class/edit']);
                    this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                    this.auth.setSessionData('updatedStudent', 1);
                }
            } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0' && this.roleId != '2' && !this.allowEditCompleted) {
                this.route.navigate(['/class/list-class']);
            } else if (this.detailData[0].classDate_status == '4' && (this.detailData[0].class_status == '1' || (this.roleId == '2' || this.allowEditCompleted))) {
                console.log('1', 'enter logic');
                if (this.allowClass == false) {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    this.auth.setSessionData('readonly_data', 'true');
                } else {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    this.auth.setSessionData('classView', false);
                    console.log('2', 'enter complete class');
                }
                this.route.navigate(['/class/create-class/addEdit']);
                this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                this.auth.setSessionData('updatedStudent', 1);
            } else if (this.detailData[0].classDate_status == '3') {
                if (this.detailData[0].class_status == '1') {
                    this.auth.removeSessionData('readonly_startdate');
                    this.auth.removeSessionData('readonly_data');
                } else {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    if (this.auth.getSessionData('rista-roleid') == '4' && this.teacherType == '0') {
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.removeSessionData('readonly_data');
                    }
                }
                this.route.navigate(['/class/create-class/edit']);
            }
        }
    }

    curriculum(value) {
        if (this.roleId != '5') {
            this.auth.setSessionData('card-data', JSON.stringify([value]));
            this.route.navigate(['/class/topicsAndCurriculum/3']);
        } else {
            this.enterList(value);
        }
    }

    selectIconClass(type, list, i) {
        if (type === 'shareClass') {
            // this.shareEmail(list);
        } else if (type === 'videoCamera') {
            this.openZoomDialog(list);
        } else if (type === 'record') {
            // this.openRecordingList(list);
        } else if (type === 'curriculum') {
            // this.curicullum(list);
        } else if (type === 'notes') {
            this.openNotes(i, list);
        } else if (type === 'information') {
            // this.showInformation(list);
        } else if (type === 'reports') {
            this.reportDetails(list);
        } else if (type === 'enter') {
            if (!(this.auth.getRoleId() === '4')) {
                this.enterClass(i, 'edit');
            } else {
                this.toastr.error('Not allowed in Enter');
            }
        }
    }

    init(id) {
        if (this.auth.getRoleId() == '4') {
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.teacherType = this.auth.getSessionData('rista-teacher_type');
            if (this.teacherType == '0') {
                this.allowClass = this.schoolListDetails.permissions[6].permission[0].status == 1;
                this.allowEditCompleted = this.schoolListDetails.permissions[6]?.permission[0]?.status == 1;
            } else {
                this.allowClass = true;
            }
        }
        this.getScheduleDetails();
    }

    closeOverAll() {
        this.modalRef.close('viewoveralldetails');
    }

    clickEve(item, type) {
        item.attendance = type == 'true' ? '1' : '0';
    }

    setFilter() {
        // let classFilterArray = [];
        // let teacherFilterArray = [];
        // let studentFilterArray = [];
        // if (this.searchClass != '') {
        //     classFilterArray = this.scheduleDataAlt.filter((val) => {
        //         if (val.class_name.toLowerCase().indexOf(this.searchClass.toLowerCase()) > -1) {
        //             return true;
        //         }
        //     });
        // } else {
        //     classFilterArray = [...this.scheduleDataAlt];
        // }
        // if (this.searchTeacher != '') {
        //     teacherFilterArray = classFilterArray.filter((val) => {
        //         if (val.teacher_name.toLowerCase().indexOf(this.searchTeacher.toLowerCase()) > -1) {
        //             return true;
        //         }
        //     });
        // } else {
        //     teacherFilterArray = [...classFilterArray];
        // }
        // if (this.searchStudent != '') {
        //   studentFilterArray = teacherFilterArray.filter((val) => {
        //       let exist = false;
        //       val.student_details.forEach((items) => {
        //           if (items.student_name.toLowerCase().indexOf(this.searchStudent.toLowerCase()) > -1) {
        //               exist = true;
        //           }
        //       });
        //       return exist;
        //   });
        // } else {
        //   studentFilterArray = [...teacherFilterArray];
        // }
        // this.scheduleData = [...studentFilterArray];


        this.scheduleData = this.scheduleDataAlt.filter((val) => {
            if (val.class_name.toLowerCase().indexOf(this.searchClass.toLowerCase()) > -1
                && val.teacher_name.toLowerCase().indexOf(this.searchTeacher.toLowerCase()) > -1) {
                if (this.searchStudent == '') {
                    return true;
                } else {
                    let exist = false;
                    val.student_details.forEach((items) => {
                        if (items.student_name.toLowerCase().indexOf(this.searchStudent.toLowerCase()) > -1) {
                            exist = true;
                        }
                    });
                    return exist;
                }
            }
        });
    }

    onDateChanged(event: IMyDateModel) {
        const splitDate = event.singleDate.formatted.split('-');
        const joinDate = splitDate[1] + '-' + splitDate[0] + '-' + splitDate[2];
        console.log(joinDate, 'joinDate');
        this.searchDate1 = joinDate;
        this.searchDate = event;
        console.log(this.searchDate1, 'serachDatee');
        this.getScheduleDetails();
        console.log(this.searchDate, 'this.searchDate');
        console.log(this.currentDate, 'this.currentDate');
    }

    getScheduleDetails() {
        const date = this.datePipe.transform(this.searchDate.singleDate.jsDate, 'dd-MM-yyyy');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            date
        };
        this.classes.overallClassAttendance(data).subscribe((successData) => {
            this.overallClassAttendanceSuccess(successData);
        }, (error) => {
            console.log(error);
        });
    }

    overallClassAttendanceSuccess(successData) {
        if (successData.IsSuccess) {
            this.scheduleDataAlt = successData.ResponseObject;
            this.sortByTime();
            this.scheduleData = JSON.parse(JSON.stringify(this.scheduleDataAlt));
        }
    }

    updateStudentAnnotate(item) {
        console.log(item);
        const date1 = this.searchDate.singleDate.jsDate;
        const date = this.datePipe.transform(date1, 'dd-MM-yyyy');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: item.class_id,
            date,
            attendence: item.student_details,
            start_date: item.start_date,
            start_time: item.start_time,
            end_time: item.end_time,
            slot_day: item.slot_days == 'Monday' ? '1' : item.slot_days == 'Tuesday' ? '2' : item.slot_days == 'Wednesday' ? '3' : item.slot_days == 'Thursday' ? '4' : item.slot_days == 'Friday' ? '5' : item.slot_days == 'Saturday' ? '6' : '7',
            type: 'add'
        };
        this.classes.updateAttendance(data).subscribe((successData: any) => {
                if (successData.IsSuccess) {
                    this.toastr.success(successData.ResponseObject, 'Success');
                } else {
                    this.toastr.error(successData.ErrorObject, 'Failed');
                }
            },
            (error) => {
                console.log(error);
            });
    }

    getStudentFullDetail(item) {
        console.log(item, 'datum');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            type: 'list'
        };
        this.student.getStudentList(data).subscribe((successData) => {
                this.studentFullDetailSuccess(successData, item);
            },
            (error) => {
                console.log(error);
            });
    }

    studentFullDetailSuccess(successData, item) {
        if (successData.IsSuccess) {
            successData.ResponseObject.forEach((val) => {
                if (val.user_id == item.student_id) {
                    this.viewdetail = val;
                    this.studentName = item.student_name;
                }
            });
            this.modalRef = this.modalService.open(this.viewoveralldetails, {size: 'xl'});
            console.log(this.viewdetail, 'viewDetail');
        }
    }

    getMeetingLink(datum, index) {
        console.log(datum, 'datum');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            // start_date: datum.start_date,
            // end_date: datum.end_date,
            class_id: datum.class_id,
            class_type: datum.availabilityDate[index].class_type,
            allow_zoom_api: datum.allow_zoom_api,
            notes: datum.notes == undefined ? [] : datum.notes,
            schedule_id: datum.availabilityDate[index].shechdule_id,
            slotday: datum.availabilityDate[index].slotday,
            slotstarttime: datum.availabilityDate[index].slotstarttime,
            slotendtime: datum.availabilityDate[index].slotendtime,
            slotselected: datum.availabilityDate[index].slotselected,
        };
        this.classes.zoomInstant(data).subscribe((successData: any) => {
            this.zoomInstantSuccess(successData, datum);
        }, (error) => {
            this.toastr.error(error.ErrorObject, 'Failed!');
            this.commondata.showLoader(false);
        });
    }

    zoomInstantSuccess(successData, datum) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            console.log(successData.ResponseObject, 'successData.ResponseObject');
            if (datum.allow_zoom_api == '0') {
                this.navigateOutsideZoom(successData.ResponseObject);
            } else if (datum.allow_zoom_api == '1') {
                if (this.settingValue == '2') {
                    this.modalRef = this.modalService.open(this.zoomDialog, {size: 's'});
                } else if (this.settingValue == '1') {
                    this.navigateOutsideZoom(successData.ResponseObject);
                } else if (this.settingValue == '0') {
                    this.zoomService.initZoomMeeting(datum);
                }
            }
        } else {
            this.toastr.error(successData.ErrorObject, 'Failed!');
        }
    }

    navigateOutsideZoom(data) {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        // if (this.selectedClass.allow_zoom_api == '0') {
        //     link.setAttribute('href', data.meeting_link);
        // } else {
        //     //role id 4 is teacher
        //     if (this.auth.getRoleId() == '4') {
        //         link.setAttribute('href', data.teacher_link);
        //     } else if (this.auth.getRoleId() == '5') {
        //         link.setAttribute('href', data.student_link);
        //     }
        // }
        if (this.selectedClass.allow_zoom_api == '0') {
            link.setAttribute('href', data.meeting_link);
            console.log(data.meeting_link, 'data.meeting_link');
        } else {
            link.setAttribute('href', data.teacher_link);
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    openZoomDialog(data) {
        if (!this.customLoader) {
            this.customLoader = true;
            this.selectedClass = data;
            if (data.availabilityDate.length == 0) {
                this.modalRef = this.modalService.open(this.zoomDialog1, {size: 's'});
            } else {
                if (this.selectedClass.allow_zoom_api == '0') {
                    this.navigateOutsideZoom(data.availabilityDate[0]);
                } else {
                    this.getMeetingLink(data, 0);
                }
            }
            this.customLoader = false;
        }
    }

    reportDetails(data) {
        this.auth.setSessionData('Individual-Class-Report', JSON.stringify(data));
        this.modalRef = this.modalService.open(this.reports, {size: 'xl'});
        this.contentNameValue = '';
    }

    enterClass(id, type) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.scheduleData[id].class_id,
            grade: [this.scheduleData[id].grade_id],
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0'
        };
        this.commondata.showLoader(true);
        this.classes.classDetails(data).subscribe((successData) => {
                this.enterClassSuccess(successData, type);
            },
            (error) => {
                console.log(error);
            });
    }

    enterClassSuccess(successData, type) {
        this.commondata.showLoader(false);
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            if (type == 'notes') {
                this.classNotesList = successData.ResponseObject[0].notes;
            } else {
                this.detailData = successData.ResponseObject;
                this.auth.setSessionData('classView', true);
                this.auth.setSessionData('enterThroughSchedule', true);
                this.auth.setSessionData('studentlist', JSON.stringify(this.detailData[0].students));
                this.auth.setSessionData('studentlist1', JSON.stringify(this.detailData[0].students));
                this.auth.setSessionData('card-data', JSON.stringify(this.detailData));
                this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
                this.auth.setSessionData('updatedStudent', 1);
                if (this.detailData[0].classDate_status == '2' || this.detailData[0].classDate_status == '5') {
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    }
                    if (this.detailData[0].class_status != '1') {
                        this.route.navigate(['/class/create-class/edit']);
                    } else {
                        this.route.navigate(['/class/create-class/edit']);
                        this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                        this.auth.setSessionData('updatedStudent', 1);
                    }
                } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0') {
                    this.route.navigate(['/class/list-class']);
                } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '1') {
                    if (this.allowClass == false) {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        this.auth.setSessionData('readonly_data', 'true');
                    } else {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    }
                    this.route.navigate(['/class/create-class/addEdit']);
                    this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                    this.auth.setSessionData('updatedStudent', 1);
                } else if (this.detailData[0].classDate_status == '3') {
                    if (this.detailData[0].class_status == '1') {
                        this.auth.removeSessionData('readonly_startdate');
                        this.auth.removeSessionData('readonly_data');
                    } else {
                        this.auth.setSessionData('readonly_startdate', 'yes');
                        if (this.auth.getSessionData('rista-roleid') == '4' && this.teacherType == '0') {
                            this.auth.setSessionData('readonly_data', 'true');
                        } else {
                            this.auth.removeSessionData('readonly_data');
                        }
                    }
                    this.route.navigate(['/class/create-class/edit']);
                }
            }
        }
    }

    openNotes(scheduleData, studentData) {
        this.scheduleDetail = scheduleData;
        this.studentDetail = studentData;
        this.scheduleNotesList();
        this.modalRef = this.modalService.open(this.notes, {size: 'lg'});
    }

    sortByTime() {
        this.scheduleDataAlt.forEach((items) => {
            const splitMeridian = items.start_time.split(' ');
            const splitTime = splitMeridian[0].split(':');
            if (splitMeridian[1] == 'AM' && splitTime[0] == '12') {
                const convert = '0' + '.' + splitTime[1];
                items.convertedTime = parseFloat(convert);
            } else if (splitMeridian[1] == 'PM' && parseInt(splitTime[0]) < 12) {
                const add12 = parseInt(splitTime[0]) + 12;
                const convert = add12.toString() + '.' + splitTime[1];
                items.convertedTime = parseFloat(convert);
            } else {
                splitMeridian[0] = splitMeridian[0].replace(':', '.');
                items.convertedTime = parseFloat(splitMeridian[0]);
            }
        });
        this.scheduleDataAlt.sort((a, b) => a.convertedTime - b.convertedTime);
    }

    scheduleNotesList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.scheduleDetail.class_id,
            content_id: '0',
            student_id: this.studentDetail.student_id
        };
        this.classes.scheduleNotesList(data).subscribe((successData) => {
                this.scheduleNotesListSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }

    scheduleNotesListSuccess(successData) {
        if (successData.IsSuccess) {
            this.notesList = successData.ResponseObject;
        }
    }

    addNotes() {
        if (this.classNotes != '') {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                class_id: this.scheduleDetail.class_id,
                student_id: this.studentDetail.student_id,
                content_id: '0',
                notes: this.classNotes.replace(/\r?\n/g, '<br />'),
                type: '1'
            };
            this.classes.addScheduleNotes(data).subscribe((successData) => {
                    this.addScheduleNoteSuccess(successData, data);
                },
                (error) => {
                    console.log(error);
                });
        } else {
            this.toastr.error('Please enter notes');
        }
    }

    deleteNotes(item) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            class_id: this.scheduleDetail.class_id,
            schedule_id: this.scheduleDetail.schedule_id,
            student_id: this.studentDetail.student_id,
            id: item.id
        };
        this.content.notesDelete(data).subscribe((successData) => {
                this.addScheduleNoteSuccess(successData, data);
            },
            (error) => {
                console.log(error);
            });
    }

    addScheduleNoteSuccess(successData, data) {
        if (successData.IsSuccess) {
            if (data.type == '1') {
                this.editorValue != '' ? this.editorValue.setContent('') : '';
                this.classNotes = '';
            }
            this.scheduleNotesList();
        }
    }

    getEditorValue(event) {
        this.editorValue = event.editor;
        this.classNotes = event.content;
    }

    openClassNotes(i, value) {
        this.modalRef = this.modalService.open(this.writeNoteOpen, {size: 'lg'});
        this.classNotes = '';
        this.classId = value.class_id;
        this.enterClass(i, 'notes');
    }

    addClassNote() {
        if (this.classNotes == '') {
            this.toastr.error('Notes should not be empty');
            return false;
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.classId,
            note: this.classNotes.replace(/\r?\n/g, '<br />'),
            status: '1',
            add_date: this.currentDate
        };
        this.classes.getNotesList(data).subscribe((successData: any) => {
                if (successData.IsSuccess) {
                    this.classNotesList = successData.ResponseObject;
                    this.editorValue != '' ? this.editorValue.setContent('') : '';
                    this.classNotes = '';
                } else {
                    this.toastr.error(successData.ErrorObject);
                }
            },
            (error) => {
            });
    }

    deleteClassNote(value) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.classId ? this.classId : '',
            note: value.note,
            status: '2',
            id: value.id,
            add_date: value.add_date
        };
        this.classes.getNotesList(data).subscribe((successData: any) => {
                this.commondata.showLoader(false);
                if (successData.IsSuccess) {
                    this.classNotesList = successData.ResponseObject;
                } else {
                    this.toastr.error(successData.ErrorObject);
                }
            },
            (error) => {
                this.commondata.showLoader(false);
            });
    }

    showInformation(data) {
        this.classInfo = data;
        this.modalRef = this.modalService.open(this.showInform, {size: 'sm'});
    }

    shareEmail(value) {
        console.log(value);
        this.emailList = [];
        this.blukEmailValue = [];
        this.selectClassData = value;
        this.modalRef = this.modalService.open(this.addMultipleEmailDialog, {size: 'lg'});
    }

    add(event): void {
        const a = event.value.split(/[ ,]+/);
        console.log(a.length, 'event.value');
        if (a.length != 0) {
            for (let i = 0; i < a.length; i++) {
                if (this.validateEmail(a[i])) {
                    this.emailList.push({value: a[i], invalid: false});
                } else if (a[i] != '') {
                    this.emailList.push({value: a[i], invalid: true});
                    this.studentEmailForm.controls['emails'].setErrors({incorrectEmail: true});
                }
                console.log(this.emailList, 'emailList');
            }
        } else {
            if (a) {
                if (this.validateEmail(a)) {
                    this.emailList.push({value: a, invalid: false});
                } else if (a != '') {
                    this.emailList.push({value: a, invalid: true});
                    this.studentEmailForm.controls['emails'].setErrors({incorrectEmail: true});
                }
                console.log(this.emailList, 'emailList');
            }
        }
        if (event.input) {
            event.input.value = '';
        }
        this.emailList = this.removeDuplicates(this.emailList, 'value');
        const validation = this.emailList;
        this.validationEmail = validation.every((items) => {
            if (!items.invalid) {
                return true;
            }
            return false;
        });
        console.log(this.emailList, 'emailListOveral');
    }

    removeDuplicates(originalArray, prop) {
        const newArray = [];
        const lookupObject = {};

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    removeEmail(data: any): void {
        if (this.emailList.indexOf(data) >= 0) {
            this.emailList.splice(this.emailList.indexOf(data), 1);
        }
        const validation = this.emailList;
        this.validationEmail = validation.every((items) => {
            if (!items.invalid) {
                return true;
            }
            return false;
        });
    }

    bulkMail() {
        if (this.emailList.length != 0) {
            for (let i = 0; i < this.emailList.length; i++) {
                this.blukEmailValue.push(this.emailList[i].value);
            }
            console.log(this.blukEmailValue, 'emaildata');
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                school_id: this.auth.getSessionData('rista-school_id'),
                class_id: this.selectClassData.class_id,
                student_id: [],
                email_id: this.blukEmailValue
            };
            this.classes.bulkMail(data).subscribe((successData) => {
                    this.bulkMailSuccess(successData);
                },
                (error) => {
                    this.bulkMailFailure(error);
                });
        } else {
            this.toastr.error('Enter emailId is required');
        }
    }

    bulkMailSuccess(successData) {
        if (successData.IsSuccess) {
            this.modalRef.close();
            this.toastr.success(successData.ResponseObject);
        } else {
            this.blukEmailValue = [];
            this.toastr.error(successData.ErrorObject);
        }
    }

    bulkMailFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject, 'Class');
    }

    private validateArrayNotEmpty(c: FormControl) {
        if (c.value && c.value.length === 0) {
            return {
                validateArrayNotEmpty: {valid: false},
            };
        }
        return null;
    }

    private validateEmail(email) {
        var re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
