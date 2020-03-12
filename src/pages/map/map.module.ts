import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MapPage } from './map';
import { MapRoutingModule } from "./map-routing.module";

@NgModule({
  declarations: [MapPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    MapRoutingModule
  ]
})
export class MapPageModule {
}
