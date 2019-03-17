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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); // Generic type listener ** event emitter ** Observer

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    // pagination query params
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
    .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams) // you must subscribe *listener
      .pipe(map(postData => {
        return { post: postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts};
      })) // allows you to massage or transform the data coming in before the dom subscribes to it
        .subscribe(newPosts => {
          this.posts = newPosts.post;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: newPosts.maxPosts
          });
        });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // streams of data over time
  }

  getPost(id: string) {
    return this.httpClient.get<{
          _id: string,
          title: string,
          content: string,
          imagePath: string,
          creator: string;
        }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image, creator: null};
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }

}
