import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Menu, NavService} from '../../service/nav.service';
import {SubjectServices} from '../../service/subject.services';
import {CreatorService} from '../../service/creator.service';
import {NavigationEnd, Router} from '@angular/router';
import {ConfigurationService} from '../../service/configuration.service';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit {

  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public imgUrl: string;
  public profile: any;
  public listCheck: any;
  public menuItems: Menu[];
  public url: any;
  public name: any;
  public role: any;
  public schoolName: any;
  public logo: any;
  public schoolListCount = 1;

  // @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService, public subject: SubjectServices, public creatorService: CreatorService, public router: Router, public config: ConfigurationService, public auth: AuthService) {
    this.imgUrl = this.config.getimgUrl();
    const url = window.location.href;
    if (url.toString().indexOf('xtracurriculum') > -1) {
      this.logo = 'xtraCurriculum.png';
    }  else if (url.toString().indexOf('elevenace') > -1) {
      this.logo = 'elevenAce.png';
    } else if (url.toString().indexOf('uniqprep') > -1) {
      this.logo = 'uniqprep.png';
    }  else if (url.toString().indexOf('safeteen') > -1) {
      this.logo = 'safeTeensOrg.png';
    } else if (url.toString().indexOf('localhost') > -1 || url.toString().indexOf('uthkal') > -1 || url.toString().indexOf('edquill') > -1 || url.toString().indexOf('edveda') > -1) {
      this.logo = 'EdQuill.png';
      // this.logo = 'xtraCurriculum.png';
    }
    this.schoolListCount = JSON.parse(this.auth.getSessionData('rista-school_details')).length;
    console.log(this.schoolListCount, 'sdasdas');
    this.creatorService.contentView.subscribe((res: any) => {
      if (res == true) {
        this.open = true;
        this.navServices.collapseSidebar = true;
      } else if (res != true || res == '' || res == null) {
        this.open = false;
        this.navServices.collapseSidebar = false;

      }
    });
    this.name = this.auth.getSessionData('rista-firstname') + ' ' + this.auth.getSessionData('rista-lastname');
    this.role = this.auth.getSessionData('rista-roleid');
    if (this.role == 2) {
      this.schoolName = this.auth.getSessionData('rista-school_name');
    } else if (this.role == 3) {
      this.schoolName = this.auth.getSessionData('rista-schooldetails');
    } else if (this.role == 4) {
      this.schoolName = this.auth.getSessionData('rista-school_name');
    }
    this.subject.profileList.subscribe((res: any) => {
      this.profile = res;
      let profilepic = this.profile.split('/');
      if (profilepic[0] ==  'assets'){
        this.listCheck = true;
      } else if (profilepic[0] == 'uploads') {
        this.listCheck = false;
      }else {
        this.listCheck = false;
      }
    });
    // this.login.homeList.subscribe((res: any) => {
    //   this.homeListPage = res;
    // });
    this.navServices.items.subscribe(menuItems => {
      this.menuItems = menuItems;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url)
              this.setNavActive(items);
            if (!items.children) return false;
            items.children.filter(subItems => {
              if (subItems.path === event.url)
                this.setNavActive(subItems);
              if (!subItems.children) return false;
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url)
                  this.setNavActive(subSubItems);
              });
            });
          });
        }
      });
    });
  }

  collapseSidebar() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('mySidenav').style.border = '1px solid #7F3486';
    // document.body.style.background = '#000000 !important';
    // this.open = !this.open;
    // this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('mySidenav').style.border = '0px';
    // document.body.style.backgroundColor = '#ffffff !important';
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    // this.rightSidebarEvent.emit(this.right_sidebar);
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/auth/login']);

  }
  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        })
      }
    })
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false;
        if (!a.children) return false;
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        })
      });
    }
    item.active = !item.active
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
    }
  }

  ngOnInit() {
    this.subject.cast.subscribe(data => {
      this.profile = data;
      let profilepic = this.profile.split('/');
      if (profilepic[0] == 'assets') {
        this.listCheck = true;
      } else {
        this.listCheck = false;

      }
    });
    if (this.role == 4 ) {
      this.profile = this.auth.getSessionData('rista-school_profile');
    } else {
      this.profile = this.auth.getSessionData('rista-school_profile_url');
    }
  }
}
