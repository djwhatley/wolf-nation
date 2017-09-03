import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'app/core/auth';
import { TeamService } from 'app/core/teams/team.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  brand: string;
  team: string;  
  navItems = [];
  isAuth: boolean;

  ngOnInit() {
    this.brand = 'WolfPAC';
    this.teamService.getTeamObservable().subscribe((team) => {
      if (this.teamService.isTeamValid(team)) {
        this.team = team;
        this.brand = 'WolfPAC '  + team.toUpperCase();      
      }
      else {
        this.brand = 'WolfPAC';
      }

      this.isAuth = this.authService.isAuth();

      let user = this.authService.getTokenObject();
      if (this.isAuth && user.team == team) {
        this.navItems = [
          {
            text: 'Maps',
            href: '/' + team + '/maps'
          }
        ];
      }
    });

    
  }
}
