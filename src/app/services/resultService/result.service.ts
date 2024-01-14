import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";


  public addResultSimple(teamIdHome : any, teamIdAway : any, resultData:any) {
    const params = { teamIdHome, teamIdAway };
    return this.http.post(this.API + '/api/v1/result/saveSimple', resultData,{ params })
  }

  public getAllResults() {
    return this.http.get(this.API+'/api/v1/result/getResultsList');
  }

  public getResultsUhrovec() {
    return this.http.get(this.API+'/api/v1/result/getResultsUhrovecList');
  }

  public deleteResult(id : any) {
    const params = { id };
    return this.http.delete(this.API+'/api/v1/result/deleteResult?id=' + id, {responseType: 'text'}  );
  }
}
