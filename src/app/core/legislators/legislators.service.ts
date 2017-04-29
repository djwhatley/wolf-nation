import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Legislator } from './legislator.model';

import { API_URL } from '../openstates.config';

@Injectable()
export class LegislatorsService {

  constructor(private http: Http) { }
  
  
}
