import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RestaurantPage } from './restaurant';
import { RestaurantRoutingModule } from "./restaurant-routing.module";

@NgModule({
  declarations: [RestaurantPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    RestaurantRoutingModule
  ]
})
export class RestaurantPageModule {
}
