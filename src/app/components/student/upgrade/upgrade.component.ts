import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from "../../../shared/service/auth.service";
import {StudentService} from "../../../shared/service/student.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ClassService} from "../../../shared/service/class.service";

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  public lastUpgrade: any;
  gradeData = [];
  public listData = [];
  public listDataAlt = [];
  @ViewChild('upgrade') upgrade: TemplateRef<any>;
  private modalRef: NgbModalRef;

  constructor(public auth: AuthService, public student: StudentService, public toastr: ToastrService, private modalService: NgbModal,
              public classes: ClassService) { }

  ngOnInit(): void {
    this.gradeList();
    this.studentList();
  }
  openUpgradeAlert() {
    this.lastUpgrade = this.listData[0].upgrade_date;
    this.modalRef = this.modalService.open(this.upgrade, { size: 'md', backdrop: 'static' });
  }
  upgradeSelectedStudent() {
    this.updateArr();
    const studentArray = [];
    this.listDataAlt.forEach((item) => {
      if (item.selected == true) {
        studentArray.push(item.user_id);
      }
    });
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: studentArray
    };
    this.student.studentUpgrade(data).subscribe((successData) => {
          this.gradingSuccess(successData);
        },
        (error) => {
          console.log(error, 'error');
        });
  }
  gradingSuccess(successData) {
    if (successData.IsSuccess) {
        this.toastr.success(successData.ResponseObject);
        this.close();
        this.studentList();
    }
  }
  studentList() {
    const data = {
      platform: 'web',
      type: 'list',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
    };
    this.student.getStudentList(data).subscribe((successData) => {
          this.studentListSuccess(successData);
        },
        (error) => {
          console.log(error, 'error');
        });
  }

  studentListSuccess(successData) {
    if (successData.IsSuccess) {
      this.listData = successData.ResponseObject;
      this.listData.forEach((value, index) => {
        value.selected = false;
        this.listData[index].status = this.listData[index].status == 1 ? 'Active' : this.listData[index].status == 2 ?
            'Inactive' : this.listData[index].status == 3 ? 'Suspended' : this.listData[index].status == 4 ? 'Deleted' : '';
      });
      this.listDataAlt = JSON.parse(JSON.stringify(this.listData));
    }
  }
  gradeList() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
    };
    this.classes.gradeList(data).subscribe((successData) => {
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
  updateArr() {
    this.listDataAlt.forEach((item) => {
      this.listData.forEach((val) => {
        if (item.user_id == val.user_id) {
          item.selected = val.selected;
        }
      });
    });
  }
  filterByGrade(event) {
    this.updateArr();
    if (event == undefined) {
      this.listData = this.listDataAlt;
    } else {
      this.listData = this.listDataAlt.filter((item) => {
        return item.grade_id == event.grade_id;
      });
    }
  }
  close() {
    this.modalRef.close();
  }

}
