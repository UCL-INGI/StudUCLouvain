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
  ModalController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { Calendar } from '@ionic-native/calendar';
import { FormControl } from '@angular/forms';
import { SportsFilterPage } from './sports-filter/sports-filter';
import { UserService } from '../../providers/utils-services/user-service';
import { SportsService } from '../../providers/rss-services/sports-service';
import { SportItem } from '../../app/entity/sportItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import 'rxjs/add/operator/debounceTime';
import { TranslateService } from '@ngx-translate/core';

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
  teams: Array<SportItem> = [];
  searching: any = false;
  segment = 'all';
  shownSports = 0;
  shownTeams = 0;
  title: any;
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any = [];
  filtersT : any = [];
  excludedFilters : any = [];
  displayedSports : Array<SportItem> = [];
  displayedSportsD :any = [];
  dateRange: any = 1;
  dateLimit: Date = new Date();
  campus:string;
  shownGroup = null;
  loading;
  nosport:any = false;

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
    public connService : ConnectivityService,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController
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
    this.presentLoading();
  }


  presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();
    }
    //this.dismiss = true;

   /* setTimeout(() => {
      this.loading.dismiss();
    }, 5000);*/
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

 /* public goToSportDetail(sport: SportItem) {
    this.nav.push(SportsDetailsPage, { 'sport': sport });
  }*/

  public loadSports() {
    console.log("start load");
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();
    let result: any;
    this.campus = this.user.campus;
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
          this.loadSports();
        } else {
          if(error == 2) {
            console.log("Loading sports : YQL req timed out > limit, suppose no sports to be displayed");
          } else {
            console.log("Error loading sports : " + error);
          }
          this.searching = false;
          this.nosport=true;
          this.updateDisplayedSports();
        }
      });

      this.sportsService.getTeams(this.segment).then(
        res => {
          result = res;
          this.teams = result.teams;
          this.shownTeams = result.shownTeams;
          this.filtersT = result.categoriesT;
          this.searching = false;
          this.updateDisplayedSports();
      })
      .catch(error => {
        if(error == 1) {
          //console.log("Error loading teams : " + error);
          this.loadSports();
        } else {
          if(error == 2) {
            console.log("Loading teams : YQL req timed out > limit, suppose no sports to be displayed");
          } else {
            console.log("Error loading teams : " + error);
          }
          this.searching = false;
          this.nosport=true;
          this.updateDisplayedSports();
        }
      });

    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }
    console.log("end Load");
  }

  public changeArray(array){
    var groups = array.reduce(function(obj,item){
      obj[item.jour] = obj[item.jour] || [];
      obj[item.jour].push(item);
      return obj;
    }, {});
    var sportsD = Object.keys(groups).map(function(key){
    return {jour: key, name: groups[key]};
    });
    return sportsD;
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


  public updateDisplayedSports() {
    console.log("start update");
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
        if(item.favorite || this.user.hasFavoriteS(item.guid)) {
          if(item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
            favSports.push(item);
          }
        }
      });

      this.displayedSports = favSports;
    }
    else if (this.segment === 'team') {
      this.displayedSports = this.teams.filter((item) => {
        return ( this.excludedFilters.indexOf(item.sport) < 0 ) && (item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
            && (Math.floor(item.date.getTime()/86400000) <= Math.floor(this.dateLimit.getTime()/86400000));
      });
    }
    //this.shownTeams = this.displayedSports.length;
    this.shownSports = this.displayedSports.length;
    this.searching = false;
    this.displayedSportsD = this.changeArray(this.displayedSports);
    //while(this.dismiss == false){}
    this.dismissLoading();
   // this.dismiss=false;
   console.log("end update");

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

  addFavorite(slidingItem: ItemSliding, itemData: SportItem) {
    if (this.user.hasFavoriteS(itemData.guid)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, itemData, 'Favoris déjà ajouté');
    } else {
      // remember this session as a user favorite
      this.user.addFavoriteS(itemData.guid);

      let toast = this.toastCtrl.create({
        message: 'Ajouté aux favoris',
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }

  }

  removeFavorite(slidingItem: ItemSliding, itemData: SportItem, title: string) {
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
            this.user.removeFavoriteS(itemData.guid);
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

}
