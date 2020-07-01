import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  allPosts: Post[] = [];
  /* Create a new subject to which subscribers can sunscribe to */
  private allUpdatedPosts = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  addPost(postTitle: string, postContent: string): void {
    const createdOnDate = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const post = { id: null, createdOn: createdOnDate, title: postTitle, content: postContent };
    this.http.post<{ message: string, post: any }>('http://localhost:3000/api/posts', post)
      .pipe(map(response => {
        console.log(response.message);
        return {
          title: response.post.title,
          content: response.post.content,
          id: response.post._id,
          createdOn: response.post.createdOn
        };
      }))
      .subscribe((addedPost: Post) => {
        console.log(addedPost.id);
        this.allPosts.push(addedPost);
        /* Once the newly created post has been updated, update the observable on the subject */
        /* ... creates a copy of an array and returns the elements. Hence the elements need to be wrapped within [] */
        this.allUpdatedPosts.next([...this.allPosts]);
      });
  }

  getPosts(): Observable<Post[]> {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      // convert the data we get from the sever
      // pipe allows us to add any operator for data transformation
      // here the operator being used is the map operator from rsjs/operatprs
      // map operator intercepts the observable from the get call,
      // applies the callback it is associated with and emits the new values as a fresh observable
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            createdOn: post.createdOn
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.allPosts = transformedPosts;
        this.allUpdatedPosts.next([...this.allPosts]);
      });
    return this.allUpdatedPosts.asObservable();
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
