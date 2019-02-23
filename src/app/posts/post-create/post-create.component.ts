import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(private postsService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const post: Post = {id: null, title: form.value.title, content: form.value.content};
      this.postsService.addPost(post);
    } else {
      const updatedPost: Post = {id: this.post.id, title: form.value.title, content: form.value.content};
      console.log('Updating...', updatedPost);
      this.postsService.updatePost(updatedPost);
    }
    form.resetForm();
  }
}
