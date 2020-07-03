import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  allPosts: Post[] = [];
  /* Create a new subject to which subscribers can sunscribe to */
  private allUpdatedPosts = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  addPost(postTitle: string, postContent: string, image: File): void {
    const createdOnDate = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const postData = new FormData();
    postData.append('title', postTitle);
    postData.append('content', postContent);
    postData.append('createdOn', createdOnDate);
    postData.append('image', image, postTitle);
    this.http.post<{ message: string, post: any }>('http://localhost:3000/api/posts', postData)
      .pipe(map(response => {
        console.log(response.message);
        return {
          title: response.post.title,
          content: response.post.content,
          id: response.post._id,
          createdOn: response.post.createdOn,
          imagePath: response.post.imagePath
        };
      }))
      .subscribe((addedPost: Post) => {
        console.log(addedPost.id);
        this.allPosts.push(addedPost);
        /* Once the newly created post has been updated, update the observable on the subject */
        /* ... creates a copy of an array and returns the elements. Hence the elements need to be wrapped within [] */
        this.allUpdatedPosts.next([...this.allPosts]);
        // route to post lists page after adding the new post
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, postTitle: string, postContent: string, image: File | string): void {
    let existingPost: Post = this.allPosts.find(p => p.id === postId);

    let postData: Post | FormData ;

    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', postTitle);
      postData.append('content', postContent);
      postData.append('image', image, postTitle);
    } else {
      postData = { ...existingPost };
      postData.content = postContent;
      postData.title = postContent;
      postData.imagePath = image;
    }

    this.http.put<{ message: string, post: any }>('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe((response) => {
        console.log(response.message);
        existingPost = {
          id: response.post._id,
          title: response.post.title,
          content: response.post.content,
          createdOn: response.post.createdOn,
          imagePath: response.post.imagePath
        };
        this.allUpdatedPosts.next([...this.allPosts]);
        // route to post lists page after updating the existing post
        this.router.navigate(['/']);
      },
        (error) => {
          console.log('Error updating post: ' + error.message);
        });
  }

  getPosts(): Observable<Post[]> {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      // convert the data we get from the sever
      // pipe allows us to add any operator for data transformation
      // here the operator being used is the map operator from rxjs/operatprs
      // map operator intercepts the observable from the get call,
      // applies the callback it is associated with and emits the new values as a fresh observable
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            createdOn: post.createdOn,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts: Post[]) => {
        transformedPosts.forEach(transformedPost => {
          console.log('Fetched post id: ' + transformedPost.id);
          console.log('Post title: ' + transformedPost.title);
          console.log('Post image path: ' + transformedPost.imagePath);
        });
        this.allPosts = transformedPosts;
        this.allUpdatedPosts.next([...this.allPosts]);
      });
    return this.allUpdatedPosts.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, createdOn: string, imagePath: string }>
    ('http://localhost:3000/api/posts/' + postId);
  }

  deletePost(postId: string): void {
    this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe((response) => {
        console.log(response.message);
        const updatedPosts = this.allPosts.filter(post => postId !== post.id);
        this.allPosts = updatedPosts;
        this.allUpdatedPosts.next([...this.allPosts]);
      });
  }
}
