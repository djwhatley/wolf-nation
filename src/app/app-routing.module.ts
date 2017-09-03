import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/core/auth';
import { ErrorComponent} from 'app/core/error';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from 'app/core/layout/layout.component';
import { LoginHandlerComponent } from 'app/core/auth/login-handler.component';
import { MapsComponent } from './team/maps/maps.component';
import { TeamHomeComponent } from './team/home/team-home.component';
import { TeamWrapperComponent } from 'app/core/wrappers';

const routes: Routes = [
    { path: 'login', component: LoginHandlerComponent },
    { path: '', component: LayoutComponent, children: [
        { path: '', component: HomeComponent },
        { path: 'error', component: ErrorComponent },
        { path: 'home', component: HomeComponent },
        { path: ':team', component: TeamWrapperComponent, children: [
            { path: 'error', component: ErrorComponent },
            { path: '', canActivateChild: [AuthGuard], children: [
                { path: '', component: TeamHomeComponent },
                { path: 'home', component: TeamHomeComponent },
                { path: 'maps', component: MapsComponent}
            ]},
            
        ]}
    ]},
]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }