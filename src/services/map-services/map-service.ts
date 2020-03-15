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
import { Platform } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  CameraPosition,
  GoogleMaps,
  GoogleMapsEvent,
  GoogleMapsMapTypeId,
  LatLng,
  LocationService,
  Marker
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
    public userS: UserService,
    private geolocation: Geolocation
  ) {
    this.onDevice = this.platform.is('cordova');
    this.apiKey = jsApiKey;
  }

  init(mapElement: any, pleaseConnect: any) {
    this.mapElement = mapElement;
    this.pleaseConnectVar = pleaseConnect;
    return this.onDevice ? this.loadDeviceGoogleMaps() : this.loadBrowserGoogleMaps();
  }

  addMarker(location: MapLocation) {
    const marker = this.getMarker(location.title);
    if (!marker) {
      for (const loc of this.onDevice ? this.markers : this.markersB) {
        if (loc.getTitle() !== this.userLocation.title) {
          this.removeMarker(new MapLocation(loc.getTitle()));
        }
      }
      let [lat, lng, address, title] = [
        parseFloat(location.lat), parseFloat(location.lng), location.address, location.title
      ];
      this.addAppropriateMarker(lat, lng, address, title);
    } else if (this.onDevice) {
      marker.showInfoWindow();
    }
  }

  private addAppropriateMarker(lat, lng, address, title) {
    this.onDevice ? this.addDeviceMarker(lat, lng, address, title) :
      this.addBrowserMarker(lat, lng, '<p>' + address + '</p>', title);
  }

  removeMarker(location: MapLocation) {
    const m = this.onDevice ? this.markers : this.markersB;
    for (let i = 0; i < m.length; i++) {
      if (m[i].getTitle() === location.title) {
        if (this.onDevice) {
          this.markers[i].remove();
          this.markers.splice(i, 1);
        } else {
          this.markersB[i].setMap(null);
        }
      }
    }
  }

  setMapClickable(enable: boolean) {
    if (this.map && this.onDevice) {
      this.map.setClickable(enable);
    }
  }

  private loadBrowserGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        this.pleaseConnect(true);
        if (this.connectivityService.isOnline()) {
          window['mapInit'] = () => this._initBrowserMap(resolve, reject);
          const script = document.createElement('script');
          script.id = 'googleMaps';
          script.src = 'http://maps.google.com/maps/api/js?' + (this.apiKey ? this.apiKey + '&callback=mapInit' : 'callback=mapInit');
          document.body.appendChild(script);
        }
      } else {
        this.pleaseConnect(true);
      }
      this.addConnectivityListeners();
    });
  }

  private _initBrowserMap(resolve, reject) {
    this.initBrowserMap().then(init => resolve(init), error => reject(error));
    this.pleaseConnect(false);
  }

  private initBrowserMap(): Promise<any> {
    this.mapInitialised = true;
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((position) => {
        this.userLocation = new MapLocation(
          'Ma Position', 'Mon adresse',
          String(position.coords.latitude), String(position.coords.longitude),
          'MYPOS'
        );
        const mapOptions = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
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
      const isOnline = this.connectivityService.isOnline();
      if (isOnline) {
        this.initDeviceMap().then(
          () => resolve(true),
          () => reject(false)
        );
      }
      this.pleaseConnect(!isOnline);
      this.addConnectivityListeners();
    });
  }

  private async initDeviceMap(): Promise<any> {
    if (await this.connectivityService.isLocationEnabled()) {
      console.log('Geolocation enabled');
      return this.initGeolocatedDevice();
    } else {
      return this.initLostDevice();
    }
  }

  private initLostDevice(): any {
    return new Promise((resolve) => {
      console.log('Geolocation disabled');
      const latLng: LatLng = this.getCampusLocalisation(this.userS.campus);
      this.userLocation = new MapLocation(
        'Campus Position', '', String(latLng.lat), String(latLng.lng), 'CAMPUSPOS'
      );
      const mapOptions = { center: latLng, zoom: 15, mapTypeId: GoogleMapsMapTypeId.ROADMAP };
      const camPos: CameraPosition<LatLng> = { target: latLng,  zoom: 5 };
      this.map = GoogleMaps.create(this.mapElement, mapOptions);
      console.log('Map created');
      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
        this.map.moveCamera(camPos);
        resolve();
      });
    });
  }

  private getCampusLocalisation(campus: string) {
    const {lat, lng} = {
      'LLN': {'lat': 50.66808100000001, 'lng': 4.611832400000026},
      'Woluwe': {'lat': 50.8489094, 'lng': 4.432088300000032},
      'Mons': {'lat': 50.45424080000001, 'lng': 3.956658999999945},
    }[campus];
    return new LatLng(lat, lng);
  }

  private initGeolocatedDevice(): any {
    return new Promise((resolve, reject) => {
      LocationService.getMyLocation().then((position) => {
        this.userLocation = new MapLocation(
          'Ma Position', '', String(position.latLng.lat), String(position.latLng.lng), 'MYPOS'
        );
        this.map = GoogleMaps.create(
          this.mapElement, { center: position.latLng, zoom: 15, mapTypeId: GoogleMapsMapTypeId.ROADMAP }
          );
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
          console.log('Map is ready!');
          this.map.moveCamera({ target: position.latLng, zoom: 15 });
          resolve(true);
        });
      }, (error) => {
        console.log('Map error initDeviceMap : ' + error);
        reject(false);
      });
    });
  }

  private addBrowserMarker(lat: number, lng: number, content: string, title: string) {
    const marker = new google.maps.Marker({
      map: this.map, animation: google.maps.Animation.DROP, position: new google.maps.LatLng(lat, lng), title: title
    });
    this.markersB.push(marker);
    google.maps.event.addListener(marker, 'click');
    new google.maps.InfoWindow({content: title + '\n' + content}).open(this.map, marker);
  }

  private addDeviceMarker(lat: number, lng: number, address: string, title: string) {
    this.map.addMarker({ position: new LatLng(lat, lng), title: title, snippet: address }).then((marker: Marker) => {
      marker.showInfoWindow();
      this.markers.push(marker);
      this.setCenteredMarkerOnDevice(title, lat, lng);
    });
  }

  private getMarker(title: string): Marker {
    for (const marker of this.onDevice ? this.markers : this.markersB) {
      if (marker.getTitle() === title) {
        return marker;
      }
    }
  }

  private setCenteredMarkerOnDevice(title: string, lat: number, lng: number) {
    for (const marker of this.markers) {
      if (marker.getTitle() === title) {
        const camPos: CameraPosition<LatLng> = {target: new LatLng(lat, lng),  zoom: 15};
        this.map.moveCamera(camPos);
        break;
      }
    }
  }

  private pleaseConnect(disable: boolean) {
    if (this.pleaseConnectVar) {
      this.pleaseConnectVar.style.display = disable ? 'block' : 'none';
      this.setMapClickable(!disable);
    }
  }

  private addConnectivityListeners() {
    document.addEventListener('online', () => {
      setTimeout(() => {
        if (this.onDevice && !this.mapInitialised) {
          this.initDeviceMap();
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
}
