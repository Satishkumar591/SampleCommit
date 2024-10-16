import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {CommonDataService} from '../../../shared/service/common-data.service';
import {ContentdetailService} from '../../../shared/service/contentdetail.service';
import {NewsubjectService} from '../../../shared/service/newsubject.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TeacherService} from '../../../shared/service/teacher.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ClassService} from '../../../shared/service/class.service';
import {SessionConstants} from '../../../shared/data/sessionConstants';
import {CreatorService} from '../../../shared/service/creator.service';

@Component({
  selector: 'app-student-work',
  templateUrl: './student-work.component.html',
  styleUrls: ['./student-work.component.scss']
})
export class StudentWorkComponent implements OnInit {

  public choosedData: any;
  public type: any;
  public classesDetails: any;
  public selectedClass: any;
  public contentType: any = 2;
  public allowDropDown: boolean;
  public teacherCorrectionStatus: any;
  public teacherContentType: any;
  public webhost: any;
  public searchStudent: any = '';
  direction = '';
  public pageNo: any = 1;
  public selector: string = '.scrollPanel1';
  public closeResult: string;
  public studentname: any = '';
  public searchTime: any;
  public releaseType: any;
  public batchData: any;
  public teacherListData: any;
  public selectTeacher: any;
  public selectClassRoom: any;
  public notifyType: any = '';
  public open: boolean;
  @ViewChild('contentnow') modalContentnow: TemplateRef<any>;
  private modalRef: NgbModalRef;

  constructor(public router: ActivatedRoute, public auth: AuthService, public commondata: CommonDataService, public confi: ConfigurationService, public contentDetail: ContentdetailService,
              public subject: NewsubjectService, public route: Router, public teacher: TeacherService, public sanitizer: DomSanitizer, public creatorService: CreatorService,
              private modalService: NgbModal, private toastr: ToastrService, public classService: ClassService) {
    this.router.params.forEach((params) => {
      this.type = params.type;
    });
    this.webhost = this.confi.getimgUrl();
    this.auth.setSessionData('rista-resourceAccess', false);
    this.auth.setSessionData('rista-browseAll', false);
    this.auth.removeSessionData('rista-classData');
    this.auth.removeSessionData('updatedStudent');
    this.auth.removeSessionData('readonly_data');
    this.auth.removeSessionData('readonly_startdate');
    this.auth.removeSessionData('rista-backOption');
    this.subject.schoolChange.subscribe(params => {
      if (params != '') {
        if (this.route.url.includes('student-work')) {
          this.init(params);
        }
      } else {
        this.init(this.auth.getSessionData('rista-school_id'));
      }
    });
  }

  ngOnInit(): void {
    this.allowDropDown = false;
    this.subject.allowSchoolChange(this.allowDropDown);
    this.open = true;
    // this.creatorService.changeViewList(this.open);
  }

  // ngOnDestroy(): void {
  //   this.setSearch_Filter();
  // }

  init(id) {
    this.pageNo = 1;
    this.choosedData = '';
    this.getSearch_Filter();
    if (this.auth.getRoleId() != '4') {
      this.teacherList();
    }
    this.batchDataList();
    this.studentContentDetails();
  }

  enterAction(data) {
    this.auth.setSessionData('rista-classDetails', JSON.stringify(data));
    this.auth.setSessionData('student-content', 1);
    if (this.contentType == 2) {
      this.route.navigate(['/assignment-correction/correction-page']);
    } else {
      this.route.navigate(['/assessment-correction/correction-page']);
    }
  }


