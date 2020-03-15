import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { GuindaillePage } from './guindaille2-0';
import { Guindaille20RoutingModule } from "./guindaille2-0-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [GuindaillePage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    Guindaille20RoutingModule,
    CommonModule,
    FormsModule
  ]
})
export class GuindaillePageModule {
}
