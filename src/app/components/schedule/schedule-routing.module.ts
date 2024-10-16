import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyScheduleComponent} from './my-schedule/my-schedule.component';
import {DailyScheduleComponent} from "./daily-schedule/daily-schedule.component";
import {SchedulePageComponent} from "./schedule-page/schedule-page.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'my-schedule',
        component: MyScheduleComponent,
        data: {
          title: 'My Schedule',
          id: true,
          adminTitle: 'Schedule',
          breadcrumb: 'My Schedule'
        }
      },
      {
        path: 'daily-schedule',
        component: DailyScheduleComponent,
        data: {
          title: 'Daily Schedule',
          id: true,
          adminTitle: 'Daily Schedule',
          breadcrumb: 'Daily Schedule'
        }
      },
      {
        path: 'schedule-page',
        component: SchedulePageComponent,
        data: {
          title: 'Schedule',
          id: true,
          adminTitle: 'Schedule',
          breadcrumb: 'Schedule'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule { }
