import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, delay, map, tap } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient, private _ngZone: NgZone, private changeDetector: ChangeDetectorRef) {}
  
  //TODO move most of this into a new service
  title = 'LeagueProfile';
  summoner!: { id: string; accountId: string; puuid: string; name: string; profileIconId: number; revisionDate: number; summonerLevel: number; };
  rank?: {freshBlood: boolean; hotStreak: boolean; inactive: boolean; leagueId: string; leaguePoints: number; losses: number; queueType: string; rank: string; summonerId: string; summonerName: string; tier: string; veteran: boolean; wins: number};
  champMastery!: Array<{championId?: number; championLevel?: number; champName?: string; champIcon?: string; championPoints?: number; lastPlayTime?: number; championPointsSinceLastLevel?: number; championPointsUntilNextLevel?: number; chestGranted?: boolean; tokensEarned?: number; summonerId?: string;}>;
  matchHistory: Array<{info: {gameCreation: number; gameDuration: number; gameId: number; gameMode: string; gameStartTimestamp: number; mapId: number; queueId: number; participants: Array<{ assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number; summoner1Name: string; summoner2Name: string; }>}; player: { assists: number; baronKills: number; championName: string; deaths: number; kills: number; puuid: number;  summoner1Name: string; summoner2Name: string;};}> = [];
  
  GetSummoner(value: string): void 
  {
    // Switching summoner profiles wipes matchhistory and rank data
    this.matchHistory = [];
    this.rank = undefined;
    this.GetFromApi("summoner", [value]).subscribe((result: any) => {
      this.summoner = result; 
      //console.log(result);
      this.GetRank(this.summoner.id);
      this.GetMastery(this.summoner.id);
      this.GetMatchHistory(this.summoner.puuid, 0, 10);
    });
  }

  GetRank(id: string) {
    this.GetFromApi("rank", [this.summoner.id]).subscribe((result: any) => {
      this.rank = result[0];
      console.log(this.rank);
    })
  }

  GetMastery(id: string): void 
  {
    let params = [id]
    this.GetFromApi("mastery", params).subscribe((result: any) => {this.champMastery = result; console.log(result);});
  }

  GetMatchHistory(id: string, start: number, end: number): void 
  {
    let params = [id, start, end] 
    this.GetFromApi("matchIds", params).subscribe((ids: any) => {
      for (let i in ids) {
        this.GetFromApi("matchData", [ids[i]]).subscribe((result: any) => {
          if (result.info) {
            result.player = result.info.participants.find((element: any) => element.puuid === this.summoner.puuid);
            this.matchHistory.push(result);
            console.log(result);
            //sort to chronological order
            if (Number(i) == ids.length-1) {
              this.matchHistory.sort((first, second) => {return second.info.gameStartTimestamp - first.info.gameStartTimestamp});
            }
          }
        },
        (error: any) => {console.log(error);}
        );
      }
    });
    
  }

  GetFromApi (dest: string, value: any[]): Observable<any> {
    let apiUrl = "http://localhost:8000/api/" + dest ;
    value.forEach(e => {
      apiUrl +=  "/" + e;
    });
    return this.http.get(apiUrl).pipe(map(result => result !== null ? result : ""));//, tap(idString => console.log(idString)));
  }


  
}