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

import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { RepertoireService } from '../../providers/wso2-services/repertoire-service';
import { EmployeeDetailsPage } from './employee-details/employee-details';
import { EmployeeItem } from '../../app/entity/employeeItem';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the Repertoire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-repertoire',
  templateUrl: 'repertoire.html'
})
export class RepertoirePage {
  title: any;
  employees: EmployeeItem[];
  searching: boolean = false;
  lastname:string = "";
  firstname:string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public repService : RepertoireService,
    public connService : ConnectivityService,
              private translateService: TranslateService
  ) {
    this.title = this.navParams.get('title');
  }


  public doRefresh(refresher) {
    //this.loadEmployees();
    refresher.complete();
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
}
