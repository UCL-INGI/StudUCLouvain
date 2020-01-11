import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MobilityPage } from './mobility';

@NgModule({
  declarations: [MobilityPage],
  imports: [
  	IonicPageModule.forChild(MobilityPage),
  	TranslateModule.forChild()
  ]
})
export class MobilityPageModule { }