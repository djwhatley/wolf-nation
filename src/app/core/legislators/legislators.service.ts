import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'app/core/auth';
import { Legislator } from './legislator.model';

import { environment } from 'environments/environment';

const API_URL: string = environment.apiHost + environment.apiUrl;

@Injectable()
export class LegislatorsService {

  constructor(
    private http: AuthHttp
  ) { }
  
  getLegislators(state: string, house?: string): Promise<Legislator[]> {
    let url = API_URL + `${state}/legislators`;
    if (house)
      url += '?house=' + house;
    return this.http.get(url)
      .toPromise()
      .then((res) => res.json());
  }
}
