import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ExamPage } from './exam';

@NgModule({
  declarations: [ExamPage],
  imports: [IonicPageModule.forChild(ExamPage), TranslateModule.forChild()]
})
export class ExamPageModule { }
