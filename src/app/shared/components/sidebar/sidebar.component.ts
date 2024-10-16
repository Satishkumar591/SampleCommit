import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Menu, NavService} from '../../service/nav.service';
import {AuthService} from '../../service/auth.service';
import {ConfigurationService} from '../../service/configuration.service';
import {SubjectServices} from '../../service/subject.services';
import {LoginService} from '../../service/login.service';
import {CommonService} from '../../service/common.service';
import {NewsubjectService} from '../../service/newsubject.service';
import {SchoolService} from '../../service/School.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

    public menuItems: Menu[];
    public url: any;
    public name: any;
    public role: any;
    public profile: any;
    public imgUrl: string;
    public listCheck: boolean;
    public schoolName: any;
    public allowSelect: boolean;
    public sclName: any;
    public hideSchoolDropdown = false;
    public corporateCode: any;
    public overallData: any;
    public logo: any;
    public  selectedOption: any;
    constructor(private router: Router, public subject: SubjectServices, public login: LoginService, public navServices: NavService, public schoolService: SchoolService,
                public auth: AuthService, public config: ConfigurationService, public common: CommonService, public newsubject: NewsubjectService) {
        const url = window.location.href;
        if (url.toString().indexOf('xtracurriculum') > -1) {
            this.logo = 'xtraCurriculum.png';
        } else if (url.toString().indexOf('safeteen') > -1) {
            this.logo = 'safeTeensOrg.png';
        }  else if (url.toString().indexOf('uniqprep') > -1) {
            this.logo = 'uniqprep.png';
        }   else if (url.toString().indexOf('elevenace') > -1) {
            this.logo = 'elevenAce.png';
        }  else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('edveda') > -1) {
            this.logo = 'EdQuill.png';
        }
        this.imgUrl = this.config.getimgUrl();
        this.overallData = this.auth.getSessionData('rista-school_id');
        this.name = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
        this.role = this.auth.getSessionData('rista-roleid');
        if (this.role == 2) {
            this.schoolName = JSON.parse(this.auth.getSessionData('rista-school_details'));
        } else if (this.role == 3) {
            this.name = this.auth.getSessionData('rista-schooldetails');
        } else if (this.role == 4 || this.role == 5 || this.role == 6) {
            this.schoolName = JSON.parse(this.auth.getSessionData('rista-school_details'));
            this.sclName = this.schoolName[this.schoolName.length - 1].school_id;
            this.corporateCode = this.auth.getSessionData('rista-corporate_code');
        }else if (this.role == 7){
            this.schoolName = JSON.parse(this.auth.getSessionData('rista-school_details'));
        }
        if (this.role != 3 && this.role != 6) {
            if (this.auth.getSessionData('selected-name') != '' && this.auth.getSessionData('selected-name') != null) {
                this.sclName = this.auth.getSessionData('selected-name');
            } else {
                this.sclName = this.schoolName[0]?.school_id;
            }
        }
        this.subject.profileList.subscribe((res: any) => {
            this.profile = res;
            const profilepic = this.profile?.split('/');
            if (profilepic[0] == 'assets') {
                this.listCheck = true;
            } else if (profilepic[0] == 'uploads') {
                this.listCheck = false;
            }
        });

        this.newsubject.sideBar.subscribe((res: any) => {
            if (res != '') {
                this.toggletNavActive(res, '');
            }
        });

        if (this.role == 4 || this.role == 2) {
            this.newsubject.navUpdate.subscribe((params) => {
                this.navServiceUpdated();
            });
        } else {
            this.navServiceUpdated();
        }
        if (this.role != 3){
            this.newsubject.allowChange.subscribe((params) => {
                this.allowSelect = !(params != '' && params != false);
            });
        }
        this.schoolService.corporateSchoolView.subscribe((res: any) => {
            if (res == true) {
                this.hideSchoolDropdown = true;
            } else if (res != true || res == '' || res == null) {
                this.hideSchoolDropdown = false;
            }
        });
    }

    // Active Nave state
    setNavActive(item) {
        console.log(item, 'items');
        this.menuItems.filter(menuItem => {
            console.log(menuItem, 'menuItems');
            if (menuItem != item)
                menuItem.active = false;
            if (menuItem.children && menuItem.children.includes(item))
                menuItem.active = true;
            if (menuItem.children) {
                menuItem.children.filter(submenuItems => {
                    if (submenuItems.path == item.path) {
                        menuItem.active = true;
                        submenuItems.active = true;
                    } else {
                        submenuItems.active = false;
                    }
                });
            }
        });
    }

    // Click Toggle menu
    public toggletNavActive(item, type) {
        this.menuItems.forEach(a => {
            if (type == 'link') {
                a.active = false;
            }
            if (a.children) {
                a.children.forEach(b => {
                    b.active = false;
                });
            }
        });
        item.active = !item.active;
    }

    //Fileupload
    readUrl(event: any) {
        if (event.target.files.length === 0)
            return;
        //Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.url = reader.result;
        };
    }


    ngOnInit(): void {
        if (this.role == 4 || this.role == 5 || this.role == 2 || this.role == 6) {
            this.profile = this.auth.getSessionData('rista-school_profile');
        } else {
            this.profile = this.auth.getSessionData('rista-school_profile_url');
        }
        const profilepic = this.profile.split('/');
        if (profilepic[0] == 'assets') {
            this.listCheck = true;
        } else if (profilepic[0] == 'uploads') {
            this.listCheck = false;
        }
    }

