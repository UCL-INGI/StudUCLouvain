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

import { MenuController, Platform } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {
    CameraPosition, GoogleMaps, GoogleMapsEvent, GoogleMapsMapTypeId, LatLng, LocationService,
    Marker, MarkerOptions
} from '@ionic-native/google-maps';

import { MapLocation } from '../../app/entity/mapLocation';
import { jsApiKey } from '../../app/variables-config';
import { ConnectivityService } from '../utils-services/connectivity-service';
import { UserService } from '../utils-services/user-service';

declare var google;

@Injectable()
export class MapService {
  mapElement: any;
  pleaseConnectVar: any;
  map: any;
  mapInitialised = false;
  markers: Array<Marker> = [];
  markersB: any = [];
  apiKey: string;
  userLocation: MapLocation;
  onDevice: boolean;

  constructor(
    public connectivityService: ConnectivityService,
    private platform: Platform,
    menuCtrl: MenuController,
    public userS: UserService,
    private geolocation: Geolocation
  ) {
    this.onDevice = this.platform.is('cordova');
    this.apiKey = jsApiKey;
    const leftMenu = menuCtrl.get('left');
    if (leftMenu) {
      leftMenu.ionOpen.subscribe(() => this.disableMap());
      leftMenu.ionClose.subscribe(() => this.enableMap());
    }
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnectVar = pleaseConnect;
    if (this.onDevice) {
      return this.loadDeviceGoogleMaps();
    } else {
      return this.loadBrowserGoogleMaps();
    }
  }

