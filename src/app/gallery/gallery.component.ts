import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FileUploadService} from "../services/fileUploadService/file-upload.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {



  images: any[] = [];

  file: File | undefined;

  constructor(private http: HttpClient, private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.loadAllImages();
  }

  selectFile(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (this.file) {
      this.fileUploadService.uploadFile(this.file).subscribe(
        (response: any) => {
          console.log('File uploaded successfully', response);
          this.images.push(response);
        },
        (error: any) => {
          console.error('Error uploading file', error);
        }
      );
    }

  }

  loadAllImages() {
    this.fileUploadService.getAllImages().subscribe(
      (response: any[]) => {
        this.images = response;
      },
      (error: any) => {
        console.error('Error loading images', error);
      }
    );
  }


}
