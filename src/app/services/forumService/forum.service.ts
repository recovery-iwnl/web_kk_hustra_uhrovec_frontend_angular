import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";

/**
 * Service for forum-related operations, such as adding, fetching, liking, and deleting comments.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ForumService {

  /**
   * API base URL for forum-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of ForumService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http : HttpClient, private config: ConfigService) { }


  /**
   * Adds a comment to the forum.
   *
   * @param email - The email associated with the comment.
   * @param commentData - The data of the comment to be added.
   * @returns An HTTP POST request to add the comment.
   */
  public addComment(email : any, commentData : any) {
    const params = { email };
    return this.http.post(this.API + '/api/v1/comment/save', commentData,{ params })
  }

  /**
   * Retrieves comments from the forum based on the specified number.
   *
   * @param number - The number associated with the comments to be fetched.
   * @returns An HTTP GET request to fetch comments.
   */
  public getComments(number : any) {
    const params = { number };
    return this.http.get(this.API + '/api/v1/comment/getCommentsList',{ params })
  }

  /**
   * Likes a comment in the forum.
   *
   * @param id - The ID of the comment to be liked.
   * @returns An HTTP PUT request to like the comment.
   */
  public likeComment( id : any) {
    const params = { id };
    return this.http.put(this.API + '/api/v1/comment/likeComment', null,{params, responseType: "text"})
  }

  /**
   * Deletes a comment from the forum.
   *
   * @param id - The ID of the comment to be deleted.
   * @returns An HTTP DELETE request to delete the comment.
   */
  public deleteComment( id : any) {
    const params = { id };
    return this.http.delete(this.API + '/api/v1/comment/deleteComment', {params, responseType: "text"})
  }
}
