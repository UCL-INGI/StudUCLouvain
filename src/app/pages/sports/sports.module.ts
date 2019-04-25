import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SportsPage } from './sports';

@NgModule({
  declarations: [SportsPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class SportsPageModule { }