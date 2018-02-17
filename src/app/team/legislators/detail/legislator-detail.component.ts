import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LegislatorsService } from '../../../core/legislators';

@Component({
  selector: 'app-legislator-detail',
  templateUrl: './legislator-detail.component.html',
  styleUrls: ['./legislator-detail.component.css']
})
export class LegislatorDetailComponent implements OnInit {

  constructor(
    private legsService: LegislatorsService,
    private route: ActivatedRoute
  ) { }

  state: string;
  house: string;
  district: number;

  detail: any;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.state = params['team'];
      this.house = (params['h'].toLowerCase() == 'l') ? 'lower' : 'upper';
      this.district = params['district'];

      this.legsService.getLegislatorDetail(this.state, this.house, this.district)
        .then((detail) => {
          let p = detail.party.toLowerCase().charAt(0);
          detail.partyBadgeClass = (p == 'r' ? 'badge-danger' : (p == 'd' ? 'badge-primary' : ''));

          detail.titleHtml = detail.title.replace(/\n/g, '<br>');
          detail.cmteHtml = detail.committees.replace(/\n/g, '<br>');
          detail.phoneHtml = detail.phones.replace(/\n/g, '<br>')

          this.detail = detail;          
        })
        .catch((err) => {
          console.error(err);
        });
    })
  }

}
