import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Legislator } from './legislator.model';

import { API_URL, API_KEY, SHEETS } from '../api.config';

@Injectable()
export class LegislatorsService {

  constructor(private http: Http) { }
  
  getLegislators(house: string): Promise<Legislator[]> {
    return this.http.get(API_URL + '1KEg18KJE7NjnIa3umiiNALgPKj1iDML34J71U4_YJDo/' + 'values/' + SHEETS[house] + '!A4:G183' + '?key=' + API_KEY)
      .toPromise()
      .then((res) => this.transform(res.json(), house))
      .catch(err => console.error(err));
  }

  private transform(data: any, house: string): Legislator[] {
    let legs = [] as Legislator[];

    for (let row of data.values) {
      let email = row[6];
      let match = /([a-zA-Z]+)\.([a-zA-Z]+)@.*/.exec(email);

      legs.push({
        state: 'GA',
        chamber: house,
        district: Number.parseInt(row[0]),
        full_name: row[1],
        party: row[2],
        role: row[3],
        score: row[4] ? Number.parseInt(row[4]) : 0,
        first_name: match ? match[1][0].toUpperCase() + match[1].substring(1, match[1].length) : '',
        last_name: match ? match[2][0].toUpperCase() + match[2].substring(1, match[2].length) : '',
      });
    }

    return legs;
  }
}
