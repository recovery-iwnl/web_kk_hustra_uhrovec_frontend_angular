import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HraciAComponent } from './hraci-a/hraci-a.component';
import { AppRoutingModule } from './app-routing.module';
import { HraciBComponent } from './hraci-b/hraci-b.component';
import { TabulkaComponent } from './tabulka/tabulka.component';
import { VysledkyComponent } from './vysledky/vysledky.component';
import { HistoriaComponent } from './historia/historia.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    HraciAComponent,
    HraciBComponent,
    TabulkaComponent,
    VysledkyComponent,
    HistoriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
