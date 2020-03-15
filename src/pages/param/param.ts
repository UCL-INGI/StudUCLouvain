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
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../services/utils-services/user-service';
import { UtilsService } from '../../services/utils-services/utils-service';
import { SettingsProvider } from "../../services/utils-services/settings-service";

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
  selectedTheme: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public userS: UserService,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private settings: SettingsProvider
  ) {
    this.title = this.navParams.get('title');
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }

  async campus_choice() {
    const settingsAlert = await this.alertCtrl.create({
      header: this.utilsService.getText('HOME', 'SETTING1'),
      message: this.utilsService.getText('HOME', 'MESSAGE'),
      inputs: this.getSettingsInputs(this.userS.campus),
      cssClass: this.selectedTheme,
      buttons: [
        {
          text: this.utilsService.getText('HOME', 'SAVE'),
          handler: data => {
            this.userS.addCampus(data);
          }
        }
      ]
    });
    return await settingsAlert.present();
  }

  async language_choice() {
    const languageAlert = await this.alertCtrl.create({
      header: this.utilsService.getText('HOME', 'SETTING2'),
      message: this.utilsService.getText('HOME', 'MESSAGE2'),
      cssClass: this.selectedTheme,
      inputs: this.utilsService.getLanguageAlertInputs(this.translateService.currentLang),
      buttons: [
        {
          text: this.utilsService.getText('HOME', 'SAVE'),
          handler: data => {
            this.languageChanged(data);
          }
        }
      ]
    });
    return await languageAlert.present();
  }

  languageChanged(event: string) {
    this.userS.storage.set('lan', event);
    this.translateService.use(event);
  }

  openTuto() {
    this.navCtrl.navigateForward(['TutoPage']);
  }

  private getCampusChoiceInput(label: string, value: string, check: string) {
    const type: any = "radio";
    return {
      type: type,
      label: label,
      value: value,
      checked: check === value
    };
  }

  private getSettingsInputs(check: string) {
    const type: any = "radio";
    return [
      this.getCampusChoiceInput('Louvain-la-Neuve', 'LLN', check),
      this.getCampusChoiceInput('Woluwé', 'Woluwe', check),
      this.getCampusChoiceInput('Mons', 'Mons', check),
      {
        type: type,
        label: 'Tournai',
        value: 'Tournai',
        disabled: true
      },
      {
        type: type,
        label: 'St-Gilles',
        value: 'StG',
        disabled: true
      }
    ];
  }
}
