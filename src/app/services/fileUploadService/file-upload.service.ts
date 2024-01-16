import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http : HttpClient) { }

  API = "http://localhost:8080";

  public uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.API + '/api/v1/image/upload', formData);
  }

  public getAllImages() {
    return this.http.get<any[]>(this.API + '/api/v1/image/all');
  }

  public deleteImage(id : any) {
    return this.http.delete(this.API + '/api/v1/image/delete/' + id, { responseType: "text"});
  }


}
