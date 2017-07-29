import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise'

@Injectable()
export class GeoDataService {

  constructor(private http: Http) { }

  getDistrictMap(state: string, house: string): Promise<any> {
    return this.http.get('/assets/geo/' + state + '/' + house  + '.json')
      .toPromise() 
      .then((data) => data)
      .catch(err => console.dir(err));
  }
}
