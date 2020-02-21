/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire, Corentin Lamy, Daubry Benjamin & Marchesini Bruno
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
  AlertController,
  App,
  IonicPage,
  ItemSliding,
  List,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { CacheService } from 'ionic-cache';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { TranslateService } from '@ngx-translate/core';

import { EventItem } from '../../app/entity/eventItem';
import { EventsService } from '../../providers/rss-services/events-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  @ViewChild('eventsList', {read: List}) eventsList: List;

  events: Array<EventItem> = [];
  searching: any = false;
  segment = 'all';
  shownEvents = 0;
  title: any;
  searchTerm = '';
  searchControl: FormControl;
  filters: any = [];
  excludedFilters: any = [];
  displayedEvents: Array<EventItem> = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();

  now = new Date();
  year = this.now.getFullYear();
  noevents: any = false;
  displayedEventsD: any = [];

  constructor(
    public alertCtrl: AlertController,
    public user: UserService,
    public app: App,
    private navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private eventsService: EventsService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService: ConnectivityService,
    private translateService: TranslateService,
    private cache: CacheService,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    this.cachedOrNot();
    this.searchControl.valueChanges.debounceTime(700).subscribe(() => {
      this.searching = false;
      this.updateDisplayedEvents();
    });
  }

  public doRefresh(refresher) {
    if (this.connService.isOnline()) {
      this.cache.removeItem('cache-event');
      this.loadEvents('cache-event');
    } else {
      this.connService.presentConnectionAlert();
    }
    refresher.complete();
  }

  public goToEventDetail(event: EventItem) {
    this.navCtrl.push('EventsDetailsPage', {event: event});
  }

  async cachedOrNot() {
    // this.cache.removeItem('cache-event');
    await this.cache.getItem('cache-event').then(data => {
      this.utilsService.presentLoading();
      this.events = data.events;
      this.events.forEach(function (element) {
        element.startDate = new Date(element.startDate);
        element.endDate = new Date(element.endDate);
      });
      this.shownEvents = data.shownEvents;
      this.filters = data.categories;
      this.searching = false;
      this.updateDisplayedEvents();
    }).catch(() => {
      console.log('Oh no! My data is expired or doesn\'t exist!');
      this.loadEvents('cache-event');
    });
  }

  public loadEvents(key?) {
    this.searching = true;
    if (this.eventsList) {
      this.eventsList.closeSlidingItems();
    }
    if (this.connService.isOnline()) {
      this.utilsService.presentLoading();
      this.eventsService.getEvents(this.segment).then(result => {
        this.events = result.events;
        if (key) {
          this.cache.saveItem(key, result);
        }
        this.shownEvents = result.shownEvents;
        this.filters = result.categories;
        this.searching = false;
        this.noevents = this.events.length === 0;
        this.updateDisplayedEvents();
      });
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  getWeek(d: Date) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) / 7
      )
    );
  }

  changeArray(array: any) {
    const weekMethod = this.getWeek;
    const groups = array.reduce(function (obj, item) {
      const week = weekMethod(item.startDate);
      obj[week] = obj[week] || [];
      obj[week].push(item);
      return obj;
    }, {});
    return Object.keys(groups).map(function (key) {
      return {weeks: key, event: groups[key]};
    });
  }

  getRangeWeek(week, year) {
    const date = new Date(year);
    date.setDate(date.getDate() - date.getDay() - 1);
    date.setDate(date.getDate() + 7 * (week - this.getWeek(date)));
    const rangeIsFrom = this.getRange(date);

    date.setDate(date.getDate() + 6);
    const rangeIsTo = this.getRange(date);
    return {from: rangeIsFrom, to: rangeIsTo};
  }

  public updateDisplayedEvents() {
    this.searching = true;
    if (this.eventsList) {
      this.eventsList.closeSlidingItems();
    }
    if (this.segment === 'all') {
      this.displayedEvents = this.events.filter(item => this.getFilterMethod(item));
    } else if (this.segment === 'favorites') {
      const favEvents = [];
      this.events.forEach(item => {
        if ((item.favorite || this.user.hasFavorite(item.guid)) && item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
          favEvents.push(item);
        }
      });
      this.displayedEvents = favEvents;
    }
    this.shownEvents = this.displayedEvents.length;
    this.searching = false;
    this.displayedEventsD = this.changeArray(this.displayedEvents);
    this.utilsService.dismissLoading();
  }

  presentFilter() {
    if (this.filters === undefined) {
      this.filters = [];
    }
    const modal = this.modalCtrl.create('EventsFilterPage', {
      excludedFilters: this.excludedFilters,
      filters: this.filters,
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
        this.excludedFilters = data.pop();
        this.updateDisplayedEvents();
      }
    });
  }

  public createEvent(slidingItem: ItemSliding, itemData: any): void {
    const options: any = {
      firstReminderMinutes: 15
    };
    let message: string;
    this.translateService.get('EVENTS.MESSAGE').subscribe((res: string) => {
      message = res;
    });

    this.calendar.createEventWithOptions(
      itemData.title,
      itemData.location,
      null,
      itemData.startDate,
      itemData.endDate,
      options
    ).then(() => {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    });
  }

  removeFavorite(slidingItem: ItemSliding, itemData: any, title: string) {
    this.utilsService.removeFavorite(slidingItem, itemData, title, false);
    this.updateDisplayedEvents();
  }

  private getRange(date: Date) {
    let range = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
    return range.replace(/-/g, '/');
  }

  private getFilterMethod(item: EventItem) {
    return (this.excludedFilters.indexOf(item.category) < 0 &&
      item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 &&
      Math.floor(item.startDate.getTime() / 86400000) <= Math.floor(this.dateLimit.getTime() / 86400000));
  }

  private updateDateLimit() {
    const today = new Date();
    this.dateLimit = new Date(
      today.getFullYear(),
      today.getMonth() + this.dateRange,
      today.getUTCDate() + 1
    );
  }
}
