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
import { HttpClient } from '@angular/common/http';
import { Wso2Service} from './wso2-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class StudentService {
  activities: Array<String> = [];
  url = 'my/v0/student/';
  options: any;
  courseUrl = 'learning/v1/';

  constructor(public http: HttpClient, private wso2Service: Wso2Service) {
  }

  /*Search activities (courses)*/
  public searchActivities(){
    this.activities = [];
    let newUrl = this.url ;
    newUrl += "activities";
    return new Promise(resolve => {
      this.wso2Service.loadStudent(newUrl).subscribe(
        data => {
          console.log(data);
          if(data['activities']!=null){
            console.log(data);
            resolve({activities : data['activities']});
          }
        });
    });
  }

  public checkCourse(sigle:string, year){
    let newUrl = this.courseUrl + year + '/learningUnits/' + sigle + '/fullInformation';
    return new Promise(resolve => {
      this.wso2Service.load(newUrl).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          resolve(err.status);
        });
    })
  }


}
