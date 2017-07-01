import { Injectable } from '@angular/core';

import { API_URL, OAUTH_ID, TOKEN_ACCESS, TOKEN_EXPIRES } from './config';
import { environment } from 'environments/environment';

export class GoogleToken {
  access_token: string;
  expires_in: string;
  token_type: string;
}

@Injectable()
export class AuthService {

  constructor() { }

  accessToken: string;
  expires: Date;

  private getOAuthUrl(): string {
    let url: string = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += '?client_id=' + OAUTH_ID;
    url += '&redirect_uri=' + (environment.production ? 'https://djwhatley.github.io/wolf-nation/' : 'http://localhost:4200/');
    url += '&response_type=token';
    url += '&scope=https://www.googleapis.com/auth/spreadsheets.readonly'

    return url;
  }

  requestAuthorization() {
    location.href = this.getOAuthUrl();
  }

  isAuth(): boolean {
    return this.getAccessToken() != null;
  }

  getAccessToken(): string {
    let exp = localStorage.getItem(TOKEN_EXPIRES);
    if (exp) {
      let expires = new Date(exp);
      let now = new Date();

      if (now.valueOf() < expires.valueOf()) {
        return localStorage.getItem(TOKEN_ACCESS);
      }
    }

    return null; 
  }

  storeAccessToken(token: GoogleToken) {
    let now = new Date();
    let t = parseInt(token.expires_in);
    this.expires = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() + t, 0);

    localStorage.setItem(TOKEN_EXPIRES, this.expires.toUTCString());
    localStorage.setItem(TOKEN_ACCESS, token.access_token);
  }
 
}
