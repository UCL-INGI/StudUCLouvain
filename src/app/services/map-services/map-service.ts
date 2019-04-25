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
import { UserService } from '../utils-services/user-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform, MenuController } from '@ionic/angular';
import { GoogleMaps,
   GoogleMapsEvent,
   LatLng,
   LocationService,
   CameraPosition,
   MarkerOptions,
   Marker,
   GoogleMapsMapTypeId} from '@ionic-native/google-maps';
import { MapLocation } from '../../entity/mapLocation';
import { jsApiKey } from '../../variables-config';

declare var google;

@Injectable({ 
  providedIn: 'root' 
})
export class MapService {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  markers: Array<Marker> = [];
  markersB: any = [];
  apiKey: string;
  userLocation: MapLocation;
  onDevice: boolean;

  constructor(public connectivityService: ConnectivityService,
              private geolocation : Geolocation,
              private platform: Platform,
              menuCtrl: MenuController,
              public userS: UserService) {
    //Check the platform used
    this.onDevice = this.platform.is('cordova');

    this.apiKey = jsApiKey;

    // let leftMenu = menuCtrl.get('left');
    // if(leftMenu) {
    //   leftMenu.ionOpen.subscribe(() => {
    //     if(this.map && this.onDevice) {
    //       this.map.setClickable(false);
    //     }
    //   });
    //   leftMenu.ionClose.subscribe(() => {
    //     if(this.map && this.onDevice) {
    //       this.map.setClickable(true);
    //     }
    //   });
    // }
  }

