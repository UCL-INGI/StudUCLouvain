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

import { Injectable } from '@angular/core';
import { ConnectivityService } from './connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { GoogleMap,
   GoogleMapsEvent,
   LatLng,
   CameraPosition,
   MarkerOptions,
   Marker,
   GoogleMapsMapTypeId} from '@ionic-native/google-maps';

declare var google;

@Injectable()
export class MapService {

  //TODO : virer code redondant, créer entité "location : {title, adress, lat, lng}", check couplage + abstraction des données

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  markers: any = [];
  apiKey: string = "AIzaSyByq9QHjtIGcxjfbUqJTFWNveGCg2hRtR4";
  userLocation = {
    lat : 0,
    lng : 0
  };
  onDevice: boolean;

  constructor(public connectivityService: ConnectivityService, private geolocation : Geolocation, private platform: Platform) {
    this.onDevice = this.platform.is('cordova');
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    if(this.onDevice) {
      console.log("LOAD MAPS ON DEVICE");
      return this.loadDeviceGoogleMaps();
    } else {
      console.log("LOAD MAPS ON BROWSER");
      return this.loadBrowserGoogleMaps();
    }
  }

  private loadBrowserGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.log("loadBrowserGoogleMaps");
        this.disableMap();

        if(this.connectivityService.isOnline()){

          window['mapInit'] = () => {

            this.initBrowserMap().then(() => {
              resolve(true);
            });

            this.enableMap();
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
          this.initBrowserMap().then(() => {
            resolve(true);
          });
          this.enableMap();
        }
        else {
          this.disableMap();
        }

      }

      this.addConnectivityListeners();

    });

  }

  private initBrowserMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);

      });

    });

  }

  private loadDeviceGoogleMaps() : Promise<any>{

    console.log("loadDeviceGoogleMaps");


    return new Promise((resolve) => {
      if(this.connectivityService.isOnline()){
        this.initDeviceMap().then(() => {
          console.log("loadDeviceGoogleMaps loaded");
          resolve(true);
        });
        this.enableMap();
      }
      else {
        this.disableMap();
      }

      this.addConnectivityListeners();
    });
  }

  private initDeviceMap() : Promise<any> {
    console.log("initDeviceMap - ask geolocation");

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {
        console.log("initDeviceMap - geolocation answered");

        let latLng = new LatLng(position.coords.latitude, position.coords.longitude);

        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

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

      });

    });

  }

  public addMarker(lat: number, lng: number, content: string, title: string): void {
    if(!this.markerExists(title)) {
        if(this.onDevice) {
          this.addDeviceMarker(lat, lng, content, title);
        } else {
          this.addBrowserMarker(lat, lng, content, title);
        }
    }
  }

  public testAddMarker(location: any) {
      let latLng = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));

      let marker = new google.maps.Marker({
        position: latLng,
        title: location.title,
        animation: google.maps.Animation.DROP
      });

      marker.setMap(this.map);
  }

  private addBrowserMarker(lat: number, lng: number, content: string, title: string): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: title
    });

    this.markers.push(marker);
    this.addBrowserInfoWindow(marker, content);

  }

  private addBrowserInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  private addDeviceMarker(lat: number, lng: number, content: string, title: string): void {

    let latLng = new LatLng(lat, lng);

    let markerOptions: MarkerOptions = {
      position: latLng,
      title: title
    };

    this.map.addMarker(markerOptions).then(
      (marker: Marker) => {
        marker.showInfoWindow();
        this.markers.push(marker);
        /*marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(
           ()=>{
               this.setCenteredMarker(title);
           }
       );*/
    });

  }

  private markerExists(title: string) : boolean{
    let exist = false;
    this.markers.map((marker) => {
      if(marker.getTitle() === title) {
        exist = true;
      }
    });
    return exist;
  }

  public toggleMarker(title: string){
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

  public setCenteredMarker(title: string) {
    if(this.onDevice) {
      this.setCenteredMarkerOnDevice(title);
    } else {
      this.setCenteredMarkerOnBrowser(title);
    }
  }

  public moveCameraTo(location: any) {
    let latLng = new LatLng(parseFloat(location.lat), parseFloat(location.lng));
    this.map.panTo(latLng);
  }

  private setCenteredMarkerOnBrowser(title:string) {
    this.markers.map((marker) => {
      if(marker.getTitle() === title) {
        console.log("moving camera");
        this.map.panTo(marker.getPosition());
      }
    });
  }

  private setCenteredMarkerOnDevice(title:string) {
    this.markers.map((marker) => {
      if(marker.getTitle() === title) {
        console.log("moving camera");
        this.map.panBy(marker.getPosition());
      }
    });

  }

  public disableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }

  }

  private enableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    }

  }

  private addConnectivityListeners(): void {

    document.addEventListener('online', () => {

      console.log("online");

      setTimeout(() => {
        if(this.onDevice) {
          if(!this.mapInitialised){
            this.initDeviceMap();
          }

          this.enableMap();
        } else {
          if(typeof google == "undefined" || typeof google.maps == "undefined"){
            this.loadBrowserGoogleMaps();
          }
          else {
            if(!this.mapInitialised){
              this.initBrowserMap();
            }

            this.enableMap();
          }

        }
      }, 2000);

    }, false);

    document.addEventListener('offline', () => {

      console.log("offline");

      this.disableMap();

    }, false);

  }

  public getUserLocation() : any {
    return this.userLocation;
  }
}
