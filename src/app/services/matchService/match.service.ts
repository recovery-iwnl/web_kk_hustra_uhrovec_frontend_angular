import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MatchService {


  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";


  public addMatch(teamIdHome : any, teamIdAway : any, matchData:any) {
    const params = { teamIdHome, teamIdAway };
    return this.http.post(this.API + '/api/v1/match/save', matchData,{ params })
  }

  public getAllMatches() {
    return this.http.get(this.API+'/api/v1/match/getMatchesList');
  }

  public getMatchesUhrovec() {
    return this.http.get(this.API+'/api/v1/match/getMatchesUhrovecList');
  }

  public deleteMatch(id : any) {
    const params = { id };
    return this.http.delete(this.API+'/api/v1/match/deleteMatch?id=' + id, {responseType: 'text'}  );
  }
}
