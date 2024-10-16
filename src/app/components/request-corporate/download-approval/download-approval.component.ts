import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../../shared/service/content.service';
import {AuthService} from '../../../shared/service/auth.service';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {dateOptions} from "../../../shared/data/config";

@Component({
  selector: 'app-download-approval',
  templateUrl: './download-approval.component.html',
  styleUrls: ['./download-approval.component.scss']
})
export class DownloadApprovalComponent implements OnInit {
    myDpOptions: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
    };
    myDpOptions1: IAngularMyDpOptions = {
        dateRange: false,
        dateFormat:dateOptions.pickerFormat,
        firstDayOfWeek: 'su',
    };
  public requestData: any = [];
  public listData: any;
  public allRequestData: any = [];
  public functionCalled = false;
  public searchStudent = '';
  public searchContent = '';
  public startDate = '';
  public endDate = '';
  public filterType = '1';
  constructor(public content: ContentService, public auth: AuthService) { }

  ngOnInit(): void {
      this.requestList('1');
  }
  onScrollDown(event) {
    console.log(event);
  }
  updateRequest(item, type) {
      const data = {
          platform: 'web',
          role_id: this.auth.getSessionData('rista-roleid'),
          user_id: this.auth.getSessionData('rista-userid'),
          school_id: this.auth.getSessionData('rista-school_id'),
          content_id: item.content_id,
          class_id: item.class_id,
          student_id: item.student_id,
          answer_request: type
      };
      this.content.updateRequestList(data).subscribe((successData) => {
              this.updateListSuccess(successData);
          },
          (error) => {
              console.error(error, 'error_requestList');
          });
  }
    updateListSuccess(successData) {
        if (successData.IsSuccess) {
            this.requestList(this.filterType);
        }
    }
  requestList(type) {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      type
    };
    this.content.answerKeyRequestList(data).subscribe((successData) => {
          this.requestListSuccess(successData);
        },
        (error) => {
          console.error(error, 'error_requestList');
        });
  }
  requestListSuccess(successData) {
    if (successData.IsSuccess) {
      this.listData = successData.ResponseObject;
      this.requestData = successData.ResponseObject.data;
      this.allRequestData = successData.ResponseObject.data;
      this.functionCalled = true;
      this.setFilter();
    }
  }
  setFilter() {
      this.requestData = this.allRequestData.filter((item) => {
          return item.student_name.toLowerCase().indexOf(this.searchStudent.toLowerCase()) !== -1 && item.content_name.toLowerCase().indexOf(this.searchContent.toLowerCase()) !== -1;
      });
      if (this.startDate != '' && this.endDate != '') {
          const sd = new Date(this.startDate);
          const ed = new Date(this.endDate);
          this.requestData = this.requestData.filter((item) => {
              const date = new Date(item.created_date);
              return sd <= date && date <= ed;
          });
      } else if (this.startDate != '') {
          const sd = new Date(this.startDate);
          this.requestData = this.requestData.filter((item) => {
              const date = new Date(item.created_date);
              return sd <= date;
          });
      } else if (this.endDate != '') {
          const ed = new Date(this.endDate);
          this.requestData = this.requestData.filter((item) => {
              const date = new Date(item.created_date);
              return date <= ed;
          });
      }
  }
  onDateChanged(event) {
        this.startDate = event.singleDate.formatted;
        this.setFilter();
  }
  onDateChanged1(event) {
      this.endDate = event.singleDate.formatted;
      this.setFilter();
  }

}
