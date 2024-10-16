import {
    Component, Input, OnChanges,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../shared/service/book.service';

import {CommonService} from '../../../shared/service/common.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
    startOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
} from 'date-fns';
import {Subject} from 'rxjs';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
} from 'angular-calendar';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {ClassService} from '../../../shared/service/class.service';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {dateOptions} from '../../../shared/data/config';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

@Component({
    selector: 'app-my-schedule',
    templateUrl: './my-schedule.component.html',
    styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent implements OnInit, OnChanges {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        disableUntil: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() - 1
        },
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    public schoolid: any;
    public gradeData: any;
    public subjectData: any;
    public calendarDetails: any;
    public currentYear: any;
    public eventArr: any = [];
    public detailData: any;
    public schoolListDetails: any;
    public teacherType: any;
    public teacherId: any;
    public classData: any;
    public teacherData: any;
    public selectClass: any;
    public selectTeacher: any;
    public schoolID: any;
    public allowClass: boolean;
    public allowSelect: boolean;
    // view: CalendarView = CalendarView.Day;
    view: string = 'day';
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    actions: CalendarEventAction[] = [];
    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [
        {
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: 'A 3 day event',
            color: colors.red,
            actions: this.actions
        },
        {
            start: startOfDay(new Date()),
            title: 'An event with no end date',
            color: colors.yellow,
            actions: this.actions
        },
        {
            start: subDays(endOfMonth(new Date()), 3),
            end: addDays(endOfMonth(new Date()), 3),
            title: 'A long event that spans 2 months',
            color: colors.blue
        },
        {
            start: addHours(startOfDay(new Date()), 2),
            end: new Date(),
            title: 'A draggable and resizable event',
            color: colors.yellow,
            actions: this.actions,
            resizable: {
                beforeStart: true,
                afterEnd: true
            },
            draggable: true
        }
    ];


    caelenderEvents: CalendarEvent[] = [];
    caelenderDayEvents: CalendarEvent[] = [];
    activeDayIsOpen: boolean;
    public minDate: any;
    public firstDay: any;
    public lastDay: any;
    public rollId: any;
    public currentCalendarshow = 'today';
    public schoolStatus: any;
    @Input() page?: any;
    @ViewChild('customCellTemplate', {static: true}) customCellTemplate: TemplateRef<any>;

    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public modalService: NgbModal, public newSubject: NewsubjectService,
                public commondata: CommonDataService, public common: CommonService, public toastr: ToastrService,
                public auth: AuthService, public router: Router, public validationService: ValidationService, public book: BookService, public classService: ClassService, public datePipe: DatePipe) {
        this.schoolid = this.auth.getSessionData('rista-school_id');
        this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
        this.teacherType = this.auth.getSessionData('rista-teacher_type');
        this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        this.rollId = this.auth.getSessionData('rista-roleid');
        this.minDate = {year: 1970, month: 1, day: 1};
        const date = new Date();
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            this.schoolid = this.auth.getSessionData('rista-school_id');
            this.teacherId = '0';
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            this.schoolListDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
            this.schoolid = this.schoolListDetails.school_id;
            this.teacherId = this.auth.getSessionData('rista-userid');
            if (this.teacherType == '0') {
                this.allowClass = this.schoolListDetails.permissions[6].permission[0].status == 1;
            } else {
                this.allowClass = true;
            }
        }
        // if (this.schoolStatus.length != 0){
        //   this.newSubject.schoolChange.subscribe(params => {
        //     if (params != ''){
        //       if (this.router.url.includes('my-schedule')) {
        //         this.init(params);
        //       }
        //     } else {
        //       this.init(this.auth.getSessionData('rista-school_id'));
        //     }
        //   });
        // }else {
        //
        // }
    }


    ngOnInit() {
        this.allowSelect = false;
        this.newSubject.allowSchoolChange(this.allowSelect);
        this.currentYear = moment(new Date()).format('YYYY');
        this.auth.setSessionData('rista-resourceAccess', false);
        this.auth.removeSessionData('rista-backOption');
    }

    ngOnChanges() {
        this.init(this.auth.getSessionData('rista-school_id'));
    }

    init(id) {
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            this.selectTeacher = null;
            this.selectClass = null;
        } else {
            this.selectClass = null;
        }
        this.schoolid = id;
        this.classList();
        this.scheduleDetails('class');
        this.individualList();
    }

    classList() {
        const data = {
            platform: 'web',
            type: '5',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolid,
            teacher_id: this.teacherId == undefined ? '0' : this.teacherId
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

    individualList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolid,
        };
        this.classService.individualTeacherList(data).subscribe((successData) => {
                this.individualListSuccess(successData);
            },
            (error) => {
                this.individualListFailure(error);
            });
    }

    individualListSuccess(successData) {
        if (successData.IsSuccess) {
            this.teacherData = successData.ResponseObject;
        }
    }

    individualListFailure(error) {
        console.log(error, 'error');
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged({
                          event,
                          newStart,
                          newEnd,
                      }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = {event, action};
        const data = event['class_id'];
        this.enterList(data);
    }

    enterList(value) {
        this.commondata.showLoader(true);
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolid,
            class_id: value,
        };
        this.classService.classDetails(data).subscribe((successData) => {
                this.enterListSuccess(successData);
            },
            (error) => {
                this.enterListFailure(error);
            });
    }

    enterListSuccess(successData) {
        if (successData.IsSuccess) {
            this.commondata.showLoader(false);
            this.detailData = successData.ResponseObject;
            this.auth.setSessionData('classView', true);
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
                    this.router.navigate(['/class/create-class/edit']);
                } else {
                    this.router.navigate(['/class/create-class/addEdit']);
                    this.auth.setSessionData('editclass', JSON.stringify(this.detailData));
                    this.auth.setSessionData('updatedStudent', 1);
                }
            } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '0') {
                this.router.navigate(['/class/list-class']);
            } else if (this.detailData[0].classDate_status == '4' && this.detailData[0].class_status == '1') {
                if (this.allowClass == false) {
                    this.auth.setSessionData('readonly_startdate', 'yes');
                    this.auth.setSessionData('readonly_data', 'true');
                } else {
                    this.auth.removeSessionData('readonly_startdate');
                    this.auth.removeSessionData('readonly_data');
                }
                this.router.navigate(['/class/create-class/addEdit']);
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
                this.router.navigate(['/class/create-class/edit']);
            }
        }
    }

    enterListFailure(error) {
        console.log(error, 'error');
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay(type) {
        this.currentCalendarshow = type;
        this.activeDayIsOpen = false;
        let date = this.viewDate;
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.scheduleDetails('class');
    }

    scheduleDetails(type) {
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            if (this.selectTeacher != 'null' && this.selectTeacher != '') {
                this.teacherId = this.selectTeacher;
            } else {
                this.teacherId = '0';
            }
        } else {
            this.teacherId = this.auth.getSessionData('rista-userid');
            this.selectTeacher = this.auth.getSessionData('rista-userid');
        }

        if (type == 'teacher') {
            this.selectClass = null;
        }

        this.classList();
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolid,
            from_date: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd'),
            to_date: this.datePipe.transform(this.lastDay, 'yyyy-MM-dd'),
            batch_id: '',
            class_name: '',
            availabilityDate: [],
            teacher_id: this.selectTeacher ? this.selectTeacher : '0',
            class_id: this.selectClass ? this.selectClass : '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.slotList(data).subscribe((successData) => {
                this.scheduleDetailsSuccess(successData);
            },
            (error) => {
                this.scheduleDetailsFailure(error);
            });
    }

    scheduleDetailsSuccess(successData) {
        if (successData.IsSuccess) {
            this.calendarDetails = successData.ResponseObject;
            this.eventArr = [];
            let arr = [];
            this.calendarDetails.forEach((item) => {
                item.event_details.forEach((data) => {
                    // if (this.datePipe.transform(this.viewDate1, 'yyyy-MM-dd') <= this.datePipe.transform(item.date, 'yyyy-MM-dd')) {
                    let convertedTime = moment(data.slotstarttime, 'hh:mm A').format('HH:mm:ss');
                    let convertedendTime = moment(data.slotendtime, 'hh:mm A').format('HH:mm:ss');
                    if (data.status == 1) {
                        arr.push(
                            {
                                start: new Date(item.date + ' ' + convertedTime),
                                end: new Date(item.date + ' ' + convertedendTime),
                                title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                actions: this.actions,
                                class_id: data.class_id,
                            }
                        );
                        this.eventArr.push(
                            {
                                start: new Date(item.date + ' ' + convertedTime),
                                end: new Date(item.date + ' ' + convertedendTime),
                                slotdate: item.date,
                                slotstarttime: data.slotstarttime,
                                slotendtime: data.slotendtime,
                                teacherid: data.teacher_id,
                                teacher_name: data.teacher_name,
                                slotday: item.slotday,
                                slotselected: item.slotselected,
                                status: data.status,
                                title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                color: colors.blue,
                                class_id: data.class_id,
                                titleName: data.message,
                                telephone_number: data.telephone_number,
                                allDay: true,
                                resizable: {
                                    beforeStart: true,
                                    afterEnd: true,
                                },
                                draggable: false,
                            },
                        );
                    } else if (data.status == 2) {
                        this.eventArr.push(
                            {
                                start: new Date(item.date + ' ' + convertedTime),
                                end: new Date(item.date + ' ' + convertedendTime),
                                slotdate: data.date,
                                slotday: item.slotday,
                                slotselected: item.slotselected,
                                telephone_number: data.telephone_number,
                                slotstarttime: data.slotstarttime,
                                slotendtime: data.slotendtime,
                                teacherid: data.teacher_id,
                                teacher_name: data.teacher_name,
                                status: data.status,
                                title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                color: colors.red,
                                actions: this.actions,
                                titleName: data.message,
                                allDay: true,
                                resizable: {
                                    beforeStart: true,
                                    afterEnd: true,
                                },
                                draggable: false,
                            },
                        );
                    }

                });
            });

            this.caelenderDayEvents = arr;
            this.caelenderEvents = this.eventArr;
            this.activeDayIsOpen = false;
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    scheduleDetailsFailure(error) {
    }

    changeTimeFormat(event) {
        let val = event.split(' ');
        let value;
        if (val[1] == 'PM') {
            value = parseInt(val[0]) + 12;
        } else {
            value = parseInt(val[0]);
        }
        return value;
    }
}
