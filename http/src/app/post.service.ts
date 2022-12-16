import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

import { Post } from "./post.model";

const API_URL = 'https://ng-complete-guide-3129d-default-rtdb.firebaseio.com/posts.json';

@Injectable({providedIn: 'root'})
export class PostService {
  error = new Subject<string>();

  constructor(private httpClient: HttpClient) {
  }

  savePost(title: string, content: string) {
    const post: Post = {title, content};

    this.httpClient
      .post<{ name: string }>(
        API_URL,
        post,
        {
          observe: 'response'
        }
      )
      .subscribe(response => {
        console.log(response);
      }, error => {
        this.error.next(error.message);
      });
  }

  listPosts() {
    return this.httpClient
      .get<Post>(
        API_URL,
        {
          headers: new HttpHeaders({
            'Custom-Header': 'any'
          }),
          params: new HttpParams().set('print', 'pretty'),
          responseType: 'json'
        }
      )
      .pipe(
        map(response => {
          const posts: Post[] = [];

          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              posts.push({...response[key], id: key});
            }
          }

          return posts;
        }),
        catchError(errorResponse => {
          // eg: send to the analytics server
          return throwError(errorResponse);
        })
      );
  }

  deletePosts() {
    return this.httpClient
      .delete(
        API_URL,
        {
          observe: 'events',
          responseType: 'text'
        }
      )
      .pipe(
        tap(event => {
          console.log(event);

          if (event.type === HttpEventType.Sent) {
            //...
          }

          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
