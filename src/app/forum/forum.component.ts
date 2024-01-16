import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {ResultService} from "../services/resultService/result.service";
import {ForumService} from "../services/forumService/forum.service";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {DatePipe} from "@angular/common";
import * as moment from 'moment';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {UserService} from "../services/userService/user.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {

  comment: any = {};

  comments: any[] = [];

  users: any[] = [];

  charactersLeft: number = 255;

  email : any;

  newestUserName: string = '';


  constructor(private dialog: MatDialog, private authService: AuthService, private forumService: ForumService, private userService: UserService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.getComments();
    this.getUsers();
  }

  addComment() {
    this.comment.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const email = <string>localStorage.getItem("token");
    this.forumService.addComment(email,this.comment).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.comments.push(resp);
        this.getComments();
        this.comment.text = '';
        this.charactersLeft = 255;
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

  updateCharacterCount() {
    this.charactersLeft = 255 - this.comment.text.length;
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

  confirmDelete(event: Event,id:any): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Upozornenie!',
        content: 'Naozaj vymazať chcete komentár ?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteComment(id);
      }
    });
  }

  deleteComment(id : any) {
    this.forumService.deleteComment(id).pipe(
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

  getUniqueAuthorsCount(): number {
    const uniqueAuthors = new Set<string>();
    this.comments.forEach(comment => uniqueAuthors.add(comment.user.userName));
    return uniqueAuthors.size;
  }

  getUsers() {
    this.userService.getAllUsers().pipe(
      tap((resp: any) => {
        console.log(resp);
        this.users = resp;

        this.users.sort((a: any, b: any) => b.userID - a.userID);

        if (this.users.length > 0) {
          this.newestUserName = this.users[0].userName;
        }

        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  formatDate(date: string): string {
    const currentDate = moment();
    const commentDate = moment(date, 'DD/MM/YYYY HH:mm:ss');

    // Calculate the difference in milliseconds
    const timeDifference = currentDate.diff(commentDate);

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
    this.email = <string>localStorage.getItem("token");
    return loggedInUser && loggedInUser.role === 'ADMIN';
  }

  isLoggedIn() : boolean {
    return this.authService.isLoggedIn;
  }

}
