import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {VysledkyComponent} from "./vysledky/vysledky.component";
import {TabulkaComponent} from "./tabulka/tabulka.component";
import { HraciAComponent } from './hraci-a/hraci-a.component';
import {HraciBComponent} from "./hraci-b/hraci-b.component";
import {HistoriaComponent} from "./historia/historia.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  { path: '', redirectTo: '/domov', pathMatch: 'full' },
  { path: 'domov', component: HomeComponent },
  { path: 'hraci-a', component: HraciAComponent },
  { path: 'hraci-b', component: HraciBComponent },
  { path: 'tabulka', component: TabulkaComponent },
  { path: 'vysledky', component: VysledkyComponent },
  { path: 'historia', component: HistoriaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
