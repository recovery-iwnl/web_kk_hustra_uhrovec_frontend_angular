import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {ResultService} from "../services/resultService/result.service";
import {ForumService} from "../services/forumService/forum.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {

  comment: any = {};

  comments: any[] = [];

  constructor(private dialog: MatDialog, private authService: AuthService, private forumService: ForumService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.getComments();
  }

  addComment() {
    const email = <string>localStorage.getItem("token");
    this.forumService.addComment(email,this.comment).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.comments.push(resp);
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getComments() {
    this.forumService.getComments().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.comments = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  likeComment(id : any) {
    this.forumService.likeComment(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.getComments();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  formatDate(date: string): string {
    const currentDate = new Date();
    const commentDate = new Date(date);

    // Calculate the difference in milliseconds
    const timeDifference = currentDate.getTime() - commentDate.getTime();

    // Convert the difference to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    }

    // Convert the difference to minutes
    const minutesDifference = Math.floor(secondsDifference / 60);

    if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Convert the difference to hours
    const hoursDifference = Math.floor(minutesDifference / 60);

    if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
    }

    // Convert the difference to days
    const daysDifference = Math.floor(hoursDifference / 24);

    return `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`;
  }




  private detectChanges(): void {
    try {
      this.cdRef.detectChanges();
    } catch (e) {
    }
  }

  isAdmin(): boolean {
    const loggedInUser = this.authService.getLoggedInUser();
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

}
