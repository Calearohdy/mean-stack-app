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
            content: post.content,
            imagePath: post.imagePath
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
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((resData) => {
        const post: Post = {id: resData.post.id, title: title, content: content, imagePath: resData.post.imagePath};
        const id = resData.post.id;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
      postData = {id: id, title: title, content: content, imagePath: image};
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(res => {
        console.log(res);
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id === id);
        const post: Post = {id: id, title: title, content: content, imagePath: ''};
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
