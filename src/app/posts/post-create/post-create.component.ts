import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  isLoading = false;
  form: FormGroup;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    // initialize the Form Group with two Form Controls: title and content
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    // check if we are in edit mode or create mode depending on the activated route
    // fetch the post details from the backend for this particular postId
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((fetchedPost) => {
          this.isLoading = false;
          this.post = {
            id: fetchedPost._id,
            title: fetchedPost.title,
            content: fetchedPost.content,
            createdOn: fetchedPost.createdOn
          };

          // setValue lets us define in an object, every form
          // control's name as key and assign a dynamic value
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onSave(): void {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    /* resetting the form after the post has been added */
    this.form.reset();
  }

}
