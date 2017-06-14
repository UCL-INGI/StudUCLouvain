/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CursusListService} from '../../providers/cursus-list-service';
import { Course } from '../../app/entity/course';

import { CoursePage } from '../course/course';


@Component({
  selector: 'page-studies',
  templateUrl: 'studies.html',

})
export class StudiesPage {
  public people: any;
  public data : any;
  public listCourses: Course[];
  public course : Course;
  public title: any;

  constructor(
    public peopleService: CursusListService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage:Storage,
    public menu: MenuController,
    public platform: Platform,
    private iab: InAppBrowser
  ) {
    this.title = this.navParams.get('title');
    this.menu.enable(true, "studiesMenu");
    this.getCourses();
    this.loadPeople();
  }

  loadPeople(){
    this.peopleService.load()
    .then(data => {
      this.people = data;
    });
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Add Course',
      message: "Enter the name and acronym of the course...",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'acronym',
          placeholder: 'Acronym'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log(data)
            this.saveCourse(data.name, data.acronym);
          }
        }
      ]
    });
    prompt.present();
  }

  getCourses(){
    this.storage.get('listCourses').then((data) => {if(data==null) {this.listCourses=[]} else { this.listCourses=data}});
  }

  saveCourse(name: string, tag: string){
    let course = {"acronym": tag, "name": name };
    console.log(course);
    this.listCourses.push(course);
    this.storage.set('listCourses',this.listCourses);
  }

  removeCourse(course: Course){
    let index= this.listCourses.indexOf(course);
    if(index>= 0){
      this.listCourses.splice(index,1);
    }
    this.storage.set('listCourses',this.listCourses);
  }

  openCoursePage(course: Course){
    console.log(course);
    this.navCtrl.push(CoursePage, {course : course});
  }

  ionViewDidLoad() {
    console.log('Hello StudiesPage Page');
  }

  launch(url) {
    let browser = this.iab.create(url,'_system');
  }



}
