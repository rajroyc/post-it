import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit() { }

  onSave(postForm: NgForm): void {
    this.postService.addPost(
      postForm.value.title,
      postForm.value.content
    );
    /* resetting the form after the post has been added */
    postForm.resetForm();
  }

}