  private loadBrowserGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        this.pleaseConnect(true);
        if (this.connectivityService.isOnline()) {
          window['mapInit'] = () => {
            this._initBrowserMap(resolve, reject);
          };
          const script = document.createElement('script');
          script.id = 'googleMaps';
          if (this.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }
          document.body.appendChild(script);
        }
      } else if (this.connectivityService.isOnline()) {
        this._initBrowserMap(resolve, reject);
      } else {
        this.pleaseConnect(true);
      }
      this.addConnectivityListeners();
    });
  }

  private _initBrowserMap(resolve: (value?: any) => void, reject: (reason?: any) => void) {
    this.initBrowserMap().then(init => resolve(init), error => reject(error));
    this.pleaseConnect(false);
  }

  private initBrowserMap(): Promise<any> {
    this.mapInitialised = true;
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((position) => {
        this.userLocation = new MapLocation('Ma Position',
          'Mon adresse',
          String(position.coords.latitude),
          String(position.coords.longitude),
          'MYPOS');
        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);
      }, (error) => {
        console.log('Map error loadDeviceGoogleMaps : ' + error);
        reject(false);
      });
    });
  }

  private loadDeviceGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.connectivityService.isOnline()) {
        this.initDeviceMap().then(
          () => resolve(true),
          () => reject(false)
        );
        this.pleaseConnect(false);
      } else {
        this.pleaseConnect(true);
      }
      this.addConnectivityListeners();
    });
  }

  private async initDeviceMap(): Promise<any> {
    if (await this.connectivityService.isLocationEnabled()) {
      console.log('Geolocation enabled');
      return new Promise((resolve, reject) => {
        LocationService.getMyLocation().then((position) => {
          this.userLocation = new MapLocation('Ma Position',
            '',
            String(position.latLng.lat),
            String(position.latLng.lng),
            'MYPOS');
          const latLng = position.latLng;
          const mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: GoogleMapsMapTypeId.ROADMAP
          };
          const camPos: CameraPosition<LatLng> = {
            target: latLng,
            zoom: 15
          };
          this.map = GoogleMaps.create(this.mapElement, mapOptions);
          this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
            this.map.moveCamera(camPos);
            resolve(true);
          });
        }, (error) => {
          console.log('Map error initDeviceMap : ' + error);
          reject(false);
        });
      });
    } else {
      return new Promise((resolve) => {
        console.log('Geolocation disabled');
        const campus = this.userS.campus;
        let latLng: LatLng;
        if (campus === 'LLN') { latLng = new LatLng(50.66808100000001, 4.611832400000026); }
        if (campus === 'Woluwe') { latLng = new LatLng(50.8489094, 4.432088300000032); }
        if (campus === 'Mons') { latLng = new LatLng(50.45424080000001, 3.956658999999945); }
        this.userLocation = new MapLocation('Campus Position',
          '',
          String(latLng.lat),
          String(latLng.lng),
          'CAMPUSPOS');
        const mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: GoogleMapsMapTypeId.ROADMAP
        };
        const camPos: CameraPosition<LatLng> = {
          target: latLng,
          zoom: 5
        };
        this.map = GoogleMaps.create(this.mapElement, mapOptions);
        console.log('Map created');
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
          console.log('Map is ready!');
          this.map.moveCamera(camPos);
          resolve();
        });
      });
    }
  }

  addMarker(location: MapLocation) {
    const marker = this.getMarker(location.title);
    if (!marker) {
      const contentString = '<p>' + location.address + '</p>';
      const m = this.onDevice ? this.markers : this.markersB;
      for (const loc of m) {
        if (loc.getTitle() !== this.userLocation.title) {
          this.removeMarker(new MapLocation(loc.getTitle()));
        }
      }
      if (this.onDevice) {
        this.addDeviceMarker(parseFloat(location.lat), parseFloat(location.lng), location.address, location.title);
      } else {
        this.addBrowserMarker(parseFloat(location.lat), parseFloat(location.lng), contentString, location.title);
      }
    } else if (this.onDevice) {
      marker.showInfoWindow();
    }
  }

  removeMarker(location: MapLocation) {
    let m;
    if (this.onDevice) { m = this.markers; } else { m = this.markersB; }
    for (let i = 0; i < m.length; i++) {
      if (m[i].getTitle() === location.title) {
        if (this.onDevice) {
          this.markers[i].remove();
        }
        if (!this.onDevice) {
          this.markersB[i].setMap(null);
        }
        this.markers.splice(i, 1);
      }
    }
  }

  private addBrowserMarker(lat: number, lng: number, content: string, title: string) {
    const latLng = new google.maps.LatLng(lat, lng);
    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: title
    });
    this.markersB.push(marker);
    this.addBrowserInfoWindow(marker, title + '\n' + content);
  }

  private addBrowserInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
    infoWindow.open(this.map, marker);
  }

  private addDeviceMarker(lat: number, lng: number, address: string, title: string) {
    const latLng = new LatLng(lat, lng);
    const markerOptions: MarkerOptions = {
      position: latLng,
      title: title,
      snippet: address
    };
    this.map.addMarker(markerOptions).then((marker: Marker) => {
      marker.showInfoWindow();
      this.markers.push(marker);
      this.setCenteredMarkerOnDevice(title, lat, lng);
    });
  }

  private getMarker(title: string): Marker {
    let res = null;
    const markers = this.onDevice ? this.markers : this.markersB;
    for (const marker of markers) {
      if (marker.getTitle() === title) {
        res = marker;
        break;
      }
    }
    return res;
  }

  setCenteredMarker(location: MapLocation) {
    if (this.onDevice) {
      this.setCenteredMarkerOnDevice(location.title, parseFloat(location.lat), parseFloat(location.lng));
    } else {
      this.setCenteredMarkerOnBrowser(location.title);
    }
  }

  private setCenteredMarkerOnBrowser(title: string) {
    this.markersB.map(marker => {
      if (marker.getTitle() === title) {
        this.map.panTo(marker.getPosition());
      }
    });
  }

  private setCenteredMarkerOnDevice(title: string, lat: number, lng: number) {
    for (const marker of this.markers) {
      if (marker.getTitle() === title) {
        const latLng = new LatLng(lat, lng);
        const camPos: CameraPosition<LatLng> = {
          target: latLng,
          zoom: 15
        };
        this.map.moveCamera(camPos);
        break;
      }
    }
  }

  disableMap() {
    if (this.map && this.onDevice) {
      this.map.setClickable(false);
    }
  }

  enableMap() {
    if (this.map && this.onDevice) {
      this.map.setClickable(true);
    }
  }

  private pleaseConnect(disable: boolean) {
    if (this.pleaseConnectVar) {
      this.pleaseConnectVar.style.display = disable ? 'block' : 'none';
      disable ? this.disableMap() : this.enableMap();
    }
  }

  private addConnectivityListeners() {
    document.addEventListener('online', () => {
      setTimeout(() => {
        if (this.onDevice) {
          if (!this.mapInitialised) {
            this.initDeviceMap();
          }
        } else if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
          this.loadBrowserGoogleMaps();
        } else if (!this.mapInitialised) {
          this.initBrowserMap();
        }
        this.pleaseConnect(false);
      }, 2000);
    }, false);
    document.addEventListener('offline', () => this.pleaseConnect(true), false);
  }

  getUserLocation(): MapLocation {
    return this.userLocation;
  }

  clearMarkers() {
    if (this.onDevice) {
      this.map.clear();
    } else {
      this.markersB.map(
        marker => marker.setMap(null)
      );
    }
  }
}
