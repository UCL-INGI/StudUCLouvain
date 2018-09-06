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
  nbCallsT = 0;

  callLimit=10;

  url = ""; //students
  urlT = ""; //equipe universitaire

  constructor(private http: HttpClient, public user:UserService, public rssService : RssService) {

  }

  /*Parse the xml to json*/
  convertXmlToJson(xml) : any{
    let parser : any = new X2JS();
    let json = parser.xml2js(xml);
    return json;
  }

  /*Get the good URL in function of the user's campus*/
  update(){
    //reset url
    this.url = "https://uclsport.uclouvain.be/smartrss.php?-public=etu&-startdate=";
    this.urlT = "https://uclsport.uclouvain.be/smartrss.php?-public=equip&-startdate="

    // first day of the week : today
    let today:Date = new Date();

    //last day of the week : today +7
    let end:Date = new Date();
    end.setDate(today.getDate() +7);

    //convert date to string : dd-mm-yyyy
    let stringDate = today.toLocaleDateString();
    let re = /\//g;
    let todayString = stringDate.replace(re,'-');
    //invert month and day
    let day = todayString.substr(0,2);
    let month = todayString.substr(3,2);
    let year = todayString.substr(6,4);
    todayString=  month+'-'+day+'-'+year;


    stringDate=end.toLocaleDateString();
    let endString= stringDate.replace(re,'-');
    day = endString.substr(0,2);
    month = endString.substr(3,2);
    year = endString.substr(6,4);
    endString = month+'-'+day+'-'+year;

    //which campus ?
    let site:string;
    let campus = this.user.campus;
    if(campus == "LLN") site = 'louv';
    if(campus == "Woluwe") site = 'wol';
    if(campus == "Mons") site = 'mons';

    //final URL
    let restUrl = /*todayString*/"10-10-2018" + "&-enddate=" + "10-12-2018"/*endString*/ + "&-site=" ;
    let urlTemp = this.url + restUrl + site;
    let urlTempT = this.urlT + restUrl + 'louv';
    this.url = urlTemp;
    this.urlT = urlTempT;

  }

  /*Get sports for the URL specific to the campus of the user*/
  public getSports(segment:string) {
    this.update();
    this.sports = [];
    return new Promise( (resolve, reject) => {
      
      this.http.get(this.url, {responseType: 'text'}).timeout(5000)
      .map(data => {return this.convertXmlToJson(data);}).subscribe( result => {
          this.nbCalls++;
          if (result == null) {
            if(this.nbCalls >= this.callLimit) {
              this.nbCalls = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCalls = 0;
            this.extractSports(result.xml.item,true);

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
      this.http.get(this.urlT, {responseType: 'text'}).timeout(5000)
      .map(data => {return this.convertXmlToJson(data);}).subscribe( result => {
          this.nbCallsT++;
          if (result == null) {
            if(this.nbCallsT >= this.callLimit) {
              this.nbCallsT = 0;
              reject(2); //2 = data.query.results == null  & callLimit reached, no sports to display
            }
            reject(1); //1 = data.query.results == null, YQL req timed out, retry rssService
          } else {
            this.nbCallsT = 0;
            this.extractSports(result.xml.item,false);

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
      if (item.activite) {
        if(isSport){
          if (this.allCategories.indexOf(item.activite) < 0) {
            this.allCategories.push(item.activite);
          }
          this.allCategories.sort();
        }
        else{
          if (this.allCategoriesT.indexOf(item.activite) < 0) {
            this.allCategoriesT.push(item.activite);
          }
          this.allCategoriesT.sort();
        }
      }
      if(isSport) this.shownSports++;
      else this.shownTeams++;
      let startDate = this.createDateForSport(item.date, item.hdebut);
      let endDate = this.createDateForSport(item.date, item.hfin);
      let newSportItem = new SportItem(item.activite, item.genre, item.lieu, item.salle, item.jour, startDate,
                      hidden, favorite, endDate , item.type, item.online, item.remarque, item.active, item.activite.concat(item.date.toString()));


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
