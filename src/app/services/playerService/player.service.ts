import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public addPlayer(playerData: any) {
    return this.http.post(this.API+'/api/v1/player/save', playerData, {responseType : 'json'})
  }
  public getPlayer(id: any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/player/getPlayer',{ params } );
  }
  public getAllPlayers() {
    return this.http.get(this.API+'/api/v1/player/getPlayersList');
  }

  public deletePlayer(id: any) {
    return this.http.delete(this.API + '/api/v1/player/deletePlayer?id=' + id,{responseType: 'text'});
  }

  public updatePlayer(player: any): Observable<any> {
    return this.http.put(this.API + '/api/v1/player/updatePlayer', player);
  }

}
