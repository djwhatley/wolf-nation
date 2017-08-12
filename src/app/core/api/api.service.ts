import { Injectable } from '@angular/core';

import { AuthService } from 'app/core/auth';
import { LegislatorsService } from 'app/core/legislators';
import { VolunteersService } from 'app/core/volunteers';

@Injectable()
export class ApiService {
    constructor(
        private authService: AuthService,
        private legislatorsService: LegislatorsService,
        private volunteersService: VolunteersService
    ) {}

    legislators = {
        get: (query: any, callback: Function) => {
            this.validateTokenThen(() => {
                this.legislatorsService.getLegislators(query['state'], query['house'])
                .then((res) => callback(res))
                .catch((err) => this.error(err));
            });
        }
    };

    volunteers = {
        getByState: (state: string, callback: Function) => {
            this.validateTokenThen(() => {
                this.volunteersService.getVolunteers(state)
                .then((res) => callback(res))
                .catch((err) => this.error(err));
            })
        }
    };

    private error(err: any) {
        console.error(err);
    }

    private validateTokenThen(callback: Function) {
        if (this.authService.isAuth())
            callback();
        else {
            this.authService.refreshToken(callback);
        }
    }
}