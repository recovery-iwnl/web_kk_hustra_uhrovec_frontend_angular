import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public addResult(teamHomeID: any, teamAwayID: any, playerHomeID:any, playerAwayID: any,  resultData:any) {
    const params = { teamHomeID, teamAwayID, playerHomeID, playerAwayID };
    return this.http.post(this.API + '/api/v1/result/save', resultData,{responseType : 'json'})
  }

  public getAllResults() {
    return this.http.get(this.API+'/api/v1/result/getResultsList');
  }
}
