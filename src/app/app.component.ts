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
import { MenuController, Nav, Platform, AlertController,LoadingController, IonicApp } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Market } from '@ionic-native/market';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { EventsPage } from '../pages/events/events';
import { MobilityPage } from '../pages/mobility/mobility';
import { LibrariesPage } from '../pages/library/libraries';
import { NewsPage } from '../pages/news/news';
import { RestaurantPage } from '../pages/restaurant/restaurant';
import { StudiesPage } from '../pages/studies/studies';
import { MapPage } from '../pages/map/map';
import { ParamPage } from '../pages/param/param';
import { SupportPage } from '../pages/help-desk/support';
import { CreditPage } from '../pages/credit/credit';
import { SportsPage } from '../pages/sports/sports';
import { HomePage } from '../pages/home/home';
import { GuindaillePage } from '../pages/guindaille2-0/guindaille2-0';
import { UserService } from '../providers/utils-services/user-service';
import { Wso2Service } from '../providers/wso2-services/wso2-service';

@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = 'HomePage';
  alertPresented: any;
  page: any;
  homePage;
  checked=false;
  campusPages: Array<{title: string, component: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;
  studiePages: Array<{title: string, component: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;
  toolPages: Array<{title: string, component: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;

  constructor(public platform: Platform,
    public menu: MenuController,
    public market: Market,
    private appAvailability : AppAvailability,
    private iab: InAppBrowser,
    private device: Device,
    private splashscreen: SplashScreen,
    private alertCtrl : AlertController,
    private user: UserService,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private ionicApp: IonicApp,
    private storage: Storage,
    private wso2Service : Wso2Service
  ) {
    this.user.getCampus();
    this.user.getDisclaimer();
    this.alertPresented = false;
    this.initializeApp();
    this.wso2Service.getToken();
    this.homePage =
      {title: 'MENU.HOME', component: HomePage, icon: 'home',
      iosSchemaName: null, androidPackageName: null,
      appUrl: null, httpUrl: null}
    ;
    this.campusPages =[
      { title: 'MENU.NEWS', component: NewsPage, icon: 'paper',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.EVENTS', component: EventsPage, icon: 'calendar',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.SPORTS', component: SportsPage, icon: 'football',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },

    ];
    this.studiePages =[
      { title: 'MENU.STUDIES', component: StudiesPage, icon: 'school',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.LIBRARY', component: LibrariesPage, icon: 'book',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.HELP', component: SupportPage,
        icon: 'information-circle', iosSchemaName: null,
        androidPackageName: null, appUrl: null, httpUrl: null }
    ];
    this.toolPages =[
      { title: 'MENU.PARTY', component: GuindaillePage, icon: 'water',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.MAP', component: MapPage, icon: 'map',
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.RESTAURANT', component: RestaurantPage, icon : 'restaurant',
        iosSchemaName: 'com.apptree.resto4u',
        androidPackageName: 'com.apptree.resto4u',
        appUrl: 'apptreeresto4u://',
        httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' },
      { title: 'MENU.MOBILITY', component: MobilityPage, icon : 'car',
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.PARAM', component: ParamPage, icon : 'construct',
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.CREDITS', component: CreditPage, icon : 'bulb',
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null }
    ];
    platform.ready().then(() => {
      translateService.setDefaultLang('fr');
      translateService.use('fr');

    })

    this.storage.get('disclaimer').then((disclaimer) => {
      if(!disclaimer) this.disclaimer();
      console.log(disclaimer);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashscreen.hide();
    });


    // Confirm exit
    this.platform.registerBackButtonAction(() => {

        let activePortal = this.ionicApp._loadingPortal.getActive() ||
           this.ionicApp._modalPortal.getActive() ||
           this.ionicApp._toastPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
            activePortal.dismiss();
            return
        }
        else if (this.menu.isOpen()) { // Close menu if open
            this.menu.close();
            return
        }
        if (this.nav.length() == 1) {
          this.confirmExitApp();
        } else {
          this.nav.pop();
        }

    });
  }

  confirmExitApp() {
    let activeVC = this.nav.getActive();
    let page = activeVC.instance;
    if(page instanceof HomePage){
      if(!this.alertPresented){
        this.alertPresented = true;
        let confirmAlert = this.alertCtrl.create({
            title: "Fermeture",
            message: "Désirez-vous quitter l'application ?",
            buttons: [
                {
                    text: 'Annuler',
                    handler: () => {
                      this.alertPresented = false;
                    }
                },
                {
                    text: 'Quitter',
                    handler: () => {
                        this.platform.exitApp();
                    }
                }
            ]
        });
        confirmAlert.present();
    }
  }
  else this.openRootPage(this.homePage);
}

  disclaimer(){
        let title:string;
    let message:string;
    this.translateService.get('HOME.WARNING').subscribe((res:string) => {title=res;});
    this.translateService.get('HOME.MESSAGE3').subscribe((res:string) => {message=res;});
     let disclaimerAlert = this.alertCtrl.create({
            title: "Avertissement",
            message: "Cette application a pour but de centraliser un maximum d'informations disponibles sur le portail UCLouvain.<br>Cela ne vous dispense pas de vous y rendre afin d'en savoir plus.",
            inputs: [
              {
                type: 'checkbox',
                label: 'Ne plus afficher',
                handler:(e)=>{
                   console.log(e.checked);
                   this.checked = e.checked;
                }
              }
            ],
            buttons: [
                {
                    text: "OK",
                    handler: data => {
                      if(this.checked){
                        this.user.addDisclaimer(this.checked);
                      }
                    }
                }
            ]
        });
        disclaimerAlert.present();
  }
  openRootPage(page) {
    let activeVC = this.nav.getActive();
    let test = activeVC.instance;
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.page = page;

    if(!((test instanceof HomePage) && page == this.homePage)){
      if(page.iosSchemaName != null && page.androidPackageName != null){
        this.launchExternalApp(page.iosSchemaName, page.androidPackageName, page.appUrl, page.httpUrl);
      }
      this.nav.setRoot(page.component, {title: page.title});
    }  

  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
	  let app: string;
    let storeUrl:string;
  	if (this.device.platform === 'iOS') {
  		app = iosSchemaName;
      storeUrl=httpUrl;
  	} else if (this.device.platform === 'Android') {
  		app = androidPackageName;
      storeUrl= 'market://details?id='+ app;
  	} else {
  		const browser = this.iab.create(httpUrl, '_system');
      browser.close();
  	}
  	this.appAvailability.check(app).then(
  		() => { // success callback
  			const browser = this.iab.create(appUrl, '_system');
        browser.close();
  		},
  		() => { // error callback
  			this.market.open(app);
  		}
  	);
  }

}
