import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../../../shared/service/student.service';
import {CommonService} from '../../../shared/service/common.service';
import {CreatorService} from '../../../shared/service/creator.service';

@Component({
  selector: 'app-student-link',
  templateUrl: './student-link.component.html',
  styleUrls: ['./student-link.component.scss']
})
export class StudentLinkComponent implements OnInit {

  public studentId = '';
  public linkQuestionData: any;
  public contentName = '';
  public contentType = '';
  public pdfPath: any;
  public functionCalled = false;

  constructor(public activateRoute: ActivatedRoute, public student: StudentService, public common: CommonService, public creator: CreatorService) {
    this.activateRoute.params.forEach((params) => {

      console.log(params, 'params');
      this.studentId = params?.id;
    });
  }

  ngOnInit(): void {
    this.getStudentDetails();
  }

  getStudentDetails() {
    const data = {
      platform: 'web',
      authorization_key: this.studentId
    };
    this.creator.getStudDetail(data).subscribe( (successData) => {
          this.getStudDetailSuccess(successData);
        },
        (error) => {
          console.error(error, 'checkDetails');
        });
  }
  getStudDetailSuccess(successData) {
    if (successData.IsSuccess) {
      console.log(successData.ResponseObject, 'successData.ResponseObject');
      const pdfpath = this.common.convertBase64(successData.ResponseObject?.pdfpath);
      console.log(pdfpath, 'pdfPath');
      if (pdfpath[0].original_image_url != undefined) {
        console.log('Not A PDF');
      } else {
        this.pdfPath = pdfpath[0];
        this.functionCalled = true;
      }
    } else {
      this.functionCalled = true;
    }
  }
  getStudDetailFailure(error) {
    console.log(error, 'error');
  }

}
