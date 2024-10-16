import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/shared/service/student.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CommonDataService } from 'src/app/shared/service/common-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-score-detection',
  templateUrl: './score-detection.component.html',
  styleUrls: ['./score-detection.component.scss']
})
export class ScoreDetectionComponent implements OnInit {
  public scoreData: any;
  public overallData: any;
  public answerData: any;
  public type: any;
  public contentScoreStatus: any;
  public errorStatus: any;

  constructor(public student: StudentService, public auth: AuthService, public commondata: CommonDataService, public route: ActivatedRoute) {
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
   }

  ngOnInit(): void {
    this.contentScoreDetails();
  }
  contentScoreDetails(){
    this.commondata.showLoader(false);
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      school_id: this.auth.getSessionData('rista-school_id'),
      student_content_id : this.type
    };
    console.log(data, 'data');
    this.student.contentScore(data).subscribe( (successData) => {
          this.contentScoreSuccess(successData);
        },
        (error) => {
          this.contentScoreFailure(error);
        });
  }

  contentScoreSuccess(successData) {
    console.log(successData, 'successData');
    if (successData.IsSuccess) {
      let data = successData.ResponseObject
      this.scoreData = data[0];
      this.overallData = data[0]?.overall_score;
      this.answerData = data[0]?.answer_details;
      this.contentScoreStatus = true;
      this.commondata.showLoader(false);
    } else{
      this.contentScoreStatus = false;
      this.errorStatus = successData.errorObject
    }
  }
  contentScoreFailure(error) {
    this.commondata.showLoader(false);
    console.log(error, 'error');
  }
}
