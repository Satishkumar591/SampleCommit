import { Component, OnDestroy, OnInit } from '@angular/core';
import {AuthService} from '../../../shared/service/auth.service';
import {ClassService} from '../../../shared/service/class.service';
import {ContentService} from '../../../shared/service/content.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { CreatorService } from '../../../shared/service/creator.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit, OnDestroy {
  public contentQuestionList: any;
  public questionsItems: any;
  public type: any;
  public webhost: any;
  public contentName: any;
  constructor(public auth: AuthService, public classService: ClassService, public creator: CreatorService,
     public contentService: ContentService, public config: ConfigurationService,  public sanitizer: DomSanitizer, public router: Router, public route: ActivatedRoute) {
    this.route.params.forEach((params) => {
      this.type = params.type;
    });
    this.webhost = this.config.getimgUrl();
    if (this.type == 'add'){
      this.questionsItems = 'multipleChoice';
    }else if (this.type == 'edit'){
    }
  }

  ngOnInit(): void {
    const editData = JSON.parse(this.auth.getSessionData('editresources'));
    this.contentName = editData.name;
    this.contentQuestion();
    this.creator.changeViewList(true);
  }

  ngOnDestroy(): void {
    this.creator.changeViewList(false);
  }
  
  backAction(){
    this.router.navigate(['content-text-resource/text-assignment/qEdit']);
  }
  contentQuestion() {
    const data = {
      platform: 'web',
      role_id: this.auth.getSessionData('rista-roleid'),
      user_id: this.auth.getSessionData('rista-userid'),
      content_format: '3'
    };
    this.contentService.contentQuestion(data).subscribe( (successData) => {
          this.gradeListSuccess(successData);
        },
        (error) => {
          this.gradeListFailure(error);
        });
  }
  gradeListSuccess(successData) {
    if (successData.IsSuccess) {
      this.contentQuestionList = successData.ResponseObject;
      this.questionsItems = this.contentQuestionList[0].resource_type;
    }
  }
  gradeListFailure(error){}
  questionType(type){
    this.questionsItems = type;
  }
  questionsSelected(value) {
    console.log(value, 'questionValue')
    this.auth.setSessionData('rista-questionID', value.question_type_id);
    this.router.navigate(['/content-text-resource/question-paper/add']);
  }
}
