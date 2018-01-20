import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MapsComponent } from './maps/maps.component';
import { TeamHomeComponent } from './home/team-home.component';
import { TeamWrapperComponent } from './wrapper/team-wrapper.component';
import { LegislatorsComponent } from './legislators/legislators.component';
import { LegislatorDetailComponent } from './legislators/detail/legislator-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MapsComponent,
    TeamHomeComponent,
    TeamWrapperComponent,
    LegislatorsComponent,
    LegislatorDetailComponent
  ]
})
export class TeamModule { }
