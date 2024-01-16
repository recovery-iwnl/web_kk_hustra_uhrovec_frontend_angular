import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FileUploadService} from "../services/fileUploadService/file-upload.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {AuthService} from "../services/auth/auth.service";
import {MatchService} from "../services/matchService/match.service";
import {ToastrService} from "ngx-toastr";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {


  images: any[] = [];

  file: File | undefined;

  constructor(private http: HttpClient, private fileUploadService: FileUploadService, private authService: AuthService,
              private cdRef: ChangeDetectorRef, private toastr : ToastrService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadAllImages();
  }

  selectFile(event: any) {
    this.file = event.target.files[0];
  }

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

  deleteImage(id :any) {
    this.fileUploadService.deleteImage(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.images = this.images.filter(i => i.Id !== i.Id);
        this.detectChanges();
        this.loadAllImages();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  showSuccess() {
    this.toastr.success('', 'Úspešne ste pridali fotku do fotogalérie!', {
      positionClass: 'toast-center-center',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }

  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }


}
