import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  /**
   * API base URL for match-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of MatchService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient, private config: ConfigService, private cookie: CookieService) {
  }

  public addNews(news: any) {
    return this.http.post(this.API + '/api/v1/news/save', news, {
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    })
  }

  public getAllNews() {
    return this.http.get(this.API + '/api/v1/news/getAllNews');
  }

  public deleteNews(id: any) {
    return this.http.delete(this.API + '/api/v1/news/delete?id="'+ id, {
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    })
  }
}
