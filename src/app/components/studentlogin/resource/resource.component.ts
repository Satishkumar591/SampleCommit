import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { StudentService } from '../../../shared/service/student.service';
import { ConfigurationService } from '../../../shared/service/configuration.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../shared/service/common.service';
import { NewsubjectService } from '../../../shared/service/newsubject.service';
import { SessionConstants } from '../../../shared/data/sessionConstants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentService } from '../../../environment.service';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  public webhost: any;
  public pageType: any = 1;
  public filterType: any;
  public contentName: any;
  public pdfTemplate: any;
  public getData: any;
  public cfsData: any;
  public cfs: any = false;
  public resourceList = [];
  public resourceListAlter = [];
  public areaInfo = [];
  public functionCalled = false;
  public searchKey = '';
  public linkdata: any = [];
  public contentResponse: any = [];
  public downloadTemplateName = '';
  private modalRef: NgbModalRef;
  public showLink = false;
  public getpdf = [];
  public mobileView = false;

  @ViewChild('content') link: TemplateRef<any>;

  constructor(public auth: AuthService, public student: StudentService, public confi: ConfigurationService, public sanitizer: DomSanitizer,
    public route: Router, public toastr: ToastrService, public common: CommonService, public newSubject: NewsubjectService,
    private modalService: NgbModal, public env: EnvironmentService) {
    this.webhost = this.confi.getimgUrl();
    this.mobileView = this.env.mobileView;
    this.newSubject.schoolChange.subscribe(params => {
      if (params != '') {
        if (this.route.url.includes('resource')) {
          this.init(params);
        }
      } else {
        this.init(this.auth.getSessionData('rista-school_id'));
      }
    });
  }

  ngOnInit(): void {
    // this.pageType = 1;
    // this.resource(1);
  }

  init(id) {
    this.pageType = 1;
    this.getSearch_Filter();
    this.resource(1);
  }

  otherlink() {
    this.modalRef = this.modalService.open(this.link);
  }

  resource(id) {
    this.filterType = id;
    let data;
    data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_id: this.auth.getSessionData('rista-userid'),
      type: id,
    };
    this.student.resourceList(data).subscribe((successData) => {
      this.resourceListSuccess(successData);
    },
      (error) => {
        console.log(error, 'error');
      });
  }

  resourceListSuccess(successData) {
    if (successData.IsSuccess) {
      this.resourceList = successData.ResponseObject;
      console.log(this.resourceList, 'resource');
      this.resourceListAlter = successData.ResponseObject;
      this.assessmentSearch();
    }
  }

  viewResource(item) {
    this.contentName = item.content_name;
    console.log(item, 'items');
    if (item.content_format == '3') {
      this.cfs = true;
      this.cfsData = item.file_text;
      this.getData = item;
      this.linkdata = [];
      this.contentDetails();
    } else {
      this.cfs = false;
      this.getData = item;
      this.areaInfo = item.annotation;
      const path = this.common.convertBase64(item.file_path);
      console.log(path, 'path');
      if (path[0].original_image_url) {
        this.showLink = false;
      } else {
        this.showLink = true;
        this.getpdf = path;
      }
      this.contentDetails();
      this.linkdata = path[0].links ? path[0].links : [];
      console.log(this.linkdata, 'linkData');
      this.pdfTemplate = this.webhost + '/' + path[0].original_image_url;
    }
    this.functionCalled = true;
    this.pageType = 2;
    // this.studentsAnswerList(item);
  }

  saveAnnotation() {
    const data = {
      platform: 'web',
      student_id: this.auth.getSessionData('rista-userid'),
      annotation: this.areaInfo,
      content_id: this.getData.content_id,
      student_content_id: this.getData.student_content_id,
      class_id: this.getData.class_id,
    };
    this.student.saveAnnotation(data).subscribe((successData) => {
      console.log(successData);
    },
      (error) => {
        console.log(error);
      });
  }

  assessmentSearch() {
    if (this.searchKey != '') {
      this.updateFilter(this.searchKey);
    }
  }

  updateFilter(event) {
    const val = event.toLowerCase();
    const temp = this.resourceListAlter.filter(function (d) {
      return d.content_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.resourceList = temp;
    this.setSearch_Filter();
  }

  getAreaInfo(event) {
    console.log(event, 'areainfo');
    this.saveAnnotation();
  }

  setSearch_Filter() {
    let data = JSON.parse(this.auth.getSessionData(SessionConstants.studentResourceSearch));
    if (data != null) {
      data.forEach((items) => {
        if (items.school_id == this.auth.getSessionData('rista-school_id')) {
          items.resourceName = this.searchKey;
        } else {
          const searchData = {
            resourceName: this.searchKey,
            school_id: this.auth.getSessionData('rista-school_id')
          };
          data.push(searchData);
        }
      });
      data = data.filter((test, index, array) =>
        index === array.findIndex((findTest) =>
          findTest.school_id === test.school_id
        )
      );
      this.auth.setSessionData(SessionConstants.studentResourceSearch, JSON.stringify(data));
    }
  }

  getSearch_Filter() {
    const data = JSON.parse(this.auth.getSessionData(SessionConstants.studentResourceSearch));
    data.every((items) => {
      if (items.school_id == this.auth.getSessionData('rista-school_id')) {
        this.searchKey = items.resourceName;
        return false;
      } else {
        this.searchKey = '';
      }
      return true;
    });
  }

  onSave() {
    this.modalRef.close();
  }

  contentDetails() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      content_id: this.getData.content_id,
      content_format: this.getData.content_format,
      class_id: this.getData.class_id,
      student_id: this.auth.getSessionData('rista-userid'),
      student_content_id: this.getData?.student_content_id ? this.getData?.student_content_id : ''
    };
    this.student.questionList(data).subscribe((successData) => {
      this.questionListSuccess(successData);
    },
      (error) => {
        console.error(error, 'contentDetails');
      });
  }

  questionListSuccess(successData) {
    if (successData.IsSuccess) {
      this.contentResponse = successData.ResponseObject;
      this.linkdata = successData.ResponseObject.links ? successData.ResponseObject.links : [];
      this.downloadTemplateName = this.contentResponse['name'] + '.pdf';
      console.log(this.linkdata, 'linkDafra');
    }
  }
}
