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

import { Component, ViewChild } from '@angular/core';
import { App, AlertController, ItemSliding, List, NavController,
  ModalController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { FormControl } from '@angular/forms';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/debounceTime';

import { UserService } from '../../providers/utils-services/user-service';
import { EventsService } from '../../providers/rss-services/events-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';

import { EventItem } from '../../app/entity/eventItem';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  //TODO : Change details to use EventItem and change EventsDetailsPage to EventDetailsPage
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('eventsList', { read: List }) eventsList: List;

  events: Array<EventItem> = [];
  searching: any = false;
  segment = 'all';
  shownEvents = 0;
  title: any;
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any = [];
  excludedFilters : any = [];
  displayedEvents : Array<EventItem> = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();
  loading;
  shownGroup = null;

  now = new Date();
  year = this.now.getFullYear();
  noevents:any =false;
  displayedEventsD : any = [];

  weekUCL = 5;

  constructor(
    public alertCtrl: AlertController,
    public app:App,
    private navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private eventsService: EventsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService : ConnectivityService,
    private translateService: TranslateService,
    private loadingCtrl: LoadingController
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    if(this.connService.isOnline()) {
      this.loadEvents();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.updateDisplayedEvents();
      });
      this.presentLoading();
    }
    else{
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  public doRefresh(refresher) {
    this.loadEvents();
    refresher.complete();
  }

  presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();
    }
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  public onSearchInput(){
    this.searching = true;
  }

  public goToEventDetail(event: EventItem) {
    this.navCtrl.push('EventsDetailsPage', { 'event': event });
  }

  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  isGroupShown(group) {
      return this.shownGroup === group;
  }

  public loadEvents() {
    this.searching = true;
    this.eventsList && this.eventsList.closeSlidingItems();
    let result: any;

    if(this.connService.isOnline()) {
      this.eventsService.getEvents(this.segment).then(
        res => {
          result = res;
          this.events = result.events;
          this.shownEvents = result.shownEvents;
          this.filters = result.categories;
          this.searching = false;
          this.updateDisplayedEvents();
      })
      .catch(error => {
        if(error == 1) {
          this.loadEvents();
        } else {
          if(error == 2) {
            console.log("Loading events : YQL req timed out > limit, suppose no events to be displayed");
          } else {
            console.log("Error loading events : " + error);
          }
          this.searching = false;
          this.noevents = true;
          this.updateDisplayedEvents();
        }
      });

    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

   //Make an array with events sorted by week
   changeArray(array, weekUCL){
    var groups = array.reduce(function(obj,item){
      var date = new Date(item.startDate.getTime());
      date.setHours(0,0,0,0);
      date.setDate(date.getDate() + 3 - (date.getDay() +6) %7);
      var temp = new Date(date.getFullYear(),0,4);
      var week = 1 + Math.round(((date.getTime() - temp.getTime()) /86400000 -3 + (temp.getDay() +6) %7)/7) - weekUCL;
      obj[week] = obj[week] || [];
      obj[week].push(item);
      return obj;
    }, {});
    var eventsD = Object.keys(groups).map(function(key){
      return {weeks: key, event: groups[key]};
    });
    return eventsD;
  }

  // Returns the ISO week of the date.
  getWeek(d:Date) {
    var date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  //Return first day of the week and last day of the week (to display range)
  getRangeWeek(week,year){
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    d1 = new Date(''+year+'');
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + (7 * (week - this.getWeek(d1))));
    rangeIsFrom = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear();
    d1.setDate(d1.getDate() + 6);
    rangeIsTo = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear() ;
    return {from:rangeIsFrom, to:rangeIsTo};
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
    this.displayedEventsD = this.changeArray(this.displayedEvents,this.weekUCL);
    console.log(this.displayedEventsD);
    this.dismissLoading();


  }

  presentFilter() {
    if(this.filters === undefined){
      this.filters = [];
    }

    let modal = this.modalCtrl.create('EventsFilterPage',
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
    let message:string;
    this.translateService.get('EVENTS.MESSAGE').subscribe((res:string) => {message=res;});

    this.calendar.createEventWithOptions(itemData.title, itemData.location,
      null, itemData.startDate, itemData.endDate, options).then(() => {
        let toast = this.toastCtrl.create({
          message:  message,
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
      let message:string;
      this.translateService.get('EVENTS.MESSAGEFAV').subscribe((res:string) => {message=res;});
      this.removeFavorite(slidingItem, itemData, message);
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(itemData.guid);
      let message:string;
      this.translateService.get('EVENTS.MESSAGEFAV2').subscribe((res:string) => {message=res;});
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }

  }

  removeFavorite(slidingItem: ItemSliding, itemData: any, title: string) {
    let message:string;
    let cancel:string;
    let delet:string;
    this.translateService.get('EVENTS.MESSAGEFAV3').subscribe((res:string) => {message=res;});
    this.translateService.get('EVENTS.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('EVENTS.DEL').subscribe((res:string) => {delet=res;});
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancel,
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: delet,
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

}
