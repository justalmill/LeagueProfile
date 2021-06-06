import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summoner-card',
  templateUrl: './summoner-card.component.html',
  styleUrls: ['./summoner-card.component.css']
})
export class SummonerCardComponent implements OnInit {
  @Input()
  rank?: {freshBlood: boolean; hotStreak: boolean; inactive: boolean; leagueId: string; leaguePoints: number; losses: number; queueType: string; rank: string; summonerId: string; summonerName: string; tier: string; veteran: boolean; wins: number};
  @Input()
  summoner!: { id: string; accountId: string; puuid: string; name: string; profileIconId: number; revisionDate: number; summonerLevel: number; };
  
  constructor() { }

  ngOnInit(): void {
  }

}
