/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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


import { debounceTime } from 'rxjs/operators';


import { IonList, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar/ngx';

import { SportItem } from '../../app/entity/sportItem';
import { SportsService } from '../../providers/rss-services/sports-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';
import { SettingsProvider } from "../../providers/utils-services/settings-service";
import { SportsFilterPage } from "./sports-filter/sports-filter";

@Component({
  selector: 'page-sports',
  templateUrl: 'sports.html'
})
export class SportsPage {
  @ViewChild('sportsList', {read: IonList, static: false}) sportsList: IonList;

  sports: Array<SportItem> = [];
  teams: Array<SportItem> = [];
  searching: any = false;
  segment = 'all';
  shownSports = 0;
  shownTeams = 0;
  title: any;
  searchTerm = '';
  searchControl: FormControl;
  filters: any = [];
  filtersT: any = [];
  excludedFilters: any = [];
  excludedFiltersT: any = [];
  displayedSports: Array<SportItem> = [];
  displayedSportsD: any = [];
  dateRange: any = 7;
  dateLimit: Date = new Date();
  campus: string;
  nosport: any = false;
  noteams: any = false;
  selectedTheme: string;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private sportsService: SportsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService: ConnectivityService,
    public navCtrl: NavController,
    private utilsService: UtilsService,
    private settings: SettingsProvider
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewDidLoad() {
    this.updateDateLimit();
    this.utilsService.presentLoading();
    this.loadSports();
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.searching = false;
      this.updateDisplayedSports();
    });
  }

  public doRefresh(refresher) {
    this.loadSports();
    refresher.complete();
  }

  public onSearchInput() {
    this.searching = true;
  }

  public async loadSports() {
    this.searching = true;
    if (this.sportsList) {
      this.sportsList.closeSlidingItems();
    }
    this.campus = this.user.campus;
    if (this.connService.isOnline()) {
      await this.getDatas(true);
      await this.getDatas(false);
      this.searching = false;
      this.updateDisplayedSports();
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  public changeArray(array) {
    const groups = array.reduce(function (obj, item) {
      obj[item.jour] = obj[item.jour] || [];
      obj[item.jour].push(item);
      return obj;
    }, {});
    const sportsD = Object.keys(groups).map(function (key) {
      return {jour: key, name: groups[key]};
    });
    return sportsD;
  }

  public updateDisplayedSports() {
    this.searching = true;
    if (this.sportsList) {
      this.sportsList.closeSlidingItems();
    }
    if (this.segment === 'all') {
      this.filterDisplayedSports(this.sports);
    } else if (this.segment === 'favorites') {
      const favSports = [];
      this.sports.forEach(item => {
        if (item.favorite || this.user.hasFavoriteS(item.guid)) {
          if (
            item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          ) {
            favSports.push(item);
          }
        }
      });
      this.displayedSports = favSports;
    } else if (this.segment === 'team') {
      this.filterDisplayedSports(this.teams);
    }
    this.shownSports = this.displayedSports.length;
    this.searching = false;
    this.displayedSportsD = this.changeArray(this.displayedSports);
    this.utilsService.dismissLoading();
  }

  presentFilter() {
    if (this.filters === undefined) {
      this.filters = [];
    }
    if (this.filtersT === undefined) {
      this.filtersT = [];
    }
    let cat;
    let exclude;
    if (this.segment === 'all') {
      cat = this.filters;
      exclude = this.excludedFilters;
    } else if (this.segment === 'team') {
      cat = this.filtersT;
      exclude = this.excludedFiltersT;
    }
    this.modalFilter(exclude, cat);
  }

  addToCalendar(itemData: SportItem) {
    const options: any = {
      firstReminderMinutes: 30
    };

    this.calendar
      .createEventWithOptions(
        itemData.sport,
        itemData.lieu,
        itemData.salle,
        itemData.date,
        itemData.hfin,
        options
      )
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: 'Sport créé',
          duration: 3000
        });
        this.sportsList.closeSlidingItems();
        return await toast.present();
      });
  }

  removeFavorite(itemData: SportItem, title: string) {
    this.utilsService.removeFavorite(this.sportsList, itemData, title, true);
    this.updateDisplayedSports();
  }

  private getDatas(isSport: boolean) {
    return this.sportsService.getSports(this.segment, isSport).then(result => {
      isSport ? this.sports = result.sports : this.teams = result.teams;
      isSport ? this.shownSports = result.shownSports : this.shownTeams = result.shownTeams;
      isSport ? this.filters = result.categories : this.filtersT = result.categoriesT;
      isSport ? this.nosport = this.sports.length === 0 : this.noteams = this.teams.length === 0;
    });
  }

  private filterDisplayedSports(items: Array<SportItem>) {
    this.displayedSports = items.filter(item => {
      return (
        this.excludedFilters.indexOf(item.sport) < 0 &&
        item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 &&
        Math.floor(item.date.getTime() / 86400000) <=
        Math.floor(this.dateLimit.getTime() / 86400000)
      );
    });
  }

  private async modalFilter(exclude: any, cat: any) {
    const modal = await this.modalCtrl.create({
      component: SportsFilterPage,
      componentProps: {
        excludedFilters: exclude,
        filters: cat,
        dateRange: this.dateRange,
      },
      cssClass: this.selectedTheme
    });
    await modal.onWillDismiss().then((data) => {
      if (data) {
        if (data[1] !== this.dateRange) {
          this.dateRange = data[1];
          this.updateDateLimit();
        }
        if (this.segment === 'all') {
          this.excludedFilters = data[0];
        } else if (this.segment === 'team') {
          this.excludedFiltersT = data[0];
        }
        this.updateDisplayedSports();
      }
    });
    return await modal.present();
  }

  private updateDateLimit() {
    const today = new Date();
    this.dateLimit = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getUTCDate() + this.dateRange
    );
  }
}
