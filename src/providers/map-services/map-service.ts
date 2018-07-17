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


// This code is inspired from the great Josh Morony tutorials :
// https://www.joshmorony.com/creating-an-advanced-google-maps-component-in-ionic-2/

import { Injectable } from '@angular/core';
import { ConnectivityService } from '../utils-services/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform, MenuController } from 'ionic-angular';
import { GoogleMap,
   GoogleMapsEvent,
   LatLng,
   CameraPosition,
   MarkerOptions,
   Marker,
   GoogleMapsMapTypeId} from '@ionic-native/google-maps';
import { MapLocation } from '../../app/entity/mapLocation';
import { jsApiKey } from '../../app/variables-config';

declare var google;

@Injectable()
export class MapService {

  //TODO : virer code redondant, check couplage + abstraction des données

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  markers: any = [];
  apiKey: string;
  userLocation: MapLocation;
  onDevice: boolean;

  constructor(public connectivityService: ConnectivityService,
              private geolocation : Geolocation,
              private platform: Platform,
              menuCtrl: MenuController) {
    this.onDevice = this.platform.is('android') || this.platform.is('ios');
    this.apiKey = jsApiKey;
    let leftMenu = menuCtrl.get('left');

    if(leftMenu) {
      leftMenu.ionOpen.subscribe(() => {
        if(this.map && this.onDevice) {
          this.map.setClickable(false);
        }
      });

      leftMenu.ionClose.subscribe(() => {
        if(this.map && this.onDevice) {
          this.map.setClickable(true);
        }
      });
    }
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    if(this.onDevice) {
      return this.loadDeviceGoogleMaps();
    } else {
      return this.loadBrowserGoogleMaps();
    }
  }

