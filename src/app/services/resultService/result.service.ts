import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

/**
 * Service for result-related operations, such as adding, fetching, and deleting results.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ResultService {


  /**
   * API base URL for result-related operations.
   */
  private API = "http://localhost:8080";

  /**
   * Creates an instance of ResultService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient) { }

  /**
   * Adds a result between two teams.
   *
   * @param teamIdHome - The ID of the home team.
   * @param teamIdAway - The ID of the away team.
   * @param resultData - The data of the result to be added.
   * @returns An HTTP POST request to add the result.
   */
  public addResultSimple(teamIdHome : any, teamIdAway : any, resultData:any) {
    const params = { teamIdHome, teamIdAway };
    return this.http.post(this.API + '/api/v1/result/saveSimple', resultData,{ params })
  }

  /**
   * Retrieves a list of all results.
   *
   * @returns An HTTP GET request to get the list of all results.
   */
  public getAllResults() {
    return this.http.get(this.API+'/api/v1/result/getResultsList');
  }


  public getResultsByYear(id : any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/result/getResultsByYear', { params } );
  }

  /**
   * Retrieves a list of results specific to Uhrovec.
   *
   * @returns An HTTP GET request to get the list of results for Uhrovec.
   */
  public getResultsUhrovec(id : any) {
    const params = { id };
    return this.http.get(this.API+'/api/v1/result/getResultsUhrovecList', { params });
  }

  /**
   * Deletes a result based on the specified ID.
   *
   * @param id - The ID of the result to be deleted.
   * @returns An HTTP DELETE request to delete the result.
   */
  public deleteResult(id : any) {
    const params = { id };
    return this.http.delete(this.API+'/api/v1/result/deleteResult?id=' + id, {responseType: 'text'}  );
  }
}
