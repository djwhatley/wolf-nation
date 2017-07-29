import { Injectable } from '@angular/core';
import {
    Http, Request, Response, Headers,
    RequestOptions, RequestOptionsArgs, 
} from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';


@Injectable()
export class AuthHttp {
    constructor(private http: Http, private authService: AuthService) { }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.request(url, this.getRequestOptionArgs(options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.delete(url, this.getRequestOptionArgs(options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        let token = this.authService.getAccessToken();
        if (token)
            options.headers.append('Authorization', 'Bearer ' + token);
/*        if (this.authService.isAuth()) {
            options.headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
            options.headers.append('X-Wolf-Token-Exp', this.authService.getAccessTokenExpiry());
            options.headers.append('X-Wolf-Refresh-Token', this.authService.getRefreshToken());
        }*/
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.map((res) => {
            if (res.headers.has('X-Wolf-New-Token')) {
                let token = res.headers.get('X-Wolf-New-Token');
                let exp = res.headers.get('X-Wolf-Token-Expires-In');

                this.authService.storeToken({
                    access_token: token,
                    expires_in: exp,
                    token_type: 'Bearer'
                });
            }

            return res;
        });
    }
}