import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/Post';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Generic type listener ** event emitter ** Observer

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts() {
    this.httpClient
    .get<{message: string, posts: any}>('http://localhost:3000/api/posts') // you must subscribe *listener
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      })) // allows you to massage or transform the data coming in before the dom subscribes to it
        .subscribe(newPosts => {
          this.posts = newPosts;
          this.postsUpdated.next([...this.posts]);
        });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // streams of data over time
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string; title: string; content: string; }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(post: Post) {
    const newPost: Post = {id: null, title: post.title, content: post.content};
    this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((resData) => {
        const id = resData.postId;
        post.id = id;
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(post: Post) {
    const newPost: Post = {id: post.id, title: post.title, content: post.content};
    this.httpClient.put('http://localhost:3000/api/posts/' + post.id, newPost)
      .subscribe(res => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id === newPost.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts: Post[] = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

}
