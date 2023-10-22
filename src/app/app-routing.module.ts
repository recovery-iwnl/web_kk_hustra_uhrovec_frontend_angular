import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HraciAComponent } from './hraci-a/hraci-a.component';
import {HraciBComponent} from "./hraci-b/hraci-b.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  // Define your routes
  { path: '', redirectTo: '/domov', pathMatch: 'full' },
  { path: 'domov', component: HomeComponent },
  { path: 'hraci-a', component: HraciAComponent },
  { path: 'hraci-b', component: HraciBComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
