import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CreditPage } from './credit';
import { CreditsRoutingModule } from "./credits-routing.module";

@NgModule({
  declarations: [CreditPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CreditsRoutingModule
  ]
})
export class CreditPageModule {
}
