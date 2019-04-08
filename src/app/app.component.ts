import { Component } from '@angular/core';

import { Platform, MenuController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Market } from '@ionic-native/market/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { UserService } from './services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Wso2Service } from './services/wso2.service';
import { CacheService } from "ionic-cache";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  rootPage ='';// = 'HomePage';
  alertPresented: any;
  page: any;
  homePage;
  checked=false;
  campusPages: Array<{title: string, route: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;
  studiePages: Array<{title: string, route: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;
  toolPages: Array<{title: string, route: any, icon: any,
    iosSchemaName: string, androidPackageName: string,
    appUrl: string, httpUrl: string}>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController,
    public market: Market,
    private appAvailability : AppAvailability,
    private iab: InAppBrowser,
    private device: Device,
    private alertCtrl : AlertController,
    private user: UserService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private wso2Service : Wso2Service,
    public cache: CacheService,
    private nav: NavController
  ) {
    console.log("Startin App");
  //  this.user.getCampus();
    //this.user.getDisclaimer();
    this.alertPresented = false;
    this.initializeApp();

    this.homePage =
      {title: 'MENU.HOME', route: '/home', icon: "./assets/img/home.png",
      iosSchemaName: null, androidPackageName: null,
      appUrl: null, httpUrl: null}
    ;
    this.campusPages =[
      { title: 'MENU.NEWS', route: '/news', icon: "./assets/img/news.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.EVENTS', route: '/events', icon: "./assets/img/event.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.SPORTS', route: '/sports', icon: "./assets/img/sport.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },

    ];
    this.studiePages =[
      { title: 'MENU.STUDIES', route: '/studies', icon: "./assets/img/études.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.LIBRARY', route: '/library', icon: "./assets/img/biblio.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.HELP', route: '/support',
        icon: "./assets/img/support.png", iosSchemaName: null,
        androidPackageName: null, appUrl: null, httpUrl: null }
    ];
    this.toolPages =[
      { title: 'MENU.PARTY', route: '/guindaille', icon: "./assets/img/g2.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.MAP', route: '/map', icon: "./assets/img/cartes.png",
        iosSchemaName: null, androidPackageName: null,
        appUrl: null, httpUrl: null  },
      { title: 'MENU.RESTAURANT', route: '/restaurant', icon : "./assets/img/resto.png",
        iosSchemaName: 'id1156050719',
        androidPackageName: 'com.apptree.resto4u',
        appUrl: 'apptreeresto4u://',
        httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' },
      { title: 'MENU.MOBILITY', route: '/mobility', icon : "./assets/img/mobilité.png",
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.PARAM', route: '/param', icon : "./assets/img/setting.png",
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null },
      { title: 'MENU.CREDITS', route: '/credit', icon : "./assets/img/signature.png",
        iosSchemaName: null,
        androidPackageName: null,
        appUrl: null, httpUrl: null }
    ];
    platform.ready().then(() => {
    	// this.wso2Service.getToken();
      /*if ((<any>window).TestFairy) {
        TestFairy.begin("b7514d146f2609b445cf858970110d58580938fc");
      }*/
      translateService.setDefaultLang('fr');
     /* this.user.storage.get('lan').then((data) =>
      {
        if(data!=null) translateService.use(data);
        else translateService.use('fr');
       });*/
      cache.setDefaultTTL(60 * 60 * 2);
      cache.setOfflineInvalidate(false);
      //this.user.storage.set('first',null);
      /*this.user.storage.get('first').then((data) =>
      {
      	if(data==null) {
      		this.rootPage = 'TutoPage';
      		this.user.storage.set('first',false);
      	}
      	else this.rootPage = 'HomePage';
      })*/

    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.backButton.subscribe(() => {
/*
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
      }*/

  });
  }

  confirmExitApp() {
    //let activeVC = this.nav.getActive();
   // let page = activeVC.instance;
    //if(page instanceof HomePage){
      if(!this.alertPresented){
        this.alertPresented = true;
        let confirmAlert = this.alertCtrl.create({
            header: "Fermeture",
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
                        navigator['app'].exitApp();
                    }
                }
            ]
        });
        confirmAlert.then(alert => alert.present());
    }
 // }
  //else this.openRootPage(this.homePage);
}

  disclaimer(){
        //let title:string;
    //let message:string;
    //this.translateService.get('HOME.WARNING').subscribe((res:string) => {title=res;});
    //this.translateService.get('HOME.MESSAGE3').subscribe((res:string) => {message=res;});
     let disclaimerAlert = this.alertCtrl.create({
            header: "Avertissement",
            message: "<p>Version beta de l'application Stud@UCLouvain.</p> <p>Cette version n'est pas publique et est uniquement destinée à une phase de test.</p>",

            buttons: [
                {
                    text: "OK",
                    handler: data => {

                    }
                }
            ]
        });
        disclaimerAlert.then(alert => alert.present());
  }

  openRootPage(page) {
    //let activeVC = this.nav.getActive();
    //let test = activeVC.instance;
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.page = page;

   // if(!((test instanceof HomePage) && page == this.homePage)){
	    if(page.iosSchemaName != null && page.androidPackageName != null){
	        this.launchExternalApp(page.iosSchemaName, page.androidPackageName, page.appUrl, page.httpUrl);
	    }
	    else {if(page != this.homePage){
       	/*	if(this.nav.length() > 1){
      			this.nav.pop();
      		}*/

      		this.nav.navigateRoot(page.component);
  		}}
   // }

  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string) {
	  let app: string;
    	//let storeUrl:string;
    	let check:string;
  	if (this.device.platform === 'iOS') {
  		app = iosSchemaName;
      //storeUrl=httpUrl;
      	check=appUrl;
  	} else if (this.device.platform === 'Android') {
  		app = androidPackageName;
      //storeUrl= 'market://details?id='+ app;
      	check=app;

  	} else {
  		const browser = this.iab.create(httpUrl, '_system');
      browser.close();
  	}
  	this.appAvailability.check(check).then(
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
