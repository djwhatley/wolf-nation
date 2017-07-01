import { Injectable } from '@angular/core';
import {
    Http, Request, Response, Headers,
    RequestOptions, RequestOptionsArgs, 
} from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/observable';
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
        //options.headers.append('Content-Type', 'application/json');
        if (this.authService.isAuth())
            options.headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
        return options;
    }
}