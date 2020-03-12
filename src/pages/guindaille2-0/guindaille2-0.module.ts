import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { GuindaillePage } from './guindaille2-0';
import { Guindaille20RoutingModule } from "./guindaille2-0-routing.module";

@NgModule({
  declarations: [GuindaillePage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    Guindaille20RoutingModule
  ]
})
export class GuindaillePageModule {
}
