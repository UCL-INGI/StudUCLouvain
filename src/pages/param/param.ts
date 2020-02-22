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

import { UserService } from '../../providers/utils-services/user-service';
import { UtilsService } from '../../providers/utils-services/utils-service';

@IonicPage()
@Component({
  selector: 'page-param',
  templateUrl: 'param.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '45px'})),
      state('false', style({height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class ParamPage {
  title: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public userS: UserService,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
  }

  campus_choice() {
    const [setting, message, save] = this.utilsService.getTexts(
      'HOME',
      ['SETTING1', 'MESSAGE', 'SAVE']
    );
    this.getSettingsAlert(setting, message, this.userS.campus, save).present();
  }

  language_choice() {
    const [message2, en, fr, setting2, save] = this.utilsService.getTexts(
      'HOME',
      ['SETTING2', 'MESSAGE2', 'FR', 'EN', 'SAVE']
    );
    this.alertCtrl.create({
      title: setting2,
      message: message2,
      inputs: this.utilsService.getLanguageAlertInputs(fr, en, this.translateService.currentLang),
      buttons: [
        {
          text: save,
          handler: data => this.languageChanged(data)
        }
      ]
    }).present();
  }

  languageChanged(event: string) {
    this.userS.storage.set('lan', event);
    this.translateService.use(event);
  }

  openTuto() {
    this.navCtrl.push('TutoPage');
  }

  private getSettingsAlert(setting: any, message: any, check: string, save: any) {
    return this.alertCtrl.create({
      title: setting,
      message: message,
      inputs: this.getSettingsInputs(check),
      buttons: [
        {
          text: save,
          handler: data => this.userS.addCampus(data)
        }
      ]
    });
  }

  private getCampusChoiceInput(label: string, value: string, check: string) {
    return {
      type: 'radio',
      label: label,
      value: value,
      checked: check === value
    };
  }

  private getSettingsInputs(check: string) {
    return [
      this.getCampusChoiceInput('Louvain-la-Neuve', 'LLN', check),
      this.getCampusChoiceInput('Woluwé', 'Woluwe', check),
      this.getCampusChoiceInput('Mons', 'Mons', check),
      {
        type: 'radio',
        label: 'Tournai',
        value: 'Tournai',
        disabled: true
      },
      {
        type: 'radio',
        label: 'St-Gilles',
        value: 'StG',
        disabled: true
      }
    ];
  }
}
