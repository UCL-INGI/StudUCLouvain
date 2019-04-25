import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RestaurantPage } from './restaurant';

@NgModule({
  declarations: [RestaurantPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class RestaurantPageModule { }