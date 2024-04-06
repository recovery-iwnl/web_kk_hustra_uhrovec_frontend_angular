import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NewsService} from "../services/newsService/news.service";
import {ConfigService} from "../services/configService/config.service";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  newsId : any;
  news: any;

  url = this.configService.apiUrl + '/api/v1/image/';
  constructor(private route: ActivatedRoute, private newsService: NewsService, private configService: ConfigService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.newsId = params['id'];
      this.getNews();
    });
  }

  getNews() {
    this.newsService.getNews(this.newsId).subscribe(
      (news) => {
        if (news === null) {
          this.router.navigateByUrl('/domov');
        } else {
          this.news = news;
        }
      }
    );
  }
}
