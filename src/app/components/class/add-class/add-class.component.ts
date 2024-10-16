 import {
    AfterViewInit,
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {SchoolService} from '../../../shared/service/School.service';
import {ClassService} from '../../../shared/service/class.service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonService} from '../../../shared/service/common.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {
    isSameDay,
    isSameMonth,
} from 'date-fns';
import {Subject} from 'rxjs';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
} from 'angular-calendar';
import {dateOptions} from '../../../shared/data/config';
import {timeZone} from "../../../shared/data/config";
import {importType} from '@angular/compiler/src/output/output_ast';
import {TreeviewContentfolderComponent} from '../../auth/treeview-contentfolder/treeview-contentfolder.component';

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
    selector: 'app-add-category',
    templateUrl: './add-class.component.html',
    styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit, OnChanges, AfterViewInit {
    public selected = [];
    public scheduleDates = [];
    public studentRows = [];
    public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        firstDayOfWeek: 'su',
        dateFormat: dateOptions.pickerFormat,
        disableUntil: {
            year: new Date(this.setDate).getFullYear(),
            month: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getMonth() + 1 : new Date(this.setDate).getMonth(),
            day: new Date(this.setDate).getDate() != 1 ? new Date(this.setDate).getDate() - 1 : new Date(this.setDate).getMonth() === (1 || 3 || 5 || 7 || 8 || 10 || 12) ? 31 : new Date(this.setDate).getMonth() === 2 ? 28 : 30,
        },
    };
    editMyDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat: dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
        disableUntil: {
            year: this.myDpOptions.disableUntil.year,
            month: this.myDpOptions.disableUntil.month,
            day: this.myDpOptions.disableUntil.day
        },
    };
    public classform: FormGroup;
    public slotform: FormGroup;
    public editslotform: FormGroup;
    public type: any;
    public timeErr: boolean;
    public editData: any;
    private modalRef: NgbModalRef;
    public modalRef1: NgbModalRef;
    public closeResult: string;
    public recordBase64Url: any;
    public searchTime: any;
    public selectedSchool: any;
    public schoolData: any;
    public grade_id: any;
    public meridian: any;
    public roleid: any;
    public gradeData: any;
    public subjectData: any;
    public batchData: any;
    public imagepath: any;
    public imagepaththumb: any;
    public pdfpath: any;
    public pdfpaththumb: any;
    public webhost: any;
    public spinner: boolean;
    public filetype: any;
    public attendanceList: any;
    public url: any;
    public getUrl: any;
    public getUrl1: any;
    public schoolId: any;
    public schoolIdList: any;
    public link1: any;
    public additionalLink: any;
    public checkvalue: boolean;
    public repeatlink: FormArray;
    public pdflinks: any = [];
    public clearnote: '';
    public multiSubject: any = [];
    public tagArray: any = [];
    public getTag: any = [];
    public getVideo: any = [];
    public calenderTimeSlot: any = [];
    public gradeSplit: any;
    public subjectSplit: any;
    public class_id: any;
    public response: any;
    public today: any;
    public browseAdd = [];
    public classDetails: any;
    public content_id: [];
    public fileContentid: any = [];
    public allGrade: any = [];
    public timeZoneList = [];
    public gradeSelectionAllow: any;
    public schoolIdNum: any;
    public showBatch: boolean;
    public teacher: any;
    public modalactivate: boolean;
    public editTimeData: any;
    public slotday: any;
    public timeSlotData: any;
    public readonlyAllData: any;
    public readOnly: boolean;
    public teacherType: any;
    public classname: any;
    public passcode: any;
    public acceptstartdate: boolean;
    public startdate: any;
    public readOnlyStart: boolean;
    public dateValidation: boolean;
    public onlineType: any;
    public slotCheck: boolean;
    public choosedData: any;
    public temp: any;

    //// availability seciton//
    public startTime: any;
    public uniqueKey: any;
    public availabilityTimeData: any = [];
    public availabilityTimeData1: any = [];
    public mondayTimings: any = [];
    public tuesdayTimings: any = [];
    public wednesDayTimingsday: any = [];
    public thursdayTimingsday: any = [];
    public fridayTimingsday: any = [];
    public saturdayTimingsday: any = [];
    public sundayTimingsday: any = [];
    public multipleteacher: any = [];
    public teacherData: any;
    public adminLogin: boolean;
    public teacherName: any;
    public allowClass: boolean;
    public allowSelect: boolean;
    public scheduleClassType: any = 'daily';
    studentAttendanceDate: any = 0;
    public endTime: any;
    public days = [
        {id: 1, day: 'Monday', status: 0, show: true},
        {id: 2, day: 'tuesday', status: 0, show: true},
        {id: 3, day: 'wednesday', status: 0, show: true},
        {id: 4, day: 'thursday', status: 0, show: true},
        {id: 5, day: 'friday', status: 0, show: true},
        {id: 6, day: 'saturday', status: 0, show: true},
        {id: 7, day: 'sunday', status: 0, show: true},
    ];
    public fromTime: any;
    public toTime: any;
    public eventArr: any = [];
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    viewDate1: Date = new Date();
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-pencil letter pl-1 pr-1" aria-hidden="true"></i>',
            a11yLabel: 'Edit',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event, this.type);
            },
        },
    ];
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean;
    public calendarId: any;
    public firstDay: any;
    public lastDay: any;
    public currentCalendarshow = 'today';
    public daytype: any;
    public oldTimeData: any;
    public selectedday: any;
    public editTime: boolean;
    public videoArray: any = [];
    public teacherid: any;
    public showZoomDetails: boolean;
    public allowZoomApi: boolean;
    public notes: any = '';
    public showNotes: any = [];
    public currentDate: any;
    public dateAddValue: any;
    public batchId = [];
    public editCompletedClass: boolean = true;
    public editorValue: any;
    // public validators = [ this.must_be_email ];
    // availability section closed

    @ViewChild('bulkmodal') Content: TemplateRef<any>;
    @ViewChild('classCheck') classCheck: TemplateRef<any>;
    @ViewChild('link') linkAdd: TemplateRef<any>;
    @ViewChild('addSlot') addSlot: TemplateRef<any>;
    @ViewChild('writeNoteOpen') writeNoteOpen: TemplateRef<any>;
    @ViewChild('myInput') myInputVariable: ElementRef<any>;
    @ViewChild('zoomLink') zoomLink: ElementRef<any>;
    @ViewChild('gradeSelection', {static: true}) gradeValidityCheck: TemplateRef<any>;
    @ViewChild('batchSelection', {static: true}) batchValidityCheck: TemplateRef<any>;
    @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;
    @ViewChild('editTimeDialog', {static: true}) editTimeDialog: TemplateRef<any>;
    @ViewChild('studentAtendance') studentAtendance: TemplateRef<any>;

    @ViewChild(TreeviewContentfolderComponent, {static: false}) treeviewCompoent: TreeviewContentfolderComponent;

    public addClassDetails: any;
    public oldavailability: any;

    constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public classService: ClassService,
                public commondata: CommonDataService, private toastr: ToastrService, public common: CommonService,
                public auth: AuthService, public brandservices: SchoolService, public sanitizer: DomSanitizer, public newSubject: NewsubjectService,
                public router: Router, public validationService: ValidationService, public config: ConfigurationService,
                public modalService: NgbModal, public datePipe: DatePipe) {
        this.newSubject.schoolChange.subscribe((res: any) => {
            if (res != '') {
                if (this.router.url.includes('create-class')) {
                    this.init(res);
                }
            } else {
                this.init(this.auth.getSessionData('rista-school_id'));
            }
        });
        this.roleid = this.auth.getSessionData('rista-roleid');
        this.allowSelect = true;
        this.newSubject.allowSchoolChange(this.allowSelect);
        const date = new Date();
        this.currentDate = this.datePipe.transform(date, 'dd-MM-yyyy');
        this.dateAddValue = this.datePipe.transform(date, dateOptions.dateFormat);
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.webhost = this.config.getimgUrl();
        this.timeErr = false;
        this.imagepath = [];
        this.imagepaththumb = [];
        this.pdfpath = [];
        this.pdfpaththumb = [];
        this.meridian = true;
        this.spinner = false;
        this.editTime = false;
        this.dateValidation = true;
        this.showZoomDetails = false;
        this.onlineType = 'In-Person';
        this.schoolId = JSON.parse(this.auth.getSessionData('rista_data1'));
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            this.adminLogin = true;
            this.schoolIdNum = this.auth.getSessionData('rista-school_id');
            this.showBatch = true;
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            this.adminLogin = false;
            this.schoolIdNum = this.schoolId.school_id;
            this.teacherName = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
            if (this.schoolId.individual_teacher == '1') {
                this.showBatch = false;
            } else if (this.schoolId.individual_teacher == '0') {
                this.showBatch = true;
            }
        }
        this.classDetails = JSON.parse(this.auth.getSessionData('rista-classData'));
        this.gradeSelectionAllow = this.auth.getSessionData('updatedStudent');
        this.route.params.forEach((params) => {
            this.type = params.type;
        });
        this.readonlyAllData = this.auth.getSessionData('readonly_data');
        if (this.readonlyAllData == 'true') {
            this.readOnly = true;
        } else if (this.readonlyAllData == null) {
            this.readOnly = false;
            this.readOnlyStart = false;
        }
        this.startdate = this.auth.getSessionData('readonly_startdate');
        if (this.startdate == 'yes') {
            this.acceptstartdate = true;
            this.readonlyAllData = true;
            this.readOnlyStart = true;
        }
        this.teacherType = this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '1' ? '1' : '0';
        // if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
        //     this.teacherType = '0';
        // } else if (this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '0') {
        //     this.teacherType = '0';
        // } else if (this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '1') {
        //     this.teacherType = '1';
        // }
        if (this.auth.getSessionData('rista-roleid') == '4' && this.schoolId.individual_teacher == '0') {
            this.allowClass = this.schoolId.permissions[6].permission[0].status == 1;
            this.editCompletedClass = this.schoolId.permissions[6].permission[0].status == 1;
        } else {
            this.allowClass = true;
            this.editCompletedClass = true;
        }
        this.classform = this.formBuilder.group({
            classname: ['', Validators.required],
            grade: [''],
            batch: [''],
            subject: ['', Validators.required],
            // timezone: ['', Validators.required],
            startDate: [''],
            endDate: [''],
            startTime: [''],
            endTime: [''],
            tag: '',
            video: '',
            meetingLink: '',
            meetingId: '',
            passcode: '',
            telephone: '',
            status: ['1', Validators.required],
            onlinePerson: '2',
        });
        this.slotform = this.formBuilder.group({
            teacherid: [''],
            meetingLink: ['', Validators.required],
            meetingId: [''],
            meetingPasscode: [''],
            telephone: ''
        });
        this.editslotform = this.formBuilder.group({
            teacherid: ['', Validators.required],
            selectedDate: ['', Validators.required],
            meetingLink: ['', Validators.required],
            meetingId: [''],
            meetingPasscode: [''],
            telephone: ''
        });

    }



    ngOnInit() {
        this.checkPerson();
        this.browseAdd = [];
        if (this.classDetails) {
            this.classDetails.content_id.forEach((item) => {
                this.browseAdd.push(item);
            });
            this.auth.removeSessionData('rista-backOption');
        }
        this.additionalLink = false;
        if (this.type == 'edit' || this.type == 'addEdit') {
            this.editData = JSON.parse(this.auth.getSessionData('editclass'));
            this.class_id = this.editData[0].class_id;
            if (this.editData[0].classDate_status == '4' && this.roleid == '2' && this.allowClass && (this.type == 'addEdit' || this.type == 'edit')) {
                this.readonlyAllData = false;
            }
            this.classform.controls.classname.patchValue(this.editData[0].class_name);
            if (this.editData[0].grade != '') {
                if (this.editData[0].grade.length >= 3) {
                    this.gradeSplit = [];
                    const grade = this.editData[0].grade.split(',');
                    for (let i = 0; i < grade.length; i++) {
                        this.gradeSplit.push(grade[i]);
                    }
                } else {
                    this.gradeSplit = [this.editData[0].grade];
                }
            } else {
                this.gradeSplit = null;
            }
            if (this.editData[0].subject != '') {
                if (this.editData[0].subject.length >= 3) {
                    this.subjectSplit = [];
                    const subject = this.editData[0].subject.split(',');
                    for (let i = 0; i < subject.length; i++) {
                        this.subjectSplit.push(subject[i]);
                    }
                } else {
                    this.subjectSplit = [this.editData[0].subject];
                }
            } else {
                this.subjectSplit = null;
            }
            this.classform.controls.grade.patchValue(this.gradeSplit);
            this.classform.controls.subject.patchValue(this.subjectSplit);
            if (this.editData[0].start_date != '0000-00-00') {
                const sd = this.editData[0].start_date.split('-');
                const sdObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                    dateRange: null
                };
                this.classform.controls.startDate.patchValue(sdObject);
                this.myDpOptions1 = {};
                this.myDpOptions1 = {
                    dateRange: false,
                    dateFormat:dateOptions.pickerFormat,
                    firstDayOfWeek: 'su',
                    disableUntil: {
                        year: parseInt(sd[0]),
                        month: parseInt(sd[1]),
                        day: parseInt(sd[2]) - 1
                    },
                };
            } else {
                this.classform.controls.startDate.patchValue(null);
            }
            if (this.editData[0].end_date != '0000-00-00') {
                const ed = this.editData[0].end_date.split('-');
                const edObject: IMyDateModel = {
                    isRange: false,
                    singleDate: {jsDate: new Date(parseInt(ed[0]), parseInt(ed[1]) - 1, parseInt(ed[2]))},
                    dateRange: null
                };
                this.classform.controls.endDate.patchValue(edObject);
            } else {
                this.classform.controls.endDate.patchValue(null);
            }
            if (this.editData[0].video_link != null) {
                for (let i = 0; i < this.editData[0].video_link.length; i++) {
                    this.getVideo.push({
                        display: this.editData[0].video_link[i],
                        value: this.editData[0].video_link[i]
                    });
                }
            }
            this.classform.controls.video.patchValue(this.getVideo);
            if (this.editData[0].tags != null) {
                for (let i = 0; i < this.editData[0].tags.length; i++) {
                    this.getTag.push({display: this.editData[0].tags[i], value: this.editData[0].tags[i]});
                }
            }
            this.classform.controls.tag.patchValue(this.getTag);
            this.showNotes = this.editData[0].notes;
            // this.notesGroup.controls.notes.patchValue(this.editData[0].notes);
            this.classform.controls.meetingLink.patchValue(this.editData[0].meeting_link);
            this.classform.controls.meetingId.patchValue(this.editData[0].meeting_id);
            this.batchId = this.editData[0].batch_id;
            if (this.editData[0].batch_id != 0) {
                this.classform.controls.batch.patchValue(this.editData[0].batch_id);
            } else {
                this.classform.controls.batch.patchValue([]);
            }
            this.classform.controls.passcode.patchValue(this.editData[0].passcode);
            this.classform.controls.status.patchValue(this.editData[0].status);
            this.classform.controls.telephone.patchValue(this.editData[0].telephone_number);
            // this.classform.controls.timezone.patchValue(this.editData[0].time_zone_id);
            this.availabilityTimeData1 = this.editData[0].availabilityDate;
            this.availabilityTimeData1.forEach((item, index) => {
                item.uniqueKey = index;
                if (item.slotday == 1) {
                    this.mondayTimings.push(item);
                } else if (item.slotday == 2) {
                    this.tuesdayTimings.push(item);
                } else if (item.slotday == 3) {
                    this.wednesDayTimingsday.push(item);
                } else if (item.slotday == 4) {
                    this.thursdayTimingsday.push(item);
                } else if (item.slotday == 5) {
                    this.fridayTimingsday.push(item);
                } else if (item.slotday == 6) {
                    this.saturdayTimingsday.push(item);
                } else if (item.slotday == 7) {
                    this.sundayTimingsday.push(item);
                }
            });
            this.oldavailability = this.availabilityTimeData1;
            if (this.editData.profile_url != '') {
                this.imagepath.push(this.editData[0].profile_url);
            }
            this.imagepaththumb.push(this.editData[0].profile_thumb_url);
            //
            if (this.editData[0].class_type == '1') {
                this.classform.controls.onlinePerson.patchValue(1);
                this.showZoomDetails = true;
                this.onlineType = 'Online';
                this.checkPerson();
            } else {
                this.classform.controls.onlinePerson.patchValue(2);
                this.showZoomDetails = false;
                this.onlineType = 'In-Person';
                this.checkPerson();
            }
        } else {
            this.batchId = [];
            this.showZoomDetails = false;
            this.classform.controls.classname.patchValue('');
            this.classform.controls.startDate.patchValue(null);
            this.classform.controls.endDate.patchValue(null);
            this.classform.controls.startTime.patchValue('');
            this.classform.controls.endTime.patchValue('');
            this.classform.controls.grade.patchValue(null);
            this.classform.controls.subject.patchValue(null);
            this.classform.controls.batch.patchValue([]);
            this.classform.controls.tag.patchValue('');
            this.classform.controls.video.patchValue('');
            this.classform.controls.meetingLink.patchValue('');
            // this.notesGroup.controls.notes.patchValue('');
            this.classform.controls.meetingId.patchValue('');
            const setting = JSON.parse(localStorage.getItem('settingList'));
            if (setting != null) {
                setting.forEach((items) => {
                    if (items.name == 'timezone') {
                        this.classform.controls.timezone.patchValue(items.value);
                    }
                });
            }
            this.classform.controls.passcode.patchValue('');
            this.classform.controls.status.patchValue('1');
            this.classform.controls.onlinePerson.patchValue('2');
            if (this.adminLogin) {
                this.editslotform.controls.teacherid.patchValue(null);
            } else {
                this.editslotform.controls.teacherid.patchValue(this.auth.getSessionData('rista-userid'));
            }
            this.slotform.controls.teacherid.patchValue(null);
            this.imagepath = [];
            this.imagepaththumb = [];
            this.imagepaththumb = [];
            this.gradeSplit = [];
        }
        this.fromTime = {hour: 0, minute: 0, seconds: 0};
        this.toTime = {hour: 23, minute: 59, seconds: 0};
    }

    onCustomAction(event) {
        console.log(event ,'event')
        switch ( event.action) {
            case 'editAction':
                // if (this.allowEdit == true){
                //     if (event.data.access == 'Public'){
                //         if (this.schoolid == event.data.school_id){
                //             this.auth.setSessionData('editBook', JSON.stringify(event.data));
                //             this.route.navigate(['/Books/create-Books/edit']);
                //         }else {
                //             this.toastr.error('You don\'t have permission to update book', 'Failed');
                //         }
                //     }else {
                //         this.auth.setSessionData('editBook', JSON.stringify(event.data));
                //         this.route.navigate(['/Books/create-Books/edit']);
                //     }
                // }
                break;
            case 'viewAction':
                break;
        }
    }

    init(id) {
        this.schoolIdNum = id;
        this.getTimeZone();
        this.gradeList();
        this.subjectList();
        this.batchDataList();
        this.individualList();
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0);
            this.viewDate = date;
        }
    }

    eventTimesChanged({
                          event,
                          newStart,
                          newEnd,
                      }: CalendarEventTimesChangedEvent, type): void {
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
        this.handleEvent('Dropped or resized', event, type);
    }

    handleEvent(action: string, event: CalendarEvent, type): void {
        this.modalData = {event, action};
        this.auth.setSessionData('editTimeSlot', JSON.stringify(event));
        this.modalactivate = true;
        this.editTimeData = JSON.parse(this.auth.getSessionData('editTimeSlot'));
        if (type == 'add') {
            this.modalactivate = false;
        } else {
            if (this.editTimeData.status == '1') {
                const condtion = this.editData != undefined ? this.editData[0].class_id == this.editTimeData.class_id : false;
                if (condtion) {
                    if (this.allowClass) {
                        if (this.modalactivate == true) {
                            if (this.editTimeData.slotdate != '0000-00-00') {
                                const sd = this.editTimeData.slotdate.split('-');
                                const sdObject: IMyDateModel = {
                                    isRange: false,
                                    singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))},
                                    dateRange: null
                                };
                                this.editslotform.controls.selectedDate.patchValue(sdObject);
                            } else {
                                this.editslotform.controls.selectedDate.patchValue(null);
                            }
                            const stTime1 = this.editTimeData.slotstarttime.replace(' ', ':').split(':');
                            if (parseInt(stTime1[0]) < 12 && stTime1[2] != 'AM') {
                                stTime1[0] = parseInt(stTime1[0]) + 12;
                                const stObject1 = {
                                    hour: parseInt(stTime1[0]),
                                    minute: parseInt(stTime1[1]),
                                    seconds: 0
                                };
                                this.fromTime = stObject1;
                            } else {
                                let newstart = stTime1[0];
                                if (stTime1[2] == 'AM') {
                                    if (newstart == 12) {
                                        stTime1[0] = 0;
                                    } else {
                                        newstart = stTime1[0];
                                    }
                                } else if (stTime1[2] == 'PM') {
                                    if (newstart == 12) {
                                        stTime1[0] = 12;
                                    } else {
                                        newstart = stTime1[0];
                                    }
                                }
                                const stObject2 = {
                                    hour: parseInt(stTime1[0]),
                                    minute: parseInt(stTime1[1]),
                                    seconds: 0
                                };
                                this.fromTime = stObject2;
                            }
                            const etTime1 = this.editTimeData.slotendtime.replace(' ', ':').split(':');
                            if (parseInt(etTime1[0]) < 12 && etTime1[2] != 'AM') {
                                etTime1[0] = parseInt(etTime1[0]) + 12;
                                const etObject1 = {
                                    hour: parseInt(etTime1[0]),
                                    minute: parseInt(etTime1[1]),
                                    seconds: 0
                                };
                                this.toTime = etObject1;
                            } else {
                                const etObject2 = {
                                    hour: parseInt(etTime1[0]),
                                    minute: parseInt(etTime1[1]),
                                    seconds: 0
                                };
                                this.toTime = etObject2;
                            }
                            console.log(this.editTimeData, 'editimedata');
                            this.editslotform.controls.meetingLink.patchValue(this.editTimeData.meeting_link);
                            this.editslotform.controls.meetingId.patchValue(this.editTimeData.meeting_id);
                            this.editslotform.controls.meetingPasscode.patchValue(this.editTimeData.passcode);
                            this.editslotform.controls.telephone.patchValue(this.editTimeData.telephone_number);
                            this.editslotform.controls.teacherid.patchValue(this.editTimeData.teacherid);
                        }
                        this.modalRef = this.modalService.open(this.editTimeDialog, {size: 'md'});
                    }
                } else {
                    this.toastr.error('Time Slot can\'t be updated for this class', 'Class');
                }
            } else if (this.editTimeData.status == '2') {
                this.toastr.error('Time Slot can\'t be updated for leave days', 'Class');
            }
        }
    }

    getEditorValue(event) {
        this.editorValue = event.editor;
        this.notes = event.content;
    }

    closeOpenMonthViewDay(type) {
        this.currentCalendarshow = type;
        this.activeDayIsOpen = false;
        const date = this.viewDate;
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.getslotList(this.calendarId, 'calenderAction');
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    ngAfterViewInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.classform.controls.startTime.value, 'this.classform.controls.startTime.');
    }

    onlinePerson(event) {
        if (this.classform.controls.onlinePerson.value == true) {
            this.showZoomDetails = true;
            this.onlineType = 'Online';
        } else {
            this.showZoomDetails = false;
            this.onlineType = 'In-Person';
        }
        this.checkPerson();
    }

    setCustomValidators(showZoom) {
        // showZoom == true show meeting elemnts | 1 hide
        if (showZoom) {
            this.allowZoomApi = true;
            // Class Zoom Details
            this.classform.controls.meetingLink.setValidators(Validators.required);
            // Daily View Zoom Details
            this.slotform.controls.meetingLink.setValidators(Validators.required);
            // Edit Slot View Details
            this.editslotform.controls.meetingLink.setValidators(Validators.required);
        }else {
            this.allowZoomApi = false;
            this.resetMeetingValidator('');
        }
    }
    resetMeetingValidator(value) {
        this.classform.controls.meetingLink.clearValidators();
        this.classform.controls.meetingLink.setValidators(value);
        this.classform.controls.meetingLink.updateValueAndValidity();

        this.slotform.controls.meetingLink.clearValidators();
        this.slotform.controls.meetingLink.setValidators(value);
        this.slotform.controls.meetingLink.updateValueAndValidity();

        this.editslotform.controls.meetingLink.clearValidators();
        this.editslotform.controls.meetingLink.setValidators(value);
        this.editslotform.controls.meetingLink.updateValueAndValidity();
    }
    checkAllowZoomApi() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum
        };
        this.classService.zoomPermission(data).subscribe((successData: any) => {
            if (successData.IsSuccess) {
                // value == 0 show meeting elemnts | 1 hide
                if (successData.ResponseObject[0].value == '0') {
                    this.setCustomValidators(true);
                }else if (successData.ResponseObject[0].value == '1') {
                    this.setCustomValidators(false);
                }
            }
            },
            (error) => {
                this.getslotListFailure(error);
            });
    }

    checkPerson() {
        if (this.showZoomDetails === true) {
            this.checkAllowZoomApi();
        } else {
            this.resetMeetingValidator('');
        }
    }

    gradeCheck() {
        this.gradeSelectionAllow = this.auth.getSessionData('updatedStudent');
        this.auth.setSessionData('studentlist', '');
    }

    eraseSessiondate(type) {
        this.auth.setSessionData('updatedStudent', 0);
        this.auth.setSessionData('studentlist', '');
        if (type == 'grade') {
            this.classform.controls.grade.patchValue(null);
        } else if (type == 'batch') {
            this.classform.controls.batch.patchValue([]);
        }
        this.modalRef.close();
    }

    close() {
        this.modalRef.close();
    }

    noClose(type) {
        if (type == 'grade') {
            if (this.editData[0].grade != '') {
                if (this.editData[0].grade.length >= 3) {
                    this.gradeSplit = [];
                    const grade = this.editData[0].grade.split(',');
                    for (let i = 0; i < grade.length; i++) {
                        this.gradeSplit.push(grade[i]);
                    }
                } else {
                    this.gradeSplit = [this.editData[0].grade];
                }
                this.classform.controls.grade.patchValue(this.gradeSplit);
            } else {
                this.gradeSplit = null;
            }
        } else if (type == 'batch') {
            if (this.editData[0].batch_id != 0) {
                this.classform.controls.batch.patchValue(this.editData[0].batch_id);
            } else {
                this.classform.controls.batch.patchValue([]);
            }
        }
        this.modalRef.close();
    }

    teacherSelection(data) {
        this.multipleteacher = [];
        data.filter((data1) => {
            this.slotform.controls.teacherid.value.filter((data2) => {
                if (data1.teacher_id == data2) {
                    this.multipleteacher.push(data1.teacher_name);
                }
            });
        });
        this.availabilityTimeData.forEach(item => {
            item.teacher_id = item.teacher_id == null || (item.teacher_id != this.slotform.controls.teacherid.value) ? this.slotform.controls.teacherid.value : item.teacher_id;
            item.teacher_name = this.multipleteacher;
            item.slotstarttime = this.startTime;
            item.slotendtime = this.endTime;
            item.meeting_link = this.slotform.controls.meetingLink.value == '' ? '' : this.slotform.controls.meetingLink.value;
            item.meeting_id = this.slotform.controls.meetingId.value == '' ? '' : this.slotform.controls.meetingId.value;
        });
    }

    newselection() {
        this.availabilityTimeData.forEach(item => {
            item.teacher_id = item.teacher_id == null || (item.teacher_id != this.slotform.controls.teacherid.value) ? this.slotform.controls.teacherid.value : item.teacher_id;
            item.teacher_name = this.multipleteacher;
            item.slotstarttime = this.startTime;
            item.slotendtime = this.endTime;
            item.meeting_link = this.slotform.controls.meetingLink.value == '' ? '' : this.slotform.controls.meetingLink.value;
            item.meeting_id = this.slotform.controls.meetingId.value == '' ? '' : this.slotform.controls.meetingId.value;
        });
    }

    submitSlot() {
        this.validatingTime(this.fromTime, this.toTime);

        /// checking time difference between two times
        const difference = this.getTimeDiference(this.fromTime, this.toTime);
        if (difference) {
            if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
                const teacher = this.slotform.controls.teacherid.value;
                this.teacher = teacher != null ? this.slotform.controls.teacherid.value : '0';
                // if (teacher != null) {
                //     this.teacher = this.slotform.controls.teacherid.value;
                // } else {
                //     this.teacher = '0';
                // }
            } else if (this.auth.getSessionData('rista-roleid') == '4') {
                this.teacher = [this.auth.getSessionData('rista-userid')];
                this.multipleteacher = [this.teacherName];
            }
            if (this.teacher != '0' && this.teacher.length != '0') {
                if (this.showZoomDetails == true) {
                    if (this.slotform.valid) {
                        this.slotCheck = true;
                    } else {
                        this.slotCheck = false;
                        this.toastr.error('Please fill all the mandatory field');
                        this.validationService.validateAllFormFields(this.slotform);
                    }
                } else if (this.showZoomDetails == false) {
                    this.slotCheck = true;
                }
                if (this.slotCheck == true) {
                    this.days.forEach((item) => {
                        if (item.show == false) {
                            this.availabilityTimeData.push(
                                {
                                    uniqueKey: this.uniqueKey,
                                    teacher_id: this.teacher,
                                    teacher_name: this.multipleteacher,
                                    slotstarttime: this.startTime,
                                    slotendtime: this.endTime,
                                    slotday: item.id,
                                    slotselected: 'true',
                                    meeting_link: this.slotform.controls.meetingLink.value == '' ? '' : this.slotform.controls.meetingLink.value,
                                    meeting_id: this.slotform.controls.meetingId.value == '' ? '' : this.slotform.controls.meetingId.value,
                                    passcode: this.slotform.controls.meetingPasscode.value == '' ? '' : this.slotform.controls.meetingPasscode.value,
                                    telephone_number: this.slotform.controls.telephone.value == '' ? '' : this.slotform.controls.telephone.value,
                                });
                            this.selectedday = item.id;
                        }
                    });
                    if (this.editTime == true) {
                        const checkData = this.availabilityTimeData[0];
                        this.oldTimeData = this.oldavailability.filter((item) => {
                            return parseInt(item.uniqueKey) !== parseInt(checkData.uniqueKey);
                        });
                    } else {
                        this.oldTimeData = this.oldavailability;
                    }
                    const data21 = {
                        platform: 'web',
                        role_id: this.auth.getSessionData('rista-roleid'),
                        user_id: this.auth.getSessionData('rista-userid'),
                        previous_availabilityDate: this.oldTimeData == undefined ? [] : this.oldTimeData,
                        selected_availabilityDate: this.availabilityTimeData
                    };
                    this.classService.timeValidation(data21).subscribe((successData) => {
                            this.timeListSuccess(successData);
                        },
                        (error) => {
                            this.timeListFailure(error);
                        });
                    console.log(this.availabilityTimeData, 'newdatsadasdsadsadd');
                } else {
                    console.log(this.availabilityTimeData, 'newdatsad');
                }
            } else {
                this.toastr.error('Please select the teacher for this slot');
            }
        } else {
            this.toastr.error('End-Time Should be greater than Start-Time', 'Failed');
        }
    }

    timeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.timeSlotData = successData.ResponseObject;
            this.toastr.success(successData.ResponseObject, 'Time Slot');
            const data = this.availabilityTimeData;
            data.forEach((item) => {
                this.availabilityTimeData1.push(item);
            });
            this.availabilityTimeData = [];
            this.mondayTimings = [];
            this.tuesdayTimings = [];
            this.wednesDayTimingsday = [];
            this.thursdayTimingsday = [];
            this.fridayTimingsday = [];
            this.saturdayTimingsday = [];
            this.sundayTimingsday = [];
            this.availabilityTimeData1 = this.availabilityTimeData1.filter((item) => {
                return item.slotselected == 'true';
            });
            this.availabilityTimeData1.forEach((item, index) => {
                item.uniqueKey = index;
                if (item.slotday == 1) {
                    this.mondayTimings.push(item);
                } else if (item.slotday == 2) {
                    this.tuesdayTimings.push(item);
                } else if (item.slotday == 3) {
                    this.wednesDayTimingsday.push(item);
                } else if (item.slotday == 4) {
                    this.thursdayTimingsday.push(item);
                } else if (item.slotday == 5) {
                    this.fridayTimingsday.push(item);
                } else if (item.slotday == 6) {
                    this.saturdayTimingsday.push(item);
                } else if (item.slotday == 7) {
                    this.sundayTimingsday.push(item);
                }
            });
            this.oldavailability = this.availabilityTimeData1;
            this.days.forEach((item) => {
                item.show = true;
                item.status = 0;
            });
            this.close();
            this.toTime = '';
            this.fromTime = '';
        } else {
            this.toastr.error(successData.ResponseObject, 'Time Slot');
            this.oldavailability = this.availabilityTimeData1;
            this.availabilityTimeData = [];
            this.days.forEach((item) => {
                item.show = true;
                item.status = 0;
            });
            for (let i = 0; i < this.days.length; i++) {
                if (this.selectedday == this.days[i].id) {
                    this.days[i].show = false;
                    this.days[i].status = 0;
                } else {
                    this.days[i].show = true;
                    this.days[i].status = 0;
                }
            }
        }
    }

    timeListFailure(error) {
        console.log(error, 'error');
    }

    submitTimeSlot(id) {
        this.validatingTime(this.fromTime, this.toTime);
        this.editTimeData = JSON.parse(this.auth.getSessionData('editTimeSlot'));
        const selectedDay = this.datePipe.transform(this.editslotform.controls.selectedDate.value.singleDate.jsDate, 'EEEE');
        if (selectedDay == 'Monday') {
            this.slotday = '1';
        } else if (selectedDay == 'Tuesday') {
            this.slotday = '2';
        } else if (selectedDay == 'Wednesday') {
            this.slotday = '3';
        } else if (selectedDay == 'Thursday') {
            this.slotday = '4';
        } else if (selectedDay == 'Friday') {
            this.slotday = '5';
        } else if (selectedDay == 'Saturday') {
            this.slotday = '6';
        } else if (selectedDay == 'Sunday') {
            this.slotday = '7';
        }
        this.teacher = this.auth.getSessionData('rista-roleid') == '4' ? [this.auth.getSessionData('rista-userid')] :
            this.editslotform.controls.teacherid.value;
        // if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
        //     this.teacher = this.editslotform.controls.teacherid.value;
        // } else if (this.auth.getSessionData('rista-roleid') == '4') {
        //     this.teacher = [this.auth.getSessionData('rista-userid')];
        // }
        if (this.teacher.length != '0') {
            if (this.showZoomDetails == true) {
                if (this.editslotform.valid) {
                    this.slotCheck = true;
                } else {
                    this.slotCheck = false;
                    this.toastr.error('Please fill all the mandatory field');
                    this.validationService.validateAllFormFields(this.editslotform);
                }
            } else if (this.showZoomDetails == false) {
                this.slotCheck = true;
            }
            if (this.slotCheck == true) {
                this.availabilityTimeData.push(
                    {
                        date: this.datePipe.transform(this.editslotform.controls.selectedDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                        teacher_id: this.teacher,
                        slotstarttime: this.startTime,
                        slotendtime: this.endTime,
                        slotday: this.slotday,
                        slotselected: 'true',
                        status: '1',
                        meeting_link: this.editslotform.controls.meetingLink.value,
                        meeting_id: this.editslotform.controls.meetingId.value,
                        passcode: this.editslotform.controls.meetingPasscode.value,
                        telephone_number: this.editslotform.controls.telephone.value
                    });
                this.availabilityTimeData.push({
                    date: this.editTimeData.slotdate,
                    teacher_id: this.editTimeData.teacherid,
                    slotstarttime: this.editTimeData.slotstarttime,
                    slotendtime: this.editTimeData.slotendtime,
                    slotday: this.editTimeData.slotday,
                    status: '2',
                    slotselected: 'true',
                    meeting_link: this.editTimeData.meeting_link,
                    meeting_id: this.editTimeData.meeting_id,
                    passcode: this.editTimeData.passcode,
                    telephone_number: this.editTimeData.telephone_number.value == '' ? '' : this.editTimeData.telephone_number,
                });
                const data = {
                    platform: 'web',
                    role_id: this.auth.getSessionData('rista-roleid'),
                    user_id: this.auth.getSessionData('rista-userid'),
                    school_id: this.schoolIdNum,
                    class_id: this.editData[0].class_id,
                    availabilityDate: this.availabilityTimeData
                };
                this.classService.timeSlotedit(data).subscribe((successData) => {
                        this.timeSlotListSuccess(successData, id);
                    },
                    (error) => {
                        this.timeSlotListFailure(error);
                    });
            } else {

            }
        } else {
            this.toastr.error('Please select the teacher name');
        }
    }

    timeSlotListSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.timeSlotData = successData.ResponseObject;
            this.toastr.success(successData.ResponseObject, 'Time Slot');
            this.availabilityTimeData = [];
            this.getslotList(id, 'updatedCalendar');
            this.modalRef.close();

        } else {
            this.toastr.error(successData.ResponseObject, 'Time Slot');
        }
    }

    timeSlotListFailure(error) {
        console.log(error, 'error');
    }

    deleteTime(type, id, event) {
        if (type == 'monday') {
            this.mondayTimings.splice(id, 1);
        } else if (type == 'tuesday') {
            this.tuesdayTimings.splice(id, 1);
        } else if (type == 'wednesday') {
            this.wednesDayTimingsday.splice(id, 1);
        } else if (type == 'thursday') {
            this.thursdayTimingsday.splice(id, 1);
        } else if (type == 'friday') {
            this.fridayTimingsday.splice(id, 1);
        } else if (type == 'saturday') {
            this.saturdayTimingsday.splice(id, 1);
        } else if (type == 'sunday') {
            this.sundayTimingsday.splice(id, 1);
        }
        this.availabilityTimeData1 = this.availabilityTimeData1.filter((item) => {
            return parseInt(event.uniqueKey) != parseInt(item.uniqueKey);
        });
        this.oldTimeData = this.availabilityTimeData1;
        this.oldavailability = this.availabilityTimeData1;
    }

    getTimeDiference(fromtime, totime) {

        let startTime: any = parseInt(fromtime.hour) * 60;
        startTime = startTime + parseInt(fromtime.minute);
        let toTime: any = parseInt(totime.hour) * 60;
        toTime = toTime + parseInt(totime.minute);
        if ((toTime - startTime) >= 1) {
            return true;
        } else {
            return false;
        }
    }

    subjectList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            type: 'active'
        };

        this.classService.subjectList(data).subscribe((successData) => {
                this.subjectListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_subjectList');
            });
    }

    subjectListSuccess(successData) {
        if (successData.IsSuccess) {
            this.subjectData = successData.ResponseObject;
        }
    }

    batchDataList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            type: '2'
        };
        this.classService.batchList(data).subscribe((successData) => {
                this.batchListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_batchList');
            });
    }

    batchListSuccess(successData) {
        if (successData.IsSuccess) {
            this.batchData = successData.ResponseObject;
        }
    }
    getTimeZone() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid')
        };
        this.common.timeZone(data).subscribe( (successData) => {
                this.timeZoneSuccess(successData);
            },
            (error) => {
                console.log(error);
            });
    }
    timeZoneSuccess(successData) {
        if (successData.IsSuccess) {
            this.timeZoneList = successData.ResponseObject;
            console.log(this.timeZoneList, 'timeZoneList');
        }
    }

    individualList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
        };
        this.classService.individualTeacherList(data).subscribe((successData) => {
                this.individualListSuccess(successData);
            },
            (error) => {
                console.error(error, 'errro_individualList');
            });
    }

    individualListSuccess(successData) {
        if (successData.IsSuccess) {
            this.teacherData = successData.ResponseObject;
        }
    }

    gradeList() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            type: 'active'
        };
        this.classService.gradeList(data).subscribe((successData) => {
                this.gradeListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_gradeList');
            });
    }

    gradeListSuccess(successData) {
        if (successData.IsSuccess) {
            this.gradeData = successData.ResponseObject;
        }
    }

    removeZoom() {
        if (this.showZoomDetails == false) {
            this.classform.controls.meetingLink.patchValue('');
            this.classform.controls.meetingId.patchValue('');
            this.classform.controls.passcode.patchValue('');
            // this.classform.controls.telephone.patchValue('');
            if (this.availabilityTimeData1.length > 0) {
                this.availabilityTimeData1.forEach((item) => {
                    item.meeting_id = '';
                    item.meeting_link = '';
                    item.passcode = '';
                    // item.telephone_number = '';
                });
            }
        }
    }

    writeNotes() {
        this.modalRef = this.modalService.open(this.writeNoteOpen, {size: 'xl'});
        this.notes = '';
    }


    addNotes(type) {
        if (type == 'add') {
            if (this.notes != '') {
                this.showNotes.unshift({
                    note: this.notes.replace(/\r?\n/g, '<br />'),
                    add_date: this.dateAddValue,
                    status: '1'
                });
                this.notes = '';
            } else {
                this.toastr.error('Notes Should not be Empty');
            }
        } else {
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                class_id: this.class_id ? this.class_id : '',
                note: this.notes.replace(/\r?\n/g, '<br />'),
                status: '1',
                add_date: this.currentDate
            };
            this.classService.getNotesList(data).subscribe((successData: any) => {
                    if (successData.IsSuccess) {
                        this.showNotes = successData.ResponseObject;
                        this.editorValue != '' ? this.editorValue.setContent('') : '';
                        this.notes = '';
                    } else {
                        // this.toastr.error(successData.ErrorObject);
                        this.toastr.error('Notes Should not be Empty');
                    }
                },
                (error) => {
                });
        }
    }

    deletedNotes(value, type) {
        if (type == 'add') {
            this.showNotes.splice(value, 1);
        } else {
            console.log(value, 'value');
            const data = {
                platform: 'web',
                role_id: this.auth.getSessionData('rista-roleid'),
                user_id: this.auth.getSessionData('rista-userid'),
                class_id: this.class_id ? this.class_id : '',
                note: value.note,
                status: '2',
                id: value.id,
                add_date: value.add_date
            };
            this.classService.getNotesList(data).subscribe((successData: any) => {
                    if (successData.IsSuccess) {
                        this.showNotes = successData.ResponseObject;
                    } else {
                        this.toastr.error(successData.ErrorObject);
                    }
                },
                (error) => {
                });
        }
    }

    submitDraftClass() {
        if (this.type == 'add' || this.type == 'edit') {
            if (this.classform.valid) {
                let submit: boolean = false;
                submit = this.classform.controls.startDate.value != null && this.classform.controls.endDate.value != null && this.availabilityTimeData1.length != 0;
                if (!submit) {
                    this.modalRef = this.modalService.open(this.classCheck);
                } else {
                    this.addclass(this.type, 2);
                }
            } else {
                this.validationService.validateAllFormFields(this.classform);
                this.toastr.error('Please Fill All The Mandatory Fields');
            }
        } else {
            this.addclass(this.type, 2);
        }
    }

    addclass(valve, id) {
        if (this.classform.controls.startDate.value != null && this.classform.controls.endDate.value != null) {
            const startdate = this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const st = startdate.split('-');
            const endDate = this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const et = endDate.split('-');
            if (st[0] == et [0]) {
                if (st[1] == et [1]) {
                    this.dateValidation = st[2] <= et [2];
                } else {
                    this.dateValidation = st[1] <= et [1];
                }
            } else {
                this.dateValidation = true;
            }
        } else {
            this.dateValidation = true;
        }
        if (this.classform.controls.startDate.valid && this.classform.controls.endDate.valid) {
            if (this.dateValidation == true) {
                if (this.classform.valid) {

                    this.tagArray = [];
                    const tags = this.classform.controls.tag.value;
                    if (tags == '') {
                        this.tagArray = [];
                    } else if (tags != '') {
                        for (let i = 0; i < tags.length; i++) {
                            this.tagArray.push(tags[i].value);
                        }
                    }
                    this.videoArray = [];
                    const video = this.classform.controls.video.value;
                    if (video == '') {
                        this.videoArray = [];
                    } else if (video != '') {
                        for (let i = 0; i < video.length; i++) {
                            this.videoArray.push(video[i].value);
                        }
                    }
                    // const subjectData = this.classform.controls.subject.value;
                    // if (subjectData != null) {
                    //     if (subjectData.length >= 3) {
                    //         const sub = subjectData.split(',');
                    //         for (let i = 0; i < sub.length; i++) {
                    //             this.multiSubject.push(sub[i]);
                    //         }
                    //     } else {
                    //         this.multiSubject = subjectData;
                    //     }
                    // } else {
                    //     this.multiSubject = [];
                    // }
                    const upload = this.browseAdd;
                    if (upload) {
                        for (let i = 0; i < upload.length; i++) {
                            this.fileContentid.push(upload[i].id);
                        }
                    } else {
                        this.fileContentid = [];
                    }
                    const batchId = this.treeviewCompoent.batchid;
                    this.removeZoom();
                    const data = {
                        platform: 'web',
                        role_id: this.auth.getSessionData('rista-roleid'),
                        user_id: this.auth.getSessionData('rista-userid'),
                        school_id: this.schoolIdNum,
                        name: this.classform.controls.classname.value,
                        start_date: this.classform.controls.startDate.value == null ? '' : this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                        end_date: this.classform.controls.endDate.value == null ? '' : this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
                        start_time: this.classform.controls.startTime.value,
                        end_time: this.classform.controls.endTime.value == null ? '' : this.classform.controls.endTime.value == '' ? 1 : this.classform.controls.endTime.value,
                        // time_zone_id: this.classform.controls.timezone.value,
                        grade: this.classform.controls.grade.value == null ? [] : this.classform.controls.grade.value,
                        batch_id: batchId ? batchId : [],
                    // batch_id: this.classform.controls.batch.value.length != 0 ? this.classform.controls.batch.value : [],
                        subject: this.classform.controls.subject.value == null ? [] : this.classform.controls.subject.value,
                        status: this.classform.controls.status.value,
                        tags: this.tagArray,
                        video_link: this.videoArray,
                        students: this.schoolIdList,
                        teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0',
                        meeting_link: this.classform.controls.meetingLink.value,
                        meeting_id: this.classform.controls.meetingId.value,
                        passcode: this.classform.controls.passcode.value,
                        profile_url: this.imagepath.toString(),
                        profile_thumb_url: this.imagepaththumb.toString(),
                        file_path: this.pdfpath,
                        links: this.pdflinks,
                        file_text: '',
                        content_type: '1',
                        content_id: this.fileContentid,
                        content_format: '1',
                        annotation: [],
                        answers: [],
                        allow_zoom_api: this.allowZoomApi ? '0' : '1',  //value == 0 show meeting elemnts | 1 hide
                        availabilityDate: this.availabilityTimeData1,
                        individual_teacher: this.teacherType,
                        telephone_number: this.classform.controls.telephone.value,
                        class_id: this.class_id ? this.class_id : '',
                        class_status: this.classform.controls.startDate.value == null && this.classform.controls.endDate.value == null ? '1' : '0',
                        class_type: this.classform.controls.onlinePerson.value,
                        notes: this.showNotes
                    };
                    console.log(data, 'data serv');
                    if (valve == 'add') {
                        this.classService.addClasses(data).subscribe((successData) => {
                                this.addClassSuccess(successData, id);
                            },
                            (error) => {
                                this.addClassFailure(error);
                            });
                    } else if (valve == 'edit') {
                        data['class_code'] = this.editData[0].class_code,
                            this.classService.editClasses(data).subscribe((successData) => {
                                    this.editClassSuccess(successData, id);
                                },
                                (error) => {
                                    this.addClassFailure(error);
                                });
                    } else if (valve == 'addEdit') {
                        data['class_code'] = this.editData[0].class_code,
                            this.classService.editClasses(data).subscribe((successData) => {
                                    this.editClassSuccess(successData, id);
                                },
                                (error) => {
                                    this.addClassFailure(error);
                                });
                    }
                } else {
                    this.validationService.validateAllFormFields(this.classform);
                    this.toastr.error('Please Fill All The Mandatory Fields');
                }
            } else {
                this.toastr.error('End Date Should be greater than Start Date');
            }

        } else {
            this.toastr.error('Please Select Future Date');
            this.validationService.validateAllFormFields(this.classform);
        }
    }

    addClassSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.addClassDetails = successData.ResponseObject;
            this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('card-data', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('classView', false);
            this.auth.setSessionData('editView', true);
            this.auth.setSessionData('studentlist', '');
            this.auth.setSessionData('studentlist1', '');
            this.auth.removeSessionData('rista-classData');
            this.auth.removeSessionData('readonly_data');
            this.auth.removeSessionData('updatedStudent');
            this.auth.removeSessionData('readonly_startdate');
            const redirectSchedulePage = !!this.auth.getSessionData('enterThroughSchedule');
            console.log(redirectSchedulePage, 'redirectSchedulePage');
            if (id == 2) {
                // this.router.navigate(['/class/submit-class/2']);
                this.router.navigate(['/class/list-class']);
            } else {
                if (redirectSchedulePage == true) {
                    this.auth.removeSessionData('enterThroughSchedule');
                    this.router.navigate(['/schedule/schedule-page']);
                } else {
                    this.router.navigate(['/class/list-class']);
                }
            }
            // if (successData.Message != '') {
            //     this.toastr.info(successData.Message);
            // }
        } else {
            this.toastr.error(successData.ErrorObject, 'Class');
        }
    }

    editClassSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.addClassDetails = successData.ResponseObject;
            this.auth.setSessionData('editclass', JSON.stringify(successData.ResponseObject));
            this.auth.setSessionData('card-data', JSON.stringify(successData.ResponseObject));
            if (id == 0) {
                this.submitClass();
            } else {
                this.auth.setSessionData('classView', true);
                this.auth.removeSessionData('readonly_data');
                this.auth.removeSessionData('updatedStudent');
                this.auth.removeSessionData('readonly_startdate');
                this.auth.removeSessionData('class-curriculum');
                const redirectSchedulePage = !!this.auth.getSessionData('enterThroughSchedule');
                console.log(redirectSchedulePage, 'redirectSchedulePage');

                if (id == 2) {
                    if (this.addClassDetails[0].class_status != '1' && this.roleid != '2') {
                        // this.router.navigate(['/class/submit-class/2']);
                        this.router.navigate(['/class/list-class']);
                    } else {
                        this.auth.setSessionData('classView', false);
                        this.auth.setSessionData('editView', true);
                        // this.router.navigate(['/class/list-class']);
                        this.router.navigate(['/class/list-class']);
                    }
                } else {
                    if (redirectSchedulePage == true) {
                        this.auth.removeSessionData('enterThroughSchedule');
                        this.router.navigate(['/schedule/schedule-page']);
                    } else {
                        this.router.navigate(['/class/list-class']);
                    }
                }
            }
            // if (successData.Message != '') {
            //     this.toastr.info(successData.Message);
            // }
        } else {
            this.toastr.error(successData.ErrorObject, 'Class');
        }
    }

    addClassFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ErrorObject, 'Class');
    }

    curicullum(value, id) {
        this.addclass(value, id);
    }

    submitClass() {
        this.choosedData = JSON.parse(this.auth.getSessionData('card-data'));
        this.temp = JSON.parse(this.auth.getSessionData('studentlist1'));
        console.log(this.temp);
        if (this.choosedData[0].grade.length >= 3) {
            const splitGrade = this.choosedData[0].grade.split(',');
            for (let i = 0; i < splitGrade.length; i++) {
                this.allGrade.push(splitGrade[i]);
            }
        } else {
            this.allGrade.push(this.choosedData[0].grade);
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            teacher_id: this.choosedData[0].teacher_id,
            class_name: this.choosedData[0].class_name,
            subject: this.choosedData[0].subject,
            start_date: this.choosedData[0].start_date,
            end_date: this.choosedData[0].end_date,
            start_time: this.choosedData[0].start_time,
            end_time: this.choosedData[0].end_time,
            grade: this.allGrade,
            meeting_link: this.choosedData[0].meeting_link,
            meeting_id: this.choosedData[0].meeting_id,
            passcode: this.choosedData[0].passcode,
            class_code: this.choosedData[0].class_code,
            status: this.choosedData[0].status,
            class_id: this.choosedData[0].class_id,
            students: this.temp
        };
        this.classService.submit(data).subscribe((successData) => {
                this.submitClassSuccess(successData);
            },
            (error) => {
                this.submitClassFailure(error);
            });
    }

    submitClassSuccess(successData) {
        if (successData.IsSuccess) {
            this.auth.setSessionData('submit-data', JSON.stringify(successData.ResponseObject[0]));
            this.auth.setSessionData('class-curriculum', true);
            this.router.navigate(['/class/topicsAndCurriculum/1']);
        }
    }

    submitClassFailure(error) {
        console.log(error, 'error');
        this.toastr.error(error.ResponseObject, 'Class');
    }

    public numberPattern(event: any) {
        this.validationService.numberValidate1(event);
    }

    onDateChanged(event: IMyDateModel): void {
        this.myDpOptions1 = {};
        this.myDpOptions1 = {
            dateRange: false,
            firstDayOfWeek: 'su',
            dateFormat:dateOptions.pickerFormat,
            disableUntil: {
                year: event.singleDate.date.year,
                month: event.singleDate.date.month,
                day: event.singleDate.date.day - 1
            },
        };
    }

    onDateChanged1(event: any): void {
        this.myDpOptions1 = {};
        this.myDpOptions1 = {
            dateRange: false,
            dateFormat:dateOptions.pickerFormat,
            firstDayOfWeek: 'su',
            disableUntil: {
                year: this.myDpOptions.disableUntil.year,
                month: this.myDpOptions.disableUntil.month,
                day: this.myDpOptions.disableUntil.day != 1 ? this.myDpOptions.disableUntil.day : this.myDpOptions.disableUntil.day - 2,
            },
        };
    }

    encodeImageFileAsURL(event: any) {
        for (let i = 0; i < event.target.files.length; i++) {
            const getUrlEdu = '';
            const imgDetails = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const url = event.target.result;
                const getUrl = url.split(',');
                const pic = imgDetails.type.split('/');
                if (pic[1] == 'jpeg' || pic[1] == 'png' || pic[1] == 'jpg') {
                    this.onUploadKYCFinished(getUrl, imgDetails);
                } else {
                    this.toastr.error('JPEG ,PNG & JPG are the required type');
                }
            };
            reader.readAsDataURL(event.target.files[i]);
        }
    }

    onUploadKYCFinished(getUrlEdu, imageList) {
        this.recordBase64Url = getUrlEdu[1];
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            image_path: [{
                image: this.recordBase64Url,
                size: imageList.size,
                type: imageList.type,
                name: imageList.name
            }],
            uploadtype: 'teacher'
        };
        this.common.fileUpload(data).subscribe(
            (successData) => {
                this.uploadSuccess(successData);
            },
            (error) => {
                this.uploadFailure(error);
            }
        );
    }

    uploadSuccess(successData) {
        if (successData.IsSuccess) {
            this.toastr.success(successData.ResponseObject.message);
            this.imagepath = [];
            this.imagepaththumb = [];
            this.imagepath.push(successData.ResponseObject.imagepath[0].original_image_url);
            this.imagepaththumb.push(successData.ResponseObject.imagepath[0].resized_url);
        } else {
            this.toastr.error('Invalid File Format');
        }
    }

    uploadFailure(error) {
        console.log(error, 'error');
    }

    deleteImg() {
        this.imagepath = [];
        this.clearUploadfilename();
    }

    clearUploadfilename() {
        this.myInputVariable.nativeElement.value = '';
    }

    showModal() {
        this.modalRef = this.modalService.open(this.Content, {size: 'lg', backdrop: 'static'});
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    showAttendance(data , slotday){
        console.log(data, 'dta fet')
        if (data.shechdule_id != undefined && data.shechdule_id != 'scheduleid'){
            this.editData[0].slotDay = slotday;
            this.editData[0].start_time = data.slotstarttime;
            this.editData[0].end_time = data.slotendtime;
            this.editData[0].shechdule_id = data.shechdule_id;
            this.selected = [];
            data.slotDay = slotday;
            console.log(this.editData[0], 'dta this.editData[0]')

            this.getScheduleDateList(data);
        }else{
            this.toastr.error('Your schedule not saved yet', 'Failed');
        }

    }

    showSlot(type) {
        this.days.forEach((item) => {
            item.show = true;
            item.status = 0;
        });
        this.days[type - 1].show = false;
        this.availabilityTimeData = [];
        this.slotform.controls.meetingLink.patchValue(this.classform.controls.meetingLink.value);
        this.slotform.controls.meetingId.patchValue(this.classform.controls.meetingId.value);
        this.slotform.controls.meetingPasscode.patchValue(this.classform.controls.passcode.value);
        this.slotform.controls.telephone.patchValue(this.classform.controls.telephone.value);
        if (this.adminLogin) {
            this.slotform.controls.teacherid.patchValue(null);
        } else {
            this.slotform.controls.teacherid.patchValue(this.auth.getSessionData('rista-userid'));
        }
        this.fromTime = {hour: 0, minute: 0, seconds: 0};
        this.toTime = {hour: 23, minute: 59, seconds: 0};
        this.editTime = false;
        this.modalRef = this.modalService.open(this.addSlot);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.daytype = type;
    }


    editSlot(event, id) {
        if (this.allowClass) {
            this.multipleteacher = event.teacher_name;
            this.uniqueKey = event.uniqueKey;
            this.days[event.slotday - 1].show = false;
            event.slotselected = 'false';
            this.slotform.controls.teacherid.patchValue(event.teacher_id);
            this.slotform.controls.meetingLink.patchValue(event.meeting_link);
            this.slotform.controls.meetingId.patchValue(event.meeting_id);
            this.slotform.controls.meetingPasscode.patchValue(event.passcode);
            this.slotform.controls.telephone.patchValue(event.telephone_number);
            const stTime1 = event.slotstarttime.replace(' ', ':').split(':');
            if (parseInt(stTime1[0]) < 12 && stTime1[2] != 'AM') {
                stTime1[0] = parseInt(stTime1[0]) + 12;
                const stObject1 = {
                    hour: parseInt(stTime1[0]), minute: parseInt(stTime1[1]), seconds: 0
                };
                this.fromTime = stObject1;
            } else {
                let newstart = stTime1[0];
                if (stTime1[2] == 'AM') {
                    if (newstart == 12) {
                        stTime1[0] = 0;
                    } else {
                        newstart = stTime1[0];
                    }
                } else if (stTime1[2] == 'PM') {
                    if (newstart == 12) {
                        stTime1[0] = 12;
                    } else {
                        newstart = stTime1[0];
                    }
                }
                const stObject2 = {
                    hour: parseInt(stTime1[0]), minute: parseInt(stTime1[1]), seconds: 0
                };
                this.fromTime = stObject2;
            }
            const etTime1 = event.slotendtime.replace(' ', ':').split(':');
            if (parseInt(etTime1[0]) < 12 && etTime1[2] != 'AM') {
                etTime1[0] = parseInt(etTime1[0]) + 12;
                const etObject1 = {
                    hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), seconds: 0
                };
                this.toTime = etObject1;
            } else {
                const etObject2 = {
                    hour: parseInt(etTime1[0]), minute: parseInt(etTime1[1]), seconds: 0
                };
                this.toTime = etObject2;
            }
            this.editTime = true;
            this.modalRef = this.modalService.open(this.addSlot);
            this.modalRef.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
            this.daytype = event.slotday;
        } else {

        }
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

    onsave() {
        this.clearnote = '';
        this.modalRef.close();
        this.link1 = '';
        this.additionalLink = '';
    }

    onSave1() {
        this.modalRef.close();
        console.log(this.daytype, this.days, this.daytype - 1, 'dayType');
        this.days[this.daytype - 1].show = true;
        this.availabilityTimeData1.forEach((item) => {
            item.slotselected = 'true'
        });
        this.editslotform.reset();
        if (this.adminLogin) {
            this.editslotform.controls.teacherid.patchValue(null);
        } else {
            this.editslotform.controls.teacherid.patchValue(this.auth.getSessionData('rista-userid'));
        }
    }

    changeStartTime() {
        if (this.classform.controls.startDate.value.singleDate.jsDate && this.classform.controls.endDate.value.singleDate.jsDate) {
            const startDate = this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            const endDate = this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            if (this.classform.controls.startTime.value && this.classform.controls.endTime.value) {
                const startTime = parseInt(this.classform.controls.startTime.value.hour);
                const startTimeHour = parseInt(this.classform.controls.startTime.value.minute);
                const endTime = parseInt(this.classform.controls.endTime.value.hour);
                const endTimeHour = parseInt(this.classform.controls.endTime.value.minute);
                const totalStartTimeMins = (startTime * 60) + startTimeHour;
                const totalendTimeHour = (endTime * 60) + endTimeHour;
                if (startDate == endDate) {
                    if (totalStartTimeMins < totalendTimeHour) {
                        this.timeErr = false;
                    } else {
                        this.timeErr = true;
                    }
                } else {
                    this.timeErr = false;
                }
            }
        }

    }

    checkTime() {
        if (this.fromTime == undefined || this.toTime == undefined) {
            this.timeErr = true;
        } else {
            const fromTime: any = this.fromTime.hour * 60;
            const fullFromTime = fromTime + this.fromTime.minute;
            const toTime: any = this.toTime.hour * 60;
            const fulltoTime = toTime + this.toTime.minute;
            if (fulltoTime > fullFromTime) {
                this.timeErr = false;
            } else {
                this.timeErr = true;
            }
        }
        return this.timeErr;
    }

    selectDate(id) {
        if (this.auth.getSessionData('rista-roleid') == '2' || this.auth.getSessionData('rista-roleid') == '6') {
            this.teacher = this.slotform.controls.teacherid.value;
        } else if (this.auth.getSessionData('rista-roleid') == '4') {
            this.teacher = [this.auth.getSessionData('rista-userid')];
            this.multipleteacher = [this.teacherName];
        }
        const timeValid = this.checkTime();
        if (!timeValid) {
            this.validatingTime(this.fromTime, this.toTime);
            for (let i = 0; i < this.days.length; i++) {
                if (this.days[i].id == id) {
                    if (this.days[i].status == 0 || !this.days[i].show) {
                        this.availabilityTimeData.push(
                            {
                                teacher_id: this.teacher,
                                teacher_name: this.multipleteacher,
                                slotstarttime: this.startTime,
                                slotendtime: this.endTime,
                                slotday: this.days[i].id,
                                slotselected: 'true',
                                meeting_link: this.slotform.controls.meetingLink.value == '' ? '' : this.slotform.controls.meetingLink.value,
                                meeting_id: this.slotform.controls.meetingId.value == '' ? '' : this.slotform.controls.meetingId.value,
                                passcode: this.slotform.controls.meetingPasscode.value == '' ? '' : this.slotform.controls.meetingPasscode.value,
                                telephone_number: this.slotform.controls.telephone.value == '' ? '' : this.slotform.controls.telephone.value,
                            });
                        this.days[i].status = 1;
                    } else {
                        this.availabilityTimeData.forEach((item) => {
                            if (item.slotday == this.days[i].id) {
                                const index = this.availabilityTimeData.indexOf(item);
                                this.availabilityTimeData.splice(index, 1);
                            }
                        });
                        this.days[i].status = 0;
                    }
                }
            }
        }
    }

    // chane the user selected time format to that we want to send backend

    validatingTime(fromTime, endTIme) {
        const setTime = fromTime;
        const hr = setTime.hour < '10' ? '0' + setTime.hour : setTime.hour.toString();
        const mns = setTime.minute < '10' ? '0' + setTime.minute : setTime.minute.toString();
        let hours = hr[0] + hr[1];
        const min = mns[0] + mns[1];

        if (parseInt(hours) < 12) {
            if (hours == 0) {
                hours = 12;
            }
            this.startTime = hours + ':' + min + ' AM';
        } else if (parseInt(hours) > 12) {
            hours = hours - 12;
            hours = (hours < 10) ? '0' + hours : hours;
            this.startTime = hours + ':' + min + ' PM';
        } else {
            this.startTime = hours + ':' + min + ' PM';
        }
        const time1 = endTIme;
        const hr1 = time1.hour < '10' ? '0' + time1.hour : time1.hour.toString();
        const mns1 = time1.minute < '10' ? '0' + time1.minute : time1.minute.toString();
        let hours1 = hr1[0] + hr1[1];
        const min1 = mns1[0] + mns1[1];
        if (parseInt(hours1) < 12) {
            if (hours1 == 0) {
                hours1 = 12;
            }
            this.endTime = hours1 + ':' + min1 + ' AM';
        } else if (parseInt(hours1) > 12) {
            hours1 = hours1 - 12;
            hours1 = (hours1 < 10) ? '0' + hours1 : hours1;
            this.endTime = hours1 + ':' + min1 + ' PM';
        } else {
            this.endTime = hours1 + ':' + min1 + ' PM';
        }
    }

    scheduleClass(type, id) {
        if (type != 'calendar') {
            this.scheduleClassType = type;
        } else {
            this.calendarId = id;
            this.getslotList(id, type);
        }
    }

    getslotList(id, type) {
        let startDate: any = '';
        let endDate: any = '';
        let calendarstartDate: any = '';
        let calendarendDate: any = '';
        if (id == '1') {
            this.classname = this.classform.controls.classname.value;
        } else if (id == '2') {
            this.classname = '';
        }
        if (type == 'calendar') {
            calendarstartDate = this.datePipe.transform(this.firstDay, 'yyyy-MM-dd');
            calendarendDate = this.datePipe.transform(this.lastDay, 'yyyy-MM-dd');
            if (this.classform.controls.startDate.value) {
                if (this.classform.controls.startDate.value.singleDate.jsDate != 'Invalid Date') {
                    startDate = this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                }
            }
            if (this.classform.controls.endDate.value) {
                if (this.classform.controls.endDate.value.singleDate.jsDate != 'Invalid Date') {
                    endDate = this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                }
            }
        } else if (type == 'updatedCalendar') {
            calendarstartDate = this.datePipe.transform(this.firstDay, 'yyyy-MM-dd');
            calendarendDate = this.datePipe.transform(this.lastDay, 'yyyy-MM-dd');
            this.classname = '';
            if (this.classform.controls.startDate.value) {
                if (this.classform.controls.startDate.value.singleDate.jsDate != 'Invalid Date') {
                    startDate = this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                }
            }
            if (this.classform.controls.endDate.value) {
                if (this.classform.controls.endDate.value.singleDate.jsDate != 'Invalid Date') {
                    endDate = this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
                }
            }
        } else if (type == 'calenderAction') {
            calendarstartDate = this.datePipe.transform(this.firstDay, 'yyyy-MM-dd');
            calendarendDate = this.datePipe.transform(this.lastDay, 'yyyy-MM-dd');
            if (this.classform.controls.startDate.value != '') {
                startDate = this.datePipe.transform(this.classform.controls.startDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            } else if (this.classform.controls.startDate.value == '') {
                startDate = '';
            }
            if (this.classform.controls.endDate.value != '') {
                endDate = this.datePipe.transform(this.classform.controls.endDate.value.singleDate.jsDate, 'yyyy-MM-dd');
            } else if (this.classform.controls.endDate.value == '') {
                endDate = '';
            }
        }
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            from_date: calendarstartDate,
            to_date: calendarendDate,
            class_from_date: startDate,
            class_to_date: endDate,
            batch_id: this.classform.controls.batch.value.length != 0 ? this.classform.controls.batch.value : [],
            class_name: this.classname,
            availabilityDate: this.availabilityTimeData1,
            teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.classService.slotList(data).subscribe((successData) => {
                this.getslotListSuccess(successData, id);
            },
            (error) => {
                this.getslotListFailure(error);
            });
    }

    getslotListSuccess(successData, id) {
        if (successData.IsSuccess) {
            this.scheduleClassType = 'calendar';
            const gradeData = successData.ResponseObject;
            this.eventArr = [];
            this.calenderTimeSlot = [];
            gradeData.forEach((item) => {
                item.event_details.forEach((data) => {
                    // if (this.datePipe.transform(this.viewDate1, 'yyyy-MM-dd') <= this.datePipe.transform(item.date, 'yyyy-MM-dd')) {
                    const convertedTime = moment(data.slotstarttime, 'hh:mm A').format('HH:mm:ss');
                    const convertedendTime = moment(data.slotendtime, 'hh:mm A').format('HH:mm:ss');
                    const convertedSlotTime = moment(data.slotstarttime, 'hh:mm A').format('HH:mm:ss');
                    if (data.status == 1) {
                        if (id == '1') {
                            this.calenderTimeSlot.push({
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
                            });
                            this.eventArr.push(
                                {
                                    start: new Date(item.date + ' ' + convertedSlotTime),
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
                        } else if (id == '2') {
                            if (this.datePipe.transform(this.viewDate1, 'yyyy-MM-dd') <= this.datePipe.transform(item.date, 'yyyy-MM-dd')) {
                                if (this.allowClass) {
                                    this.calenderTimeSlot.push({
                                        slotdate: item.date,
                                        slotday: item.slotday,
                                        slotselected: item.slotselected,
                                        slotstarttime: data.slotstarttime,
                                        slotendtime: data.slotendtime,
                                        teacherid: data.teacher_id,
                                        teacher_name: data.teacher_name,
                                        status: data.status,
                                        telephone_number: data.telephone_number,
                                        title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                        color: colors.blue,
                                        class_id: data.class_id,
                                        meeting_link: data.meeting_link,
                                        meeting_id: data.meeting_id,
                                        passcode: data.passcode,
                                        titleName: data.message,
                                        actions: this.actions,
                                        start: new Date(item.date + ' ' + convertedTime),
                                        end: new Date(item.date + ' ' + convertedendTime),
                                    });
                                    this.eventArr.push(
                                        {
                                            start: new Date(item.date + ' ' + convertedSlotTime),
                                            slotdate: item.date,
                                            slotday: item.slotday,
                                            slotselected: item.slotselected,
                                            slotstarttime: data.slotstarttime,
                                            slotendtime: data.slotendtime,
                                            teacherid: data.teacher_id,
                                            teacher_name: data.teacher_name,
                                            status: data.status,
                                            telephone_number: data.telephone_number,
                                            title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                            color: colors.blue,
                                            class_id: data.class_id,
                                            meeting_link: data.meeting_link,
                                            meeting_id: data.meeting_id,
                                            passcode: data.passcode,
                                            titleName: data.message,
                                            actions: this.actions,
                                            allDay: true,
                                            resizable: {
                                                beforeStart: true,
                                                afterEnd: true,
                                            },
                                            draggable: false,
                                        },
                                    );
                                } else {
                                    this.calenderTimeSlot.push({
                                        start: new Date(item.date + ' ' + convertedTime),
                                        end: new Date(item.date + ' ' + convertedendTime),
                                        slotdate: item.date,
                                        slotday: item.slotday,
                                        slotselected: item.slotselected,
                                        slotstarttime: data.slotstarttime,
                                        slotendtime: data.slotendtime,
                                        teacherid: data.teacher_id,
                                        teacher_name: data.teacher_name,
                                        status: data.status,
                                        telephone_number: data.telephone_number,
                                        title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                        color: colors.blue,
                                        class_id: data.class_id,
                                        meeting_link: data.meeting_link,
                                        meeting_id: data.meeting_id,
                                        passcode: data.passcode,
                                        titleName: data.message,
                                    });
                                    this.eventArr.push(
                                        {
                                            start: new Date(item.date + ' ' + convertedSlotTime),
                                            slotdate: item.date,
                                            slotday: item.slotday,
                                            slotselected: item.slotselected,
                                            slotstarttime: data.slotstarttime,
                                            slotendtime: data.slotendtime,
                                            teacherid: data.teacher_id,
                                            teacher_name: data.teacher_name,
                                            status: data.status,
                                            telephone_number: data.telephone_number,
                                            title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name}`,
                                            color: colors.blue,
                                            class_id: data.class_id,
                                            meeting_link: data.meeting_link,
                                            meeting_id: data.meeting_id,
                                            passcode: data.passcode,
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
                            } else {
                                this.calenderTimeSlot.push({
                                    start: new Date(item.date + ' ' + convertedTime),
                                    end: new Date(item.date + ' ' + convertedendTime),
                                    slotdate: data.date,
                                    slotday: item.slotday,
                                    slotselected: item.slotselected,
                                    slotstarttime: data.slotstarttime,
                                    slotendtime: data.slotendtime,
                                    teacherid: data.teacher_id,
                                    teacher_name: data.teacher_name,
                                    status: data.status,
                                    telephone_number: data.telephone_number,
                                    title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name} `,
                                    color: colors.blue,
                                    titleName: data.message,
                                });
                                this.eventArr.push(
                                    {
                                        start: new Date(item.date + ' ' + convertedSlotTime),
                                        slotdate: data.date,
                                        slotday: item.slotday,
                                        slotselected: item.slotselected,
                                        slotstarttime: data.slotstarttime,
                                        slotendtime: data.slotendtime,
                                        teacherid: data.teacher_id,
                                        teacher_name: data.teacher_name,
                                        status: data.status,
                                        telephone_number: data.telephone_number,
                                        title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name} `,
                                        color: colors.blue,
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
                        }
                    } else if (data.status == 2) {
                        this.calenderTimeSlot.push({
                            slotdate: data.date,
                            slotday: item.slotday,
                            slotselected: item.slotselected,
                            telephone_number: data.telephone_number,
                            slotstarttime: data.slotstarttime,
                            slotendtime: data.slotendtime,
                            teacherid: data.teacher_id,
                            teacher_name: data.teacher_name,
                            status: data.status,
                            title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name} `,
                            color: colors.red,
                            titleName: data.message,
                            start: new Date(item.date + ' ' + convertedTime),
                            end: new Date(item.date + ' ' + convertedendTime),
                        });
                        this.eventArr.push(
                            {
                                start: new Date(item.date + ' ' + convertedSlotTime),
                                slotdate: data.date,
                                slotday: item.slotday,
                                slotselected: item.slotselected,
                                telephone_number: data.telephone_number,
                                slotstarttime: data.slotstarttime,
                                slotendtime: data.slotendtime,
                                teacherid: data.teacher_id,
                                teacher_name: data.teacher_name,
                                status: data.status,
                                title: `${data.message + ' at ' + data.slotstarttime + '-' + data.slotendtime + ' by ' + data.teacher_name} `,
                                color: colors.red,
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
            this.events = this.eventArr;
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    getslotListFailure(error) {
        console.log(error, 'error');
    }

    cleardata(id, type) {
        if (type == 'slot') {
            if (id == 1) {
                this.slotform.controls.meetingLink.patchValue('');
            } else if (id == 2) {
                this.slotform.controls.meetingId.patchValue('');
            } else if (id == 3) {
                this.slotform.controls.meetingPasscode.patchValue('');
            } else if (id == 4) {
                this.slotform.controls.telephone.patchValue('');
            }
        } else {
            if (id == 1) {
                this.editslotform.controls.meetingLink.patchValue('');
            } else if (id == 2) {
                this.editslotform.controls.meetingId.patchValue('');
            } else if (id == 3) {
                this.editslotform.controls.meetingPasscode.patchValue('');
            } else if (id == 4) {
                this.editslotform.controls.telephone.patchValue('');
            }
        }
    }

    changeZoomLink(){
        clearTimeout(this.searchTime);
        if (this.type == 'add') {
            this.updateZoomLink();
        } else {
            this.searchTime = setTimeout(() => {
                this.modalRef = this.modalService.open(this.zoomLink);
            }, 500);
        }
    }
    updateZoomLink(){
            if (this.availabilityTimeData1.length > 0) {
                this.availabilityTimeData1.forEach((item) => {
                    item.meeting_id = this.classform.controls.meetingId.value;
                    item.meeting_link = this.classform.controls.meetingLink.value;
                    item.passcode = this.classform.controls.passcode.value;
                    // item.telephone_number = '';
                });
            }
        }
    updateStudentAnnotate(){
        console.log(this.editData[0] , 'hi updte');
        let date = this.datePipe.transform(this.studentAttendanceDate, 'dd-MM-yyyy');
        this.editData[0].students.forEach((item) => {
            item.student_id = item.user_id;
        })
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.schoolIdNum,
            class_id: this.editData[0].class_id,
            date,
            attendence: this.editData[0].students,
            start_date: this.datePipe.transform(this.studentAttendanceDate, 'MM-dd-yyyy'),
            start_time: this.editData[0].start_time,
            end_time: this.editData[0].end_time,
            slot_day: this.editData[0].slotDay,
            type: 'add'
        };
        console.log(data ,'data');
        if (this.studentAttendanceDate == 'undefined' || this.studentAttendanceDate == undefined){
            this.toastr.error('Please Select The date', 'Failed');
            return false;

        }
        this.classService.updateAttendance(data).subscribe((successData: any) => {
            console.log(successData , 'suc');
            if (successData.IsSuccess){
                this.modalRef1.close();

                this.toastr.success(successData.ResponseObject, 'Success');
            }else{
                this.toastr.error(successData.ErrorObject, 'Failed');
            }
            },
            (error) => {
                this.timeSlotListFailure(error);
            });
    }
    getSelectedStudentList(scheduleid){
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            schedule_id: scheduleid,
            start_date: this.datePipe.transform(this.studentAttendanceDate, 'MM-dd-yyyy'),
        };
        console.log(data ,'data');
        this.classService.attendanceList(data).subscribe((successData: any) => {
               console.log(successData ,'suc')
            if (successData.IsSuccess){
                this.selected = [];

                let id = []
                successData.ResponseObject.forEach( (item) => {
                    if (item.attendance == '1'){
                        id.push(item.student_id);
                    }
                });
                this.editData[0].students.forEach( (item) => {
                    if(id.includes(item.user_id)){
                        this.selected.push(item);
                    }
                });
               console.log(this.selected ,'selectedddd')
            }else{
                this.toastr.error(successData.ErrorObject, 'Failed');

            }
            },
            (error) => {
                this.timeSlotListFailure(error);
            });
    }

    getScheduleDateList(item){
        console.log(item, 'item fetch');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            class_id: this.editData[0].class_id,
            schedule_id: item.shechdule_id,
            start_time: item.slotstarttime,
            end_time: item.slotendtime,
            slot_day: item.slotDay
        };
        console.log(data , 'data');
        this.classService.attendanceList(data).subscribe((successData: any) => {
            if (successData.IsSuccess){
                this.scheduleDates = [];
                successData.ResponseObject.scheduledate.forEach((items) => {
                    this.scheduleDates.push(this.datePipe.transform(items, dateOptions.dateFormat));
                });
                this.attendanceList = [...successData.ResponseObject.attendace];
                this.editData[0].students.forEach((val) => {
                    val.attendance  = '0';
                    val.isSelected = false;
                    val.schedule_id = this.editData[0].schedule_id;
                    val.class_id = this.editData[0].class_id;
                    val.slotDay = this.editData[0].slotDay;
                    val.start_time = this.editData[0].start_time;
                    val.end_time = this.editData[0].end_time;
                });
                console.log(this.scheduleDates, 'scheduleDates')
                if (this.scheduleDates.length > 0) {
                    this.studentAttendanceDate = this.scheduleDates[0];
                    this.changeDate();
                }
                this.modalRef1 = this.modalService.open(this.studentAtendance , {size : 'xl'});
                this.modalRef1.result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            }else{
                this.toastr.success(successData.ErrorObject, 'Failed');
            }
            },
            (error) => {
                this.timeSlotListFailure(error);
            });
    }
    allPresent(event) {
        if (event.target.checked == true) {
            this.editData[0].students.forEach((item) => {
                item.attendance  = '1';
                item.isSelected = true;
            });
        }
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        console.log(this.selected ,'selected');
        this.onUserRowSelect();

    }
    onActivate(event) {
        console.log(event ,'activate');
    }
    attendance(eve, val, type , rowIndex) {
        if (type == 'true') {
            if (eve.target.checked) {
                val = true;
                this.editData[0].students[rowIndex].attendance =  '1';
            }
        } else if (type == 'false') {
            if (eve.target.checked) {
                val = false;
                this.editData[0].students[rowIndex].attendance = '0';
                console.log(document.getElementById('allPresent').attributes);
                $('#allPresent').prop('checked', false);
            }
        }
        console.log(this.editData[0].students, 'editData[0].students');
        console.log(this.editData[0].students[rowIndex], 'editData[0].students');

    }

    studentFilterFun(){
        this.editData[0].students.forEach( (item) => {
            item.attendance = item.isSelected == false ? '0' : '1';
            item.schedule_id = this.editData[0].schedule_id;
            item.class_id = this.editData[0].class_id;
            item.slotDay = this.editData[0].slotDay;
            item.start_time = this.editData[0].start_time;
            item.end_time = this.editData[0].end_time;
        });
    }
    public onUserRowSelect() {
        console.log('s')
        // let id= []
        // this.selected.forEach( (item2) => {
        //     id.push(item2.user_id);
        // });
        // this.editData[0].students.forEach( (item) => {
        //     item.attendance = '0';
        //     item.schedule_id = this.editData[0].schedule_id;
        //     item.class_id = this.editData[0].class_id;
        //     item.slotDay = this.editData[0].slotDay;
        //     item.start_time = this.editData[0].start_time;
        //     item.end_time = this.editData[0].end_time;
        //
        // });
        // this.editData[0].students.forEach( (item) => {
        //     if (id.includes(item.user_id)){
        //         item.attendance = '1';
        //         item.schedule_id = this.editData[0].schedule_id;
        //         item.class_id = this.editData[0].class_id;
        //         item.slotDay = this.editData[0].slotDay;
        //         item.start_time = this.editData[0].start_time;
        //         item.end_time = this.editData[0].end_time
        //     }
        // });

    }
    dropdownChange(event) {
        // console.log(event, 'eve');
        this.studentAttendanceDate = event;
        $('#allPresent').prop('checked', false);
        this.changeDate();
    }

    changeDate(){
        // this.getSelectedStudentList(this.editData[0].schedule_id);
        let id = [];
        this.editData[0].students.forEach((item) => {
            item.isSelected = false;
            item.attendance = '0';
        });
        let checkSelected = this.datePipe.transform(this.studentAttendanceDate.toString(), 'MM-dd-yyyy');
        this.attendanceList.forEach((item) => {
            if (item.date.toString() == checkSelected){
                id.push(item);
            }
        });
        id.forEach( (item) => {
            this.editData[0].students.forEach( (item2) => {
                if (item.student_id == item2.user_id){
                    item2.attendance = item.attendance;
                    item2.isSelected = item.attendance == '1';
                }
            });
        });
        this.studentRows = [];
        this.studentRows = [...this.editData[0].students];
    }
}
