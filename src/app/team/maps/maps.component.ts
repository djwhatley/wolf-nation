import { Component, OnInit } from '@angular/core';

import { ApiService } from 'app/core/api';

import { GeoDataService } from 'app/core/geo-data.service';
import { Legislator  } from 'app/core/legislators';
import { TeamService } from 'app/core/teams/team.service';

import { Volunteer } from 'app/core/volunteers/volunteer.model';

const MAP_LEGISLATORS: string = 'leg_support';
const MAP_VOLUNTEERS: string = 'volunteers';

declare var AmCharts: any;
declare var geojson2svg: any;
declare var $: any;

@Component({
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private geoService: GeoDataService,
    private teamService: TeamService
  ) { }

  map: any;
  geoData: any[];
  mapType: string;
  house: string;

  loading: boolean;

  legs: Legislator[];
  legDict: Map<number, Legislator>;


  volunteers: Volunteer[];
  sheetCount: number;
  allPresent: boolean;

  volDict: any = {};
  districtVolunteers: any = {};

  selectedDistrict: any;

  generatedMap: string;

  team: string;

  sub: any;

  ngOnInit() {
    this.loading = true;

    this.team = this.teamService.getTeam();
    this.sub = this.teamService.getTeamObservable().subscribe((team) => {
      this.team = team;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getMap() {
    delete this.generatedMap;
    switch(this.mapType) {
      case MAP_LEGISLATORS:
        this.getLegislators(this.house);
        break;
      case MAP_VOLUNTEERS:
      this.getVolunteers();
        break;
    }

    this.getGeoData();
  }

  getGeoData() {
    delete this.geoData;
    this.geoService.getDistrictMap(this.team, this.house)
    .then((res) => {
      this.geoData = res.json();
      console.log(this.geoData);
      if (this.legs || this.volunteers) {
        this.createMap();
      }      
    })
    .catch(err => console.error(err));
  }

  createMap() {
    switch(this.mapType) {
      case MAP_LEGISLATORS:
        this.map = AmCharts.makeChart("chartdiv", this.getLegislatorsMapObject(this.geoData, this.house));
        break;
      case MAP_VOLUNTEERS:
        this.map = AmCharts.makeChart("chartdiv", this.getVolunteersMapObject(this.geoData, this.house));
        break;
    }
    $('a[href="http://www.amcharts.com/javascript-maps/"]').css('display', 'none');
    this.loading = false;
    this.generatedMap = this.mapType;
  }

  clickMapObject(ev: any) {
    let obj = ev.mapObject;
    this.selectedDistrict = obj;
  }

  homeButtonClicked(ev: any) {
    this.selectedDistrict = void 0;
  }

  getLegislators(house: string) {
    console.log(house);
    delete this.legs;
    this.apiService.legislators.get({
      state: this.team,
      house: house
    }, (res) => {
      this.legs = res;

      this.legDict = new Map<number, Legislator>();
      for (let leg of this.legs) {
        this.legDict.set(leg.district, leg);
      }

      console.log(this.legs);

      if (this.geoData) {
        this.createMap();
      }
    })
    /*this.legService.getLegislators('ga', house)
    .then((res) => {
      this.legs = res;

      this.legDict = new Map<number, Legislator>();
      for (let leg of this.legs) {
        this.legDict.set(leg.district, leg);
      }

      console.log(this.legs);

      if (this.geoData) {
        this.createMap();
      }
    })
    .catch(err => console.error(err));*/
  }

  getLegislatorsMapObject(geodata: any, house: string) {
    let areas = [];

    for (let feat of geodata.features) {
      let prop = (house == 'lower' ? 'SLDLST' : 'SLDUST');

      let dist = Number.parseInt(feat.properties[prop]),
          leg = this.legDict.get(dist);

      if (leg.score > 0 && leg.score < 4) {
        areas.push({
          id: feat.properties['NAMELSAD'],
          customData: '(' + leg.party + ') ' + leg.full_name + '<br>' + 
                (leg.score == 1 ? 'SUPPORTIVE' : 
                (leg.score == 2 ? 'UNSURE' :  
                (leg.score == 3 ? 'NOT SUPPORTIVE' : void 0))),
          value: leg.score,
          color: leg.score == 1 ? '#93c47d' : 
                (leg.score == 2 ? '#ffd966' :  
                (leg.score == 3 ? '#dd7e6b' : void 0)),
          outlineThickness: 1,
          outlineColor: leg.score == 1 ? '#5b9443' : 
                       (leg.score == 2 ? '#fbbc00' :  
                       (leg.score == 3 ? '#b44229' : void 0)),
          rollOverColor: leg.party == 'R' ? '#f00' : (leg.party == 'D' ? '#04f' : ''),
          selectedColor: leg.party == 'R' ? '#f00' : (leg.party == 'D' ? '#04f' : '')
        });
      }
    }

    let mapData = this.parseGeoJSON(geodata);

    return {
      type: 'map',
      theme: 'light',
      dataProvider: {
        mapVar: mapData,
        areas: areas,
      },
      areasSettings: {
        autoZoom: true,
        balloonText: '[[title]]<br>[[customData]]',
        selectedColor: '#CC0000'
      },
      zoomDuration: 0.1
    };
  };


  getVolunteers() {
    delete this.volunteers;
    delete this.districtVolunteers;
    this.apiService.volunteers.getByState(this.team, (volunteers) => {
      this.volunteers = volunteers;

      console.log(this.volunteers);

      
        
      if (this.geoData)
        this.createMap();
    });
    /*this.volService.getVolunteers('ga')
      .then((volunteers) => {
        this.volunteers = volunteers;
        
        if (this.geoData)
          this.createMap();
    })*/
  }

  getVolunteersMapObject(geodata: any, house: string) {
    for (let volunteer of this.volunteers) {
      
      if (!this.districtVolunteers)
        this.districtVolunteers = {};
      if (!this.districtVolunteers[volunteer.districts[house]])
        this.districtVolunteers[volunteer.districts[house]] = [];
      this.districtVolunteers[volunteer.districts[house]].push(volunteer);
    }

    let areas = [];

    for (let feat of geodata.features) {
      let prop = (house == 'lower' ? 'SLDLST' : 'SLDUST')

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
