import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SportsFilterPage } from './sports-filter';

@NgModule({
  declarations: [SportsFilterPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class SportsFilterPageModule { }