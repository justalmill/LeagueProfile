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
  title = 'LeagueProfile';
  summoner!: { id: string; accountId: string; puuid: string; name: string; profileIconId: number; revisionDate: number; summonerLevel: number; };
  champMastery!: Array<{championId?: number; championLevel?: number; champName?: string; champIcon?: string; championPoints?: number; lastPlayTime?: number; championPointsSinceLastLevel?: number; championPointsUntilNextLevel?: number; chestGranted?: boolean; tokensEarned?: number; summonerId?: string;}>;
  
  GetSummoner(value: string): void 
  {
    this.GetFromApi("summoner", value).subscribe((result: any) => {
      this.summoner = result; 
      console.log(result);
      this.GetMastery(this.summoner.id);
    });
  }

  GetMastery(id: string): void 
  {
    this.GetFromApi("mastery", id).subscribe((result: any) => {this.champMastery = result; console.log(result);});
  }

  GetFromApi (dest: string, value: string): Observable<any> {
    let riotUrl = "http://localhost:8000/api/" + dest + "/" + value;
    return this.http.get(riotUrl).pipe(map(result => result !== null ? result : ""), tap(idString => console.log(idString), debounceTime(300)));
  }


  
}