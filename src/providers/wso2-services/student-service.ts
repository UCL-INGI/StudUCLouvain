/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
    This file is part of Stud.UCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    Stud.UCLouvain is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Stud.UCLouvain is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
*/

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Wso2Service } from './wso2-service';

@Injectable()
export class StudentService {
  activities: Array<String> = [];
  url = 'my/v0/student/';
  options: any;
  courseUrl = 'learning/v1/learningUnits/';

  constructor(public http: HttpClient, private wso2Service: Wso2Service) {
  }

  /*Search activities (courses)*/
  public searchActivities() {
    this.activities = [];
    let newUrl = this.url;
    newUrl += "activities";
    return new Promise(resolve => {
      this.wso2Service.loadStudent(newUrl).subscribe(
        data => {
          console.log(data);
          if (data['activities'] != null) {
            console.log(data);
            resolve({ activities: data['activities'] });
          }
        });
    });
  }

  public checkCourse(sigle: string, year) {
    let newUrl = this.courseUrl + year + '/' + sigle + '/fullInformation';
    return new Promise(resolve => {
      this.wso2Service.load(newUrl).subscribe(
        (data) => {
          let res: any;
          res = data;
          resolve(res.ficheActivite);
        },
        (err) => {
          console.log(err);
          console.log(err.error);
          resolve(err.status);
        });
    })
  }

  public weekSchedule() {
    let newUrl = this.url + "courseSchedules?date=";
    var C = 7 - new Date().getDay();
    //var C = 7 - new Date("10/16/2017").getDay();
    if (C == 7) C = C - 1;
    //console.log(C);
    let schedule: Array<any> = [];
    return new Promise(resolve => {
      for (var _i = 0; _i < C; _i++) {
        let date = this.getDate(_i);
        let day = this.getDay(_i);

        let url = newUrl + date;
        this.wso2Service.loadStudent(url).subscribe(
          data => {
            let res: any;
            res = data;
            //console.log(res);
            if (res.items != null) {
              let items = res.items.item;
              //console.log(date);
              let dayDate = date.substr(5);
              dayDate = dayDate.substr(3) + "/" + dayDate.substr(0, 2);
              for (let cours of items) {
                let name: any;
                let res: any;
                this.checkCourse(cours.cours, new Date().getFullYear()).then(data => {
                  res = data;
                  name = res.intituleCompletMap.entry[1].value;
                  cours['name'] = name;
                })
              }
              let daySchedule = { 'date': dayDate, 'schedule': items, 'day': day };
              //console.log(daySchedule);
              schedule.push(daySchedule);
              schedule.sort((a, b) => parseInt(a.date.substr(0, 2)) - parseInt(b.date.substr(0, 2)));
            }
          });
      }
      console.log(schedule);
      //schedule.sort((a,b) => parseInt(a.date.substr(0,2)) - parseInt(b.date.substr(0,2)));
      resolve(schedule);
    })

    /*var today = new Date();
    console.log(today)
    today.setDate(today.getDate() +1)
    console.log( today)*/


  }

  public todaySchedule() {
    let newUrl = this.url + "courseSchedules?date=";

    let schedule: Array<any> = [];
    return new Promise(resolve => {
      let date = this.getDate(0);

      let url = newUrl + date;
      this.wso2Service.loadStudent(url).subscribe(
        data => {
          let res: any;
          res = data;
          //console.log(res);
          if (res.items != null) {
            let items = res.items.item;
            //console.log(date);
            let dayDate = date.substr(5);
            dayDate = dayDate.substr(3) + "/" + dayDate.substr(0, 2);
            for (let cours of items) {
              let name: any;
              let res: any;
              this.checkCourse(cours.cours, new Date().getFullYear()).then(data => {
                res = data;
                name = res.intituleCompletMap.entry[1].value;
                cours['name'] = name;
              })
            }
            let daySchedule = { 'date': dayDate, 'schedule': items };
            console.log(daySchedule);
            schedule.push(daySchedule);
            schedule.sort((a, b) => parseInt(a.date.substr(0, 2)) - parseInt(b.date.substr(0, 2)));
          }
        });

      resolve(schedule);
    })

  }

  getDay(i: number): string {
    let day: string = '';
    if (i === 0) day = 'Lundi';
    if (i === 1) day = 'Mardi';
    if (i === 2) day = 'Mercredi';
    if (i === 3) day = 'Jeudi';
    if (i === 4) day = 'Vendredi';
    if (i === 5) day = 'Samedi';

    return day;
  }

  getDate(i: number): string {
    var today = new Date();
    //var today = new Date("10/16/2017");
    today.setDate(today.getDate() + i);
    var d = today.getDate();
    var dd = d.toString();
    var m = today.getMonth() + 1;
    var mm = m.toString();
    if (m < 10) {
      mm = "0" + mm;
    }
    if (d < 10) {
      dd = "0" + dd;
    }
    var yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  getStatus() {
    let newUrl = this.url + "inscriptions";
    return new Promise(resolve => {
      this.wso2Service.loadStudent(newUrl).subscribe(
        (data) => {
          let res: any;
          res = data;
          console.log(res.lireInscriptionAnacResponse.return);
          resolve(res.lireInscriptionAnacResponse.return);
        },
        (err) => {
          console.log(err);
          console.log(err.error);
          resolve(err.status);
        });
    })
  }


}
