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
import 'rxjs/add/operator/do';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LibraryItem } from '../../app/entity/libraryItem';
import { MapLocation } from '../../app/entity/mapLocation';
import { TimeSlot } from '../../app/entity/timeSlot';
import { Wso2Service } from './wso2-service';

@Injectable()
export class LibrariesService {
  libraries: Array<LibraryItem> = [];
  url = 'libraries/v1/list';
  options: any;

  constructor(public http: HttpClient, private wso2Service: Wso2Service) {
  }

  /*Load the list of the libraries*/
  public loadLibraries() {
    this.libraries = [];
    return new Promise(resolve => {
      this.wso2Service.load(this.url).subscribe(
        data => {
          this.extractLibraries(data['return'].library);
          resolve({ libraries: this.libraries });
        });
    });
  }

  /*Load the details of a specific library, the library selected by the user*/
  public loadLibDetails(lib: LibraryItem) {
    return new Promise(resolve => {
      const url_details = this.url + '/' + lib.id;
      this.wso2Service.load(url_details).subscribe(
        data => {
          lib = this.extractLibraryDetails(lib, data['return'].library);
          resolve({ libDetails: lib });
        });
    });
  }

  /*Extract the list of the libraries*/
  private extractLibraries(data: any) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const library = new LibraryItem(item.id, item.name);
      this.libraries.push(library);
    }
  }

  /*Extract all the details for a specific library, the library selected by the user*/
  /*Retrieves all the necessary information*/
  private extractLibraryDetails(lib: LibraryItem, data: any): LibraryItem {
    if (data.locationId == null) {
      lib.locationId = -1;
    } else {
      lib.locationId = data.locationId;
    }

    if (data.mapLocation == null) {
      lib.mapLocation = new MapLocation(lib.name, '', '', '', '');
    } else {
      lib.mapLocation = new MapLocation(lib.name, data.address.street + ', ' + data.address.postalCode + ', ' + data.address.locality, '', '', ''); // TODO update maplocation with lat lng code
    }

    if (data.phone == null) {
      lib.phone = '';
    } else {
      lib.phone = data.phone.substr(3);
    }

    if (data.email == null) {
      lib.email = false;
    } else {
      lib.email = data.email;
    }


    if (data.website == null) {
      lib.website = '';
    } else {
      lib.website = data.website;
    }

    if (data.openingHours) {
      for (let i = 0; i < data.openingHours.length; i++) {
        lib.openingHours.push(new TimeSlot(data.openingHours[i].day, data.openingHours[i].startHour, data.openingHours[i].endHour));
      }
    }

    if (data.openingExaminationHours) {
      for (let i = 0; i < data.openingExaminationHours.length; i++) {
        lib.openingExaminationHours.push(new TimeSlot(data.openingExaminationHours[i].day, data.openingExaminationHours[i].startHour, data.openingExaminationHours[i].endHour));
      }
    }

    if (data.openingSummerHours) {
      for (let i = 0; i < data.openingSummerHours.length; i++) {
        lib.openingSummerHours.push(new TimeSlot(data.openingSummerHours[i].day, data.openingSummerHours[i].startHour, data.openingSummerHours[i].endHour));
      }
    }

    lib.openingHoursNote = data.openingHoursNote;

    if (data.closedDates.length === undefined) {
      lib.closedDates = [data.closedDates];
    } else {
      lib.closedDates = data.closedDates;
    }
    return lib;
  }
}
