import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription;
  private userIsAuth = false;
  private posts: Post[] = [];
  private postsSub: Subscription; // unmount handler
  userId: string;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSize = [1, 2, 5, 10];

  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatus()
    .subscribe(isAuthenticated => {
      this.userIsAuth = isAuthenticated;
    });
    this.userIsAuth = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsService.getPostUpdateListener() // did update handler subscribing to changes
      .subscribe((postData: {posts: Post[], postCount: number}) => {
          this.isLoading = false;
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy() {
    // this.postsSub.unsubscribe(); // unmount
    this.authListenerSub.unsubscribe();
  }

}
