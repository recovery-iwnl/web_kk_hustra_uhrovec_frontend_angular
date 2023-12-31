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
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/domov', pathMatch: 'full' },
  { path: 'domov', component: HomeComponent },
  { path: 'hraci', component: PlayersComponent },
  { path: 'tabulka', component: TableComponent },
  { path: 'vysledky', component: ResultsComponent },
  { path: 'historia', component: HistoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
