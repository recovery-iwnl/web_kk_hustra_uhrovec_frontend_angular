import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ResultsComponent} from "./results/results.component";
import {TableComponent} from "./table/table.component";
import { PlayersComponent } from './players/players.component';
import {HistoryComponent} from "./history/history.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {UpcomingMatchesComponent} from "./upcoming-matches/upcoming-matches.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {ForumComponent} from "./forum/forum.component";
import {AuthGuard} from "./auth.guard";
import {CompareComponent} from "./compare/compare.component";

const routes: Routes = [
  { path: '', redirectTo: '/domov', pathMatch: 'full' },
  { path: 'domov', component: HomeComponent },
  { path: 'hraci', component: PlayersComponent },
  { path: 'statistiky', component: CompareComponent },
  { path: 'tabulka', component: TableComponent },
  { path: 'vysledky', component: ResultsComponent },
  { path: 'historia', component: HistoryComponent },
  { path: 'galeria', component: GalleryComponent },
  { path: 'fan-zone', component: ForumComponent },
  { path: 'login', component: LoginComponent },
  { path: 'nasledujuce-zapasy', component: UpcomingMatchesComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
