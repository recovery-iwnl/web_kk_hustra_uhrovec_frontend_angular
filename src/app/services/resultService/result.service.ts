import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public addResult(teamIdHome : any, teamIdAway : any,
  player1IdHome : any, player2IdHome : any, player3IdHome : any, player4IdHome: any, player5IdHome : any, player6IdHome : any,
  player1IdAway : any, player2IdAway : any, player3IdAway : any, player4IdAway : any, player5IdAway : any, player6IdAway : any,
  resultData:any) {
    const params = { teamIdHome, teamIdAway, player1IdHome, player2IdHome, player3IdHome, player4IdHome, player5IdHome, player6IdHome,
      player1IdAway, player2IdAway, player3IdAway, player4IdAway, player5IdAway, player6IdAway};
    return this.http.post(this.API + '/api/v1/result/save', resultData,{ params })
  }

  public getAllResults() {
    return this.http.get(this.API+'/api/v1/result/getResultsList');
  }
}
