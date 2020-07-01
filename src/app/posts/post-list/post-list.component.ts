import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private postSubscription: Subscription;

  allPosts: Post[] = [];

  postOpenMap: Map<Post, boolean>;

  isLoading = false;

  constructor(public postService: PostService) { }

  ngOnDestroy(): void {
    /* This helps to prevent memory leak when the page has been routed
      and Angular destroys the Post List.
      Open Subscriptions are not automatically destroyed by Angular.
      Hence we have to explicitly unsubscribe during OnDestroy
    */
    this.postSubscription.unsubscribe();
  }

  ngOnInit() {
    this.postOpenMap = new Map();

    this.isLoading = true;
    this.postSubscription = this.postService.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.isLoading = false;
        this.allPosts = posts;
        posts.forEach(post => {
          if (!this.postOpenMap.has(post)) {
            this.postOpenMap.set(post, false);
          }
        });
      }
    });
  }

  onDelete(post: Post): void {
    this.postService.deletePost(post.id);
  }

}