  releaseScore(studentData) {
    this.releaseType = 'single';
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      student_id: [studentData.student_id],
      content_id: studentData.content_id,
      class_id: studentData.class_id,
      release_score: '1'
    };
    this.teacher.releaseScore(data).subscribe((successData) => {
          this.releaseScoreSuccess(successData);
        },
        (error) => {
          this.releaseScoreFailure(error);
        });
  }

  releaseScoreSuccess(successData) {
    if (successData.IsSuccess) {
      this.toastr.success(successData.ResponseObject, 'Score released');
      this.choosedData = '';
      this.studentContentDetails();
    }
  }

  releaseScoreFailure(error) {
    this.toastr.error(error, 'Failed');
  }

  batchDataList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      type: '2'
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

  releaseAll() {
    this.releaseType = 'all';
    let notifyStudent = [];
    console.log(this.choosedData, 'choose1');
    this.choosedData.forEach((items) => {
      notifyStudent.push({
        class_id: items.class_id,
        content_id: items.content_id,
        student_id: items.student_id,
        student_content_id: items.student_content_id
      });
    });
    console.log(this.choosedData, 'choose2');
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      student_list: notifyStudent,
      release_score: '1'
    };
    console.log(data, 'newdata');
    this.teacher.releaseScoreAll(data).subscribe((successData) => {
          this.releaseScoreSuccess(successData);
        },
        (error) => {
          this.releaseScoreFailure(error);
        });
  }

  notifyParent(data, id) {
    this.notifyType = id;
    if (id == 1) {
      this.studentname = data;
    } else {
      this.studentname = [data];
    }
    this.modalRef = this.modalService.open(this.modalContentnow);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close() {
    this.modalRef.close();
    this.notifyType = '';
  }

  confirmNotifiy() {
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
    this.contentDetail.notifiyParent(data).subscribe((successData) => {
          this.teacherNotifyParentSuccess(successData);
        },
        (error) => {
          this.teacherNotifiyParentError(error);
        });
  }

  teacherNotifyParentSuccess(successData) {
    if (successData.IsSuccess) {
      console.log(successData, 'response');
      this.modalRef.close();
      this.toastr.success(successData.ResponseObject, 'Notify-Parent');
      this.notifyType = '';
    } else {
      this.toastr.error(successData.ErrorObject);
    }
  }

  teacherNotifiyParentError(error) {
    console.log(error);
    this.notifyType = '';
  }

  contentselect(event) {
    this.choosedData = '';
    this.pageNo = 1;
    this.contentType = event.target.value;
    if (event == '2') {
      this.teacherContentType = 'Assignment';
    } else {
      this.teacherContentType = 'Assessment';
    }
    this.studentContentDetails();
  }

  onScrollDown(ev) {
    this.direction = 'down';
    this.pageNo++;
    this.studentContentDetails();
  }

  onUp(ev) {
    this.direction = 'up';
  }

  teacherStatus(event) {
    this.choosedData = '';
    this.pageNo = 1;
    this.teacherCorrectionStatus = event.target.value;
    this.studentContentDetails();
  }

  updateFilter(event) {
    this.searchStudent = event;
    clearTimeout(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.studentContentDetails();
      this.setSearch_Filter();
    }, 1200);
    this.pageNo = 1;
  }

  selection() {
    this.pageNo = 1;
    this.choosedData = '';
    this.setSearch_Filter();
  }

  confirmStudentNotify(type) {
    if (type == 1) {
      this.close();
      this.studentContentDetails();
    } else if (type == 2) {
      this.close();
      this.confirmNotifiy();
    }
  }

  studentContentDetails() {
    const data = {
      platform: 'web',
      type: '0',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : this.selectTeacher ? this.selectTeacher : '0',
      status: this.teacherCorrectionStatus,
      content_type: this.contentType,
      class_id: this.selectedClass ? this.selectedClass : '0',
      pageno: this.pageNo,
      recordsperpage: '20',
      search: this.searchStudent,
      batch_id: this.selectClassRoom ? this.selectClassRoom : ''
    };
    if (this.notifyType != '') {
      this.contentDetail.notifiyAllParent(data).subscribe((successData) => {
            this.teacherNotifyParentSuccess(successData);
          },
          (error) => {
            this.teacherNotifiyParentError(error);
          });
    } else {
      this.contentDetail.studentContent(data).subscribe((successData) => {
            this.studentContentDetailsListSuccess(successData);
          },
          (error) => {
            this.studentContentDetailsListFailure(error);
          });
    }
  }

  studentContentDetailsListSuccess(successData) {
    this.classList();
    if (successData.IsSuccess) {
      let temp = successData.ResponseObject;
      if (this.searchStudent.length > 0 && this.pageNo == 1) {
        this.choosedData = successData.ResponseObject;
      }
      if (this.searchStudent.length == 0 && this.pageNo == 1) {
        this.choosedData = successData.ResponseObject;
      }
      if (this.pageNo > 1 && temp.length > 0) {
        for (let entry of temp) {
          this.choosedData.push(entry);
        }
      }
      // if (this.choosedData.length == 0 && this.selectedClass != ''){
      //     this.selectedClass = null;
      //     this.studentContentDetails(1);
      // }
    } else {
      this.toastr.error(successData.ErrorObject);
    }
  }

  studentContentDetailsListFailure(error) {
    console.log(error, 'error');
  }

  classList() {
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      teacher_id: this.auth.getRoleId() == '4' ? this.auth.getUserId() : '0',
      status: this.teacherCorrectionStatus,
      content_type: this.contentType
    };
    this.contentDetail.classList(data).subscribe((successData) => {
          this.classListSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_classList');
        });
  }

  classListSuccess(successData) {
    if (successData.IsSuccess) {
      this.classesDetails = successData.ResponseObject;
      if (this.classesDetails.length == 0){
        this.selectedClass = undefined;
      }
    }
  }

  setSearch_Filter() {
    let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentWorkSearch));
    if (data != null) {
      data.forEach((items) => {
        if (items.school_id == this.auth.getSessionData('rista-school_id')) {
          items.class = this.selectedClass;
          items.teacher = this.selectTeacher;
          items.curriculum_Folder = this.selectClassRoom;
          items.teacherCorrectionStatus = this.teacherCorrectionStatus;
          items.contentType = this.contentType;
          items.studentName = this.searchStudent;
        } else {
          const searchData = {
            teacher: this.selectTeacher,
            class: this.selectedClass,
            curriculum_Folder: this.selectClassRoom,
            school_id: this.auth.getSessionData('rista-school_id'),
            teacherCorrectionStatus: this.teacherCorrectionStatus,
            contentType: this.contentType,
            studentName: this.searchStudent
          };
          data.push(searchData);
        }
      });
      data = data.filter((test, index, array) =>
          index === array.findIndex((findTest) =>
          findTest.school_id === test.school_id
          )
      );
      this.auth.setSessionData(SessionConstants.studentWorkSearch, JSON.stringify(data));
    }
  }

  getSearch_Filter() {
    let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentWorkSearch));
    data.every((items) => {
      if (items.school_id == this.auth.getSessionData('rista-school_id')) {
        this.selectedClass = items.class;
        this.selectTeacher = items.teacher;
        this.selectClassRoom = items.curriculum_Folder;
        this.teacherCorrectionStatus = items.teacherCorrectionStatus;
        this.contentType = items.contentType;
        this.searchStudent = items.studentName;
        return false;
      } else {
        this.selectedClass = undefined;
        this.selectTeacher = undefined;
        this.selectClassRoom = undefined;
        this.teacherCorrectionStatus = '0';
        this.contentType = 2;
        this.searchStudent = '';
      }
      return true;
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

}
