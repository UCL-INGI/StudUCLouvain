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

import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserService } from '../../providers/utils-services/user-service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-param',
  templateUrl: 'param.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class ParamPage {
  title: any;
  shownGroup = null;
  setting:string ="Campus";
  setting2:string ="Langue";
  message:string = "Dans quel campus êtes-vous?";
  message2:string = "Quelle langue choisissez-vous?";
  save:string = "OK";
  en:string = "English";
  fr:string = "Français";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private iab: InAppBrowser,
              public userS:UserService,
              private alertCtrl : AlertController,
              private translateService: TranslateService) {
    this.title = this.navParams.get('title');
  }

  campus_choice(){
    let check = this.userS.campus;
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
        }
      }]
    });
    settingsAlert.present();
  }

  language_choice(){
    let check2 = this.translateService.currentLang;
    let languageAlert = this.alertCtrl.create({
      title: this.setting2,
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
    languageAlert.present();
  }

  languageChanged(event:string) {
         this.translateService.use(event);
     }
}
