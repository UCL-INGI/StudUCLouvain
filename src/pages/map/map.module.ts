import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MapPage } from './map';
import { MapRoutingModule } from "./map-routing.module";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [MapPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    MapRoutingModule,
    CommonModule
  ]
})
export class MapPageModule {
}
