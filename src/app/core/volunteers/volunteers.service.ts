import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'app/core/auth';
import { Volunteer } from './volunteer.model';

import { environment } from 'environments/environment';

const API_URL: string = environment.apiHost + environment.apiUrl;

@Injectable()
export class VolunteersService {

  constructor(
    private http: AuthHttp
  ) { }

  getVolunteers(state: string): Promise<Volunteer[]> {
    let url = API_URL + `${state}/volunteers`;
    return this.http.get(url)
      .toPromise()
      .then((res) => res.json() as Volunteer[])
  }
}
