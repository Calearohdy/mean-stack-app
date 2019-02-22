import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/Post';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Generic type listener ** event emitter ** Observer

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    this.httpClient.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts') // you must subscribe *listener
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // streams of data over time
  }

  addPost(post: Post) {
    const newPost: Post = {id: null, title: post.title, content: post.content};
    this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((resData) => {
        console.log(resData);
      });
    this.posts.push(newPost);
    this.postsUpdated.next([...this.posts]);
  }

}
