import {Inject, Injectable} from '@angular/core';
import { CanActivate, Router} from '@angular/router';

import {AuthService} from './auth.service';


@Injectable()
export class RoleGaurd implements CanActivate {


    constructor(private authService: AuthService , public router: Router) {
    }

    canActivate() {
        if (this.authService.loggedIn()) {
            return false;
        } else {
            return true;
        }
    }
}
