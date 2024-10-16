import {Inject, Injectable} from '@angular/core';
import { AnsweringComponent} from '../../components/studentlogin/answering/answering.component';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable} from 'rxjs';

export interface DeactivateAnswering {
    canDeactivate: () => Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;
}
// interface DeactivateAnswering<T> {
//     DeactivateAnswering(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
// }
@Injectable()

export class DeactivateAnswering implements CanDeactivate<AnsweringComponent> {

    constructor() {
    }

    CanDeactivate(component: AnsweringComponent) {
        let can = component.guard;
        console.log(can, 'permit');
        if (can ==  true) {
            let pop = confirm('You have not saved your answers. Are you sure do you want to navigate from this page?');
            if (pop == true) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
}
