import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models/Post';
import { PostsService } from '../../services/posts.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private posts: Post[] = [];
  private postsSub: Subscription; // unmount handler

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsService.getPostUpdateListener() // did update handler subscribing to changes
      .subscribe((posts: Post[]) => {
          this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe(); // unmount
  }

}
