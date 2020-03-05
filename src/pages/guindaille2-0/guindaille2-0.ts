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

import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-guindaille2-0',
  templateUrl: 'guindaille2-0.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '45px'})),
      state('false', style({height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class GuindaillePage {
  title: any;
  shownGroup = null;
  segment = 'pict';

  alt: string;
  altsub: string;
  alterner = {title: '', subTitle: '', buttons: ['OK']};

  brt: string;
  brtsub: string;
  bruit = {title: '', subTitle: '', buttons: ['OK']};

  wat: string;
  watsub: string;
  eau = {title: '', subTitle: '', buttons: ['OK']};

  where: string;
  wheresub: string;
  ou = {title: '', subTitle: '', buttons: ['OK']};

  can: string;
  cansub: string;
  cans = {title: '', subTitle: '', buttons: ['OK']};

  pres: string;
  pressub: string;
  preservatif = {title: '', subTitle: '', buttons: ['OK']};

  rac: string;
  racsub: string;
  racompagner = {title: '', subTitle: '', buttons: ['OK']};

  ur: string;
  ursub: string;
  uriner = {title: '', subTitle: '', buttons: ['OK']};

  de: string;
  desub: string;
  dehors = {title: '', subTitle: '', buttons: ['OK']};

  vio: string;
  viosub: string;
  violence = {title: '', subTitle: '', buttons: ['OK']};

  ttl1: string;
  efct1: string;
  ttl2: string;
  efct2: string;
  ttl3: string;
  efct3: string;
  ttl4: string;
  efct4: string;
  ttl5: string;
  efct5: string;
  ttl6: string;
  efct6: string;

  slides = [
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/1.png'
    },
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/2.png'
    },
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/3.png'
    },
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/4.png'
    },
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/5.png'
    },
    {
      title: '',
      subTitle: '',
      buttons: ['OK'],
      image: 'assets/img/guindaille/6.png'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public translateService: TranslateService
  ) {
    this.title = this.navParams.get('title');
    this.getPictograms();
    this.getSlides();
  }

  showAlert(page) {
    const alert = this.alertCtrl.create(page);
    alert.present();
  }

  private getSlides() {
    const ttls = [this.ttl1, this.ttl2, this.ttl3, this.ttl4, this.ttl5, this.ttl6];
    const efcts = [this.efct1, this.efct2, this.efct3, this.efct4, this.efct5, this.efct6];
    for (let i = 0; i < ttls.length; i++) {
      this.getSlide(i, ttls[i], efcts[i]);
    }
  }

  private getSlide(i: number, title: string, effect: string) {
    const real_index = i + 1;
    this.translateService.get('GUINDAILLE.TITLEF' + real_index).subscribe((res: string) => {
      title = res;
    });
    this.translateService.get('GUINDAILLE.EFFECT' + real_index).subscribe((res: string) => {
      effect = res;
    });
    this.slides[i].title = title;
    this.slides[i].subTitle = effect;
  }

  private getPictograms() {
    const titles = [this.alt, this.brt, this.wat, this.where, this.can, this.pres, this.rac, this.ur, this.de, this.vio];
    const pics = [
      this.altsub, this.brtsub, this.watsub, this.wheresub, this.cansub, this.pressub, this.racsub, this.ursub, this.desub, this.viosub
    ];
    const items = [
      this.alterner, this.bruit, this.eau, this.ou, this.cans, this.preservatif, this.racompagner, this.uriner, this.dehors, this.violence
    ];
    for (let i = 0; i < titles.length; i++) {
      this.getPictogram(i, titles[i], pics[i], items[i]);
    }
  }

  private getPictogram(i: number, title: string, pict: string, item: any) {
    const real_index = i + 1;
    this.translateService.get('GUINDAILLE.TITLE' + real_index).subscribe((res: string) => {
      title = res;
    });
    this.translateService.get('GUINDAILLE.PIC' + real_index).subscribe((res: string) => {
      pict = res;
    });
    item.title = title;
    item.subTitle = pict;
  }
}
