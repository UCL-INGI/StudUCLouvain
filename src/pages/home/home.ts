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
import { AlertController, App, Content, FabContainer, IonicPage, NavController } from 'ionic-angular';

import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Market } from '@ionic-native/market';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('home') content: Content;

  title = 'Stud.UCLouvain';
  where = '';

  libraryPage = this.utilsService.getPageObject('Libraries', 'LIBRARY');
  newsPage = this.utilsService.getPageObject('News');
  eventPage = this.utilsService.getPageObject('Events');
  sportPage = this.utilsService.getPageObject('Sports');
  studiesPage = this.utilsService.getPageObject('Studies');
  helpDeskPage = this.utilsService.getPageObject('Support', 'HELP');
  mapPage = this.utilsService.getPageObject('Map');
  guindaillePage = this.utilsService.getPageObject('Guindaille', 'PARTY');
  paramPage = this.utilsService.getPageObject('Param');
  restoPage = this.utilsService.getPageObject(
    'Restaurant',
    'RESTAURANT',
    'id1156050719', 'com.apptree.resto4u',
    'apptreeresto4u://', 'https://uclouvain.be/fr/decouvrir/resto-u'
  )
  ;
  mobilityPage = this.utilsService.getPageObject('Mobility');

  constructor(
    public app: App,
    public userS: UserService,
    public nav: NavController,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    public market: Market,
    public splashscreen: SplashScreen,
    private utilsService: UtilsService
  ) {
    this.app.setTitle(this.title);
    document.title = this.title;
    // this.userS.addCampus('');
  }

  ionViewDidEnter() {
    this.app.setTitle(this.title);
    setTimeout(() => {
      this.splashscreen.hide();
    }, 1000);
  }

  updateCampus() {
    this.userS.addCampus(this.where);
  }

  changePage(page) {
    if (page.iosSchemaName != null && page.androidPackageName != null) {
      this.utilsService.launchExternalApp(page);
    } else {
      this.nav.push(page.component, {title: page.title});
    }
  }

  public openURL(url: string, fab: FabContainer) {
    this.iab.create(url, '_system');
    fab.close();
  }

  public openUCL(url: string) {
    this.iab.create(url, '_system');
  }

  emergency() {
    const alert = this.alertCtrl.create({
      title: this.utilsService.getText('HOME', 'URG'),
      message: this.getAlertEmergencyMsg(),
      cssClass: 'emergency',
      buttons: [
        {
          text: this.utilsService.getText('HOME', 'CLOSE')
        }
      ]
    });
    alert.present();
  }

  private getAlertEmergencyMsg() {
    const [
      msg1, msg2, out, msg3, msg4, msg5, msg6, msg7, msg8, msg9
    ] = this.utilsService.getTexts(
      'GUINDAILLE',
      ['HELP1', 'HELP2', 'HELP3', 'HELP4', 'HELP5', 'HELP6', 'HELP7', 'HELP8', 'HELP9', 'HELP18']
    );
    return '<p><strong>' + msg1 + '</strong>: <br><font size="+1"><a href="tel:010472222">010 47 22 22</a></font></p>' +
      '<p><strong>' + msg2 + '</strong>: <br><font size="+1"><a href="tel:010472424">010 47 24 24</a></font><br>ou' +
      '<br><font size="+1">' + '<a href="tel:027649393">02 764 93 93</a></font><br>(Woluwe - St Gilles - Tournai)<br>' +
      ' ou ' + '<br><font size="+1"><a href="tel:065323555">065 32 35 55</a></font> (Mons)</p>' +
      '<p><strong>Contact:</strong><a href="mailto:security@uclouvain.be">security@uclouvain.be</a></p>' +
      '<p><strong>' + out + ':</strong><font size="+1"><a href="tel:112">112</a></font></p><p><br>' + msg3 +
      ' <br><br><strong>' + msg4 + '</strong> ' + msg5 + '<br><strong>' + msg6 + '</strong> ' + msg7 + '<br><strong>' +
      msg8 + '</strong> ' + msg9 + '<br>';
  }
}
