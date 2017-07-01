import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, GoogleToken } from 'app/core/google-sheets/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  isAuth: boolean;

  ngOnInit() {
    this.isAuth = this.authService.isAuth();

    this.route.fragment.subscribe(frag => {
      if (frag) {
        let params = {};
        let asdf = frag.split('&');
        for (let s of asdf) {
          let kv = s.split('=');
          params[kv[0]] = kv[1];
        }

        this.authService.storeAccessToken(params as GoogleToken);
        this.isAuth = true;
        this.router.navigateByUrl('home');
      }
    });
  }

  requestAuth() {
    this.authService.requestAuthorization();
  }

}
