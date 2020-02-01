import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RestaurantPage } from './restaurant';

@NgModule({
  declarations: [RestaurantPage],
  imports: [
    IonicPageModule.forChild(RestaurantPage),
    TranslateModule.forChild()
  ]
})
export class RestaurantPageModule { }
