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

import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-guindaille2-0',
  templateUrl: 'guindaille2-0.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})

export class GuindaillePage {
  title: any;
  shownGroup = null;
  segment:string = 'pict';

  /*Create that to use the system of bilingual application, the objects are instantiate here
  One object for each pictogram*/

  alt:string;
  altsub:string;
  alterner = { title: '',
          subTitle: '',
          buttons: ['OK'] };

  brt:string;
  brtsub:string;
  bruit = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  wat:string;
  watsub:string;
  eau = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  where:string;
  wheresub:string;
  ou = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  can:string;
  cansub:string;
  cans = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  pres:string;
  pressub:string;
  preservatif = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  rac:string;
  racsub:string;
  racompagner = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  ur:string;
  ursub:string;
  uriner = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  de:string;
  desub:string;
  dehors = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  vio:string;
  viosub:string;
  violence = { title: '',
      subTitle: '',
      buttons: ['OK'] };

  /*Create that to use the system of bilingual application, the objects are instantiate here
  title and efct for each part of the effectometre*/
  ttl1:string;
  efct1:string;
  ttl2:string;
  efct2:string;
  ttl3:string;
  efct3:string;
  ttl4:string;
  efct4:string;
  ttl5:string;
  efct5:string;
  ttl6:string;
  efct6:string;

  /*Create that to use the system of bilingual application, the objects are instantiate here
  One object each part of the effectometre*/

  slides = [
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/1.png",
      },
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/2.png",
      },
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/3.png",
      },
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/4.png",
      },
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/5.png",
      },
      {
        title: '',
        subTitle: '',
        buttons: ['OK'],
        image: "assets/img/guindaille/6.png",
      }];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public translateService: TranslateService)
  {
      this.title = this.navParams.get('title');

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE1').subscribe((res:string) => {this.alt=res;});
      this.translateService.get('GUINDAILLE.PIC1').subscribe((res:string) => {this.altsub=res;});
      //put real value for each attributes
      this.alterner.title = this.alt;
      this.alterner.subTitle = this.altsub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE2').subscribe((res:string) => {this.brt=res;});
      this.translateService.get('GUINDAILLE.PIC2').subscribe((res:string) => {this.brtsub=res;});
      //put real value for each attributes
      this.bruit.title = this.brt;
      this.bruit.subTitle = this.brtsub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE3').subscribe((res:string) => {this.wat=res;});
      this.translateService.get('GUINDAILLE.PIC3').subscribe((res:string) => {this.watsub=res;});
      //put real value for each attributes
      this.eau.title = this.wat;
      this.eau.subTitle = this.watsub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE4').subscribe((res:string) => {this.where=res;});
      this.translateService.get('GUINDAILLE.PIC4').subscribe((res:string) => {this.wheresub=res;});
      //put real value for each attributes
      this.ou.title = this.where;
      this.ou.subTitle = this.wheresub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE5').subscribe((res:string) => {this.can=res;});
      this.translateService.get('GUINDAILLE.PIC5').subscribe((res:string) => {this.cansub=res;});
      //put real value for each attributes
      this.cans.title = this.can;
      this.cans.subTitle = this.cansub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE6').subscribe((res:string) => {this.pres=res;});
      this.translateService.get('GUINDAILLE.PIC6').subscribe((res:string) => {this.pressub=res;});
      //put real value for each attributes
      this.preservatif.title = this.pres;
      this.preservatif.subTitle = this.pressub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE7').subscribe((res:string) => {this.rac=res;});
      this.translateService.get('GUINDAILLE.PIC7').subscribe((res:string) => {this.racsub=res;});
      //put real value for each attributes
      this.racompagner.title = this.rac;
      this.racompagner.subTitle = this.racsub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE8').subscribe((res:string) => {this.ur=res;});
      this.translateService.get('GUINDAILLE.PIC8').subscribe((res:string) => {this.ursub=res;});
      //put real value for each attributes
      this.uriner.title = this.ur;
      this.uriner.subTitle = this.ursub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE9').subscribe((res:string) => {this.de=res;});
      this.translateService.get('GUINDAILLE.PIC9').subscribe((res:string) => {this.desub=res;});
      //put real value for each attributes
      this.dehors.title = this.de;
      this.dehors.subTitle = this.desub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLE10').subscribe((res:string) => {this.vio=res;});
      this.translateService.get('GUINDAILLE.PIC10').subscribe((res:string) => {this.viosub=res;});
      //put real value for each attributes
      this.violence.title = this.vio;
      this.violence.subTitle = this.viosub;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF1').subscribe((res:string) => {this.ttl1=res;});
      this.translateService.get('GUINDAILLE.EFFECT1').subscribe((res:string) => {this.efct1=res;});
      //put real value for each attributes
      this.slides[0].title = this.ttl1;
      this.slides[0].subTitle = this.efct1;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF2').subscribe((res:string) => {this.ttl2=res;});
      this.translateService.get('GUINDAILLE.EFFECT2').subscribe((res:string) => {this.efct2=res;});
      //put real value for each attributes
      this.slides[1].title = this.ttl2;
      this.slides[1].subTitle = this.efct2;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF3').subscribe((res:string) => {this.ttl3=res;});
      this.translateService.get('GUINDAILLE.EFFECT3').subscribe((res:string) => {this.efct3=res;});
      //put real value for each attributes
      this.slides[2].title = this.ttl3;
      this.slides[2].subTitle = this.efct3;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF4').subscribe((res:string) => {this.ttl4=res;});
      this.translateService.get('GUINDAILLE.EFFECT4').subscribe((res:string) => {this.efct4=res;});
      //put real value for each attributes
      this.slides[3].title = this.ttl4;
      this.slides[3].subTitle = this.efct4;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF5').subscribe((res:string) => {this.ttl5=res;});
      this.translateService.get('GUINDAILLE.EFFECT5').subscribe((res:string) => {this.efct5=res;});
      //put real value for each attributes
      this.slides[4].title = this.ttl5;
      this.slides[4].subTitle = this.efct5;

      //get the good value
      this.translateService.get('GUINDAILLE.TITLEF6').subscribe((res:string) => {this.ttl6=res;});
      this.translateService.get('GUINDAILLE.EFFECT6').subscribe((res:string) => {this.efct6=res;});
      //put real value for each attributes
      this.slides[5].title = this.ttl6;
      this.slides[5].subTitle = this.efct6;
  }

  /*Display alert*/
  showAlert(page) {
      let alert = this.alertCtrl.create(page).then(alert => alert.present());
  }
}
