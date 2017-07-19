import { Component, OnInit } from '@angular/core';

import { AuthService } from '../google-sheets/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  navItems = [];
  isAuth: boolean;

  ngOnInit() {
    this.isAuth = this.authService.isAuth();

    if (this.isAuth) {
      [
        {
          text: 'Legislator Map',
          href: 'lmap'
        },
        {
          text: 'Volunteer Map',
          href: 'vmap'
        }
      ];
    }
  }
}
