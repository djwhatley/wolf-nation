import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ApiService } from './api';
import { GeoDataService } from './geo-data.service';
import { LegislatorsService } from './legislators/legislators.service';
import { VolunteersService } from './volunteers/volunteers.service';

import { AuthHttp, AuthService } from './auth';

import { LayoutComponent } from './layout/layout.component';
import { LegislatorsComponent } from './legislators/legislators.component';
import { LoginHandlerComponent } from './auth/login-handler.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [LayoutComponent, LegislatorsComponent, LoginHandlerComponent, NavComponent],
  providers: [ApiService, AuthHttp, AuthService, GeoDataService, LegislatorsService, VolunteersService]
})
export class CoreModule { }
