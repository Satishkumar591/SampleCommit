import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AnsweringComponent} from '../../components/studentlogin/answering/answering.component';

@Injectable({
  providedIn: 'root'
})
export class AnsweringGuard implements CanDeactivate<AnsweringComponent> {
  canDeactivate(
      component: AnsweringComponent,
      currentRoute: ActivatedRouteSnapshot,
      currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let can = component.guard;
    console.log(can, 'permit');
    if (can ==  true) {
      let pop = confirm('You have not saved your answers. Are you sure do you want to navigate from this page?');
      if (pop == true) {
        return true;
      } else {
        return false;
      }
    }else{
      return  true;
    }
  }
}
