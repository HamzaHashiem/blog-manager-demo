import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  DashboardComponent,
  UsersComponent,
  PostsComponent,
  PageNotFoundComponent,
} from './components';

import { AppLayoutComponent, SiteLayoutComponent } from './layout';

const appRoutes: Routes = [
  // App routes goes here here
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'posts', component: PostsComponent },
    ],
  },

  //Site routes goes here
  {
    path: '',
    component: SiteLayoutComponent,
    children: [{ path: '**', component: PageNotFoundComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class RoutingModule {}
export const routingComponents = [
  DashboardComponent,
  UsersComponent,
  PostsComponent,
  PageNotFoundComponent,
  AppLayoutComponent,
  SiteLayoutComponent,
];
