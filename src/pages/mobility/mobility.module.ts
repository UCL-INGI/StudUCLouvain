import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
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