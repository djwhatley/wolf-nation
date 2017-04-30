import { Component, OnInit } from '@angular/core';

import { GeoDataService } from 'app/core/geo-data.service';

declare var AmCharts: any;
declare var geojson2svg: any;
declare var $: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private geoService: GeoDataService) { }

  map: any;

  ngOnInit() {
    /*this.geoService.getDistrictMap('ga', 'upper')
    .then((data) => {
      this.map = AmCharts.makeChart("chartdiv", this.getMapObject(data.json()));
    })
    .catch(err => console.error(err));*/
  }

  getMap(house) {
    this.geoService.getDistrictMap('ga', house)
    .then((data) => {
      this.map = AmCharts.makeChart("chartdiv", this.getMapObject(data.json()));
      $('a[href="http://www.amcharts.com/javascript-maps/"]').css('display', 'none');
    })
    .catch(err => console.error(err));
  }

  getMapObject(geodata: any) {
    let data = this.parseGeoJSON(geodata);

    return {
      type: 'map',
      theme: 'light',
      dataProvider: {
        mapVar: data,
        getAreasFromMap: true
      },
      areasSettings: {
        autoZoom: true,
        balloonText: '[[title]]',
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
    
    console.log(mapVar);
    return mapVar;
  }

}
