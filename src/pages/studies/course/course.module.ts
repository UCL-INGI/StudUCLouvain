import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CoursePage } from './course';

@NgModule({
  declarations: [CoursePage],
  imports: [
  	IonicPageModule.forChild(CoursePage),
  	TranslateModule.forChild()
  ]
})
export class CoursePageModule { }