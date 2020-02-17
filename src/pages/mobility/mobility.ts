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
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';
import { Market } from '@ionic-native/market';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../../providers/utils-services/utils-service';

@IonicPage()
@Component({
  selector: 'page-mobility',
  templateUrl: 'mobility.html'
})
export class MobilityPage {
  public title: any;
  carpoolingPage;
  busPage;
  trainPage;
  constructor(
    public nav: NavController,
    public market: Market,
    public navParams: NavParams,
    private translateService: TranslateService,
    public utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
    let titlecar: string;
    this.translateService.get('MOBI.COVOIT').subscribe((res: string) => {
      titlecar = res;
    });

    this.carpoolingPage = {
      title: titlecar,
      component: 'CarpoolingPage',
      iosSchemaName: 'id1143545052',
      androidPackageName: 'net.commuty.mobile',
      appUrl: 'commutynet://',
      httpUrl: 'https://app.commuty.net/sign-in'
    };
    this.busPage = {
      title: 'NextRide',
      component: 'BusPage',
      iosSchemaName: 'id568042532',
      androidPackageName: 'be.thomashermine.prochainbus',
      appUrl: 'nextride://',
      httpUrl: 'https://nextride.be/timetables'
    };
    this.trainPage = {
      title: 'SNCB',
      component: 'TrainPage',
      iosSchemaName: 'id403212064',
      androidPackageName: 'de.hafas.android.sncbnmbs',
      appUrl: 'sncb://',
      httpUrl:
        'http://www.belgianrail.be/fr/service-clientele/outils-voyage.aspx'
    };
  }
}
