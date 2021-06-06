import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summoner-mastery',
  templateUrl: './summoner-mastery.component.html',
  styleUrls: ['./summoner-mastery.component.css']
})
export class SummonerMasteryComponent implements OnInit {
  @Input()
  champMastery?: Array<{championId?: number; championLevel?: number; champName?: string; champIcon?: string; championPoints?: number; lastPlayTime?: number; championPointsSinceLastLevel?: number; championPointsUntilNextLevel?: number; chestGranted?: boolean; tokensEarned?: number; summonerId?: string;}>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
