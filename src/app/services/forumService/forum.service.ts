import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {catchError} from "rxjs/operators";

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
   * @param config
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
  public getComments(number : any):Observable<any[]> {
    const params = { number };
    return this.http.get<any[]>(this.API + '/api/v1/comment/getCommentsList',{ params })
  }

  /**
   * Likes a comment in the forum.
   *
   * @param email
   * @param id - The ID of the comment to be liked.
   * @returns An HTTP PUT request to like the comment.
   */
  public likeComment( email : any, commentID : any) {
    const params = { email, commentID };
    return this.http.post(this.API + '/api/v1/commentLiked/like', null,{params, responseType: "text"})
  }

  public getLikes( commentID : any) {
    const params = { commentID };
    return this.http.get(this.API + '/api/v1/commentLiked/getCommentLikes', {params, responseType: "text"})
  }

  public isLiked(email : any, commentID : any) {
    const params = { email, commentID };
    return this.http.get(this.API + '/api/v1/commentLiked/isLiked', {params, responseType: "text"})
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
