import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { VolunteerMapComponent } from './volunteer-map/volunteer-map.component';

const routes: Routes = [
    //{ path: '', redirectTo: '/map', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    //{ path: 'map', component: MapComponent },
    { path: 'vmap', component: VolunteerMapComponent }
]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }