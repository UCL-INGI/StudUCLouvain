import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SportsFilterPage } from './sports-filter';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SportsFilterPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule
  ]
})
export class SportsFilterPageModule {
}
