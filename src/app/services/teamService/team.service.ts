import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * Service for team-related operations, such as adding, fetching, updating, and deleting teams.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {


  /**
   * API base URL for team-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of TeamService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }


  /**
   * Adds a new team.
   *
   * @param teamData - The data of the team to be added.
   * @returns An HTTP POST request to add the team.
   */
  public addTeam(teamData:any) {
    return this.http.post(this.API + '/api/v1/team/save', teamData,{responseType : 'json'})
  }

  /**
   * Retrieves a team based on the specified ID.
   *
   * @param id - The ID of the team to be retrieved.
   * @returns An HTTP GET request to get the team by ID.
   */
  public getTeam(id: any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/team/getTeam',{ params } );
  }

  /**
   * Retrieves a list of all teams.
   *
   * @returns An HTTP GET request to get the list of all teams.
   */
  public getAllTeams() {
    return this.http.get(this.API+'/api/v1/team/getTeamsList');
  }

  /**
   * Deletes a team based on the specified ID.
   *
   * @param id - The ID of the team to be deleted.
   * @returns An HTTP DELETE request to delete the team.
   */
  public deleteTeam(id: any) {
    return this.http.delete(this.API + '/api/v1/team/deleteTeam?id=' + id,{responseType: 'text'});
  }

  /**
   * Updates an existing team.
   *
   * @param team - The updated data of the team.
   * @returns An HTTP PUT request to update the team.
   */
  public updateTeam(team: any): Observable<any> {
    return this.http.put(this.API + '/api/v1/team/updateTeam', team);
  }

  /**
   * Retrieves a list of players belonging to a specific team.
   *
   * @param id - The ID of the team to get players for.
   * @returns An HTTP GET request to get players by team ID.
   */
  public getPlayersByTeam(id: any) {
    const params = { id };
    return this.http.get(this.API + '/api/v1/team/playersByTeam', { params });
  }
}
