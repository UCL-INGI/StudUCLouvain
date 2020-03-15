import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MobilityPage } from './mobility';
import { MobilityRoutingModule } from "./mobility-routing.module";

@NgModule({
  declarations: [MobilityPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    MobilityRoutingModule
  ]
})
export class MobilityPageModule {
}
