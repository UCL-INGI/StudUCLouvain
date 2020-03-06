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

import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MapLocation } from '../../app/entity/mapLocation';
import { UserService } from '../utils-services/user-service';

@Injectable()
export class POIService {

  zones: any = [];
  url = '';
  prefix_path = 'assets/data/mapMarkers';
  old = '';

  constructor(public http: HttpClient, public user: UserService) {
    this.old = this.user.campus;
    this.update();
  }

  update() {
    const campus = this.user.campus;
    this.url = this.prefix_path + {
      'LLN': 'LLN.json',
      'Woluwe': 'Mons.json',
      'Mons': 'Woluwe.json',
      undefined: this.url
    }[campus];
    if (campus !== this.old) {
      this.zones = [];
      this.old = campus;
    }
  }

  private getZoneList(listZone) {
    return {
      list: this.createMapLocations(listZone),
      listChecked: Array(listZone.length).fill(false),
      showDetails: false
    }
  }

  public loadResources() {
    this.update();
    if (this.zones.length === 0) {
      return new Promise(resolve => {
        this.http.get(this.url).map(res => res).subscribe(data => {
          this.zones.push({
            auditoires: this.getZoneList(data['zones'].auditoires),
            locaux: this.getZoneList(data['zones'].locaux),
            bibliotheques: this.getZoneList(data['zones'].bibliotheques),
            sports: this.getZoneList(data['zones'].sports),
            restaurants_universitaires: this.getZoneList(data['zones'].restaurants_universitaires),
            services: this.getZoneList(data['zones'].services),
            parkings: this.getZoneList(data['zones'].parkings),
            icon: 'arrow-dropdown',
          });
          resolve(this.zones);
        });
      });
    } else {
      return new Promise(resolve => {
        resolve(this.zones);
      });
    }
  }

  private createMapLocations(list: any): Array<MapLocation> {
    function compare(a, b) {
      if (a.nom < b.nom) {
        return -1;
      } else if (a.nom > b.nom) {
        return 1;
      }
      return 0;
    }

    const locationsList: MapLocation[] = [];
    for (const elem of list.sort(compare)) {
      locationsList.push(
        new MapLocation(elem.nom, elem.adresse, elem.coord.lat, elem.coord.lng, elem.sigle)
      );
    }
    return locationsList;
  }
}
