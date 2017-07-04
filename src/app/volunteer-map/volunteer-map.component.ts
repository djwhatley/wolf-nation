import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GeoDataService } from 'app/core/geo-data.service';
import { GoogleSheetsService } from 'app/core/google-sheets/google-sheets.service';
import { Volunteer } from 'app/core/volunteers/volunteer.model';

import { SHEET_VOLUNTEERS, SHEET_VOLUNTEERS_TABS } from 'app/core/google-sheets/config';

import 'rxjs/add/operator/toPromise';

declare var AmCharts: any;
declare var geojson2svg: any;
declare var $: any;

@Component({
  templateUrl: './volunteer-map.component.html',
  styleUrls: ['./volunteer-map.component.css']
})
export class VolunteerMapComponent implements OnInit {

  constructor(
    private router: Router,
    private geoService: GeoDataService,
    private googService: GoogleSheetsService
  ) { }

  map: any;
  mapData: any[];

  volunteers: Volunteer[];
  sheetCount: number;
  allPresent: boolean;

  volDict: any = {};
  districtVolunteers: any = {};

  loading: boolean;

  selectedDistrict: any;

  ngOnInit() {
    this.loading = true;
    this.getVolunteers();
    this.getMapData();
  }

  getVolunteers() {
    this.sheetCount = 0;
    this.volunteers = [];
    for (let tab of SHEET_VOLUNTEERS_TABS) {
      this.googService.getValues(SHEET_VOLUNTEERS, tab + '!A4:J')
        .then(res => {
          let data = res.json();

          for (let row of data.values) {
            let volunteer = new Volunteer();

            volunteer.name = row[0];
            volunteer.phone = row[1];
            volunteer.email = row[2];

            if (volunteer.name == 'DORMANT WOLF')
              break;

            /*let oa = row[3];
            let lc = row[4];
            let lr = row[5];

            /*if (oa && lc && lr) {
              volunteer.outreach.attempts = parseInt(oa);
            }*/

            //let level = row[6];

            let regex = /[^0-9]*([0-9]+)[^0-9]*/;

            if (row[7]) {
              let match_hd = regex.exec(row[7]);
              let hd = (match_hd && match_hd[1]) ? parseInt(match_hd[1]) : null;

              if (!hd)
                continue;
              
              volunteer.districts = { lower: hd, upper: undefined };

              if (!this.districtVolunteers[hd])
                this.districtVolunteers[hd] = [];

              this.districtVolunteers[hd].push(volunteer);
              this.volunteers.push(volunteer);
            }
            else {
              continue;
            }
          }
          
          console.log(this.districtVolunteers);

          this.sheetCount++;

          if (this.sheetCount == SHEET_VOLUNTEERS_TABS.length) {
            this.allPresent = true;
            if (this.mapData)
              this.createMap();
          }
        })
        .catch(err => {
          console.error(err);
          if (err.status == 403)
            this.router.navigateByUrl('/');
        });
    }
  }

  getMapData() {
    this.geoService.getDistrictMap('ga', 'lower')
    .then((res) => {
      this.mapData = res.json();
      if (this.allPresent)
        this.createMap();   
    })
    .catch(err => console.error(err));
  }

  createMap() {
    this.map = AmCharts.makeChart("chartdiv", this.getMapObject(this.mapData, this.volunteers));
    $('a[href="http://www.amcharts.com/javascript-maps/"]').css('display', 'none');
    this.loading = false;
  }

  getMapObject(geodata: any, volunteers: Volunteer[]) {
    let areas = [];

    for (let feat of geodata.features) {
      let prop ='SLDLST';

      let dist = Number.parseInt(feat.properties[prop]);

      let vols = this.districtVolunteers[dist];
      if (vols) {
        areas.push({
          id: feat.properties['NAMELSAD'],
          value: vols.length,
          district: dist
        })
      }
    }

    let mapData = this.parseGeoJSON(geodata);

    return {
      type: 'map',
      theme: 'light',
      colorSteps: 5,
      dataProvider: {
        mapVar: mapData,
        areas: areas,
      },
      areasSettings: {
        autoZoom: true,
        balloonText: '[[title]]<br>Volunteers: [[value]]',
        selectedColor: '#CC0000'
      },
      zoomDuration: 0.1,
      listeners: [
        {
          event: 'clickMapObject',
          method: (ev) => { this.clickMapObject(ev) }
        },
        {
          event: 'homeButtonClicked',
          method: (ev) => { this.homeButtonClicked(ev) }
        }
      ]
    };
  };

  clickMapObject(ev: any) {
    let obj = ev.mapObject;
    this.selectedDistrict = obj;
  }

  homeButtonClicked(ev: any) {
    this.selectedDistrict = void 0;
  }

  parseGeoJSON(geojson: any, fieldMap?: any) {

    // init field map
    if (typeof(fieldMap) !== "object")
        fieldMap = {};
    
    // init calibration
    /*var bounds = {
        "left": -180,
        "bottom": -90,
        "right": 180,
        "top": 90
    };*/
    let bounds = {
        "left": 32,
        "bottom": -82,
        "right": 35,
        "top": -85
    };
    
    // init empty map
    let mapVar = {
        "svg": {
            "defs": {
                "amcharts:ammap": {
                "projection":"mercator",
                "leftLongitude":"-180",
                "topLatitude":"90",
                "rightLongitude":"180",
                "bottomLatitude":"-90"
                }   
            },
            "g":{
                "path":[]
            }
        }
    };

    // convert GeoJSON to SVG paths
    let converter = geojson2svg({
        "output": "svg",
        "explode": false,
        "attributes": {"class": "land"},
        "mapExtent": bounds,
        "viewportSize": {
        "width": 800,
        "height": 800
        }
    });

    for (let feature of geojson.features) {
      feature.properties.id = feature.properties['NAMELSAD'];
    }

    let svg = converter.convert(geojson, {});
    
    // parse each path into JavaScript Maps data structure
    for(let i = 0; i < svg.length; i++) {
        let path = svg[i];
        let attrs = path.match(/\w+=".*?"/g);
        let area = {};
        for(let x = 0; x < attrs.length; x++) {
            let parts = attrs[x].replace(/"/g, '').split("=");
            let key = fieldMap[parts[0]] || parts[0];
            area[key] = parts[1];
        }
        area['title'] = area['id'];
        mapVar.svg.g.path.push(area);
    }
    
    return mapVar;
  }

}
