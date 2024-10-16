import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ReportService} from '../../../shared/service/report.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-student-report',
    templateUrl: './student-report.component.html',
    styleUrls: ['./student-report.component.scss']
})
export class StudentReportComponent implements OnInit {

    @Input() classData: any = [];
    @Input() studentId: any = '';
    @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
    @ViewChild('notStarted') notStarted: TemplateRef<any>;
    @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
    @ViewChild('writeNoteOpen') writeNoteOpen: TemplateRef<any>;

    public contentData = [];
    public contentFormatted = [];
    public studentContentDetailsData = [];
    public contentType = '2';
    public modalRef: NgbModalRef;
    public contentId = '';
    public contentFormat = '';
    public studentContentId = '';
    public studentname: any;
    public closeResult: string;
    public editorValue: any = '';
    public notes: any = '';
    public searchContent = '';
    public studentContentDetailsData1 = [];
    public showNotes = [];

    constructor(public auth: AuthService, public report: ReportService, private modalService: NgbModal,
                public contentDetail: ContentdetailService, public toastr: ToastrService) {
    }

    ngOnInit(): void {
        console.log(this.classData, 'classData');
        this.studentDetails();
    }

    onSave() {
        this.modalRef.close('viewStudentDetails');
    }

    updateFilter(event) {
        const val = event.toLowerCase();
        const temp = this.studentContentDetailsData1.filter(function (d) {
            return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        console.log(temp, 'temp');
        this.studentContentDetailsData = temp;
    }

    openNotes(item, list) {
        item['content_id'] = list.content_id;
        item['student_id'] = list.student_id;
        item['content_type'] = list.content_type;
        console.log(item, 'item');
        console.log(list, 'list');
        this.getNotes(item);
        this.modalRef = this.modalService.open(this.writeNoteOpen, {size: 'md'});
    }

    notifyParent(data){
        this.studentname = [data];
        this.modalRef = this.modalService.open(this.modalContentnow);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    studentNotAnswer(data){
        this.modalRef = this.modalService.open(this.notStarted);
        this.studentname = [data];
    }

    closeNotstarted(){
        this.modalRef.close('notStarted');
    }

    studentCorrectionDetail(data){
        console.log(data, 'data');
        this.contentId = data.content_id;
        this.contentFormat = data.content_format;
        this.studentContentId = data.student_content_id;
        this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
    }

    studentContentDetails(event) {
        this.contentType = event.target.value;
        this.contentData = [];
        this.contentFormatted = [];
        this.studentDetails();
    }

    getNotes(item) {
        // this.notesData = item;
        // console.log(this.details, 'this.details');
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: item.content_id,
            student_id: item.student_id,
            class_id: item.class_id,
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.contentDetail.notesList(data).subscribe((successData) => {
                this.notesListSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_classList');
            });
    }

    notesListSuccess(successData) {
        if (successData.IsSuccess) {
            console.log(successData.ResponseObject, 'get notes');
            this.showNotes = successData.ResponseObject;
        }
    }

    addNotes(type) {
        console.log(this.classData, 'ClassData');
        // this.notes = $('#addNotes').val();
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.classData.content_id,
            content_type: this.classData.content_type,
            student_id: this.studentId,
            class_id: this.classData.class_id,
            notes: this.notes,
            type,
            school_id: this.auth.getSessionData('rista-school_id'),
        };
        this.contentDetail.notesAdd(data).subscribe((successData) => {
                this.addNotesSuccess(successData, data);
            },
            (error) => {
                console.error(error, 'error_classList');
            });
    }
    addNotesSuccess(successData, data) {
        if (successData.IsSuccess) {
            if (data.type == '2') {
                this.toastr.success('Mail Sent Successfully');
            }
            this.editorValue != '' ? this.editorValue.setContent('') : '';
            this.notes = '';
            this.getNotes(this.classData);
            // $('#addNotes').val('');
            this.notes = '';
            // this.showNotes = successData.ResponseObject;
        } else {
            this.toastr.error(successData.ErrorObject);
        }
    }

    deleteNotes(item) {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.classData.content_id,
            student_id: this.studentId,
            class_id: this.classData.class_id,
            school_id: this.auth.getSessionData('rista-school_id'),
            id: item.id
        };
        this.contentDetail.notesDelete(data).subscribe((successData) => {
                this.deleteNotesSuccess(successData);
            },
            (error) => {
                console.error(error, 'error_classList');
            });
    }
    deleteNotesSuccess(successData) {
        if (successData.IsSuccess) {
            this.getNotes(this.classData);
        }
    }

    getEditorValue(event) {
        this.editorValue = event.editor;
        this.notes = event.content;
    }

    studentDetails() {
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            teacher_id: '0',
            class_id: this.classData.class_id,
            content_type: this.contentType,
            content_id: this.contentData,
            date_filter: '2',
            from_date: null,
            to_date: null
        };
        this.report.getPerformanceContent(data).subscribe((successData) => {
                this.studentContentDetailsSuccess(successData);
            },
            (error) => {
                console.error(error, 'StudentReportClass');
            });
    }

