import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MobilityPage } from './mobility';

@NgModule({
  declarations: [MobilityPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class MobilityPageModule { }