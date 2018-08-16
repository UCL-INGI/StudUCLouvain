/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Benjamin Daubry & Bruno Marchesini
    Date : July 2018
    This file is part of StudUCLouvain
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutoPage } from './tuto';

@NgModule({
  declarations: [
    TutoPage,
  ],
  imports: [
    IonicPageModule.forChild(TutoPage),
  ],
})
export class TutoPageModule {}
