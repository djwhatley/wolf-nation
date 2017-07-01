import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GoogleSheetsService } from 'app/core/google-sheets/google-sheets.service';
import { Volunteer } from './volunteer.model';

import { SHEET_VOLUNTEERS, SHEET_VOLUNTEERS_TABS } from '../google-sheets/config';

@Injectable()
export class VolunteersService {

  constructor(
    private googService: GoogleSheetsService
  ) { }

  /*getVolunteers(): Promise<Volunteer[]> {
    let volunteers = [] as Volunteer[];

    for (let tab of SHEET_VOLUNTEERS_TABS) {

    }

    this.googService.getSpreadsheet(SHEET_VOLUNTEERS)
      .then(res =>  {

      })
      .catch(err => console.error(err));
  }

  transform(data: any): Volunteer[] {
    let volunteers = [] as Volunteer[];

    for (let row of data.values) {

    }
  }*/

}