  /*Initializes the map for the device or the browser*/
  init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    if(this.onDevice) {
      return this.loadDeviceGoogleMaps();
    } else {
      return this.loadBrowserGoogleMaps();
    }
  }

  /*Load the map for the browser and check the connectivity, if no connexion display a message to ask to connect*/
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

  /*Initializes the map, center the map on the position of the user by getting her, put the type of map in roadmap and set a zoom to 15*/
  private initBrowserMap(): Promise<any> {
    this.mapInitialised = true;
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition(
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

  /*Load the map for the device and check the connectivity, if no connexion display a message to ask to connect*/
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

  /*Initializes the map, center the map on the position of the user by getting her, put the type of map in roadmap and set a zoom to 15*/
   private async initDeviceMap() : Promise<any> {
    console.log("Geolocation enabled ?");
    if(await this.connectivityService.isLocationEnabled() ){
      console.log("Geolocation enabled");
      return new Promise((resolve, reject) => {
        console.log("initDeviceMap - ask geolocation");
        LocationService.getMyLocation().then(
          (position) => {
            console.log("initDeviceMap - geolocation answered");
            this.userLocation = new MapLocation( "Ma Position",
                                        "",
                                        String(position.latLng.lat),
                                        String(position.latLng.lng),
                                        "MYPOS");

            //let latLng = new LatLng(position.coords.latitude, position.coords.longitude);
            let latLng = position.latLng;
            let mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: GoogleMapsMapTypeId.ROADMAP
            }
            // create CameraPosition
            let camPos: CameraPosition<LatLng> = {
              target: latLng,
              zoom: 15
            };
            //this.map = new GoogleMap(this.mapElement, mapOptions);
            this.map = GoogleMaps.create(this.mapElement, mapOptions);
            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
              console.log('Map is ready!');
              this.map.moveCamera(camPos);
              resolve(true);
            });
          }, (error) => {
            console.log("Map error initDeviceMap : " + error);
            reject(false);
          })
        })
      }
        else{
          return new Promise((resolve, reject) => {
            console.log("Geolocation disabled");
              let campus = this.userS.campus;
              let latLng: LatLng;
              if(campus === 'LLN') latLng = new LatLng(50.66808100000001,4.611832400000026);
              if(campus === 'Woluwe') latLng = new LatLng(50.8489094,4.432088300000032);
              if(campus === 'Mons') latLng = new LatLng(50.45424080000001,3.956658999999945);

              this.userLocation = new MapLocation( "Campus Position",
                                        "",
                                        String(latLng.lat),
                                        String(latLng.lng),
                                        "CAMPUSPOS");
              let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: GoogleMapsMapTypeId.ROADMAP
              }
              let camPos: CameraPosition<LatLng> = {
                target: latLng,
                zoom: 5
              }
              
            this.map = GoogleMaps.create(this.mapElement,mapOptions);
            console.log("Map created");
            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
              console.log('Map is ready!');


              this.map.moveCamera(camPos);
              resolve(true);
            });
        });
      }
  }

  /*Add marker in the map for a location selected*/
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

  /*Remove a marker for a location unselected*/
  removeMarker(location: MapLocation) {
      //console.log(location);
      //console.log(this.markers);
      let m;
      if(this.onDevice) m = this.markers;
      else m = this.markersB;
      for(var i=0;i<m.length; i++){
         if(m[i].getTitle() === location.title) {
          //console.log(this.markers[i]);
          //let m: Marker = this.markers[i];
         //m.remove();
         if(this.onDevice){
         this.markers[i].remove();
          //this.markers[i].setMap(null);
          //this.markers[i]=null;
          
          //console.log(this.markers);
      	}
          if(!this.onDevice){
            //m.remove();
            this.markersB[i].setMap(null);
            //this.map.clear();
            //this.addMarker(this.userLocation);
          }
          this.markers.splice(i,1);
        }
      }
   }

  /*Add Marker in the map for the browser*/
  private addBrowserMarker(lat: number, lng: number, content: string, title: string) {
    let latLng = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: title
    });
    this.markersB.push(marker);
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

  /*Add Marker in the map for the device*/
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

  /*Get a marker for the selected location*/
  private getMarker(title: string) : Marker{
    let res = null;
    if(this.onDevice){
	    this.markers.map((marker) => {
	      if(marker.getTitle() === title) {
	        res=marker;
	      }
	    });
	}
	else{
		this.markersB.map((marker) => {
	      if(marker.getTitle() === title) {
	        res=marker;
	      }
	    });
	}
    return res;
  }

  setCenteredMarker(location: MapLocation) {
    if(this.onDevice) {
      this.setCenteredMarkerOnDevice(location.title, parseFloat(location.lat), parseFloat(location.lng));
    } else {
      this.setCenteredMarkerOnBrowser(location.title);
    }
  }

  private setCenteredMarkerOnBrowser(title:string) {
    this.markersB.map((marker) => {
      if(marker.getTitle() == title) {
        this.map.panTo(marker.getPosition());
      }
    });
  }

  private setCenteredMarkerOnDevice(title:string, lat:number, lng:number) {
    this.markers.map((marker) => {
      if(marker.getTitle() == title) {
        let latLng = new LatLng(lat, lng);
        let camPos: CameraPosition<LatLng> = {
          target: latLng,
          zoom: 15
        };
        this.map.moveCamera(camPos);
      }
    });
  }

  /*Disable Map*/
  disableMap() {
    if(this.map && this.onDevice) {
      this.map.setClickable(false);
    }
  }

  /*Enable Map*/
  enableMap() {
    if(this.map && this.onDevice) {
      this.map.setClickable(true);
    }
  }

  /*If no connexion disable the map and display message*/
  private showPleaseConnect() {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
      this.disableMap();
    }
  }

  /*Enable map and undisplay message*/
  private hidePleaseConnect() {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
      this.enableMap();
    }
  }

  /*Connectivity listener to check if the connexion persists*/
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

  /*Return the location of the user*/
  getUserLocation() : MapLocation {
    return this.userLocation;
  }


  clearMarkers() {
    if(this.onDevice){
      this.map.clear();
    } else {
      this.markersB.map(
        marker => {
         marker.setMap(null)
        }
      );
    }
  }
}
