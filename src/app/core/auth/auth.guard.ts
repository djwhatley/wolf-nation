import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from 'app/core/auth';
import { ErrorService } from 'app/core/error';
import { TeamService } from 'app/core/teams/team.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService,
        private errorService: ErrorService,
        private teamService: TeamService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let token = this.authService.getTokenObject();
        let team = route.params['team'];

        if (!this.teamService.isTeamValid(team)) {
            this.errorService.error('Bad Request', 'That looks like a team that doesn\'t exist on our server (yet!). If you got here by mistake, just ignore it. If you are with a team that does not have this tool setup, ...');
            return false;
        }

        else if (!token || !(token['team'] == team)) {
            this.errorService.error('Unauthorized', 'You do not have access to that page. Sorry!');
            return false;
        }

        /*else if (!this.authService.isGoogleTokenValid(this.authService.getToken())) {
            this.router.navigateByUrl('/home');
            return false;
        }*/

        return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
}