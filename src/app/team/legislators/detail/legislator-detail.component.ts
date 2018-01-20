import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-legislator-detail',
  templateUrl: './legislator-detail.component.html',
  styleUrls: ['./legislator-detail.component.css']
})
export class LegislatorDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  state: string;
  house: string;
  district: number;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.state = params['team'];
      this.house = (params['h'].toLowerCase() == 'l') ? 'lower' : 'upper';
      this.district = params['district'];
    })
  }

}
