import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { ToggleFullscreenDirective } from './directives/fullscreen.directive';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavService } from './service/nav.service';
import { WINDOW_PROVIDERS } from './service/windows.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { RemoveAnnatationComponent } from './components/remove-annatation/remove-annatation.component';
import {PipesModule} from './pipes/pipes.module';
import { Header2Component } from './components/header2/header2.component';
import { RightSidebarMobComponent } from './components/right-sidebar-mob/right-sidebar-mob.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LongPress} from './directives/long-press';
import { FileDragNDropDirective } from './directives/file-drag-n-drop.directive';

@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    RemoveAnnatationComponent,
    Header2Component,
    RightSidebarMobComponent,
      LongPress,
      FileDragNDropDirective
  ],
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [NavService, WINDOW_PROVIDERS],
    exports: [FeatherIconsComponent, ToggleFullscreenDirective, RemoveAnnatationComponent, LongPress, FileDragNDropDirective]
})
export class SharedModule { }
