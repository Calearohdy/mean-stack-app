import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  constructor(private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    if (form.valid) {
      const post: Post = {id: null, title: form.value.title, content: form.value.content};
      this.postsService.addPost(post);
      form.resetForm();
    }
  }
}
