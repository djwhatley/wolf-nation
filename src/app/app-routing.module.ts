import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LayoutComponent } from 'app/core/layout/layout.component';
import { LoginHandlerComponent } from 'app/core/auth/login-handler.component';
import { MapsComponent } from './maps/maps.component';

const routes: Routes = [
    { path: 'login', component: LoginHandlerComponent },
    { path: '', component: LayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'home', component: HomeComponent },
        { path: 'maps', component: MapsComponent }
    ]},
]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }