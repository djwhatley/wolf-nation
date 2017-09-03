import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApiService } from './api';
import { ErrorService } from './error';
import { GeoDataService } from './geo-data.service';
import { LegislatorsService } from './legislators/legislators.service';
import { TeamService } from './teams/team.service';
import { VolunteersService } from './volunteers/volunteers.service';

import { AuthGuard, AuthHttp, AuthService } from './auth';

import { LayoutComponent } from './layout/layout.component';
import { LegislatorsComponent } from './legislators/legislators.component';
import { LoginHandlerComponent } from './auth/login-handler.component';
import { NavComponent } from './nav/nav.component';
import { TeamWrapperComponent } from './wrappers';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [LayoutComponent, LegislatorsComponent, LoginHandlerComponent, NavComponent, TeamWrapperComponent, ErrorComponent],
  providers: [ApiService, AuthHttp, AuthGuard, AuthService, ErrorService, GeoDataService, LegislatorsService, TeamService, VolunteersService]
})
export class CoreModule { }
