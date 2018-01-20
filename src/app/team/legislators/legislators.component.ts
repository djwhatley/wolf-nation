import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'app/core/api';

import { Legislator  } from 'app/core/legislators';
import { TeamService } from 'app/core/teams/team.service';

@Component({
  selector: 'app-legislators',
  templateUrl: './legislators.component.html',
  styleUrls: ['./legislators.component.css']
})
export class LegislatorsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  loading: boolean;

  team: string;
  legislators: Map<string, Legislator[]>;

  house: string = 'lower';

  sub: any;

  ngOnInit() {
    this.loading = true;

    this.legislators = new Map<string, Legislator[]>();

    this.team = this.teamService.getTeam();
    this.sub = this.teamService.getTeamObservable().subscribe((team) => {
      this.team = team;
      this.getLegislators();
    });

    this.getLegislators();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getLegislators() {
    this.apiService.legislators.get({ state: this.team }, (legs: Legislator[]) => {
      for (let leg of legs) {
        let partyBadgeClass, supportBadgeClass, supportLevelText;

        if (leg.party == 'R')
          partyBadgeClass = 'badge-danger';
        else if (leg.party == 'D')
          partyBadgeClass = 'badge-primary';

        switch (leg.score) {
          case 1:
            supportBadgeClass = 'badge-success';
            supportLevelText = 'Supportive';
            break;
          case 2:
            supportBadgeClass = 'badge-warning';
            supportLevelText = 'Unsure';
            break;
          case 3:
            supportBadgeClass = 'badge-danger';
            supportLevelText = 'Not Supportive';
            break;
          case 4:
            supportBadgeClass = 'badge-light';
            supportLevelText = 'Not Contacted';
            break;
        }

        (leg as any).partyBadgeClass = partyBadgeClass;
        (leg as any).supportBadgeClass = supportBadgeClass;
        (leg as any).supportLevelText = supportLevelText;
        
      }

      let lower = legs.filter((l) => l.chamber == 'lower')
      let upper = legs.filter((l) => l.chamber == 'upper');

      this.legislators.set('lower', lower);
      this.legislators.set('upper', upper);
    });
  }

  viewDetail(leg: Legislator) {
    let h = (leg.chamber == 'lower') ? 'l' : 'u';
    this.router.navigate([h, leg.district], { relativeTo: this.route });
  }
}
