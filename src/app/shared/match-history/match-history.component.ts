import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {
  @Input()
  matchHistory?: Array<{info: {gameCreation: number; gameDuration: number; gameId: number; gameMode: string; gameStartTimestamp: number; mapId: number; queueId: number; participants: Array<{ assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number; summoner1Name: string; summoner2Name: string; }>}; player: { assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number;  summoner1Name: string; summoner2Name: string;};}>;
 

  constructor() { }

  ngOnInit(): void {
  }

}
