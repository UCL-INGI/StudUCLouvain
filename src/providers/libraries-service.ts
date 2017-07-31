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
import { Http, Headers, RequestOptions } from '@angular/http';
import { LibraryItem } from '../app/entity/libraryItem';
import { TimeSlot } from '../app/entity/timeSlot';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class LibrariesService {
  libraries:Array<LibraryItem> = [];
  url = 'https://esb-test.sipr.ucl.ac.be:8248/libraries/v1/list';
  test_url = 'assets/data/temp_libraries.json';
  test_url_details = 'assets/data/temp_library_33.json';
  options: any;

  constructor(public http: Http) {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', `Bearer b1f03f08-fcd7-3834-9e28-ba91d462ad24`);
    this.options = new RequestOptions({ headers: headers });
  }

  public loadLibraries(){
    return new Promise(resolve => {

      this.http.get(this.url, this.options)
        .map(res => res.json()).subscribe(data => {
          this.extractLibraries(data.return.library);
          resolve({libraries:this.libraries});
        });

      });
  }

  public loadLibDetails(lib:LibraryItem){
    return new Promise(resolve => {

      let url_details = this.url + '/' + lib.id;

      this.http.get(url_details, this.options)
        .map(res => res.json()).subscribe(data => {
          lib = this.extractLibraryDetails(lib, data.return.library);
          resolve({libDetails:lib});
        });

      });
  }

  private extractLibraries(data: any){
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let library = new LibraryItem(item.id, item.name);
      this.libraries.push(library);
    }
  }

  private extractLibraryDetails(lib : LibraryItem, data:any): LibraryItem {

    lib.locationId = data.locationId;
    lib.mapLocation = data.mapLocation;
    lib.phone = data.phone;
    lib.email = data.email;
    lib.website = data.website;

    for( let i=0; i < data.openingHours.length; i++) {
      lib.openingHours.push(new TimeSlot(data.openingHours[i].day, data.openingHours[i].startHour, data.openingHours[i].endHour));
    }

    for( let i=0; i < data.openingExaminationHours.length; i++) {
      lib.openingExaminationHours.push(new TimeSlot(data.openingExaminationHours[i].day, data.openingExaminationHours[i].startHour, data.openingExaminationHours[i].endHour));
    }

    for( let i=0; i < data.openingSummerHours.length; i++) {
      lib.openingSummerHours.push(new TimeSlot(data.openingSummerHours[i].day, data.openingSummerHours[i].startHour, data.openingSummerHours[i].endHour));
    }

    lib.openingHoursNote = data.openingHoursNote;
    lib.closedDates = data.closedDates;

    return lib;
  }
}
