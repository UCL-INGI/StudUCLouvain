import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { TrainPage } from './train';

@NgModule({
  declarations: [TrainPage],
  imports: [
  	IonicPageModule.forChild(TrainPage),
  	TranslateModule.forChild()
  ]
})
export class TrainPageModule { }