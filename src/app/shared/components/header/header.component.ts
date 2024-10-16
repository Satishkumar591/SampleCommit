import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {NavService} from '../../service/nav.service';
import {Router} from '@angular/router';
import {ConfigurationService} from '../../service/configuration.service';
import {AuthService} from '../../service/auth.service';
import {SubjectServices} from '../../service/subject.services';
import {CreatorService} from '../../service/creator.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    public right_sidebar: boolean = false;
    public open: boolean = false;
    public openNav: boolean = false;
    public imgUrl: string;
    public profile: any;
    public listCheck: any;
    public roleid: any;
    public name: any;
    public logo: any;
    public showWarning = false;

    @Output() rightSidebarEvent = new EventEmitter<boolean>();

    constructor(public navServices: NavService, public subject: SubjectServices, public datePipe: DatePipe,
                public creatorService: CreatorService, public router: Router, public config: ConfigurationService, public auth: AuthService) {
        const url = window.location.href;
        if (url.toString().indexOf('xtracurriculum') > -1) {
            this.logo = 'xtraCurriculum.png';
        } else if (url.toString().indexOf('elevenace') > -1) {
            this.logo = 'elevenAce.png';
        } else if (url.toString().indexOf('uniqprep') > -1) {
            this.logo = 'uniqprep.png';
        } else if (url.toString().indexOf('safeteen') > -1) {
            this.logo = 'safeTeensOrg.png';
        } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('edveda') > -1) {
            this.logo = 'EdQuill.png';
            // this.logo = 'xtraCurriculum.png';
        }
        this.imgUrl = this.config.getimgUrl();
        this.roleid = this.auth.getSessionData('rista-roleid');

        this.creatorService.contentView.subscribe((res: any) => {
            if (res == true) {
                this.open = true;
                this.navServices.collapseSidebar = true;
            } else if (res != true || res == '' || res == null) {
                this.open = false;
                this.navServices.collapseSidebar = false;

            }
            this.name = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        });
    }

    showDate() {
        const schoolDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        return this.datePipe.transform(schoolDetails.display_until, 'MMMM d, y');
    }

    showPaymentMessage() {
        let showWarning = false;
        const schoolDetails = JSON.parse(this.auth.getSessionData('rista_data1'));
        const givenDate: Date = new Date(schoolDetails.display_until);
        const currentDate = new Date();
        if (this.auth.getRoleId() == '2') {
            showWarning = schoolDetails.payment_status == 'N' && (currentDate < givenDate || currentDate.toDateString() == givenDate.toDateString());
        } else {
            showWarning = false;
        }
        return showWarning;
    }

    collapseSidebar() {
        this.open = !this.open;
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
        this.creatorService.changeViewList(this.navServices.collapseSidebar);
    }

    right_side_bar() {
        this.right_sidebar = !this.right_sidebar;
        this.rightSidebarEvent.emit(this.right_sidebar);
    }

    openMobileNav() {
        this.openNav = !this.openNav;
    }

    logout() {
        if (this.auth.getRoleId() != '6') {
            this.router.navigate(['/auth/login']);
        } else {
            this.router.navigate(['/auth/login/corporate']);
        }
        sessionStorage.clear();
        localStorage.clear();
    }


    ngOnInit() {
        this.subject.cast.subscribe(data => {
            this.profile = data;
            const profilepicSubject = this.profile.split('/');
            this.listCheck = profilepicSubject[0] == 'assets';
        });
        // this.subject.cast1.subscribe(data => {
        //   this.profile1 = localStorage.avatarimg;
        // });
        // this.profile = this.auth.getSessionData('go-profile_url');
        this.profile = this.auth.getSessionData('rista-profile_url');
        // this.profile1 = localStorage.avatarimg;
        const profilepic = this.profile.split('/');
        this.listCheck = profilepic[0] == 'assets';
    }
}
