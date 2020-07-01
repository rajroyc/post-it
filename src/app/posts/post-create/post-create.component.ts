import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  mode = 'create';
  private postId: string;
  post: Post;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((fetchedPost) => {
          this.post = {
            id: fetchedPost._id,
            title: fetchedPost.title,
            content: fetchedPost.content,
            createdOn: fetchedPost.createdOn
          }
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onSave(postForm: NgForm): void {
    if (this.mode === 'create') {
      this.postService.addPost(
        postForm.value.title,
        postForm.value.content
      );
    } else {
      this.postService.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }

    /* resetting the form after the post has been added */
    postForm.resetForm();
  }

}
