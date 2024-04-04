import {ChangeDetectorRef, Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth.service";
import {ForumService} from "../services/forumService/forum.service";
import {catchError, filter, tap} from "rxjs/operators";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {DatePipe} from "@angular/common";
import * as moment from 'moment';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {UserService} from "../services/userService/user.service";
import {CookieService} from "ngx-cookie-service";


/**
 * ForumComponent is an Angular component responsible for managing and displaying forum comments.
 *
 * It includes features such as adding comments, deleting comments, liking comments, and displaying comment-related information.
 *
 */
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {

  /**
   * Object representing the current comment being added.
   */
  comment: any = {};

  /**
   * Array containing all comments in the forum.
   */
  comments: any[] = [];

  /**
   * Number of characters left for the user to type in a comment.
   */
  charactersLeft: number = 255;

  /**
   * Email of the currently logged-in user.
   */
  email : any;

  username : any;

  numberOfUsers : any;

  /**
   * Username of the newest user in the forum.
   */
  newestUserName: string = '';

  /**
   * Type of the forum (e.g., 1 for a specific type).
   */
  type : any = 1;

  typeName: any = "Najnovšie";

  currentPage: number = 1;
  commentsPerPage: number = 5;

  totalPages: any;


  /**
   * Creates an instance of ForumComponent.
   *
   * @param dialog - Reference to the MatDialog service for displaying dialogs.
   * @param authService - Reference to the AuthService for handling user authentication.
   * @param forumService - Reference to the ForumService for managing forum-related operations.
   * @param userService - Reference to the UserService for managing user-related operations.
   * @param cdRef - Reference to the ChangeDetectorRef for manual change detection.
   * @param datePipe - Reference to the DatePipe for formatting dates.
   */
  constructor(private dialog: MatDialog,
              private authService: AuthService, private forumService: ForumService,
              private userService: UserService, private cdRef: ChangeDetectorRef,
              private datePipe: DatePipe,
              private cookie: CookieService) {
  }

  /**
   * Lifecycle hook that is called after the component is created.
   * Initializes the component by fetching comments and users.
   */
  ngOnInit(): void {
    this.getComments();
    this.getNewestUser();
    this.getNumberOfUsers();
  }

  /**
   * Adds a comment to the forum.
   * Handles the process of submitting a new comment, updating the UI, and resetting the comment input.
   */
  addComment() {
    this.comment.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.forumService.addComment(this.email,this.comment).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.comments.push(resp);
        this.getComments();
        this.comment.text = '';
        this.comment.subject = '';
        this.charactersLeft = 255;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Retrieves forum comments based on the specified type.
   * Updates the 'comments' array with the fetched comments and triggers change detection.
   */
  getComments() {
    const startIndex = (this.currentPage - 1) * this.commentsPerPage;
    const endIndex = startIndex + this.commentsPerPage;
    const token = this.cookie.get("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.email = tokenPayload.email;
    }
    this.forumService.getComments(this.type).pipe(
      switchMap((comments: any[]): Observable<any[]> => {
        this.calculateTotalPages(comments.length);
        const observables = comments.slice(startIndex, endIndex).map(comment => {
          const likes$ = this.forumService.getLikes(comment.id);
          const isLiked$ = this.forumService.isLiked(this.email, comment.id);
          return forkJoin({ comment: of(comment), likes: likes$, isLiked: isLiked$ });
        });
        return forkJoin(observables);
      }),
      map((commentsWithLikes: any[]) => {
        return commentsWithLikes.map(({ comment, likes, isLiked }) => {
          comment.likes = likes;
          comment.isLiked = isLiked;

          return comment;
        });
      }),
      tap((commentsWithLikes: any[]) => {
        this.comments = commentsWithLikes;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
    this.detectChanges();
  }
  calculateTotalPages(totalComments: number) {
    if(totalComments == 0) {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(totalComments / this.commentsPerPage);
    }

  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getComments();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getComments();
    }
  }

  options = [
    { label: 'Najnovšie', value: '1' },
    { label: 'Najstaršie', value: '2' },
    { label: 'Najoblúbenejšie', value: '3' }
  ];

  setType(value: string) {
    this.type = value;
    this.currentPage = 1;
    this.totalPages = 1;
    this.getComments();
  }

  setTypeName(name: string) {
    this.typeName = name;
  }

  /**
   * Updates the character count based on the length of the comment text.
   */
  updateCharacterCount() {
    this.charactersLeft = 255 - this.comment.text.length;
  }

  /**
   * Likes a specific comment by its ID.
   * Fetches updated comments and triggers change detection.
   *
   * @param email
   * @param id - The ID of the comment to be liked.
   */
  likeComment(email:any,id : any) {
    this.forumService.likeComment(this.email, id).pipe(
      tap((resp: any) => {
        this.getComments();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Opens a confirmation dialog to confirm comment deletion.
   * If the user confirms, deletes the comment with the specified ID.
   *
   * @param event - The click event triggering the confirmation dialog.
   * @param id - The ID of the comment to be deleted.
   */
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

  /**
   * Deletes a comment with the specified ID.
   * Fetches updated comments and triggers change detection.
   *
   * @param id - The ID of the comment to be deleted.
   */
  deleteComment(id : any) {
    this.forumService.deleteComment(id).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.comments = this.comments.filter(c => c.id !== id);
        this.getComments();
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Calculates the number of unique authors among the displayed comments.
   *
   * @returns The count of unique authors.
   */
  getUniqueAuthorsCount(): number {
    const uniqueAuthors = new Set<string>();
    this.comments.forEach(comment => uniqueAuthors.add(comment.username));
    return uniqueAuthors.size;
  }

  getNewestUser() {
    this.userService.getNewestUser().pipe(
      tap((resp: any) => {
        this.newestUserName = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }

  getNumberOfUsers() {
    this.userService.getNumberOfUsers().pipe(
      tap((resp: any) => {
        this.numberOfUsers = resp;
        this.detectChanges();
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    ).subscribe();
  }


  /**
   * Formats a given date string into a human-readable relative time format (e.g., "3 minutes ago").
   *
   * @param date - The date string to be formatted.
   * @returns A formatted string representing the relative time.
   */
  formatDate(date: string): string {
    const currentDate = moment();
    const commentDate = moment(date, 'DD/MM/YYYY HH:mm:ss');

    // Calculate the difference in milliseconds
    const timeDifference = currentDate.diff(commentDate);

    // Convert the difference to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return `${secondsDifference} sekundami`;
    }

    // Convert the difference to minutes
    const minutesDifference = Math.floor(secondsDifference / 60);

    if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? 'minútou' : 'minútami'}`;
    }

    // Convert the difference to hours
    const hoursDifference = Math.floor(minutesDifference / 60);

    if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hodinou' : 'hodinami'}`;
    }

    // Convert the difference to days
    const daysDifference = Math.floor(hoursDifference / 24);

    return `${daysDifference} ${daysDifference === 1 ? 'dňom' : 'dňami'}`;
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

  /**
   * Checks if the currently logged-in user has the 'ADMIN' role.
   *
   * @returns True if the user is an admin, false otherwise.
   */
  isAdmin(): boolean {
    const token = this.cookie.get("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.email = tokenPayload.email;
      this.username = tokenPayload.username;
      return tokenPayload.role === 'ADMIN';
    } else {
      return false;
    }
  }

  /**
   * Checks if a user is currently logged in.
   *
   * @returns True if a user is logged in, false otherwise.
   */
  isLoggedIn() : boolean {
    return this.authService.isLoggedIn;
  }

}