    studentContentDetailsSuccess(successData) {
        console.log(successData, 'successData');
        const selected = successData.ResponseObject;
        if (successData.IsSuccess) {
            this.contentData = selected.map(item => item.content_id);
            this.contentFormatted = selected.map(item => item.content_format);
            this.studentReportDetails();
        } else {
            this.studentContentDetailsData = [];
            this.studentContentDetailsData1 = [];
            this.contentData = [];
            this.contentFormatted = [];
        }
    }

    studentReportDetails() {
      const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        school_id: this.auth.getSessionData('rista-school_id'),
        teacher_id: '0',
        content_type: this.contentType,
        class_id: this.classData.class_id,
        student_id: this.studentId,
        type: '',
        performance: '',
        content_id: this.contentData,
        content_format : this.contentFormatted
      };
      this.report.getMissedWorkReport(data).subscribe((successData) => {
            this.studentReportDetailsSuccess(successData);
          },
          (error) => {
            console.error(error, 'studentReprtError');
          });
    }

    studentReportDetailsSuccess(successData) {
      console.log(successData, 'successData');
      if (successData.IsSuccess) {
        this.studentContentDetailsData = successData.ResponseObject?.data[0].content;
        this.studentContentDetailsData1 = successData.ResponseObject?.data[0].content;
        console.log(this.studentContentDetailsData, 'studentContentDetailsData');
        // for (let i = 0; i < this.rows.length; i++) {
        //   if (this.rows[i].content == ''){
        //   }else {
        //     this.contentDetailsData = this.rows[i].content;
        //   }
        // }
        // this.totalrecords = successData.ResponseObject?.data[0].count;
      } else{
          this.studentContentDetailsData = [];
          this.studentContentDetailsData1 = [];
        // this.contentDetailsData = [];
        // this.newrows = [];
        // console.log(this.contentDetailsData, 'this.message');
      }
    }
    //
    // studentReportDetailsFailure(error) {
    //   console.log(error, 'error');
    // }

    confirmNotifiy(){
        let notifyStudent = [];
        this.studentname.forEach((items) => {
            notifyStudent.push({
                class_id: items.class_id,
                content_id: items.content_id,
                student_id: items.student_id,
                student_content_id: items.student_content_id
            });
        });
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            school_id: this.auth.getSessionData('rista-school_id'),
            notify: notifyStudent
        };
        console.log(data, 'dadass');
        this.contentDetail.notifiyParent(data).subscribe( (successData) => {
                this.teacherNotifyParentSuccess(successData);
            },
            (error) => {
                console.error(error, 'notify-parent');
            });
    }

    teacherNotifyParentSuccess(successData){
        if (successData.IsSuccess) {
            console.log(successData, 'response');
            this.toastr.success(successData.ResponseObject);
            this.close();
            this.studentReportDetails();
        }else{
            this.toastr.error(successData.ErrorObject);
        }
    }

    close(){
        this.modalRef.close(this.modalContentnow);
        this.editorValue != '' ? this.editorValue.setContent('') : '';
        this.notes = '';
        // this.notes = $('#addNotes').val('');
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

}
