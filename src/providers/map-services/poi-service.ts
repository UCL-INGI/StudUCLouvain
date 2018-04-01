/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MapLocation } from '../../app/entity/mapLocation';
import { UserService } from '../utils-services/user-service';
import 'rxjs/add/operator/map';

@Injectable()
export class POIService {

  zones: any = [];
  url = '';
  urlLLN ='assets/data/resourcesLLN.json';
  urlMons = 'assets/data/resourcesMons.json';
  urlWol = 'assets/data/resourcesWoluwe.json'; 
  old = '';
  constructor(public http: Http,

    public user: UserService) {
    this.old = this.user.campus;
    this.update();

  }

  update(){
    let campus = this.user.campus;
    if(campus == "LLN") this.url = this.urlLLN;
    if(campus == "Woluwe") this.url = this.urlWol;
    if(campus == "Mons") this.url = this.urlMons;
    if(campus != this.old) {
      this.zones = [];
      this.old = campus;
    }
  }

  public loadResources() {
    this.update();
    if(this.zones.length == 0) return new Promise(resolve => {

      this.http.get(this.url).map(res => res.json()).subscribe(data => {
        let tmpZones = data.zones;

        //for (let zone of tmpZones) {
          let auditoiresLength = tmpZones.auditoires.length;
          let bibliothequesLength = tmpZones.bibliotheques.length;
          let restauULength = tmpZones.restaurants_universitaires.length;
          let parkingsLength = tmpZones.parkings.length;

          let newZone = {
            auditoires: {
              list: this.createMapLocations(tmpZones.auditoires),
              listChecked: Array(auditoiresLength).fill(false),
                        showDetails: false},
            bibliotheques: {
              list: this.createMapLocations(tmpZones.bibliotheques),
              listChecked: Array(bibliothequesLength).fill(false),
                        showDetails: false},
            restaurants_universitaires: {
              list: this.createMapLocations(tmpZones.restaurants_universitaires),
              listChecked: Array(restauULength).fill(false),
                        showDetails: false},
            parkings: {
              list: this.createMapLocations(tmpZones.parkings),
              listChecked: Array(parkingsLength).fill(false),
                        showDetails: false},
            icon: 'arrow-dropdown',

          };

          this.zones.push(newZone);
        //}

        resolve(this.zones);
      });

    });
      else return new Promise(resolve => {
        resolve(this.zones);
      });
  }

  private createMapLocations(list: any): Array<MapLocation> {

    let locationsList: MapLocation[] = [];

    for (let elem of list) {
      let newLocation = new MapLocation(elem.nom,
                                    elem.adresse,
                                    elem.coord.lat,
                                    elem.coord.lng,
                                    elem.sigle);

      locationsList.push(newLocation);
    }

    return locationsList;
  }

 /* private applyHaversine(locations, userLocation:any){

    locations.map((location) => {

      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        userLocation,
        placeLocation,
        'miles'
      ).toFixed(2);
    });

    return locations;
  }*/

 /* private getDistanceBetweenPoints(start, end, units){

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }*/

  /*private toRad(x){
    return x * Math.PI / 180;
  }*/
}
  