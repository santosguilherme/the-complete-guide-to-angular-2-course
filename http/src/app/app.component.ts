import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from "rxjs";

import { PostService } from "./post.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {
  }

  ngOnInit() {
    this.errorSubscription = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    this.fetchPosts();
  }

  ngOnDestroy() {
    this.saveSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.savePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.deleteSubscription = this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  private fetchPosts() {
    this.isFetching = true;

    this.saveSubscription = this.postService
      .listPosts()
      .subscribe(posts => {
        this.error = null;
        this.loadedPosts = posts;
        this.isFetching = false;
      }, error => {
        this.error = error.message;
        this.isFetching = false;
      });
  }

  onHandleError() {
    this.error = null;
  }
}
