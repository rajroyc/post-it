import { mimeType } from './mime-type.validator';
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
  // this will hold the data url of the image that was uploaded
  imagePreview: string;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    // initialize the Form Group with two Form Controls: title and content
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
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
            createdOn: fetchedPost.createdOn,
            imagePath: fetchedPost.imagePath
          };

          // setValue lets us define in an object, every form
          // control's name as key and assign a dynamic value
          // setValue will change the state of the form completely
          // if the form was already set with a couple of attributes
          // a new call to set value will create a new form state with
          // the earlier attributes lost and only the attributes defined
          // in the fresh setValue() command assigned to the form
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });

          this.form.get('image').updateValueAndValidity();
          this.imagePreview = this.post.imagePath;

          console.log(this.form.get('image'));
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
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    /* resetting the form after the post has been added */
    this.form.reset();
  }

  onImageUpload(event: Event): void {
      const file: File = (event.target as HTMLInputElement).files[0];
      // we need to use the patchValue method because the form may already
      // have been initialized with the title and content
      // patch value preserves the existing attribute values and only
      // changes or adds the attributes defined in the patchValue() method
      this.form.patchValue({
        image: file
      });

      this.readFileAsImage(file);

      // updateValueAndValidity() will trigger the validators associated
      // with this form control attribute
      this.form.get('image').updateValueAndValidity();

      console.log(file);
      //console.group(this.form);
  }

  private readFileAsImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
