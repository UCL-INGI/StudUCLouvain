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
import 'rxjs/add/operator/map';
import { UserService } from '../utils-services/user-service';
import { RssService } from './rss-service';
import { SportItem } from '../../app/entity/sportItem';
//import xml2js from 'xml2js';
import X2JS from 'x2js';

@Injectable()
export class SportsService {
  sports: Array<SportItem> = [];
  allCategories: any = [];
  shownSports = 0;
  nbCalls = 0;
  callLimit = 30;

  url = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/recordrss.php";
  url1 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t1"; //LLN
  url2 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t3"; //woluwe
  url3 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t5"; //mons
  url4 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t7"; //equipe universitaire
  constructor(private http: Http, public user:UserService, public rssService : RssService) {}

convertXmlToJson(xml) : any{
    let parser : any = new X2JS();
    let json = parser.xml2js(xml);
    return json;
  }
  public getSports(segment:string) {
    this.sports = [];
    return new Promise( (resolve, reject) => {
     /* this.rssService.load(this.url1).subscribe(
        data => {
          this.nbCalls++;
          if (data['query']['results'] == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no events to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(data['query']['results']['item']);
            resolve({sports : this.sports, shownSports: this.shownSports, categories: this.allCategories});
          }
        },
        err => {
          reject(err);
        });;
    });*/
      this.http.get(this.url).map(data => {return this.convertXmlToJson(data.text());}).subscribe( result => {
          this.nbCalls++;
          if (result == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(result.xml.item);
            
            resolve({sports : this.sports, shownSports: this.shownSports, categories: this.allCategories});
          }
        },
        err => {
          reject(err);
        });
    });
  }

  private extractSports(data: any) {
    let maxDescLength = 20;
    if(data === undefined){
      console.log("Error sports data undefined!!!")
      return;
    }
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      //console.log(item);
      let favorite = false;
      let hidden = false;

      if (this.user.hasFavorite(item.guid)) {
        favorite = true;
      }
      if (item.sport) {
        if (this.allCategories.indexOf(item.sport) < 0) {
          this.allCategories.push(item.sport);
        }
        this.allCategories.sort();
      }

      this.shownSports++;

      let startDate = this.createDateForSport(item.date, item.hdebut);
      let endDate = this.createDateForSport(item.date, item.hfin);
      let newSportItem = new SportItem(item.sport, item.sexe, item.lieu, item.salle, item.jour, startDate,
                      hidden, favorite, endDate , item.type, item.online, item.remarque, item.active, item.guid);

      this.sports.push(newSportItem);
    }
  }

  private createDateForSport(str : string, hour: string):Date{
    
      let timeSplit = hour.split(":");
      //let dateTimeSplit = str.split(" ");
      let dateSplit = str.split("/");
      let year = parseInt(dateSplit[2]);
      let month = parseInt(dateSplit[1])-1;
      let day = parseInt(dateSplit[0]);
      let hours = parseInt(timeSplit[0]);
      let minutes = parseInt(timeSplit[1]);
      return new Date(year, month, day, hours, minutes);
  }

  public filterItems(myList, searchTerm){

    return myList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

}