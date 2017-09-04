import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MapsComponent } from './maps/maps.component';
import { TeamHomeComponent } from './home/team-home.component';
import { TeamWrapperComponent } from './wrapper/team-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MapsComponent,
    TeamHomeComponent,
    TeamWrapperComponent
  ]
})
export class TeamModule { }
