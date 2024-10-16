import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ConfigurationService} from '../../service/configuration.service';
import {SubjectServices} from '../../service/subject.services';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
public name: any;
public role: any;
  public profile: any;
  constructor(public auth: AuthService, public subject: SubjectServices, public config: ConfigurationService) {
    this.name = this.auth.getSessionData('go-firstname');
    this.role = this.auth.getSessionData('go-roleid');
    this.profile = this.auth.getSessionData('go-profile_url');

  }

  public users = [
    {
      img: "assets/images/dashboard/user.png",
      name: "Vincent Porter",
      status: "Online"
    },
    {
      img: "assets/images/dashboard/user1.jpg",
      name: "Ain Chavez",
      status: "28 minutes ago"
    },
    {
      img: "assets/images/dashboard/user2.jpg",
      name: "Kori Thomas",
      status: "Online"
    },
    {
      img: "assets/images/dashboard/user3.jpg",
      name: "Erica Hughes",
      status: "Online"
    },
    {
      img: "assets/images/dashboard/man.png",
      name: "Ginger Johnston",
      status: "2 minutes ago"
    },
    {
      img: "assets/images/dashboard/user5.jpg",
      name: "Prasanth Anand",
      status: "2 hour ago"
    },
    {
      img: "assets/images/dashboard/designer.jpg",
      name: "Hileri Jecno",
      status: "Online"
    }
  ]

  ngOnInit() {
    this.subject.cast.subscribe(data => {
      this.profile = data;
    });

  }

}
