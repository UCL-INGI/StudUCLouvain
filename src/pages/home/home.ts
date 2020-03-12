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
import { AlertController, IonContent, NavController } from '@ionic/angular';

import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';
import { SettingsProvider } from "../../providers/utils-services/settings-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('home', {static: false}) content: IonContent;

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
  selectedTheme: string;
  constructor(
    public userS: UserService,
    public nav: NavController,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    public splashscreen: SplashScreen,
    private utilsService: UtilsService,
    private settings: SettingsProvider
  ) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    document.title = this.title;
    // this.userS.addCampus('');
  }

  ionViewDidEnter() {
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
      this.nav.navigateForward([page.component]);
    }
  }

  public openUCL(url: string) {
    this.iab.create(url, '_system');
  }

  async emergency() {
    const alert = await this.alertCtrl.create({
      header: this.utilsService.getText('HOME', 'URG'),
      message: this.getAlertEmergencyMsg(),
      cssClass: 'emergency ' + this.selectedTheme,
      buttons: [
        {
          text: this.utilsService.getText('HOME', 'CLOSE')
        }
      ]
    });
    return await alert.present();
  }

  private getAlertEmergencyMsg() {
    const [
      msg1, msg2, msg9, msg3, msg4, msg5, msg6, msg7, msg8, out
    ] = this.utilsService.getTexts(
      'GUINDAILLE',
      ['HELP1', 'HELP2', 'HELP3', 'HELP4', 'HELP5', 'HELP6', 'HELP7', 'HELP8', 'HELP9', 'HELP18']
    );
    return '<p><strong>' + msg1 + '</strong>: <br><a href="tel:010472222">010 47 22 22</a></p>' +
      '<p><strong>' + msg2 + '</strong>: <br><a href="tel:010472424">010 47 24 24</a><br>ou' +
      '<br>' + '<a href="tel:027649393">02 764 93 93</a><br>(Woluwe - St Gilles - Tournai)<br>' +
      ' ou ' + '<br><a href="tel:065323555">065 32 35 55</a> (Mons)</p>' +
      '<p><strong>Contact:</strong><a href="mailto:security@uclouvain.be">security@uclouvain.be</a></p>' +
      '<p><strong>' + out + ':</strong><a href="tel:112">112</a></p><p><br><strong>' + msg9 + '</strong><br><strong>' +
      msg3 + '</strong><br>' + msg4 + '<strong><br>' + msg5 + '</strong><br>' + msg6 + '<br><strong>' + msg7 +
      '</strong><br>' + msg8;
  }
}
