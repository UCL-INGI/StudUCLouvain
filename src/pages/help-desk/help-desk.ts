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

import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { NavController, NavParams, ModalController, Platform} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RepertoireService } from '../../providers/wso2-services/repertoire-service';
import { EmployeeDetailsPage } from './employee-details/employee-details';
import { EmployeeItem } from '../../app/entity/employeeItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-help-desk',
  templateUrl: 'help-desk.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class HelpDeskPage {
  title: any;
  shownGroup = null;
  employees: EmployeeItem[];
  searching: boolean = false;
  lastname:string = "";
  firstname:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private iab: InAppBrowser,
              public platform: Platform,
              public repService : RepertoireService,
              public connService : ConnectivityService,
              private translateService: TranslateService) {
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {

  }

  update(){
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
  }

  goToEmpDetails(emp: EmployeeItem) {
    this.navCtrl.push(EmployeeDetailsPage, { 'emp': emp});
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

  public openURL(url: string) {
    this.iab.create(url, '_system','location=yes');
  }
}
