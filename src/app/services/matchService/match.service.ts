import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
/**
 * Service for match-related operations, such as adding, fetching, and deleting matches.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class MatchService {

  /**
   * API base URL for match-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of MatchService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

  /**
   * Adds a match between two teams.
   *
   * @param teamIdHome - The team ID for the home team.
   * @param teamIdAway - The team ID for the away team.
   * @param matchData - The data of the match to be added.
   * @returns An HTTP POST request to add the match.
   */
  public addMatch(teamIdHome : any, teamIdAway : any, matchData:any) {
    const params = { teamIdHome, teamIdAway };
    return this.http.post(this.API + '/api/v1/match/save', matchData,{ params })
  }

  /**
   * Retrieves all matches from the server.
   *
   * @returns An HTTP GET request to fetch all matches.
   */
  public getAllMatches() {
    return this.http.get(this.API+'/api/v1/match/getMatchesList');
  }

  /**
   * Retrieves matches specifically for Uhrovec from the server.
   *
   * @returns An HTTP GET request to fetch matches for Uhrovec.
   */
  public getMatchesUhrovec() {
    return this.http.get(this.API+'/api/v1/match/getMatchesUhrovecList');
  }

  /**
   * Deletes a match based on the specified ID.
   *
   * @param id - The ID of the match to be deleted.
   * @returns An HTTP DELETE request to delete the match.
   */
  public deleteMatch(id : any) {
    const params = { id };
    return this.http.delete(this.API+'/api/v1/match/deleteMatch?id=' + id, {responseType: 'text'}  );
  }
}
