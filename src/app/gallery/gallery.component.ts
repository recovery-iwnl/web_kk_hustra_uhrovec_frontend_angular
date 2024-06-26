import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FileUploadService} from "../services/fileUploadService/file-upload.service";
import {catchError, tap} from "rxjs/operators";
import {map, Observable, of} from "rxjs";
import {AuthService} from "../services/auth/auth.service";
import {MatchService} from "../services/matchService/match.service";
import {ToastrService} from "ngx-toastr";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfigService} from "../services/configService/config.service";
import {CookieService} from "ngx-cookie-service";


/**
 * GalleryComponent is an Angular component responsible for managing and displaying image gallery functionalities.
 * It includes features such as uploading, deleting, and displaying images.
 *
 */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit{

  /**
   * Array containing information about all images in the gallery.
   */
  images: any[] = [];

  /**
   * The selected file to be uploaded.
   */
  file: File | undefined;

  url = this.configService.apiUrl + '/api/v1/image/';

  /**
   * Creates an instance of GalleryComponent.
   *
   * @param http - Reference to the HttpClient for making HTTP requests.
   * @param fileUploadService - Reference to the FileUploadService for managing file-related operations.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param cdRef - Reference to the ChangeDetectorRef for manual change detection.
   * @param toastr - Reference to the ToastrService for displaying notifications.
   * @param dialog - Reference to the MatDialog service for displaying dialogs.
   */
  constructor(private http: HttpClient, private fileUploadService: FileUploadService, private authService: AuthService,
              private cdRef: ChangeDetectorRef, private toastr : ToastrService, private dialog: MatDialog, private configService: ConfigService,
              private cookie: CookieService) {
  }

  /**
   * Lifecycle hook that is called after the component is created.
   * Initializes the component by loading all images in the gallery.
   */
  ngOnInit() {
    this.loadAllImages();
  }

  /**
   * Handles the file selection event and sets the 'file' property to the selected file.
   *
   * @param event - The file selection event.
   */
  selectFile(event: any) {
    this.file = event.target.files[0];
  }

  /**
   * Uploads the selected file to the server.
   * Updates the 'images' array with the uploaded image information and triggers change detection.
   */
  uploadFile() {
    if (this.file) {
      this.fileUploadService.uploadFile(this.file).pipe(
        tap((resp: any) => {
          console.log('File uploaded successfully', resp);
          this.images.push(resp);
          this.showSuccess();
          this.detectChanges();
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      ).subscribe();
    }

  }

  /**
   * Loads all images from the server and updates the 'images' array.
   */
  loadAllImages() {
    this.fileUploadService.getAllImages().pipe(
      tap((resp: any) => {
        this.images = resp;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Opens a confirmation dialog to confirm image deletion.
   * If the user confirms, deletes the image with the specified ID.
   *
   * @param event - The click event triggering the confirmation dialog.
   * @param id - The ID of the image to be deleted.
   */
  confirmDelete(event: Event,id:any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať fotku ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteImage(id);
      }
    });
  }

  /**
   * Deletes the image with the specified ID.
   * Updates the 'images' array and triggers change detection.
   *
   * @param id - The ID of the image to be deleted.
   */
  deleteImage(id :any) {
    this.fileUploadService.deleteImage(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.images = this.images.filter(i => i.Id !== i.Id);
        this.detectChanges();
        this.showSuccessDelete();
        this.loadAllImages();
      }),
      catchError((err) => {
        console.log(err);
        if (err && err.message) {
          this.showError('Obrázok nie je možné vymazať pretože, je súčasťou novinky!', 'Chyba');
        } else {
          this.showError('Nastala chyba pri mazaní obrázka!.', 'Chyba');
        }
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Displays a success notification using Toastr.
   */
  showSuccess() {
    this.toastr.success('', 'Úspešne ste pridali fotku do fotogalérie!', {
      positionClass: 'toast-center-center',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

  showSuccessDelete() {
    this.toastr.success('', 'Úspešne ste vymazali fotku z fotogalérie!', {
      positionClass: 'toast-center-center',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title, {
      positionClass: 'toast-center-center',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    });
  }

  /**
   * Detects changes manually in the component.
   * This is necessary in certain situations where Angular's change detection may not be triggered automatically.
   */
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  /**
   * Checks if the currently logged-in user has the 'ADMIN' role.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    const token = this.cookie.get("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role === 'ADMIN';
    } else {
      return false;
    }
  }


}
