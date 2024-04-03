import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../configService/config.service";
import {CookieService} from "ngx-cookie-service";

/**
 * Service for uploading and managing images using HTTP requests.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  /**
   * API base URL for image-related operations.
   */
  private API = this.config.apiUrl;

  /**
   * Creates an instance of FileUploadService.
   *
   * @param http - Reference to the Angular HttpClient for making HTTP requests.
   * @param config
   */
  constructor(private http : HttpClient, private config: ConfigService, private cookie: CookieService) { }

  /**
   * Uploads a file to the server.
   *
   * @param file - The file to be uploaded.
   * @returns An HTTP POST request to upload the file.
   */
  public uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.API + '/api/v1/image/upload', formData,{
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    });
  }

  /**
   * Retrieves all images from the server.
   *
   * @returns An HTTP GET request to fetch all images.
   */
  public getAllImages() {
    return this.http.get<any[]>(this.API + '/api/v1/image/all');
  }

  public getImageByName(name: any) {
    const params = { name };
    return this.http.get(this.API + '/api/v1/image/getImagebyName', {params});
  }

  /**
   * Deletes an image from the server by its ID.
   *
   * @param id - The ID of the image to be deleted.
   * @returns An HTTP DELETE request to delete the image.
   */
  public deleteImage(id : any) {
    return this.http.delete(this.API + '/api/v1/image/delete/' + id, {
      responseType: 'text',
      headers: {Authorization: `Bearer ${<string>this.cookie.get("token")}`}
    });
  }


}
