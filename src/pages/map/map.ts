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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { POIService } from '../../providers/map-services/poi-service';
import { MapService } from '../../providers/map-services/map-service';
import { MapLocationSelectorPage }
  from './map-location-selector/map-location-selector';
import { NavController, Platform, ActionSheetController, ModalController,
   MenuController, NavParams } from 'ionic-angular';
import { GoogleMap } from '@ionic-native/google-maps';
import { MapLocation } from '../../app/entity/mapLocation';

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
  map: GoogleMap;
  public title: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public mapService: MapService,
    public platform: Platform,
    public navParams: NavParams,
    public poilocations: POIService,
    public menuCtrl: MenuController) {
      this.title = this.navParams.get('title');
  }

  ngAfterViewInit(){
    let mapLoaded = this.mapService.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
    let zones = this.poilocations.loadResources();

    Promise.all([
      mapLoaded,
      zones
    ]).then((result) => {
      this.zones = result[1];
      this.filters = this.zones;
      this.userLocation = this.mapService.getUserLocation();
      this.selectedLocation = this.userLocation;
      this.showedLocations.push(this.selectedLocation);
      this.mapService.addMarker(this.selectedLocation.lat, this.selectedLocation.lng, this.selectedLocation.address, this.selectedLocation.title);
    });
  }

  toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'arrow-dropdown';
    } else {
        data.showDetails = true;
        data.icon = 'arrow-dropup';
    }
  }

  toggleLocation(data, checkList, index) {
    if (checkList[index] === true) {
      this.addShowedLocations(data);
    } else {
      this.removeShowedLocations(data);
    }
  }

  addShowedLocations(rawLocation){
    this.showedLocations.push(rawLocation);
  }

  removeShowedLocations(rawLocation){
    let locToRemove = this.showedLocations.find(item => item.title === rawLocation.title);
    this.showedLocations.splice(this.showedLocations.indexOf(locToRemove),1);
  }

  presentFilter() {
    this.showLocationList = !this.showLocationList;
  }

  presentSelector() {
    let modal = this.modalCtrl.create(MapLocationSelectorPage,
                  { locations: this.showedLocations, current: this.selectedLocation });
    this.mapElement.nativeElement.style.display = "none";
    modal.present();

    modal.onWillDismiss((data: any) => {
      if (data) {
        if(this.selectedLocation !== data){
          this.selectedLocation = data;
          this.mapService.moveCameraTo(this.selectedLocation);
          this.mapService.addMarker(this.selectedLocation.lat, this.selectedLocation.lng, this.selectedLocation.address, this.selectedLocation.title);
        }
      }
      this.mapElement.nativeElement.style.display = "block";
    });

  }

  public toggleMarker(title: string) {
    this.mapService.toggleMarker(title);
  }

}
