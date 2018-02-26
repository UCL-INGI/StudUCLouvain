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

import { Component} from '@angular/core';
import { NavParams, NavController, App, AlertController, LoadingController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';
import { AppAvailability } from '@ionic-native/app-availability';
import { UserService } from '../../providers/utils-services/user-service';
import { MyApp } from '../../app/app.component';
import { TranslateService } from '@ngx-translate/core';


import { EventsPage } from '../events/events';
import { MobilityPage } from '../mobility/mobility';
import { LibrariesPage } from '../library/libraries';
import { NewsPage } from '../news/news';
import { RestaurantPage } from '../restaurant/restaurant';
import { StudiesPage } from '../studies/studies';
import { MapPage } from '../map/map';
import { HelpDeskPage } from '../help-desk/help-desk';
import { SportsPage } from '../sports/sports';

@Component({
  selector: 'page-homeC',
  templateUrl: 'homeC.html',
})
export class HomePage {
//  @ViewChild('Nav') nav: Nav;
  title:string = "Accueil";
  shownGroup = null;
  where = "";
  myApp : MyApp;

  setting:string ="";
  message:string = "";
  save:string = "";
  message2:string = "";
  en:string = "";
  fr:string = "";


  libraryPage = { title: 'MENU.LIBRARY', component: LibrariesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  newsPage = { title: 'MENU.NEWS', component: NewsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  eventPage = { title: 'MENU.EVENTS', component: EventsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  sportPage = { title: 'MENU.SPORTS', component: SportsPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  studiesPage = { title: 'MENU.STUDIES', component: StudiesPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  helpDeskPage = { title: 'MENU.HELP', component: HelpDeskPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  mapPage = { title: 'MENU.MAP', component: MapPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  restoPage = { title: 'MENU.RESTAURANT', component: RestaurantPage,
    iosSchemaName: 'com.apptree.resto4u',
    androidPackageName: 'com.apptree.resto4u',
    appUrl: 'apptreeresto4u://',
    httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' };

  mobilityPage = { title: 'MENU.MOBILITY', component: MobilityPage,
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  constructor(public navParams: NavParams,
              public app: App,
              public userS:UserService,
              public nav : NavController,
              private iab: InAppBrowser,
              private appAvailability: AppAvailability,
              private device: Device,
              private alertCtrl : AlertController,
              private translateService: TranslateService,
              public loadingCtrl: LoadingController
            )
  {
      if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }

      this.app.setTitle(this.title);
  }

  updateCampus(){
    this.userS.addCampus(this.where);
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  changePage(page) {
    //console.log(this.myApp.nav); //Comprendre comment utiliser app.component
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.launchExternalApp(page);
    }
    this.nav.push(page.component, {title: page.title});
    if(page.title=='MENU.NEWS' || page.title=='MENU.EVENTS' || page.title=='MENU.LIBRARY'){
      this.presentLoadingDefault();
    }
    //console.log(this.MyApp);
    //this.myApp.openRootPage(page);
  }

  launchExternalApp(page) {
    let app: string;
    let storeUrl:string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      storeUrl=page.httpUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      storeUrl= 'market://details?id='+ app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => { // error callback
        //this.market.open(app);
      }
    );
  }

 languageChanged(event:string) {
        this.translateService.use(event);
    }

  settings(){
    let check = this.userS.campus;
    let check2 = this.translateService.currentLang;
    this.translateService.get('HOME.SETTINGS').subscribe((res:string) => {this.setting=res;});
    this.translateService.get('HOME.MESSAGE').subscribe((res:string) => {this.message=res;});
    this.translateService.get('HOME.SAVE').subscribe((res:string) => {this.save=res;});
    this.translateService.get('HOME.MESSAGE2').subscribe((res:string) => {this.message2=res;});
    this.translateService.get('HOME.FR').subscribe((res:string) => {this.fr=res;});
    this.translateService.get('HOME.EN').subscribe((res:string) => {this.en=res;});
    let settingsAlert = this.alertCtrl.create({
            title: this.setting,
            message: this.message,
            inputs : [
                {
                    type:'radio',
                    label:'Louvain-la-Neuve',
                    value:'LLN',
                    checked:(check == 'LLN')
                },
                {
                    type:'radio',
                    label:'Woluwé',
                    value:'Woluwe',
                    checked:(check == 'Woluwe')
                },
                {
                    type:'radio',
                    label:'Mons',
                    value:'Mons',
                    checked:(check == 'Mons')
                }],
            buttons: [
                {
                    text: this.save,
                    handler: data => {
                      this.userS.addCampus(data);
                      languageAlert.present();
                    }
                }
            ]
        });
        settingsAlert.present();

        let languageAlert = this.alertCtrl.create({
          title: this.setting,
          message : this.message2,
          inputs : [
            {
              type:'radio',
              label:this.fr,
              value:'fr',
              checked:(check2 == 'fr')
            },
            {
              type:'radio',
              label:this.en,
              value:'en',
              checked:(check2 == 'en')
            }
          ],
          buttons: [
          {
            text:this.save,
            handler:data => {
               this.languageChanged(data);
            }
          }]
        });

  }

}
