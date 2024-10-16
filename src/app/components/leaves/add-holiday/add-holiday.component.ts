import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ValidationService} from '../../../shared/service/validation.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ActivatedRoute} from '@angular/router';
import {BookService} from '../../../shared/service/book.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
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
import { Subject } from 'rxjs';
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
import {dateOptions, timeZone} from "../../../shared/data/config";

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
  selector: 'app-list-category',
  templateUrl: './add-holiday.component.html',
  styleUrls: ['./add-holiday.component.scss']
})
export class AddHolidayComponent implements OnInit {
  public setDate = new Date().toLocaleString('en-US', { timeZone: timeZone.location });
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableUntil: {
      year: new Date(this.setDate).getFullYear(),
      month: new Date(this.setDate).getMonth() + 1,
      day: new Date(this.setDate).getDate() - 1
    },
  };
  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat:dateOptions.pickerFormat,
    firstDayOfWeek: 'su',
    disableUntil: {
      year: this.myDpOptions.disableUntil.year,
      month: this.myDpOptions.disableUntil.month,
      day: this.myDpOptions.disableUntil.day
    },
  };
  private modalRef: NgbModalRef;
  public addLeaves: FormGroup;
  public schoolid: any;
  public allowSelect: boolean;
  public gradeData: any;
  public subjectData: any;
  public calendarDetails: any;
  public currentYear: any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate1: Date = new Date();
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-pencil letter pl-1 pr-1" aria-hidden="true"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.patchHoliday(event);
      },
    },
    {
      label: '<i class="fa fa-trash letter pl-1 pr-1" aria-hidden="true"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.deleteHoliday(event);
      },
    },
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  caelenderEvents: CalendarEvent[] = [];
  activeDayIsOpen: boolean;
  public minDate: any;
  public updateLeaves: boolean;
  public updateLeavesId: any;
  public firstDay: any;
  public lastDay: any;
  public schoolStatus: any;
  public currentCalendarshow = 'today';
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('customCellTemplate', { static: true }) customCellTemplate: TemplateRef<any>;
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, public modalService: NgbModal, public newSubject: NewsubjectService,
              public commondata: CommonDataService, public common: CommonService, public toastr: ToastrService,
              public auth: AuthService, public router: Router, public validationService: ValidationService, public book: BookService, public classService: ClassService, public datePipe: DatePipe) {
    this.minDate = {year: 1970, month: 1, day: 1};
    let date = new Date();
    this.schoolStatus = JSON.parse(this.auth.getSessionData('rista-school_details'));
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.addLeaves = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: '',
      leaves: ['', Validators.required]
    });
    this.auth.removeSessionData('readonly_startdate');
    if (this.schoolStatus.length != 0) {
      this.newSubject.schoolChange.subscribe(params => {
        if (params != ''){
          if (this.router.url.includes('add-holiday')) {
            this.leavesDetails();
          }
        } else {
          this.leavesDetails();
        }
      });
    } else {

    }
  }
  ngOnInit() {
    this.allowSelect = false;
    this.newSubject.allowSchoolChange(this.allowSelect);
    this.currentYear = moment(new Date()).format('YYYY');
    this.auth.setSessionData('rista-resourceAccess', false);
    this.auth.removeSessionData('rista-backOption');
  }
  init(params){
    this.schoolid = params;
    this.leavesDetails();
  }
  close(){
    this.modalRef.close();
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
  addHolidays(){
    this.updateLeaves = false;
    this.modalService.open(this.modalContent, { size: 'md' , windowClass: 'addHolidayModel'});
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modalService.open(this.modalContent, { size: 'md' });
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
    this.leavesDetails();
  }
  onDateChanged(event: IMyDateModel): void {
    this.myDpOptions1 = {};
    this.myDpOptions1 = {
      dateRange: false,
      dateFormat:dateOptions.pickerFormat,
      firstDayOfWeek: 'su',
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
        year: event.singleDate.date.year,
        month: event.singleDate.date.month,
        day: event.singleDate.date.day - 1
      },
    };

  }
  addLeavesSave() {
    if (this.addLeaves.valid) {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        from_date: this.datePipe.transform(this.addLeaves.controls.fromDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
        to_date: this.addLeaves.controls.toDate.value == '' ? '' : this.datePipe.transform(this.addLeaves.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
        festival_name: this.addLeaves.controls.leaves.value
      };
      this.classService.addLeavesDetails(data).subscribe( (successData) => {
            this.addLeavesSuccess(successData);
          },
          (error) => {
            this.addLeavesFailure(error);
          });
    }else {
      this.toastr.error('Please Enter required field');
    }
  }
  addLeavesSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.addLeaves.reset();
      this.modalService.dismissAll('a');
      this.leavesDetails();
    }else{
      this.toastr.error(successData.ErrorObject);
    }
  }
  addLeavesFailure(error) {}
  patchHoliday(eve){
    const setDate = this.datePipe.transform(eve.start, 'yyyy-MM-dd');
    const sd = setDate.split('-');
    const sdObject: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))}, dateRange: null};
    this.updateLeavesId = eve.id;
    this.addLeaves.controls.fromDate.patchValue(sdObject);
    this.addLeaves.controls.toDate.patchValue(sdObject);
    this.addLeaves.controls.leaves.patchValue(eve.title);
    this.updateLeaves = true;
    this.modalService.open(this.modalContent, { size: 'md' });
  }
  editHoliday(eiditId){
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      id: eiditId,
      from_date: this.datePipe.transform(this.addLeaves.controls.fromDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
      to_date: this.addLeaves.controls.toDate.value == '' ? '' : this.datePipe.transform(this.addLeaves.controls.toDate.value.singleDate.jsDate, 'yyyy-MM-dd'),
      festival_name: this.addLeaves.controls.leaves.value
    };
    this.classService.editLeavesDetails(data).subscribe( (successData) => {
          this.editLeavesSuccess(successData);
        },
        (error) => {
          this.editLeavesFailure(error);
        });
  }
  editLeavesSuccess(successData){
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.addLeaves.reset();
      this.modalService.dismissAll('a');
      this.leavesDetails();
    }else{
      this.toastr.error(successData.ErrorObject);
    }
  }
  editLeavesFailure(error){}
  deleteHoliday(eve){
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      id: eve.id,
      from_date: this.datePipe.transform(eve.start, 'yyyy-MM-dd'),
      to_date: this.datePipe.transform(eve.start, 'yyyy-MM-dd')
    };
    this.classService.deleteLeavesDetails(data).subscribe( (successData) => {
          this.deleteLeavesSuccess(successData);
        },
        (error) => {
          this.deleteLeavesFailure(error);
        });
  }
  deleteLeavesSuccess(successData){
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject);
      this.activeDayIsOpen = false;
      this.leavesDetails();
    }else {
      this.toastr.error(successData.ErrorObject);
    }
  }
  deleteLeavesFailure(error){}
  leavesDetails() {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        from_date: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd'),
        to_date: this.datePipe.transform(this.lastDay, 'yyyy-MM-dd'),
        // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      this.classService.LeavesDetailsList(data).subscribe( (successData) => {
            this.leavesDetailsSuccess(successData);
          },
          (error) => {
            this.leavesDetailsFailure(error);
          });
    }
  leavesDetailsSuccess(successData) {
    if (successData.IsSuccess) {
      this.calendarDetails = successData.ResponseObject;
      let eventArr = [];
      this.calendarDetails?.forEach((item) => {
        if (this.datePipe.transform(this.viewDate1, 'yyyy-MM-dd') <= this.datePipe.transform(item.from_date, 'yyyy-MM-dd')) {
          eventArr.push(
              {
                start: new Date(item.from_date),
                end_date: item.to_date,
                title: `${item.festival_name} `,
                id: item.id,
                school_id: item.school_id,
                color: colors.red,
                titleName: item.message,
                actions: this.actions,
                allDay: true,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
                draggable: false,
              },
          );
        }else{
          eventArr.push(
              {
                start: new Date(item.from_date),
                end_date: item.to_date,
                title: `${item.festival_name} `,
                id: item.id,
                school_id: item.school_id,
                color: colors.red,
                titleName: item.message,
                // actions: this.actions,
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
      this.caelenderEvents = eventArr;
      this.activeDayIsOpen = false;
    }else{
      this.toastr.error(successData.ErrorObject);
    }
  }
  leavesDetailsFailure(error) {}
}
