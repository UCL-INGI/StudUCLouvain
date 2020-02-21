import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MapPage } from './map';

@NgModule({
  declarations: [MapPage],
  imports: [IonicPageModule.forChild(MapPage), TranslateModule.forChild()]
})
export class MapPageModule {
}
