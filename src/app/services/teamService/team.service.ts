import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public addTeam(teamData:any) {
    return this.http.post(this.API + '/api/v1/team/save', teamData,{responseType : 'json'})
  }

  public getTeam(id: any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/team/getTeam',{ params } );
  }
  public getAllTeams() {
    return this.http.get(this.API+'/api/v1/team/getTeamsList');
  }

  public deleteTeam(id: any) {
    return this.http.delete(this.API + '/api/v1/team/deleteTeam?id=' + id,{responseType: 'text'});
  }

  public updateTeam(team: any): Observable<any> {
    return this.http.put(this.API + '/api/v1/team/updateTeam', team);
  }

  public getPlayersByTeam(id: any) {
    const params = { id };
    return this.http.get(this.API + '/api/v1/team/playersByTeam', { params });
  }
}
