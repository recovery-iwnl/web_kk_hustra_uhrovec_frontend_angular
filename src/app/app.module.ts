import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PlayersComponent } from './players/players.component';
import { TableComponent } from './table/table.component';
import { ResultsComponent } from './results/results.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule} from "@angular/material/button";
import { UsersListComponent } from './users-list/users-list.component';


import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PlayersComponent,
    TableComponent,
    ResultsComponent,
    HistoryComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ConfirmationDialogComponent,
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatExpansionModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    }),
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [ { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
