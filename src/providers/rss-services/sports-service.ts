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
import xml2js from 'xml2js';

@Injectable()
export class SportsService {
  sports: Array<SportItem> = [];
  allCategories: any = [];
  shownSports = 0;
  nbCalls = 0;
  callLimit = 30;

  url = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/recordrss.php";

  constructor(private http: Http, public user:UserService, public rssService : RssService) {}

  public getSports(segment:string) {
    this.sports = [];
    return new Promise( (resolve, reject) => {
      this.http.get(this.url).map(data => {return data.text();}).subscribe( data => {
        let result = this.parseXML(data);
          this.nbCalls++;
          if (result == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(result);
            
            resolve({sports : this.sports, shownSports: this.shownSports, categories: this.allCategories});
          }
        },
        err => {
          reject(err);
        });
    });
  }
  parseXML(data)
   {
         var k,
             arr : Array<Object> = [],
             parser = new xml2js.Parser(
             {
                trim: true,
                explicitArray: true
             });

         parser.parseString(data, function (err, result) 
         {
            var obj = result.xml;
            for(k in obj.item)
            {
               var item = obj.item[k];
               arr.push({  
                  sport           : item.sport[0],
                  sexe        : item.sexe[0],
                  lieu : item.lieu[0],
                  salle        : item.salle[0],
                  jour : item.jour[0],
                  date : item.date[0],
                  hdebut : item.hdebut[0],
                  hfin : item.hfin[0],
                  type : item.type[0],
                  online : item.online[0],
                  remarque : item.remarque[0],
                  active : item.active[0]
               });
            }
         });
         return arr;
   }

  private extractSports(data: any) {
    let maxDescLength = 20;
    if(data === undefined){
      console.log("Error sports data undefined!!!")
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
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
      let dateTimeSplit = str.split(" ");
      let dateSplit = dateTimeSplit[0].split("/");
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
