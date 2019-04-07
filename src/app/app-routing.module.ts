import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'credit', loadChildren: './credit/credit.module#CreditPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'library', loadChildren: './library/library.module#LibraryPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'mobility', loadChildren: './mobility/mobility.module#MobilityPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'param', loadChildren: './param/param.module#ParamPageModule' },
  { path: 'restaurant', loadChildren: './restaurant/restaurant.module#RestaurantPageModule' },
  { path: 'sports', loadChildren: './sports/sports.module#SportsPageModule' },
  { path: 'studies', loadChildren: './studies/studies.module#StudiesPageModule' },
  { path: 'support', loadChildren: './support/support.module#SupportPageModule' },
  { path: 'tuto', loadChildren: './tuto/tuto.module#TutoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
