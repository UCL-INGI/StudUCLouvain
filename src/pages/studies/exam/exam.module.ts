import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { ExamPage } from './exam';

@NgModule({
  declarations: [ExamPage],
  imports: [
  	IonicPageModule.forChild(ExamPage),
  	TranslateModule.forChild()
  ]
})
export class ExamPageModule { }