import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummonerCardComponent } from './shared/summoner-card/summoner-card.component';
import { SummonerMasteryComponent } from './shared/summoner-mastery/summoner-mastery.component';
import { MatchHistoryComponent } from './shared/match-history/match-history.component';

@NgModule({
  declarations: [
    AppComponent,
    SummonerCardComponent,
    SummonerMasteryComponent,
    MatchHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
