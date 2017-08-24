import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { JwtHelper } from './auth.jwt';
import { OAUTH_ID, TOKEN_NAME } from './config';
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
    url += '&scope=email https://www.googleapis.com/auth/spreadsheets.readonly';
    url += '&access_type=offline';

    return url;
  }

  requestAuthorization() {
    location.href = this.getOAuthUrl();
  }

  isAuth(): boolean {
    let token = this.getToken();
    return token != null && this.isGoogleTokenValid(token);
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  isGoogleTokenValid(token: string): boolean {
    let decoded = JwtHelper.decodeToken(token);

    let exp_ms = decoded.gt_expires * 1000;
    let exp = new Date(exp_ms);
    return (Date.now() < exp.getTime())
  }

  refreshToken(callback: Function) {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.set('Authorization', 'Bearer ' + this.getToken());
    this.http.get(environment.apiHost + environment.oAuthUrl + 'newtoken', options)
      .toPromise()
      .then((res) => {
        this.storeToken(res.text());
        callback();
      })
      .catch((err) => {
        console.error(err);
      })
  }

  storeToken(token: string) {
    localStorage.setItem(TOKEN_NAME, token);  
  }
}
