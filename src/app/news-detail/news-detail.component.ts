import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NewsService} from "../services/newsService/news.service";
import {ConfigService} from "../services/configService/config.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {FileUploadService} from "../services/fileUploadService/file-upload.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  newsId : any;

  news: any = {};

  updatedNews: any = {};

  /**
   * The selected file to be uploaded.
   */
  file: File | undefined;

  url = this.configService.apiUrl + '/api/v1/image/';
  constructor(private route: ActivatedRoute, private newsService: NewsService, private configService: ConfigService,
              private router: Router, private cookie: CookieService, private fileUploadService: FileUploadService,
              private toastr: ToastrService,private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.newsId = params['id'];
      this.getNews();
    });
  }

  getNews() {
    this.newsService.getNews(this.newsId).pipe(
      tap((resp: any) => {
        console.log(resp);
        if (resp === null) {
          this.router.navigateByUrl('/domov');
        } else {
          this.news = resp;
        }
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  updateNews(news: any) {
    console.log(this.news);
    this.news.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.newsService.updateNews(news).pipe(
      tap((resp: any) => {

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
          this.news.image = resp;
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
