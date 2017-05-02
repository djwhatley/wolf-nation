import { Component, OnInit } from '@angular/core';

import { GeoDataService } from 'app/core/geo-data.service';
import { Legislator, LegislatorsService } from 'app/core/legislators';

declare var AmCharts: any;
declare var geojson2svg: any;
declare var $: any;

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(
    private geoService: GeoDataService,
    private legService: LegislatorsService
  ) { }

  map: any;
  mapData: any[];
  legs: Legislator[];
  legDict: Map<number, Legislator>;

  ngOnInit() {
  }


  getMap(house: string) {
    this.getLegs(house);
    this.getMapData(house);
  }


  getLegs(house: string) {
    delete this.legs;
    this.legService.getLegislators(house)
    .then((res) => {
      this.legs = res;

      this.legDict = new Map<number, Legislator>();
      for (let leg of this.legs) {
        this.legDict.set(leg.district, leg);
      }

      if (this.mapData) {
        this.createMap(house);
      }
    })
    .catch(err => console.error(err));
  }

  getMapData(house: string) {
    delete this.mapData;
    this.geoService.getDistrictMap('ga', house)
    .then((res) => {
      this.mapData = res.json();
      if (this.legs) {
        this.createMap(house);
      }
      
    })
    .catch(err => console.error(err));
  }

  createMap(house: string) {
    this.map = AmCharts.makeChart("chartdiv", this.getMapObject(this.mapData, this.legs, house));
    $('a[href="http://www.amcharts.com/javascript-maps/"]').css('display', 'none');
  }



  getMapObject(geodata: any, legislators: Legislator[], house: string) {
    let areas = [];

    for (let feat of geodata.features) {
      let prop = (house == 'lower' ? 'SLDLST' : 'SLDUST');

      let dist = Number.parseInt(feat.properties[prop]),
          leg = this.legDict.get(dist);

      if (leg.score > 0 && leg.score < 4) {
        areas.push({
          id: feat.properties['NAMELSAD'],
          customData: leg.full_name,
          value: leg.score,
          color: leg.score == 1 ? '#93c47d' : 
                (leg.score == 2 ? '#ffd966' :  
                (leg.score == 3 ? '#dd7e6b' : void 0)),
          outlineThickness: 1,
          outlineColor: leg.score == 1 ? '#5b9443' : 
                       (leg.score == 2 ? '#fbbc00' :  
                       (leg.score == 3 ? '#b44229' : void 0)),
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
        balloonText: '[[customData]]<br>[[title]]',
        selectedColor: '#CC0000'
      }
    };
  };

  parseGeoJSON(geojson: any, fieldMap?: any) {
    console.log(geojson);

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
