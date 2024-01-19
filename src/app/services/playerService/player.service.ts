import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

/**
 * Service for player-related operations, such as adding, fetching, updating, and deleting players.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  /**
   * API base URL for player-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of PlayerService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

  /**
   * Adds a player to the specified team.
   *
   * @param id - The team ID to which the player will be added.
   * @param playerData - The data of the player to be added.
   * @returns An HTTP POST request to add the player.
   */
  public addPlayer(id: any, playerData: any) {
    return this.http.post(this.API+'/api/v1/player/save?id=' +id , playerData, {responseType : 'json'})
  }

  /**
   * Adds a player to the team Uhrovec.
   *
   * @param playerData - The data of the player to be added.
   * @returns An HTTP POST request to add the player.
   */
  public addPlayerUhrovec(playerData: any) {
    return this.http.post(this.API+'/api/v1/player/saveUhrovec', playerData, {responseType : 'json'})
  }

  /**
   * Retrieves player information based on the specified ID.
   *
   * @param id - The ID of the player to fetch.
   * @returns An HTTP GET request to get player details.
   */
  public getPlayer(id: any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/player/getPlayer',{ params } );
  }

  /**
   * Retrieves a list of all players.
   *
   * @returns An HTTP GET request to get the list of all players.
   */
  public getAllPlayers() {
    return this.http.get(this.API+'/api/v1/player/getPlayersList');
  }

  /**
   * Deletes a player based on the specified ID.
   *
   * @param id - The ID of the player to be deleted.
   * @returns An HTTP DELETE request to delete the player.
   */
  public deletePlayer(id: any) {
    return this.http.delete(this.API + '/api/v1/player/deletePlayer?id=' + id,{responseType: 'text'});
  }

  /**
   * Updates player information.
   *
   * @param player - The updated data of the player.
   * @returns An HTTP PUT request to update the player.
   */
  public updatePlayer(player: any): Observable<any> {
    return this.http.put(this.API + '/api/v1/player/updatePlayer', player);
  }

}
