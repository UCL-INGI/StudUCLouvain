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

import {Injectable} from '@angular/core';

import {SportItem} from '../../app/entity/sportItem';
import {UserService} from '../utils-services/user-service';
import {RssService} from './rss-service';

@Injectable()
export class SportsService {
  sports: Array<SportItem> = [];
  teams: Array<SportItem> = [];
  allCategories: any = [];
  allCategoriesT: any = [];
  shownSports = 0;
  shownTeams = 0;
  url = '';
  urlT = '';

  constructor(public user: UserService, public rssService: RssService) {}

  update() {
    this.url = 'https://uclsport.uclouvain.be/smartrss.php?-public=etu&-startdate=';
    this.urlT = 'https://uclsport.uclouvain.be/smartrss.php?-public=equip&-startdate=';

    const today: Date = new Date();
    const end: Date = new Date(new Date().setDate(today.getDate() + 6));
    const todayString = dateToString(today);
    const endString = dateToString(end);

    const site = {
      'LLN': 'louv',
      'Woluwe': 'wol',
      'Mons': 'mons',
      undefined: ''
    }[this.user.campus];

    const restUrl = todayString + '&-enddate=' + endString + '&-site=';
    this.url = this.url + restUrl + site;
    this.urlT = this.urlT + restUrl + 'louv';

    function dateToString(date) {
      return date.toISOString().split('T')[0];
    }
  }


  public getSports(segment: string, isSport: boolean) {
    this.update();
    isSport ? this.sports = [] : this.teams = [];
    isSport ? this.shownSports = 0 : this.shownTeams = 0;
    return this.rssService.load(isSport ? this.url : this.urlT, true).then(result => {
      if (result === undefined) {
        console.log('Error Sports/Teams data undefined!!!');
        return;
      }
      this.extractSports(result, isSport);
      return this.getAdaptedResult(isSport);
    }).catch(error => {
      if (error === 1) {
        return this.getSports(segment, isSport);
      } else if (error === 2) {
        console.log('Loading sports/teams : GET req timed out > limit, suppose no sports/teams to be displayed');
      } else {
        console.log('Error loading sports/teams : ' + error);
      }
      return this.getAdaptedResult(isSport);
    });
  }

  private getAdaptedResult(isSport: boolean) {
    return isSport ? {
      sports: this.sports,
      shownSports: this.shownSports,
      categories: this.allCategories
    } : {
      teams: this.teams,
      shownTeams: this.shownTeams,
      categories: this.allCategoriesT
    };
  }

  private extractSports(data: any, isSport: boolean = true) {
    if (data.length === undefined) {
      data = [data];
    }
    this.shownSports = 0;
    this.shownTeams = 0;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const favorite = this.user.hasFavorite(item.guid);
      if (item.activite) {
        const cats = isSport ? this.allCategories : this.allCategoriesT;
        if (cats.indexOf(item.activite) < 0) {
          cats.push(item.activite);
        }
        cats.sort();
        isSport ? this.allCategories = cats : this.allCategoriesT = cats;
      }
      isSport ? this.shownSports++ : this.shownTeams++;
      const startDate = this.createDateForSport(item.date, item.hdebut);
      const endDate = this.createDateForSport(item.date, item.hfin);
      const jour = item.jour[1].toUpperCase() + item.jour.substr(2);
      const newSportItem = new SportItem(item.activite, item.genre, item.lieu, item.salle, jour, startDate,
        false, favorite, endDate, item.type, item.online, item.remarque, item.active, item.activite.concat(item.date.toString()));
      isSport ? this.sports.push(newSportItem) : this.teams.push(newSportItem);
    }
  }

  private createDateForSport(str: string, hour: string): Date {
    const timeSplit = hour.split(':');
    const dateSplit = str.split('/');
    return this.rssService.createDate(dateSplit, timeSplit);
  }
}
