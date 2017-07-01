import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GeoDataService } from './geo-data.service';
import { LegislatorsService } from './legislators/legislators.service';
import { VolunteersService } from './volunteers/volunteers.service';

import { AuthHttp } from './google-sheets/auth.http';
import { AuthService } from './google-sheets/auth.service';
import { GoogleSheetsService } from './google-sheets/google-sheets.service';

import { LegislatorsComponent } from './legislators/legislators.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [LegislatorsComponent, LayoutComponent],
  providers: [AuthHttp, AuthService, GeoDataService, GoogleSheetsService, LegislatorsService, VolunteersService]
})
export class CoreModule { }
