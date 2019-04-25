import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { GuindaillePage } from './guindaille2-0';

@NgModule({
  declarations: [GuindaillePage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class GuindaillePageModule { }