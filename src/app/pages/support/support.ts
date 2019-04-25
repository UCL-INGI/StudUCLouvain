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

import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform,LoadingController} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { RepertoireService } from '../../services/wso2-services/repertoire-service';
import { ConnectivityService } from '../../services/utils-services/connectivity-service';

import { EmployeeItem } from '../../entity/employeeItem';

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class SupportPage {
  title: any;
  shownGroup = null;
  employees: EmployeeItem[];
  searching: boolean = false;
  lastname:string = "";
  firstname:string = "";
  loading;
  segment:string="aide";
  shownHelp = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private iab: InAppBrowser,
              public platform: Platform,
              public repService : RepertoireService,
              public connService : ConnectivityService,
              public loadingCtrl: LoadingController)
  {
    this.title = this.navParams.get('title');
  }

  /*Display loading pop up*/
  presentLoading() {
    if(!this.loading){
        this.loading = this.loadingCtrl.create({
          message: 'Please wait...'
        }).then(loading => loading.present());
    }

  }

  /*Dismiss loading pop up*/
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
  }

  /*Take the name and lastname in the good field to do the search and display the result*/
  update(){
    this.presentLoading();
    let options: Array<string>= [];
    let values: Array<string> = [];
    if(this.lastname.length>0){
      values.push(this.lastname);
      options.push("lastname");
    }
    if(this.firstname.length>0){
      values.push(this.firstname);
      options.push("firstname");
    }
    this.searchEmployees(options, values);
  }

  /*Search employees with the name and lastname in option, return the result and dismiss the loading pop up*/
  searchEmployees(options:Array<string>, values:Array<string>){
    if(this.connService.isOnline()) {
      this.repService.searchEmployees(options, values).then(
        res => {
          let result:any = res;
          this.employees = result.employees;
          this.searching = true;
        }
      );
    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }
    this.dismissLoading();
  }

  /*Open the page with the details for the employee selectionned*/
  goToEmpDetails(emp: EmployeeItem) {
    this.navCtrl.navigateForward(['EmployeeDetailsPage', { 'emp': emp}]);
  }

  /*Show or close the informations for the section selectionned*/
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

  /*Open url for some details on site of the UCL about support, etc for more informations*/
  public openURL(url: string) {
    this.iab.create(url, '_system','location=yes');
  }
}
