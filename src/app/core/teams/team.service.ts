import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { VALID_TEAMS } from './config';
import { environment } from 'environments/environment';

@Injectable()
export class TeamService {

  constructor(
    private router: Router
  ) { }

  team: string;
  teamSub: Subject<string> = new Subject<string>();

  getTeam(): string {
    if (this.team)
      return this.team;

    let regex = new RegExp(environment.redirectUrl + /([a-z]+)(\/(.*))?/.source);
    let match = regex.exec(location.href);
    if (match) {
      let team = match[1];
      this.setTeam(team);
      return team;
    }
    return '';
  }

  getTeamObservable(): Observable<string> {
    return this.teamSub.asObservable();
  }

  isTeamValid(team: string): boolean {
    for (let t of VALID_TEAMS)
      if (team.toLowerCase() == t)
        return true;
    return false;
  }

  setTeam(team: string) {
    this.team = team;
    this.teamSub.next(team);
  }

}
