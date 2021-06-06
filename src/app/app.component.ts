import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RiotApiService } from './services/riot-api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private riotApi: RiotApiService, private http: HttpClient, private _ngZone: NgZone, private changeDetector: ChangeDetectorRef) {}
  
  title = 'LeagueProfile';
  summoner!: { id: string; accountId: string; puuid: string; name: string; profileIconId: number; revisionDate: number; summonerLevel: number; };
  rank?: {freshBlood: boolean; hotStreak: boolean; inactive: boolean; leagueId: string; leaguePoints: number; losses: number; queueType: string; rank: string; summonerId: string; summonerName: string; tier: string; veteran: boolean; wins: number};
  champMastery?: Array<{championId?: number; championLevel?: number; champName?: string; champIcon?: string; championPoints?: number; lastPlayTime?: number; championPointsSinceLastLevel?: number; championPointsUntilNextLevel?: number; chestGranted?: boolean; tokensEarned?: number; summonerId?: string;}>;
  matchHistory?: Array<{info: {gameCreation: number; gameDuration: number; gameId: number; gameMode: string; gameStartTimestamp: number; mapId: number; queueId: number; participants: Array<{ assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number; summoner1Name: string; summoner2Name: string; }>}; player: { assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number;  summoner1Name: string; summoner2Name: string;};}>;
  
  GetSummoner(value: string): void 
  {
    // Switching summoner profiles wipes matchhistory and rank data
    this.matchHistory = [];
    this.rank = undefined;
    this.riotApi.GetFromApi("summoner", [value]).subscribe((result: any) => {
      this.summoner = result; 
      this.riotApi.GetRank(this.summoner.id).subscribe((result:any) => this.rank = result);
      this.riotApi.GetMastery(this.summoner.id).subscribe((result: any) => this.champMastery = result);
      this.matchHistory = this.riotApi.GetMatchHistory(this.summoner.puuid, 0, 10);
    });
  }
}