import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NewsService} from "../services/newsService/news.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {ConfigService} from "../services/configService/config.service";
import {DatePipe} from "@angular/common";
import {FileUploadService} from "../services/fileUploadService/file-upload.service";
import {ToastrService} from "ngx-toastr";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  news: any[] = [];

  newsCarousel: any[] = [];

  newNews: any = {};

  currentPage: number = 1;

  newsPerPage: number = 6;

  totalPages: any;

  /**
   * The selected file to be uploaded.
   */
  file: File | undefined;

  url = this.configService.apiUrl + '/api/v1/image/';

  constructor(private newsService: NewsService, private cdRef: ChangeDetectorRef,
              private cookie: CookieService, private configService: ConfigService,
              private datePipe: DatePipe, private fileUploadService: FileUploadService,
              private toastr: ToastrService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getNews();
    this.detectChanges();
  }


  addNews() {
    this.newNews.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.newsService.addNews(this.newNews).pipe(
      tap((resp: any) => {
        this.news.push(resp);
        this.getNews();
        this.newNews = {};
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
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
          this.newNews.image = resp;
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

  showSuccess() {
    this.toastr.success('', 'Fotka sa automaticky nahrala do galérie!', {
      positionClass: 'toast-center-center',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

  getNews() {
    const startIndex = (this.currentPage - 1) * this.newsPerPage;
    const endIndex = startIndex + this.newsPerPage;
    this.newsService.getAllNews().pipe(
      tap((resp: any) => {
        this.calculateTotalPages(resp.length);
        this.newsCarousel = resp;
        this.news = resp.slice(startIndex, endIndex);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getNews();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getNews();
    }
  }

  calculateTotalPages(totalResults: number) {
    if(totalResults == 0) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(totalResults / this.newsPerPage);
    }
  }

  deleteNews(news : any) {
    this.newsService.deleteNews(news.newsID).pipe(
      tap((resp: any) => {
        this.news = this.news.filter(n => n.newsID !== news.newsID);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  confirmDelete(event: Event, newsN: any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj chcete vymazať novinku "' + newsN.subject + '" ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteNews(newsN);
      }
    });
  }


  /**
   * Detects changes manually in the component.
   * This is necessary in certain situations where Angular's change detection may not be triggered automatically.
   */
  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {
    }
  }

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
