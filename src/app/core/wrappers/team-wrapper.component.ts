import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ErrorService } from 'app/core/error';
import { TeamService } from 'app/core/teams/team.service';

@Component({
  template: '<router-outlet></router-outlet>',
})
export class TeamWrapperComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (this.teamService.isTeamValid(params.team))
        this.teamService.setTeam(params.team);
      else
        this.errorService.error('Bad Request', 'That looks like a team that doesn\'t exist on our server (yet!). If you got here by mistake, just ignore it. If you are with a team that does not have this tool setup, ...');
    });
  }

}
