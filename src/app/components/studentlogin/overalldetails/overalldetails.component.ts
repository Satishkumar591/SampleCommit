import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from '../../../shared/service/auth.service';
import {ClassService} from '../../../shared/service/class.service';
import {ReportService} from '../../../shared/service/report.service';
import {ToastrService} from 'ngx-toastr';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';

@Component({
  selector: 'app-overalldetails',
  templateUrl: './overalldetails.component.html',
  styleUrls: ['./overalldetails.component.scss']
})
export class OveralldetailsComponent implements OnInit {
  @Input() studentdata: any;
  public details: any;
  public imageObject: any;
  public classData: any;
  webhost: any;
  recordsperpage: any;
  pageOffSet: any;
  pageno: any;
  totalrecords: any;
  harizontalScroll: any;
  public contentDetailsData: any;
  public rows: any;
  public newrows: any;
  public contentType: any;
  public notesData: any;
  public contentData: any = [];
  public contentFormatted: any = [];
  public showNotes: any = [];
  public classNotes: any = [];
  public listContent: any = [];
  public notes: any = '';
  public classIndex: any;
  public studentname: any;
  private modalRef: NgbModalRef;
  public closeResult: string;
  public contentId: any;
  public contentFormat: any;
  public classId: any;
  public studentId: any;
  public classInfo: any;
  public editorValue: any;
  @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
  @ViewChild('viewStudentDetails') viewStudentDetails: TemplateRef<any>;
  @ViewChild('showInform') showInform: TemplateRef<any>;
    @ViewChild('notStarted') notStarted: TemplateRef<any>;
    @ViewChild('writeNoteOpen') writeNoteOpen: TemplateRef<any>;
    @ViewChild('classNote') classNote: TemplateRef<any>;
    public studentContentId: any;
    constructor(public auth: AuthService, public confi: ConfigurationService, public sanitizer: DomSanitizer, public classlist: ClassService,
                public report: ReportService, private modalService: NgbModal, public toastr: ToastrService, public contentDetail: ContentdetailService) {
    this.webhost = this.confi.getimgUrl();
    this.recordsperpage = 10;
    this.harizontalScroll = true;
    this.pageOffSet = 0;
    this.pageno = 1;
    this.imageObject = [{thumbImage: 'assets/images/ristaschool/male.png', id: '0'},
      {thumbImage: 'assets/images/ristaschool/female1.png', id: '1'},
      {thumbImage: 'assets/images/ristaschool/Do not want to disclose.png', id: '2'},
    ];
  }

  ngOnInit(): void {
    this.details = this.studentdata;
    console.log(this.details, 'getAnswerNeeded')
    this.selectClass();
  }

