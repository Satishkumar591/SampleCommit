import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../shared/service/auth.service';
import {TeacherService} from '../../../shared/service/teacher.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})
export class MailboxComponent implements OnInit {
  public composeMail = false;
  public toggleNav = false;
  mailForm: FormGroup;
  selectedMail: any = undefined;
  selectedIndex: any;
  currentDate: any;
  mailBoxList = [];
  toList = [{student_name: 'Raj', student_id: '1'}, {student_name: 'Sandy', student_id: '11'}, {student_name: 'kiran', student_id: '2'}, {student_name: 'Ranga rajan', student_id: '14'}];
  attachment = [{name: 'life.pdf', original_image_url: ''}, {name: 'tech.pdf', original_image_url: ''},
      {name: 'stun.pdf', original_image_url: ''}, {name: 'lifeCare.pdf', original_image_url: ''}];

  constructor(public builder: FormBuilder, public toastr: ToastrService, public datePipe: DatePipe, public auth: AuthService, public teacher: TeacherService) {
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      console.log(this.currentDate, 'currentDate');
      this.mailForm = this.builder.group({
          to: ['', Validators.required],
          subject: ['', Validators.required],
          title: ['', Validators.required],
          brief: ''
      });
  }

  ngOnInit(): void {
      this.mailList('all');
  }
  getEditorValue(event) {
    this.mailForm.controls.brief.patchValue(event.content);
  }
  selectMailToView(detail, index) {
      if (this.selectedIndex !== index) {
          this.selectedIndex = index;
          this.selectedMail = detail;
          if (detail.is_read === '0') {
              this.updateMail('seen', '1');
          }
      }
  }
  sendMail() {
      if (this.mailForm.valid) {
          const data = {
              title: this.mailForm.controls.title.value,
              subject: this.mailForm.controls.subject.value,
              to: this.mailForm.controls.to.value,
              brief: this.mailForm.controls.brief.value
          };
          console.log(data, 'data');
          this.toastr.success('Mail sent');
          this.composeMail = false;
      } else {
          this.toastr.error('Please fill Mandatory fields');
      }
  }
  mailList(type) {
      const data = {
          platform: 'web',
          role_id: this.auth.getSessionData('rista-roleid'),
          user_id: this.auth.getSessionData('rista-userid'),
          type
      };
      this.teacher.mailBoxList(data).subscribe(
          (successData) => {
              this.mailListSuccess(successData);
          },
          (error) => {
              console.log(error, 'error');
          }
      );
  }
  mailListSuccess(successData) {
      if (successData.IsSuccess) {
          this.mailBoxList = successData.ResponseObject;
      }
  }
  updateMail(type, value) {
      const data = {
          platform: 'web',
          role_id: this.auth.getSessionData('rista-roleid'),
          user_id: this.auth.getSessionData('rista-userid'),
          message_id: this.selectedMail.message_id,
          is_trash: type == 'trash' ? value : this.selectedMail.is_trash,
          is_starred: type == 'starred' ? value : this.selectedMail.is_starred,
          is_read: type == 'seen' ? value : this.selectedMail.is_read
      };
      this.teacher.updateMail(data).subscribe(
          (successData) => {
              this.updateMailSuccess(successData, type, value);
          },
          (error) => {
              console.log(error, 'error');
          }
      );
  }
  updateMailSuccess(successData, type, value) {
      if (successData.IsSuccess) {
          type === 'trash' ? this.selectedMail.is_trash = value : type === 'starred' ?
              this.selectedMail.is_starred = value : this.selectedMail.is_read = value;
          if (type == 'trash') {
              this.mailList('all');
              this.selectedMail = undefined;
              this.selectedIndex = undefined;
          }
      }
  }
  getMessageTime(data) {
      console.log(data, 'date');
      const split = data.split(' ');
      if (split[0] === this.currentDate) {
          // return split[1].split(':').splice(0, 2).join(':');
          return this.datePipe.transform(data, 'hh:mm a');
      } else {
          return this.datePipe.transform(split[0], 'dd MMM');
      }
  }

}
