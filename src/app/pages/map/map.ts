/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire, Corentin Lamy, Daubry Benjamin & Marchesini Bruno
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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, ActionSheetController, ModalController, NavParams } from '@ionic/angular';

import { POIService } from '../../services/map-services/poi-service';
import { MapService } from '../../services/map-services/map-service';

import { MapLocation } from '../../entity/mapLocation';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  showedLocations: MapLocation[] = [];
  zones: any;
  filters : any;
  excludedFilters : any = [];
  selectedLocation: any = [];
  userLocation:any = [];
  showLocationList = false;
  title: any;
  searching: boolean = false;
  temp:any;
  temp2:any;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,
              public mapService: MapService,
              public platform: Platform,
              public navParams: NavParams,
              public poilocations: POIService)
  {
      this.title = this.navParams.get('title');
  }

  /*ngAfterViewInit() is called after the view is initially rendered, load map and list of positions*/
  ngAfterViewInit(){
    let mapLoaded = this.mapService.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
    let zones = this.poilocations.loadResources();
    this.searching = true;

    Promise.all([
      mapLoaded,
      zones
    ]).then((result) => {
      this.searching = false;
      this.zones = result[1];
      this.filters = this.zones;
      this.userLocation = this.mapService.getUserLocation();
      this.selectedLocation = this.userLocation;
      this.showedLocations.push(this.selectedLocation);
      if(result[0]) {
        this.mapService.addMarker(this.selectedLocation);
      }
    }, (error) => {
    });
  }

  /*Use to display or close the list of a type of positions (auditoires, parkings, bibliotheques, ...)*/
  toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'arrow-dropdown';
    } else {
        data.showDetails = true;
        data.icon = 'arrow-dropup';
    }
  }

  /*select or unselect a specific location*/
  toggleLocation(data, checkList, index) {
    if (checkList[index] === true) {
      this.addShowedLocations(data);
      this.onSelect(data);
    } else {
      this.removeShowedLocations(data);
      this.mapService.removeMarker(data);
    }
  }

  /*push a location to display*/
  addShowedLocations(rawLocation){
    this.showedLocations.push(rawLocation);
  }

  /*remove a location displayed*/
  removeShowedLocations(rawLocation){
    let locToRemove = this.showedLocations.find(item => item.title === rawLocation.title);
    this.showedLocations.splice(this.showedLocations.indexOf(locToRemove),1);
  }

  /*when select an location*/
  onSelect(data:any){
    if(this.selectedLocation !== data){
      this.selectedLocation = data;
    }
    this.mapService.addMarker(this.selectedLocation);
  }
}