  setPage(pageInfo) {
    console.log(pageInfo, 'inside');
    this.pageno = pageInfo.offset + 1;
    this.pageOffSet = pageInfo.offset;
  }
  selectClass(){
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.details.school_id,
      student_id: this.details.user_id,
    };
    this.classlist.studentClass(data).subscribe( (successData) => {
          this.studentClasslistSuccess(successData);
        },
        (error) => {
          this.studentClasslistError(error);
        });
  }
  studentClasslistSuccess(successData){
    console.log(successData, 'successData');
    this.classData = successData.ResponseObject;
    this.classData.forEach((items) => {
       items.selectedstatus = 'false';
    });
  }
  studentClasslistError(error){
    console.log(error, 'error');
  }

  getEditorValue(event) {
    this.editorValue = event.editor;
    this.notes = event.content;
}
  studentContentDetails(event){
    this.contentType = event.target.value;
    this.contentData = [];
    this.contentFormatted = [];
    this.newrows = [];
    this.studentDetails(this.classIndex);
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
                this.teacherNotifiyParentError(error);
            });
    }
    studentNotAnswer(data){
        this.modalRef = this.modalService.open(this.notStarted);
        this.studentname = [data];
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
    teacherNotifiyParentError(error){
        console.log(error);
    }
    close(){
        this.modalRef.close(this.modalContentnow);
        this.editorValue != '' ? this.editorValue.setContent('') : '';
        this.notes = '';
        // this.notes = $('#addNotes').val('');
    }
    closeNotstarted(){
        this.modalRef.close('notStarted');
    }
    selectStudentDetails(index, contentType){
        this.contentType = contentType;
        this.contentData = [];
        this.contentFormatted = [];
        this.classIndex = index;
        this.studentDetails(index);
    }
  studentDetails(indexValue) {
    this.classData.forEach((items, index) => {
        items.selectedstatus = 'false';
        if (index == indexValue){
            items.selectedstatus = 'true';
        }
    });
    console.log('in');
    const data = {
        platform: 'web',
        role_id: this.auth.getSessionData('rista-roleid'),
        user_id: this.auth.getSessionData('rista-userid'),
        teacher_id: '0',
        class_id: this.classData[indexValue].class_id,
        content_type: this.contentType,
        content_id: this.contentData,
        date_filter: '2',
        from_date: null,
        to_date: null
      };
    this.report.getPerformanceContent(data).subscribe((successData) => {
      this.studentContentDetailsSuccess(successData, indexValue);
      },
        (error) => {
      this.studentContentDetailsFailure(error);
    });
  }

  studentContentDetailsSuccess(successData, indexValue) {
    console.log(successData, 'successData');
    const selected = successData.ResponseObject;
    if (successData.IsSuccess) {
        this.newrows = successData.ResponseObject;
        this.contentData = selected.map(item => item.content_id);
        this.contentFormatted = selected.map(item => item.content_format);
        this.studentReportDetails();
    }else {
        this.contentDetailsData = [];
        this.newrows = [];
    }
  }

  studentContentDetailsFailure(error) {
    console.log(error, 'error');
  }
  studentReportDetails() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      teacher_id: '0',
      content_type: this.contentType,
      class_id: this.classData[this.classIndex].class_id,
      student_id: this.details.user_id,
      type: '',
      performance: '',
      content_id: this.contentData,
      content_format : this.contentFormatted
    };
    this.report.getMissedWorkReport(data).subscribe((successData) => {
      this.studentReportDetailsSuccess(successData);
      },
        (error) => {
      this.studentReportDetailsFailure(error);
    });
  }

  studentReportDetailsSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      this.rows = successData.ResponseObject?.data;
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].content == ''){
        }else {
          this.contentDetailsData = this.rows[i].content;
        }
      }
      this.totalrecords = successData.ResponseObject?.data[0].count;
    } else{
        this.contentDetailsData = [];
        this.newrows = [];
      // console.log(this.contentDetailsData, 'this.message');
    }
  }

  studentReportDetailsFailure(error) {
    console.log(error, 'error');
  }

    openNotes(item, list) {
        item['content_id'] = list.content_id;
        item['student_id'] = list.student_id;
        item['content_type'] = list.content_type;
        console.log(item, 'item')
        console.log(list, 'list')
        this.getNotes(item);
        this.modalRef = this.modalService.open(this.writeNoteOpen, {size: 'md'});
    }

    openClassNotes(list) {
        console.log(list, this.details, 'classNotes');
        this.getClassNotes(list, 0);
        this.modalRef = this.modalService.open(this.classNote, {size: 'lg'});
    }

    getNotes(item) {
        this.notesData = item;
        console.log(this.details, 'this.details');
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
    getClassNotes(item, contentId) {
        this.notesData = item;
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            student_id: this.details.user_id,
            class_id: item.class_id,
            school_id: this.details.school_id,
            content_id: contentId == 0 ? 0 : item.content_id
        };
        this.contentDetail.notesList(data).subscribe((successData) => {
                this.ClassNotesListSuccess(successData, data);
            },
            (error) => {
                console.error(error, 'error_classList');
            });
    }
    ClassNotesListSuccess(successData, key) {
        if (successData.IsSuccess) {
            this.classNotes = successData.ResponseObject;
            if (key.content_id == 0) {
                this.listContent = [];
                this.classNotes.forEach((val) => {
                    if (this.listContent.length > 0) {
                        let occured = false;
                        this.listContent.forEach((item) => {
                            if (item.content_id == val.content_id) {
                                occured = true;
                            }
                        });
                        if (!occured) {
                            this.listContent.push({content_name: val.content_name, content_id: val.content_id, class_id: val.class_id});
                        }
                    } else {
                        this.listContent.push({content_name: val.content_name, content_id: val.content_id, class_id: val.class_id});
                    }
                });
            }
        }
    }
    changeNotes(event) {
        console.log(event);
        if (event == undefined) {
            this.getClassNotes(this.notesData, 0);
        } else {
            this.getClassNotes(event, 1);
        }

    }

    addNotes(type) {
        console.log(this.notesData, 'notesData');
        // this.notes = $('#addNotes').val();
        const data = {
            platform: 'web',
            role_id: this.auth.getSessionData('rista-roleid'),
            user_id: this.auth.getSessionData('rista-userid'),
            content_id: this.notesData.content_id,
            content_type: this.notesData.content_type,
            student_id: this.notesData.student_id,
            class_id: this.notesData.class_id,
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
            this.getNotes(this.notesData);
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
            content_id: this.notesData.content_id,
            student_id: this.notesData.student_id,
            class_id: this.notesData.class_id,
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
            this.getNotes(this.notesData);
        }
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
    studentCorrectionDetail(data){
        console.log(data, 'data');
        this.modalRef = this.modalService.open(this.viewStudentDetails, {size: 'xl'});
        this.contentId = data.content_id;
        this.contentFormat = data.content_format;
        this.classId = data.class_id;
        this.studentId = data.student_id;
        this.studentContentId = data.student_content_id;
    }
    onSave() {
        this.modalRef.close('viewStudentDetails');
    }
    onSave1() {
        this.modalRef.close('showInform');
    }
    showInformation(value){
        this.modalRef = this.modalService.open(this.showInform, {size: 'sm'});
        this.classInfo = value;
        console.log(this.classInfo, 'val');
    }
}
