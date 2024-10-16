import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {dateOptions} from '../data/config';

@Injectable({
    providedIn: 'root'
})
export class NewsubjectService {

    public schoolChange = new BehaviorSubject<any>('');
    schoollist = this.schoolChange.asObservable();

    public sideBar = new BehaviorSubject<any>('');
    highlightMenu = this.sideBar.asObservable();

    public allowChange = new BehaviorSubject<any>('');
    allowedlist = this.allowChange.asObservable();

    public changeNav = new BehaviorSubject<any>('');
    navUpdate = this.changeNav.asObservable();

    public dateFormat = new BehaviorSubject<any>('');
    globalDateFormat = this.dateFormat.asObservable();

    public timeZone = new BehaviorSubject<any>('');
    globalTimeZone = this.dateFormat.asObservable();

    constructor() {
    }

    changeDateFormat(data) {
        // dateOptions.pickerFormat = data.toLowerCase();
        localStorage.setItem('currentFormat', data);
        this.dateFormat.next(data);
    }

    changeTimeZone(data) {
        localStorage.setItem('currentLocation', data);
        this.timeZone.next(data);
    }

    changeSchoolList(data) {
        this.schoolChange.next(data);
    }

    allowSchoolChange(data) {
        this.allowChange.next(data);
    }

    newNav(data) {
        this.changeNav.next(data);
    }

    highListSideBarMenu(data) {
        this.sideBar.next(data);
    }
}
