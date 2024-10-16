import {Component, HostListener, OnInit} from '@angular/core';
import { NavService } from '../../service/nav.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, zoomOut, zoomIn, fadeIn, bounceIn } from 'ng-animate';
import {AuthService} from '../../service/auth.service';
import {CommonDataService} from '../../service/common-data.service';
import {ConfigurationService} from '../../../shared/service/configuration.service';
import {EnvironmentService} from '../../../environment.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('* => *', useAnimation(fadeIn, {
      // Set the duration to 5seconds and delay to 2 seconds
      //params: { timing: 3}
    }))])
  ]
})
export class ContentLayoutComponent implements OnInit {
  public allowDashboard: any;
  public right_side_bar: boolean;
  public layoutType: string = 'RTL';
  public layoutClass: boolean = false;
  public imgUrl: string;
  public profile: any;

  public showMobView = false;

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.showMobView = this.env.deviceType();
  }
  constructor(public navServices: NavService, public env: EnvironmentService,
              public auth: AuthService, public commondata: CommonDataService, public config: ConfigurationService) {
    this.imgUrl = this.config.getimgUrl();
    this.profile = this.auth.getSessionData('rista-profile_url');
    this.showMobView = this.env.deviceType();
  }

  public getRouterOutletState(outlet) {
    this.allowDashboard = this.auth.getSessionData('rista-default_password');
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  public clickRtl(val) {
    if (val === 'RTL') {
      document.body.className = 'rtl';
      this.layoutClass = true;
      this.layoutType = 'LTR';
    } else {
      document.body.className = '';
      this.layoutClass = false;
      this.layoutType = 'RTL';
    }
  }

  ngOnInit() {
    // this.commondata.showLoader(true);
  }

}
