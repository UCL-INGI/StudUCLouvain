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

import { Component, ViewChild } from '@angular/core';
import { App, AlertController, ItemSliding, List, NavController,
  ModalController, NavParams, ToastController } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { Calendar } from '@ionic-native/calendar';
import { FormControl } from '@angular/forms';
import { SportsDetailsPage } from './sports-details/sports-details';
import { SportsFilterPage } from './sports-filter/sports-filter';
import { UserService } from '../../providers/utils-services/user-service';
import { SportsService } from '../../providers/rss-services/sports-service';
import { SportItem } from '../../app/entity/sportItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-sports',
  templateUrl: 'sports.html'
})
export class SportsPage {
  //TODO : Change details to use EventItem and change EventsDetailsPage to EventDetailsPage
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('sportsList', { read: List }) sportsList: List;

  sports: Array<SportItem> = [];
  searching: any = false;
  segment = 'all';
  shownSports = 0;
  title: any;
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any = [];
  excludedFilters : any = [];
  displayedSports : Array<SportItem> = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();

  constructor(
    public alertCtrl: AlertController,
    public app:App,
    private nav: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private sportsService: SportsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private device: Device,
    private calendar: Calendar,
    private appAvailability: AppAvailability,
    private iab: InAppBrowser,
    public connService : ConnectivityService
  ) {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    this.loadSports();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.updateDisplayedSports();
    });
  }

  public onSearchInput(){
    this.searching = true;
  }

  public goToSportDetail(sport: SportItem) {
    this.nav.push(SportsDetailsPage, { 'sport': sport });
  }

  public doRefresh(refresher) {
    this.loadSports();
    refresher.complete();
  }

  public loadSports() {
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();
    let result: any;

    if(this.connService.isOnline()) {
      this.sportsService.getSports(this.segment).then(
        res => {
          result = res;
          this.sports = result.sports;
          this.shownSports = result.shownSports;
          this.filters = result.categories;
          this.searching = false;
          this.updateDisplayedSports();
      })
      .catch(error => {
        if(error == 1) {
          //console.log("Error loading sports : " + error);
          this.loadSports();
        } else {
          if(error == 2) {
            console.log("Loading sports : YQL req timed out > limit, suppose no sports to be displayed");
          } else {
            console.log("Error loading sports : " + error);
          }
          this.searching = false;
          this.updateDisplayedSports();
        }
      });

    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }
  }

  public updateDisplayedSports() {
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();

    if (this.segment === 'all') {
      this.displayedSports = this.sports.filter((item) => {
        return ( this.excludedFilters.indexOf(item.sport) < 0 ) && (item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
            && (Math.floor(item.date.getTime()/86400000) <= Math.floor(this.dateLimit.getTime()/86400000));
      });
    } else if (this.segment === 'favorites') {
      let favSports = [];

      this.sports.filter((item) => {
        if(item.favorite || this.user.hasFavorite(item.guid)) {
          if(item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
            favSports.push(item);
          }
        }
      });

      this.displayedSports = favSports;
    }
    this.shownSports = this.displayedSports.length;
    this.searching = false;

  }


  presentFilter() {
    if(this.filters === undefined){
      this.filters = [];
    }

    let modal = this.modalCtrl.create(SportsFilterPage,
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
        this.updateDisplayedSports();
      }
    });

  }

  private updateDateLimit(){
    let today = new Date();
    this.dateLimit = new Date(today.getFullYear(), today.getMonth()+this.dateRange, today.getUTCDate()+1);
  }

  public createSport(slidingItem: ItemSliding, itemData: any):void{

    let options:any = {
      firstReminderMinutes:5
    };

    this.calendar.createEventWithOptions(itemData.title, itemData.location,
      null, itemData.startDate, itemData.endDate, options).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Sport créé',
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
      this.removeFavorite(slidingItem, itemData, 'Favoris déjà ajouté');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(itemData.guid);

      let toast = this.toastCtrl.create({
        message: 'Ajouté aux favoris',
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }

  }

  removeFavorite(slidingItem: ItemSliding, itemData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Souhaitez vous retirer ce sport des favoris ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(itemData.guid);
            this.updateDisplayedSports();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  /*launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
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
  }*/

}
