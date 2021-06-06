import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RiotApiService {

  constructor(private http: HttpClient) { }
  
  public GetFromApi (dest: string, value: any[]): Observable<any> {
    let apiUrl = "http://localhost:8000/api/" + dest ;
    value.forEach(e => {
      apiUrl +=  "/" + e;
    });
    return this.http.get(apiUrl).pipe(map(result => result !== null ? result : ""));//, tap(idString => console.log(idString)));
  }

  GetRank(id: string) {
    return this.GetFromApi("rank", [id]);
  }

  GetMastery(id: string)
  {
    let params = [id]
    return this.GetFromApi("mastery", params);
  }

  GetMatchHistory(id: string, start: number, end: number) 
  {
    let params = [id, start, end] 
    let matchHistory: any[] = [];
    this.GetFromApi("matchIds", params).subscribe((ids: any) => {
      for (let i in ids) {
        this.GetFromApi("matchData", [ids[i]]).subscribe((result: any) => {
          if (result.info) {
            result.player = result.info.participants.find((element: any) => element.puuid === id);
            matchHistory.push(result);
            console.log(result);
            //sort to chronological order
            if (Number(i) == ids.length-1) {
              matchHistory.sort((first, second) => {return second.info.gameStartTimestamp - first.info.gameStartTimestamp});
            }
          }
        },
        (error: any) => {console.log(error);}
        );
      }
    });
    return matchHistory;
  }  
}
