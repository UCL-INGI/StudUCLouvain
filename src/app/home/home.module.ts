import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
//import { Http } from '@angular/http';
import { HttpLoaderFactory } from '../app.module'

import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  	IonicModule,
  	TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  exports: [TranslateModule],
})
export class HomePageModule { }