import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
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