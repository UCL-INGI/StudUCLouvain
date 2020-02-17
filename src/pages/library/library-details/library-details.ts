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

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { LibraryItem } from '../../../app/entity/libraryItem';
import { ConnectivityService } from '../../../providers/utils-services/connectivity-service';
import { UtilsService } from '../../../providers/utils-services/utils-service';
import { LibrariesService } from '../../../providers/wso2-services/libraries-service';

@IonicPage()
@Component({
  selector: 'page-library-details',
  templateUrl: 'library-details.html',
  animations: [
    trigger('expand', [
      state('true', style({ height: '45px' })),
      state('false', style({ height: '0' })),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class LibraryDetailsPage {
  libDetails: LibraryItem;
  searching = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libService: LibrariesService,
    public connService: ConnectivityService,
    public utilsService: UtilsService
  ) {
    this.libDetails = navParams.get('lib');
    this.searching = true;
    if (this.connService.isOnline()) {
      this.libService.loadLibDetails(this.libDetails).then(res => {
        const result: any = res;
        this.libDetails = result.libDetails;
        this.searching = false;
      });
    } else {
      this.searching = false;
      this.connService.presentConnectionAlert();
    }
  }

  openPage(url: string) {
    window.open(url, '_blank');
  }
}
