/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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
import 'rxjs/add/operator/map';

@Injectable()
export class POIService {

  zones: any = [];

  constructor(public http: Http) {

  }

  public loadResources() {
    return new Promise(resolve => {

      this.http.get('assets/data/resources.json').map(res => res.json()).subscribe(data => {
        let tmpZones = data.zones;

        for (let zone of tmpZones) {
          let auditoiresLength = zone.auditoires.length;
          let bibliothequesLength = zone.bibliotheques.length;
          let restauULength = zone.restaurants_universitaires.length;
          let parkingsLength = zone.parkings.length;

          let newZone = {
            name: zone.nom,
            auditoires: {
              list: zone.auditoires,
              listChecked: Array(auditoiresLength).fill(false)},
            bibliotheques: {
              list: zone.bibliotheques,
              listChecked: Array(bibliothequesLength).fill(false)},
            restaurants_universitaires: {
              list: zone.restaurants_universitaires,
              listChecked: Array(restauULength).fill(false)},
            parkings: {
              list: zone.parkings,
              listChecked: Array(parkingsLength).fill(false)},
            icon: 'arrow-dropdown',
            showDetails: false
          };

          this.zones.push(newZone);
        }

        resolve(this.zones);
      });

    });
  }

  private applyHaversine(locations, userLocation:any){

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
  }

  private getDistanceBetweenPoints(start, end, units){

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

  }

  private toRad(x){
    return x * Math.PI / 180;
  }
}
