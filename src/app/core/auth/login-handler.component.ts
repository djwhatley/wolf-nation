import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, GoogleToken } from 'app/core/auth';

@Component({
  selector: 'app-login-handler',
  template: '<html></html>'
})
export class LoginHandlerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.fragment.subscribe(frag => {
      if (frag) {
        let params = {};
        let asdf = frag.split('&');
        for (let s of asdf) {
          let kv = s.split('=');
          params[kv[0]] = kv[1];
        }

        let success = params['login_success'] == '1' ? true : false;

        if (!success || params['error']) {
          // handle error
          console.error('OAuth Login Error: ', params);
        }
        else {
          this.authService.storeToken(params as GoogleToken);
        }
        
        this.router.navigateByUrl('home');
      }
    });
  }

}
