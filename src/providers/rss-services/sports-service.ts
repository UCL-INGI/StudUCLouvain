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

import { Injectable } from '@angular/core';

import { SportItem } from '../../app/entity/sportItem';
import { UserService } from '../utils-services/user-service';
import { RssService } from './rss-service';

@Injectable()
export class SportsService {
  sports: Array<SportItem> = [];
  teams: Array<SportItem> = [];
  allCategories: any = [];
  allCategoriesT: any = [];
  shownSports = 0;
  shownTeams = 0;

  url = ''; // students
  urlT = ''; // equipe universitaire

  constructor(public user: UserService, public rssService: RssService) {

  }

  /*Get the good URL in function of the user's campus*/
  update() {
    // reset url
    this.url = 'https://uclsport.uclouvain.be/smartrss.php?-public=etu&-startdate=';
    this.urlT = 'https://uclsport.uclouvain.be/smartrss.php?-public=equip&-startdate=';

    // first day of the week : today
    const today: Date = new Date();

    // last day of the week : today +6
    const end: Date = new Date();
    end.setDate(today.getDate() + 6);

    // invert date
    const todayString = dateToString(today);
    const endString = dateToString(end);

    // which campus ?
    let site: string;
    const campus = this.user.campus;
    if (campus === 'LLN') { site = 'louv'; }
    if (campus === 'Woluwe') { site = 'wol'; }
    if (campus === 'Mons') { site = 'mons'; }

    // final URL
    const restUrl = todayString + '&-enddate=' + endString + '&-site=';
    const urlTemp = this.url + restUrl + site;
    const urlTempT = this.urlT + restUrl + 'louv';
    this.url = urlTemp;
    this.urlT = urlTempT;

    function dateToString(date) {
      return date.toISOString().split('T')[0];
    }
  }


  /*Get sports for the URL specific to the campus of the user*/
  public getSports(segment: string) {
    this.update();
    this.sports = [];
    return this.rssService.load(this.url, true).then(result => {
      this.extractSports(result);
      return {
        sports: this.sports,
        showSports: this.shownSports
      };
    }).catch(error => {
      if (error === 1) {
        return this.getSports(segment);
      } else {
        if (error === 2) {
          console.log('Loading sports : GET req timed out > limit, suppose no sports to be displayed');
        } else {
          console.log('Error loading sports : ' + error);
        }
        return {
          sports: [],
          shownSports: 0
        };
      }
    });
  }

  /*Get sports for the university teams*/
  public getTeams(segment: string) {
    this.teams = [];
    return this.rssService.load(this.urlT, true).then(result => {
      this.extractSports(result, false);
      return {
        teams: this.teams,
        shownTeams: this.shownTeams
      };
    })
      .catch(error => {
        if (error === 1) {
          return this.getTeams(segment);
        } else {
          if (error === 2) {
            console.log('Loading teams : GET req timed out > limit, suppose no teams to be displayed');
          } else {
            console.log('Error loading teams : ' + error);
          }
          return {
            teams: [],
            shownTeams: 0
          };
        }
      });
  }

  /*Extract sports with all the details*/
  private extractSports(data: any, isSport: boolean = true) {
    if (data === undefined) {
      console.log('Error sports data undefined!!!');
      return;
    }
    if (data.length === undefined) {
      const temp = data;
      data = [];
      data.push(temp);
    }
    this.shownSports = 0;
    this.shownTeams = 0;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let favorite = false;
      const hidden = false;

      if (this.user.hasFavorite(item.guid)) {
        favorite = true;
      }
      if (item.activite) {
        if (isSport) {
          if (this.allCategories.indexOf(item.activite) < 0) {
            this.allCategories.push(item.activite);
          }
          this.allCategories.sort();
        } else {
          if (this.allCategoriesT.indexOf(item.activite) < 0) {
            this.allCategoriesT.push(item.activite);
          }
          this.allCategoriesT.sort();
        }
      }
      if (isSport) { this.shownSports++; } else { this.shownTeams++; }
      const startDate = this.createDateForSport(item.date, item.hdebut);
      const endDate = this.createDateForSport(item.date, item.hfin);
      const jour = item.jour[1].toUpperCase() + item.jour.substr(2);
      const newSportItem = new SportItem(item.activite, item.genre, item.lieu, item.salle, jour, startDate,
        hidden, favorite, endDate, item.type, item.online, item.remarque, item.active, item.activite.concat(item.date.toString()));


      if (isSport) { this.sports.push(newSportItem); } else { this.teams.push(newSportItem); }
    }
  }

  /*Return a date in good form by splitting for the sport*/
  private createDateForSport(str: string, hour: string): Date {
    const timeSplit = hour.split(':');
    const dateSplit = str.split('/');
    const year = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]) - 1;
    const day = parseInt(dateSplit[0]);
    const hours = parseInt(timeSplit[0]);
    const minutes = parseInt(timeSplit[1]);
    return new Date(year, month, day, hours, minutes);
  }

  /*Return the items of filter*/
  public filterItems(myList, searchTerm) {
    return myList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

}
