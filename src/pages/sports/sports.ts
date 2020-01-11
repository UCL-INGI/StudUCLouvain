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
    AlertController, App, IonicPage, ItemSliding, List, LoadingController, ModalController,
    NavController, NavParams, ToastController
} from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { TranslateService } from '@ngx-translate/core';

import { SportItem } from '../../app/entity/sportItem';
import { SportsService } from '../../providers/rss-services/sports-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UserService } from '../../providers/utils-services/user-service';

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
  searchTerm: string = '';
  searchControl: FormControl;
  filters : any = [];
  filtersT : any = [];
  excludedFilters : any = [];
  excludedFiltersT : any = [];
  displayedSports : Array<SportItem> = [];
  displayedSportsD :any = [];
  dateRange: any = 7;
  dateLimit: Date = new Date();
  campus:string;
  shownGroup = null;
  loading;
  nosport:any = false;
  noteams:any = false;

  constructor(
    public alertCtrl: AlertController,
    public app:App,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private sportsService: SportsService,
    public user: UserService,
    public toastCtrl: ToastController,
    private calendar: Calendar,
    public connService : ConnectivityService,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController)
  {
    this.title = this.navParams.get('title');
    this.searchControl = new FormControl();
  }

  /*update the date with in real time value, load sport and display them*/
  ionViewDidLoad() {
    this.app.setTitle(this.title);
    this.updateDateLimit();
    //Check connxion, if it's ok, load and display sports
    if(this.connService.isOnline()) {
      this.loadSports();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.updateDisplayedSports();
      });
      this.presentLoading();
      //this.nosport=true;
    }
    //If not go back to previous page and pop an alert
    else{
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Reload sport after refreshing the page*/
  public doRefresh(refresher) {
    this.loadSports();
    refresher.complete();
  }

  /*display an loading pop up*/
  presentLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.loading.present();
    }
  }

  /*Cancel loading pop up*/
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  public onSearchInput(){
    this.searching = true;
  }

  /*Load sports to display*/
  public loadSports() {
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();
    this.campus = this.user.campus;
    //Check the connexion, if it's ok, load them else return to previous page and display an alert
    if(this.connService.isOnline()) {
      //get sports for all students
      this.sportsService.getSports(this.segment).then(
        result => {
          this.sports = result.sports;
          this.shownSports = result.shownSports;
          this.filters = result.categories;
          this.searching = false;
          this.nosport = this.sports.length == 0;
          this.updateDisplayedSports();
      })
      this.sportsService.getTeams(this.segment).then(
        result => {
          this.teams = result.teams;
          this.shownTeams = result.shownTeams;
          this.filtersT = result.categoriesT;
          this.searching = false;          
          this.noteams = this.teams.length == 0;
          this.updateDisplayedSports();
      })
    } else {
      this.searching = false;
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Sort sports BY DAY*/
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

  /*Display or close the group of sports for one day*/
  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  }

  /*Check if the list is shown or not*/
  isGroupShown(group) {
      return this.shownGroup === group;
  }

  /*Display the good list of sports according to the tab*/
  public updateDisplayedSports() {
    this.searching = true;
    this.sportsList && this.sportsList.closeSlidingItems();

    if (this.segment === 'all') { //List of sports for all students
      this.filterDisplayedSports(this.sports);
    }
    else if (this.segment === 'favorites') { //list of sports put in favorite
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
    else if (this.segment === 'team') { //List of sports for university teams
      this.filterDisplayedSports(this.teams);
    }

    this.shownSports = this.displayedSports.length;
    this.searching = false;
    this.displayedSportsD = this.changeArray(this.displayedSports);
    this.dismissLoading();
  }

  private filterDisplayedSports(items: Array<SportItem>) {
    this.displayedSports = items.filter((item) => {
      return (this.excludedFilters.indexOf(item.sport) < 0) && (item.sport.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
        && (Math.floor(item.date.getTime() / 86400000) <= Math.floor(this.dateLimit.getTime() / 86400000));
    });
  }

  /*Display a modal to select as filter only the sports that the user want to see*/
  presentFilter() {
    if(this.filters === undefined){
      this.filters = [];
    }
    if(this.filtersT === undefined){
      this.filtersT = [];
    }
    let cat;
    let exclude;
    if(this.segment === 'all'){
      cat = this.filters;
      exclude = this.excludedFilters;
    }
    if(this.segment === 'team'){ 
      cat = this.filtersT;
      exclude = this.excludedFiltersT;
    }
    //Create a modal in which the filter will be by the SportsFilterPage
    let modal = this.modalCtrl.create('SportsFilterPage',
                  { excludedFilters : exclude, filters : cat, dateRange : this.dateRange});
    modal.present();

    //Applied changing of date range when dismiss the modal
    modal.onWillDismiss((data: any[]) => {
      if (data) {
        let tmpRange = data.pop();
        if(tmpRange !== this.dateRange) {
          this.dateRange = tmpRange;
          this.updateDateLimit();
        }
        let newExclude = data.pop();
        if(this.segment === 'all') this.excludedFilters = newExclude;
        if(this.segment === 'team') this.excludedFiltersT = newExclude;
        this.updateDisplayedSports();
      }
    });
  }

  /*Update the dateLimit when that is changed by the filter*/
  private updateDateLimit(){
    let today = new Date();
    this.dateLimit = new Date(today.getFullYear(), today.getMonth(), today.getUTCDate()+this.dateRange);
  }

  /*Add a sport to calendar of the smartphone*/
  addToCalendar(slidingItem: ItemSliding, itemData: SportItem){
    let options:any = {
      firstReminderMinutes:30
    };

    this.calendar.createEventWithOptions(itemData.sport, itemData.lieu,
      itemData.salle, itemData.date, itemData.hfin, options).then(() => {
        let toast = this.toastCtrl.create({
          message: 'Sport créé',
          duration: 3000
        });
        toast.present();
        slidingItem.close();
      });
  }

  /*Add a sport to favorite, each slot for the day selected*/
  addFavorite(slidingItem: ItemSliding, itemData: SportItem) {
    if (this.user.hasFavoriteS(itemData.guid)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      let message:string;
      this.translateService.get('SPORTS.MESSAGEFAV').subscribe((res:string) => {message=res;});
      this.removeFavorite(slidingItem, itemData, message);
    } else {
      // remember this session as a user favorite
      this.user.addFavoriteS(itemData.guid);
      let message:string;
      this.translateService.get('SPORTS.FAVADD').subscribe((res:string) => {message=res;});

      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
      slidingItem.close();
    }
  }

  /*Remove a sport of the favorites*/
  removeFavorite(slidingItem: ItemSliding, itemData: SportItem, title: string) {
    let message:string;
    let delet:string;
    let cancel:string;
    this.translateService.get('SPORTS.MESSAGEFAV2').subscribe((res:string) => {message=res;});
    this.translateService.get('SPORTS.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('SPORTS.DEL').subscribe((res:string) => {delet=res;});
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
