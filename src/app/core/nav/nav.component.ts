import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/core/auth';

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
      this.navItems = [
        {
          text: 'Maps',
          href: '/maps'
        }
      ];
    }
  }
}
