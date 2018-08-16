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
  teams: Array<SportItem> = [];
  allCategories: any = [];
  allCategoriesT: any = [];
  shownSports = 0;
  shownTeams = 0;
  nbCalls = 0;

  callLimit=30;

  url = "";
  url1 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t1"; //LLN
  url2 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t3"; //woluwe
  url3 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t5"; //mons
  url4 = "http://ucl-fms01.sipr.ucl.ac.be:82/ucl_sport/rsssport.php?-action=t7"; //equipe universitaire

  constructor(private http: Http, public user:UserService, public rssService : RssService) {

  }

  /*Parse the xml to json*/
  convertXmlToJson(xml) : any{
    let parser : any = new X2JS();
    let json = parser.xml2js(xml);
    return json;
  }

  /*Get the good URL in function of the user's campus*/
  update(){
    let campus = this.user.campus;
    if(campus == "LLN") this.url = this.url1;
    if(campus == "Woluwe") this.url = this.url2;
    if(campus == "Mons") this.url = this.url3;
  }

  /*Get sports for the URL specific to the campus of the user*/
  public getSports(segment:string) {
    this.update();
    this.sports = [];
    return new Promise( (resolve, reject) => {
      this.http.get(this.url).timeout(5000)
      .map(data => {return this.convertXmlToJson(data.text());}).subscribe( result => {
          this.nbCalls++;
          if (result == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(result.rss.channel.item,true);

            resolve({sports : this.sports, shownSports: this.shownSports, categories: this.allCategories});
          }
        },
        err => {
          reject(err);
        });
    });
  }

  /*Get sports for the university teams*/
  public getTeams(segment:string) {
    this.teams = [];
    return new Promise( (resolve, reject) => {
      this.http.get(this.url4).timeout(5000)
      map(data => {return this.convertXmlToJson(data.text());}).subscribe( result => {
          this.nbCalls++;
          if (result == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(result.rss.channel.item,false);

            resolve({teams : this.teams, shownTeams: this.shownTeams, categoriesT: this.allCategoriesT});
          }
        },
        err => {
          reject(err);
        });
    });
  }

  /*Extract sports with all the details*/
  private extractSports(data: any, isSport:boolean) {
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
        if(isSport){
          if (this.allCategories.indexOf(item.sport) < 0) {
            this.allCategories.push(item.sport);
          }
          this.allCategories.sort();
        }
        else{
          if (this.allCategoriesT.indexOf(item.sport) < 0) {
            this.allCategoriesT.push(item.sport);
          }
          this.allCategoriesT.sort();
        }
      }
      if(isSport) this.shownSports++;
      else this.shownTeams++;

      let startDate = this.createDateForSport(item.date, item.hdebut);
      let endDate = this.createDateForSport(item.date, item.hfin);
      let newSportItem = new SportItem(item.sport, item.sexe, item.lieu, item.salle, item.jour, startDate,
                      hidden, favorite, endDate , item.type, item.online, item.remarque, item.active, item.sport.concat(item.date.toString()));


      if(isSport) this.sports.push(newSportItem);
      else this.teams.push(newSportItem);
    }
  }

  /*Return a date in good form by splitting for the sport*/
  private createDateForSport(str : string, hour: string):Date{
      let timeSplit = hour.split(":");
      let dateSplit = str.split("/");
      let year = parseInt(dateSplit[2]);
      let month = parseInt(dateSplit[1])-1;
      let day = parseInt(dateSplit[0]);
      let hours = parseInt(timeSplit[0]);
      let minutes = parseInt(timeSplit[1]);
      return new Date(year, month, day, hours, minutes);
  }

  /*Return the items of filter*/
  public filterItems(myList, searchTerm){
    return myList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

}
