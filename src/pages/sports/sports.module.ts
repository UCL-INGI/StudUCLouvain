import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { TranslateModule } from '@ngx-translate/core';

import { SportsPage } from './sports';
import { SportsRoutingModule } from "./sports-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SportsPage],
  imports: [
    IonicModule,
    SportsRoutingModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Calendar]
})
export class SportsPageModule {
}
