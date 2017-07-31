/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

import { Component, ViewChild } from '@angular/core';
import { App, AlertController, ItemSliding, List, NavController, ModalController, NavParams, ToastController } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { Calendar } from '@ionic-native/calendar';
import { Http, Response } from '@angular/http';
import { FormControl } from '@angular/forms';
import { DetailsPage } from '../campus-events-details/details';
import { CampusEventsFilterPage } from '../campus-events-filter/campus-events-filter';
import { UserData } from '../../providers/user-data';
import { EventsService } from '../../providers/events-service';
import { EventItem } from '../../app/entity/eventItem';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'campus-events',
  templateUrl: 'campus-events.html'
})
export class CampusEventsPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('eventsList', { read: List }) eventsList: List;

  events: any = [];
  searching: any = false;
  segment = 'all';
  shownEvents = 0;
  title: any;
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any;
  excludedFilters : any = [];
  displayedEvents : any = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();

  constructor(
    public alertCtrl: AlertController,
    public app:App,
    private nav: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private eventsService: EventsService,
    public user: UserData,
    public toastCtrl: ToastController,
    private device: Device,
    private calendar: Calendar,
    private appAvailability: AppAvailability,
    private iab: InAppBrowser
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle('Events');
    this.updateDateLimit();
    this.loadEvents();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.updateDisplayedEvents();
    });
  }

  public onSearchInput(){
    this.searching = true;
  }

  public goToEventDetail(feed: any) {
    this.nav.push(DetailsPage, { 'feed': feed });
  }

  public doRefresh(refresher) {
    this.loadEvents();
    refresher.complete();
  }

  public loadEvents() {
    this.searching = true;
    this.eventsList && this.eventsList.closeSlidingItems();
    let result: any;
    this.eventsService.getEvents(this.segment).then(
      res => {
        result = res;
        this.events = result.events;
        this.shownEvents = result.shownEvents;
        this.filters = result.categories;
        this.searching = false;
        this.updateDisplayedEvents();
    });
  }

  public updateDisplayedEvents() {
    this.searching = true;
    this.eventsList && this.eventsList.closeSlidingItems();

    if (this.segment === 'all') {
      this.displayedEvents = this.events.filter((item) => {
        return ( this.excludedFilters.indexOf(item.category) < 0 ) && (item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
            && (Math.floor(item.startDate.getTime()/86400000) <= Math.floor(this.dateLimit.getTime()/86400000));
      });
    } else if (this.segment === 'favorites') {
      let favEvents = [];

      this.events.filter((item) => {
        if(item.favorite || this.user.hasFavorite(item.guid)) {
          if(item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
            favEvents.push(item);
          }
        }
      });

      this.displayedEvents = favEvents;
    }
    this.shownEvents = this.displayedEvents.length;
    this.searching = false;

  }


  presentFilter() {
    let modal = this.modalCtrl.create(CampusEventsFilterPage,
                  { excludedFilters : this.excludedFilters, filters : this.filters, dateRange : this.dateRange});
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        let tmpRange = data.pop();
        if(tmpRange !== this.dateRange) {
          this.dateRange = tmpRange;
          this.updateDateLimit();
        }
        this.excludedFilters = data.pop();
        this.updateDisplayedEvents();
      }
    });

  }

  private updateDateLimit(){
    let today = new Date();
    this.dateLimit = new Date(today.getFullYear(), today.getMonth()+this.dateRange, today.getUTCDate()+1);
  }

  public createEvent(slidingItem: ItemSliding, itemData: any):void{

    let options:any = {
      firstReminderMinutes:5
    };

    this.calendar.createEventWithOptions(itemData.title, itemData.location, null, itemData.startDate, itemData.endDate, options).then(() => {
      let toast = this.toastCtrl.create({
        message: 'Event Created',
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    });
  }

  addFavorite(slidingItem: ItemSliding, itemData: any) {

    if (this.user.hasFavorite(itemData.guid)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, itemData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(itemData.guid);

      let toast = this.toastCtrl.create({
        message: 'Favorite added',
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }

  }

  removeFavorite(slidingItem: ItemSliding, itemData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this event from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(itemData.guid);
            this.updateDisplayedEvents();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
    let app: string;
    let storeUrl:string;

    if (this.device.platform === 'iOS') {
      app = iosSchemaName;
      storeUrl=httpUrl;
    } else if (this.device.platform === 'Android') {
      app = androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      let browser = this.iab.create(httpUrl, '_system');
      return;
    }

    this.appAvailability.check(app).then(
      () => { // success callback
        let browser = this.iab.create(appUrl, '_system');
      },
      () => { // error callback
        let browser = this.iab.create(storeUrl, '_system');
      }
    );
  }

  openGuindaille(){
    this.launchExternalApp('','com.us.guindaille', 'fb504565829719289://', 'https://app.commuty.net/sign-in');
  }

}
