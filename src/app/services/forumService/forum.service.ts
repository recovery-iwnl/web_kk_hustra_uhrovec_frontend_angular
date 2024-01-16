import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public addComment(email : any, commentData : any) {
    const params = { email };
    return this.http.post(this.API + '/api/v1/comment/save', commentData,{ params })
  }

  public getComments() {
    return this.http.get(this.API + '/api/v1/comment/getCommentsList')
  }

  public likeComment( id : any) {
    const params = { id };
    return this.http.put(this.API + '/api/v1/comment/likeComment', null,{params, responseType: "text"})
  }
}
