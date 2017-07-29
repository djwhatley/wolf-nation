import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';

import { OAUTH_ID, TOKEN_ACCESS, TOKEN_EXPIRES, TOKEN_REFRESH } from './config';
import { environment } from 'environments/environment';

export class GoogleToken {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token?: string;
}

@Injectable()
export class AuthService {

  constructor(
    private http: Http
  ) { }

  accessToken: string;
  expires: Date;

  private getOAuthUrl(): string {
    let url: string = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += '?client_id=' + OAUTH_ID;
    url += '&redirect_uri=' + environment.apiHost + environment.oAuthUrl + 'oauth2login';
    url += '&response_type=code';
    url += '&scope=profile https://www.googleapis.com/auth/spreadsheets.readonly';
    url += '&access_type=offline';

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

  getAccessTokenExpiry(): string {
    return localStorage.getItem(TOKEN_EXPIRES);
  }

  getRefreshToken(): string {
    return localStorage.getItem(TOKEN_REFRESH);
  }

  refreshAccessToken(callback: Function) {
    let refreshToken = localStorage.getItem(TOKEN_REFRESH);
    if (!refreshToken) {
      this.requestAuthorization();
      return;
    }
    this.http.get(environment.apiHost + environment.oAuthUrl + '/newtoken?refresh_token=' + refreshToken)
      .toPromise()
      .then((res) => {
        console.log(res);
        this.storeToken(res.json());
        callback();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  storeToken(token: GoogleToken) {
    let now = new Date();
    let t = parseInt(token.expires_in);
    this.expires = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() + t, 0);

    localStorage.setItem(TOKEN_EXPIRES, this.expires.toISOString());
    localStorage.setItem(TOKEN_ACCESS, token.access_token);
    if (token.refresh_token)
      localStorage.setItem(TOKEN_REFRESH, token.refresh_token);
  }
 
}
