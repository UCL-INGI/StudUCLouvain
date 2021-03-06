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
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { EmployeeItem } from '../../app/entity/employeeItem';
import { ConnectivityService } from '../../services/utils-services/connectivity-service';
import { UtilsService } from '../../services/utils-services/utils-service';
import { RepertoireService } from '../../services/wso2-services/repertoire-service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '45px'})),
      state('false', style({height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class SupportPage {
  title: any;
  employees: EmployeeItem[];
  searching = false;
  lastname = '';
  firstname = '';
  loading;
  segment = 'aide';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private iab: InAppBrowser,
    public platform: Platform,
    public repService: RepertoireService,
    public connService: ConnectivityService,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
  }

  update() {
    this.utilsService.presentLoading();
    const options: Array<string> = [];
    const values: Array<string> = [];
    for (const key of ['lastname', 'firstname']) {
      const field = key === 'lastname' ? this.lastname : this.firstname;
      if (field.length > 0) {
        values.push(field);
        options.push(key);
      }
    }
    this.searchEmployees(options, values);
  }

  searchEmployees(options: Array<string>, values: Array<string>) {
    if (this.connService.isOnline()) {
      this.repService.searchEmployees(options, values).then((res: any) => {
        this.employees = res.employees;
      });
    } else {
      this.connService.presentConnectionAlert();
    }
    this.searching = false;
    this.utilsService.dismissLoading();
  }

  goToEmpDetails(emp: EmployeeItem) {
    const navigationExtras: NavigationExtras = {
      state: {  emp: emp }
    };
    this.navCtrl.navigateForward('EmployeeDetailsPage', navigationExtras);
  }

  public openURL(url: string) {
    this.iab.create(url, '_system', 'location=yes');
  }
}
