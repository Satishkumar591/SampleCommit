import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';



@Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthService {

    constructor(private router: Router , public toastr: ToastrService) { }

    loggedIn() {
        return (this.getAccessToken() === undefined || this.getAccessToken() === '' || this.getAccessToken() == null) ?  false : true;
    }

    clearToken() {
        localStorage.removeItem(environment.sessionPrefix + 'rista-userid');
        localStorage.removeItem(environment.sessionPrefix + 'rista-firstname');
        localStorage.removeItem(environment.sessionPrefix + 'rista-lastname');
        localStorage.removeItem(environment.sessionPrefix + 'rista-roleid');
        localStorage.removeItem(environment.sessionPrefix + 'rista-roleid');
    }

    setToken( userid, firstname, lastname, userrole, accesstoken  ) {
        localStorage.setItem(environment.sessionPrefix + 'rista-userid', userid);
        localStorage.setItem(environment.sessionPrefix + 'rista-firstname', firstname);
        localStorage.setItem(environment.sessionPrefix + 'rista-lastname', lastname);
        localStorage.setItem(environment.sessionPrefix + 'rista-roleid', userrole);
        localStorage.setItem('Accesstoken', accesstoken);

    }

    getSchoolName() {
        return localStorage.getItem(environment.sessionPrefix + 'rista-school_name');
    }

    getUserId() {
        return localStorage.getItem(environment.sessionPrefix + 'rista-userid');
    }
    getFirstName() {
        return localStorage.getItem(environment.sessionPrefix + 'rista-firstname');
    }
    getLastName() {
        return localStorage.getItem(environment.sessionPrefix + 'rista-lastname');
    }

        getAccessToken() {
        return localStorage.getItem('Accesstoken');
    }

    getRoleId() {
        return localStorage.getItem(environment.sessionPrefix + 'rista-roleid');
    }

    getSessionData(variable) {
        variable = environment.sessionPrefix + variable;
        return localStorage.getItem(variable);
    }
    setSessionData(variable, value) {
        variable = environment.sessionPrefix + variable;
        return localStorage.setItem(variable, value);
    }

    removeSessionData(variable){
        localStorage.removeItem(environment.sessionPrefix + variable);
    }



    /**
     * Checks wether used is logged in
     * and Redirects to users repository
     */
    checkAuthentication() {
        if (this.loggedIn()) {
            // route to home component
            // alert('checkAuthentication');
            this.router.navigate(['/dashboard/default']);
        }
    }


    logout() {

        if (this.getRoleId() != '6'){
            this.router.navigate(['/auth/login']);
        }else {
            this.router.navigate(['/auth/login/corporate']);
        }
        this.toastr.error('You have logged in another Device .Please Re-login');

        sessionStorage.clear();
        localStorage.clear();
    }

}
