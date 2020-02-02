import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';
import { TranslateModule } from '@ngx-translate/core';

import { CoursePage } from './course';

@NgModule({
  declarations: [CoursePage],
  imports: [IonicPageModule.forChild(CoursePage), TranslateModule.forChild()],
  providers: [Calendar]
})
export class CoursePageModule { }
