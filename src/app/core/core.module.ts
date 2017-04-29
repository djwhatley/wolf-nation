import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GeoDataService } from './geo-data.service';

import { LegislatorsComponent } from './legislators/legislators.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [LegislatorsComponent, LayoutComponent],
  providers: [GeoDataService]
})
export class CoreModule { }
