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

import { Component,ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController }
        from 'ionic-angular';
import { POIService } from '../../../providers/map-services/poi-service';
import { MapService } from '../../../providers/map-services/map-service';
import { Storage } from '@ionic/storage';
import { MapLocation } from '../../../app/entity/mapLocation';

/**
 * Generated class for the ModalProjectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  location : any = this.navParams.get('location');
  selectedLocation: any = [];
    userLocation:any = [];
      showedLocations: MapLocation[] = [];

  constructor(public navCtrl: NavController,
    public storage:Storage,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public mapService: MapService,
    public poilocations: POIService) {
  }

 closeModal() {

        this.viewCtrl.dismiss();

  }

 ngAfterViewInit(){
    let mapLoaded = this.mapService.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);

    Promise.all([
      mapLoaded
    ]).then((result) => {
      this.userLocation = this.mapService.getUserLocation();
      this.selectedLocation = this.userLocation;
      this.showedLocations.push(this.selectedLocation);

      if(result[0]) {
        this.mapService.addMarker(this.selectedLocation);
      }
    });
  }


  /*getProjects(sessionId :string){
    this.studiesService.getProjects(sessionId).then(
      data => {
        this.projects = data;
    });
  }*/

  ionViewDidLoad() {
    //this.getProjects(this.sessionId);
  }

}