//  school change list
    schoolChangeList(data) {
        if (this.role == 2) {
            this.schoolName.forEach((item) => {
                if (item.school_id == data) {
                    this.auth.setSessionData('rista-school_name', item.name);
                    this.auth.setSessionData('rista_data1', JSON.stringify(item));
                    this.auth.setSessionData('rista-school_profile', item.profile_url);
                    this.auth.setSessionData('rista-teacher_id', item.school_idno);
                }
            });
            this.newsubject.newNav(this.auth.getSessionData('rista_data1'));
        } else if (this.role == 4) {
            this.schoolName.forEach((item) => {
                if (item.school_id == data) {
                    this.auth.setSessionData('rista-school_name', item.name);
                    this.auth.setSessionData('rista_data1', JSON.stringify(item));
                    this.auth.setSessionData('rista-teacher_type', item.individual_teacher);
                    this.auth.setSessionData('rista-school_profile', item.profile_url);
                }
            });
            this.newsubject.newNav(this.auth.getSessionData('rista_data1'));
        } else if (this.role == 5) {
            this.schoolName.forEach((item) => {
                if (item.school_id == data) {
                    this.auth.setSessionData('rista-school_name', item.name);
                    this.auth.setSessionData('rista_data1', JSON.stringify(item));
                    this.auth.setSessionData('rista-school_profile', item.profile_url);
                    this.auth.setSessionData('rista-teacher_id', item.school_idno);
                }
            });
        } else if (this.role == 6) {
            this.schoolName.forEach((item) => {
                if (item.school_id == data) {
                    this.auth.setSessionData('rista-school_name', item.name);
                    this.auth.setSessionData('rista_data1', JSON.stringify(item));
                    this.auth.setSessionData('rista-school_profile', item.profile_url);
                }
            });
        }
        this.auth.setSessionData('rista-school_id', data);
        this.auth.setSessionData('selected-name', data);
        this.newsubject.changeSchoolList(data);
    }

    navServiceUpdated() {
        this.navServices.items.subscribe(menuItems => {
            this.menuItems = menuItems;
            if (menuItems[3].children == '') {
                menuItems.forEach((item, index) => {
                    if (menuItems[3].title == item.title) {
                        this.menuItems.splice(index, 1);
                    }
                });
            }
            this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    menuItems.filter(items => {
                        const url = event.url.split('/');
                        if (!items.children) {
                            this.menuItems.filter((list) => {
                                if (list.children) {
                                    list.active = false;
                                    list.children.filter((child) => {
                                        child.active = false;
                                    });
                                } else {
                                    if (url[1].toLowerCase() == list.title.toLowerCase()) {
                                        list.active = true;
                                    }
                                }
                            })
                        } else {
                            items.children.filter(subItems => {
                                const menusplit = subItems.path.split('/');
                                if (menusplit[1] === url[1])
                                    this.setNavActive(subItems);
                                if (!subItems.children) return false;
                                subItems.children.filter(subSubItems => {
                                    const menusplit = subSubItems.path.split('/');
                                    if (menusplit[1] === url[1])
                                        this.setNavActive(subSubItems);
                                });
                            });
                        }
                    });
                }
            });
        });
    }
}
