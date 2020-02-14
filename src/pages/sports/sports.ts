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

import 'rxjs/add/operator/debounceTime';

import {
    AlertController, App, IonicPage, ItemSliding, List, ModalController, NavController, NavParams,
    ToastController
} from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { TranslateService } from '@ngx-translate/core';

import { SportItem } from '../../app/entity/sportItem';
import { SportsService } from '../../providers/rss-services/sports-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';

@IonicPage()
@Component({
  selector: 'page-sports',
  templateUrl: 'sports.html'
})
export class SportsPage {
  @ViewChild('sportsList', { read: List }) sportsList: List;

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

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private sportsService: SportsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService: ConnectivityService,
    private translateService: TranslateService,
    public navCtrl: NavController,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    if (this.connService.isOnline()) {
      this.utilsService.presentLoading();
      this.loadSports();
      this.searchControl.valueChanges.debounceTime(700).subscribe(() => {
        this.searching = false;
        this.updateDisplayedSports();
      });
    } else {
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  public doRefresh(refresher) {
    this.loadSports();
    refresher.complete();
  }

  public onSearchInput() {
    this.searching = true;
  }

  public loadSports() {
    this.searching = true;
    if (this.sportsList) {
      this.sportsList.closeSlidingItems();
    }
    this.campus = this.user.campus;
    if (this.connService.isOnline()) {
      this.sportsService.getSports(this.segment).then(result => {
        this.sports = result.sports;
        this.shownSports = result.shownSports;
        this.filters = result.categories;
        this.nosport = this.sports.length === 0;
      });
      this.sportsService.getTeams(this.segment).then(result => {
        this.teams = result.teams;
        this.shownTeams = result.shownTeams;
        this.filtersT = result.categoriesT;
        this.noteams = this.teams.length === 0;
      });
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
      return { jour: key, name: groups[key] };
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
    }
    if (this.segment === 'team') {
      cat = this.filtersT;
      exclude = this.excludedFiltersT;
    }
    const modal = this.modalCtrl.create('SportsFilterPage', {
      excludedFilters: exclude,
      filters: cat,
      dateRange: this.dateRange
    });
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        const tmpRange = data.pop();
        if (tmpRange !== this.dateRange) {
          this.dateRange = tmpRange;
          this.updateDateLimit();
        }
        const newExclude = data.pop();
        if (this.segment === 'all') { this.excludedFilters = newExclude; }
        if (this.segment === 'team') { this.excludedFiltersT = newExclude; }
        this.updateDisplayedSports();
      }
    });
  }

  private updateDateLimit() {
    const today = new Date();
    this.dateLimit = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getUTCDate() + this.dateRange
    );
  }

  addToCalendar(slidingItem: ItemSliding, itemData: SportItem) {
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
      .then(() => {
        const toast = this.toastCtrl.create({
          message: 'Sport créé',
          duration: 3000
        });
        toast.present();
        slidingItem.close();
      });
  }

  addFavorite(slidingItem: ItemSliding, itemData: SportItem) {
    if (this.user.hasFavoriteS(itemData.guid)) {
      let message: string;
      this.translateService
        .get('SPORTS.MESSAGEFAV')
        .subscribe((res: string) => {
          message = res;
        });
      this.removeFavorite(slidingItem, itemData, message);
    } else {
      this.user.addFavoriteS(itemData.guid);
      this.utilsService.hasNotFavorite(slidingItem);
    }
  }

  removeFavorite(slidingItem: ItemSliding, itemData: SportItem, title: string) {
    const alert = this.utilsService.removeFavorite(slidingItem, itemData, title);
    this.updateDisplayedSports();
    alert.present();
  }
}
