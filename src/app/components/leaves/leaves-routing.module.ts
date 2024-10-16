import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddHolidayComponent } from './add-holiday/add-holiday.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add-holiday',
        component: AddHolidayComponent,
        data: {
          title: "add-holiday",
          breadcrumb: "Add Holiday"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
