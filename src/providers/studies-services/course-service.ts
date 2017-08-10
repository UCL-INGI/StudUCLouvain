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
export class CourseService {
  public server_url:"http://horairev6.uclouvain.be";
  public info_path: "/jsp/custom/modules/plannings/info.jsp?displayConfName=web&order=slot";
  public project_id: 6;
  public user: "etudiant";
  public password:"student";
  public notify_id=1;

  data:any;
    constructor(public http: Http) {
      console.log('Hello PeopleService Provider');
    }

    load(tag: string, weeks: string) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.

      this.http.get(
        this.server_url
        +"/jsp/custom/modules/plannings/direct_planning.jsp?weeks="
        + weeks + "&code=" + tag + "&login=" + "etudiant" + "&password="
        + "student" + "&projectId=" + "6" + "&showTabDuration=true"
        + "&showTabDate=true&showTab=true&showTabWeek=false&showTabDay=false"
        + "&showTabStage=false&showTabResources=false"
        + "&showTabCategory6=false&showTabCategory7=false"
        + "&showTabCategory8=false")
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data.results;
          resolve(this.data);
        });
    });
  }

}
