import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, IonContent} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { AppComponent } from '../../app.component';
import { Market } from '@ionic-native/market/ngx';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../services/user.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  title:string = "Stud.UCLouvain";
  shownGroup = null;
  where = "";
  myApp : AppComponent;

  /*Create an object Page for each feature of our application display in the home page*/

  libraryPage = { title: 'MENU.LIBRARY', route: '/library',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  newsPage = { title: 'MENU.NEWS', route: '/news',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  eventPage = { title: 'MENU.EVENTS', route: '/events',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  sportPage = { title: 'MENU.SPORTS', route: '/sports',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  studiesPage = { title: 'MENU.STUDIES', route: '/studies',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  helpDeskPage = { title: 'MENU.HELP', route: '/support',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };

  mapPage = { title: 'MENU.MAP', route: '/map',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  guindaillePage = { title: 'MENU.PARTY', route: '/',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  paramPage = { title: 'MENU.PARAM', route: '/param',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null  };

  restoPage = { title: 'MENU.RESTAURANT', route: '/restaurant',
    iosSchemaName: 'id1156050719',
    androidPackageName: 'com.apptree.resto4u',
    appUrl: 'apptreeresto4u://',
    httpUrl: 'https://uclouvain.be/fr/decouvrir/resto-u' };

  mobilityPage = { title: 'MENU.MOBILITY', route: '/mobility',
    iosSchemaName: null, androidPackageName: null,
    appUrl: null, httpUrl: null };


  constructor(
    public userS:UserService,
    public nav : NavController,
    private iab: InAppBrowser,
    private appAvailability: AppAvailability,
    private device: Device,
    private alertCtrl : AlertController,
    private translateService: TranslateService,
    public market: Market,
    public loadingCtrl: LoadingController,
    public studentService : StudentService,
    public splashscreen: SplashScreen
    ){
     /* if(this.navParams.get('title') !== undefined) {
        this.title = this.navParams.get('title');
      }*/
      console.log(this.title);
      document.title = this.title;
  }

  /*Set the title*/
  ionViewDidEnter() {
    setTimeout(()=>{
      this.splashscreen.hide();
    },1000);
  }

  /*Update the public variable campus for the user*/
  updateCampus(){
    this.userS.addCampus(this.where);
  }

  /*Change page when click on a page of the home of launchExternalApp if it's the resto U*/
  changePage(page) {
    if(page.iosSchemaName != null && page.androidPackageName != null){
      this.launchExternalApp(page);
    }
    else{
      this.nav.navigateRoot(page.route);
    }
  }

  /*launch external application*/
  launchExternalApp(page) {
    let app: string;
    //let storeUrl:string;
    let check:string;
    if (this.device.platform === 'iOS') {
      app = page.iosSchemaName;
      //storeUrl=page.httpUrl;
      check=page.appUrl;
    } else if (this.device.platform === 'Android') {
      app = page.androidPackageName;
      //storeUrl= 'market://details?id='+ app;
      check=app;
    } else {
      const browser = this.iab.create(page.httpUrl, '_system');
      browser.close();
    }
    this.appAvailability.check(check).then(
      () => { // success callback
      console.log("have APP");
        const browser = this.iab.create(page.appUrl, '_system');
        browser.close();
      },
      () => { // error callback
      console.log("not have APP");
        this.market.open(app);
      }
    );
  }

  /*Open the URL for the social media of the UCL*/
  public openURL(url: string) {
    this.iab.create(url, '_system');
  }
  public openUCL(url: string) {
    this.iab.create(url, '_system');
  }

  /*If the user change the language of the app, tranlate the text and change the public variable*/
  languageChanged(event:string) {
    this.userS.storage.set('lan',event);
    this.translateService.use(event);
  }

  /*Create an alert to allow the user to change the parameters of the application (language and campus)*/
  settings(){
    let check = this.userS.campus;
    let check2 = this.translateService.currentLang;
    let settings, message, save, message2, fr, en:string;
    this.translateService.get('HOME.SETTINGS').subscribe((res:string) => {settings=res;});
    this.translateService.get('HOME.MESSAGE').subscribe((res:string) => {message=res;});
    this.translateService.get('HOME.SAVE').subscribe((res:string) => {save=res;});
    this.translateService.get('HOME.MESSAGE2').subscribe((res:string) => {message2=res;});
    this.translateService.get('HOME.FR').subscribe((res:string) => {fr=res;});
    this.translateService.get('HOME.EN').subscribe((res:string) => {en=res;});

    let settingsAlert = this.alertCtrl.create({
            header: settings,
            message: message,
            inputs : [
                {
                    type:'radio',
                    label:'Louvain-la-Neuve',
                    value:'LLN',
                    //checked:(check == 'LLN')
                },
                {
                    type:'radio',
                    label:'Woluwe',
                    value:'Woluwe',
                    //checked:(check == 'Woluwe')
                },
                {
                    type:'radio',
                    label:'Mons',
                    value:'Mons',
                    //checked:(check == 'Mons')
                }],
            buttons: [
                {
                    text: save,
                    handler: data => {
                      this.userS.addCampus(data);
                      languageAlert.then(alert => alert.present());
                    }
                }
            ]
        });
        settingsAlert.then(alert => alert.present());

        let languageAlert = this.alertCtrl.create({
          header: settings,
          message : message2,
          inputs : [
            {
              type:'radio',
              label:fr,
              value:'fr',
              checked:(check2 == 'fr')
            },
            {
              type:'radio',
              label:en,
              value:'en',
              checked:(check2 == 'en')
            }
          ],
          buttons: [
          {
            text:save,
            handler:data => {
               this.languageChanged(data);
            }
          }]
        });

  }

  /*action when click on the floating urgency button, display the text to help the user in an alert*/
  emergency(){
    let close :string;
    this.translateService.get('HOME.CLOSE').subscribe((res:string) => {close=res;});
    let urg:string;
    this.translateService.get('HOME.URG').subscribe((res:string) => {urg=res;});
    let msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9 : string;
    this.translateService.get('GUINDAILLE.HELP1').subscribe((res:string) => {msg1=res;});
    this.translateService.get('GUINDAILLE.HELP2').subscribe((res:string) => {msg2=res;});
    this.translateService.get('GUINDAILLE.HELP3').subscribe((res:string) => {msg3=res;});
    this.translateService.get('GUINDAILLE.HELP4').subscribe((res:string) => {msg4=res;});
    this.translateService.get('GUINDAILLE.HELP5').subscribe((res:string) => {msg5=res;});
    this.translateService.get('GUINDAILLE.HELP6').subscribe((res:string) => {msg6=res;});
    this.translateService.get('GUINDAILLE.HELP7').subscribe((res:string) => {msg7=res;});
    this.translateService.get('GUINDAILLE.HELP8').subscribe((res:string) => {msg8=res;});
    this.translateService.get('GUINDAILLE.HELP9').subscribe((res:string) => {msg9=res;});
    let out:string;
    this.translateService.get('GUINDAILLE.HELP18').subscribe((res:string) => {out=res;});
    let alert = this.alertCtrl.create({
      header: urg,
      message: "<p> <strong>" + msg1 + "</strong>: <br><font size=\"+1\"><a href=\"tel:010 47 22 22\">010 47 22 22</a></font> </p> <p><strong>" + msg2 + "</strong>: <br><font size=\"+1\"><a href=\"tel:010 47 24 24\">010 47 24 24</a></font> <br>ou<br> <font size=\"+1\"><a href=\"tel:02 764 93 93\">02 764 93 93</a></font> <br>(Woluwe - St Gilles - Tournai)<br> ou <br><font size=\"+1\"><a href=\"tel:065 32 35 55\">065 32 35 55</a></font> (Mons)</p> <p><strong>Contact:</strong> <a href=\"mailto:security@uclouvain.be\">security@uclouvain.be</a></p> <p><strong>" + out + ":</strong> <font size=\"+1\"><a href=\"tel:112\">112</a></font></p>  <p> <br>" + msg3 + " <br><br> <strong>" + msg4 + "</strong> " + msg5 + "<br> <strong>" + msg6 + "</strong> " + msg7 + "<br> <strong>" + msg8 + "</strong> " + msg9 +"<br>",
      cssClass: "emergency",
      buttons: [
      {
        text:close,
        handler:data => {
        }
      }]
    }).then(alert => alert.present());

  }
}
