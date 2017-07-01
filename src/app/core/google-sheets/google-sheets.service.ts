import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthHttp } from './auth.http';

import { API_URL, OAUTH_ID, TOKEN_ACCESS, TOKEN_EXPIRES } from './config';
import { environment } from 'environments/environment';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GoogleSheetsService {

  constructor(
    private router: Router,
    private http: AuthHttp
  ) { }

  getSpreadsheet(id: string): Promise<any> {
    const url: string = API_URL + id;
    return this.http.get(url)
      .toPromise()
      /*.then(res => res.json())
      .catch(err => { console.error(err); });*/
  }

  getValues(sheet_id: string, range: string): Promise<any> {
    const url: string = API_URL + sheet_id + '/values/' + range;
    return this.http.get(url)
      .toPromise();
  }

}
