import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { MapPage } from './map';

@NgModule({
  declarations: [MapPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class MapPageModule { }