  private loadBrowserGoogleMaps(): Promise<any> {

    return new Promise((resolve, reject) => {

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        this.showPleaseConnect();

        if(this.connectivityService.isOnline()){
          window['mapInit'] = () => {
            this.initBrowserMap().then(
              (init) => {
                resolve(init);
              }, error => {
                reject(error);
              });

            this.hidePleaseConnect();
          }
          let script = document.createElement("script");
          script.id = "googleMaps";

          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }
          document.body.appendChild(script);
        }
      }
      else {
        if(this.connectivityService.isOnline()){
          this.initBrowserMap().then(
            (init) => {
              resolve(init);
            }, error => {
              reject(error);
            });
          this.hidePleaseConnect();
        }
        else {
          this.showPleaseConnect();
        }
      }
      this.addConnectivityListeners();
    });
  }

  private initBrowserMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then(
        (position) => {
          this.userLocation =new MapLocation( "Ma Position",
                                      "Mon adresse",
                                      String(position.coords.latitude),
                                      String(position.coords.longitude),
                                      "MYPOS");

          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

          this.map = new google.maps.Map(this.mapElement, mapOptions);
          resolve(true);
        }, (error) => {
          console.log("Map error loadDeviceGoogleMaps : " + error);
          reject(false);
        });

    });

  }

  private loadDeviceGoogleMaps() : Promise<any>{
    return new Promise((resolve, reject) => {
      if(this.connectivityService.isOnline()){
        this.initDeviceMap().then(
          (init) => {
            resolve(true);
          },(error) => {
            reject(false);
          });
        this.hidePleaseConnect();
      }
      else {
        this.showPleaseConnect();
      }

      this.addConnectivityListeners();
    });
  }

  private initDeviceMap() : Promise<any> {
    console.log("initDeviceMap - ask geolocation");

    return new Promise((resolve, reject) => {

      this.geolocation.getCurrentPosition().then(
        (position) => {
          console.log("initDeviceMap - geolocation answered");
          this.userLocation = new MapLocation( "Ma Position",
                                      "",
                                      String(position.coords.latitude),
                                      String(position.coords.longitude),
                                      "MYPOS");

          let latLng = new LatLng(position.coords.latitude, position.coords.longitude);

          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: GoogleMapsMapTypeId.ROADMAP
          }

          // create CameraPosition
          let camPos: CameraPosition = {
            target: latLng,
            zoom: 15
          };

          this.map = new GoogleMap(this.mapElement, mapOptions);

          this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
            this.map.moveCamera(camPos);
            resolve(true);
          });
        }, (error) => {
          console.log("Map error initDeviceMap : " + error);
          reject(false);
        });

    });
  }

  addMarker(location: MapLocation) {
    //console.log(this.markers);
    let marker = this.getMarker(location.title);

    if(!marker) {
      let contentString = "<p>"+ location.address +"</p>";

      if(this.onDevice) {
        this.addDeviceMarker(parseFloat(location.lat), parseFloat(location.lng),  location.address, location.title);
      } else {
        this.addBrowserMarker(parseFloat(location.lat), parseFloat(location.lng), contentString, location.title);
      }
    } else {
      if(this.onDevice) {
        marker.showInfoWindow();
      }
    }
    //console.log(this.markers);
}

    removeMarker(location: MapLocation) {
      //console.log(location);
      //console.log(this.markers);
      for(var i=0;i<this.markers.length; i++){
         if(this.markers[i].getTitle() === location.title) {
          //console.log(this.markers[i]);
          //let m: Marker = this.markers[i];
         //m.remove();
          this.markers[i].setMap(null);
          //this.markers[i]=null;
          this.markers.splice(i,1);
          //console.log(this.markers);
          if(this.onDevice){
            this.map.clear();
            this.addMarker(this.userLocation);
          }
        }
      }

            

  }


  private addBrowserMarker(lat: number, lng: number, content: string, title: string) {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: title
    });

    this.markers.push(marker);
    this.addBrowserInfoWindow(marker, title+"\n"+content);
  }

  private addBrowserInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

    infoWindow.open(this.map,marker);
  }

  private addDeviceMarker(lat: number, lng: number, address: string, title: string) {

    let latLng = new LatLng(lat, lng);

    let markerOptions: MarkerOptions = {
      position: latLng,
      title: title,
      snippet: address
    };

    this.map.addMarker(markerOptions).then(
      (marker: Marker) => {
        marker.showInfoWindow();
        this.markers.push(marker);
        this.setCenteredMarkerOnDevice(title, lat, lng);
      });
  }

  private getMarker(title: string) : Marker{
    let res = null;
    this.markers.map((marker) => {

      if(marker.getTitle() === title) {
        res=marker;
      }
    });
    return res;
  }

  toggleMarker(title: string){
    if(this.onDevice) {
      this.toggleMarkerOnDevice(title);
    } else {
      this.toggleMarkerOnBrowser(title);
    }
  }

  private toggleMarkerOnDevice(title:string) {
    this.markers.map((marker) => {
      if(marker.getTitle() === title) {
        if(marker.isVisible()){
          marker.setVisible(false);
        } else {
          marker.setVisible(true);
          marker.showInfoWindow();
        }
      }
    });
  }

  private toggleMarkerOnBrowser(title:string) {
    this.markers.map((marker) => {
      if(marker.getTitle() === title) {
        if(marker.getVisible()){
          marker.setVisible(false);
        } else {
          marker.setVisible(true);
        }
      }
    });
  }

  setCenteredMarker(location: MapLocation) {
    if(this.onDevice) {
      this.setCenteredMarkerOnDevice(location.title, parseFloat(location.lat), parseFloat(location.lng));
    } else {
      this.setCenteredMarkerOnBrowser(location.title);
    }
  }

  private setCenteredMarkerOnBrowser(title:string) {
    this.markers.map((marker) => {
      if(marker.getTitle() == title) {
        this.map.panTo(marker.getPosition());
      }
    });
  }

  private setCenteredMarkerOnDevice(title:string, lat:number, lng:number) {
    this.markers.map((marker) => {
      if(marker.getTitle() == title) {
        let latLng = new LatLng(lat, lng);
        let camPos: CameraPosition = {
          target: latLng,
          zoom: 15
        };
        this.map.moveCamera(camPos);
      }
    });
  }

  disableMap() {
    if(this.map && this.onDevice) {
      this.map.setClickable(false);
    }
  }

  enableMap() {
    if(this.map && this.onDevice) {
      this.map.setClickable(true);
    }
  }

  private showPleaseConnect() {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
      this.disableMap();
    }
  }

  private hidePleaseConnect() {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
      this.enableMap();
    }
  }

  private addConnectivityListeners() {

    document.addEventListener('online',
      () => {setTimeout(
        () => {
          if(this.onDevice) {
            if(!this.mapInitialised){
              this.initDeviceMap();
            }
            this.hidePleaseConnect();
          } else {
            if(typeof google == "undefined" || typeof google.maps == "undefined"){
              this.loadBrowserGoogleMaps();
            }
            else {
              if(!this.mapInitialised){
                this.initBrowserMap();
              }

              this.hidePleaseConnect();
            }
          }
        }, 2000);
      }, false);

    document.addEventListener('offline',
      () => {
        this.showPleaseConnect();
      }, false);
  }

  getUserLocation() : MapLocation {
    return this.userLocation;
  }

  clearMarkers() {
    if(this.onDevice){
      this.map.clear();
    } else {
      this.markers.map(
        marker => {
          marker.setMap(null);
        }
      );
    }
  }
}
