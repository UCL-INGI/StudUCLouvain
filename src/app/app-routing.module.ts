import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'credit', loadChildren: './pages/credit/credit.module#CreditPageModule' },
  { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule' },
  { path: 'library', loadChildren: './pages/library/library.module#LibraryPageModule' },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule' },
  { path: 'mobility', loadChildren: './pages/mobility/mobility.module#MobilityPageModule' },
  { path: 'news', loadChildren: './pages/news/news.module#NewsPageModule' },
  { path: 'param', loadChildren: './pages/param/param.module#ParamPageModule' },
  { path: 'restaurant', loadChildren: './pages/restaurant/restaurant.module#RestaurantPageModule' },
  { path: 'sports', loadChildren: './pages/sports/sports.module#SportsPageModule' },
  { path: 'studies', loadChildren: './pages/studies/studies.module#StudiesPageModule' },
  { path: 'support', loadChildren: './pages/support/support.module#SupportPageModule' },
  { path: 'tuto', loadChildren: './pages/tuto/tuto.module#TutoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
