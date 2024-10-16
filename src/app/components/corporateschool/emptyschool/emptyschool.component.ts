import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-emptyschool',
  templateUrl: './emptyschool.component.html',
  styleUrls: ['./emptyschool.component.scss']
})
export class EmptyschoolComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  routeSchool(){
    this.router.navigate(['/School/create-School/add']);
  }
}
