import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { Observable, forkJoin } from 'rxjs';
import { IBar, IPost } from '../models';
import { map, concatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  private output: IBar[] = [];
  getUsersPostsCount() {
    return this.userService.getUsers().pipe(
      map((users) => users),
      concatMap((users) => {
        let observables = users.map((user) => {
          return this.postService
            .getPostsByUser(user.id)
            .pipe(map((posts) => posts));
        });
        return forkJoin(observables, (...data) => {
          let posts = data as IPost[][];
          users.forEach((user) => {
            let countPosts = posts.filter((x) =>
              x.filter((i) => i.userId == user.id)
            );
            this.output.push({
              name: user.name,
              value: countPosts.length,
            });
          });
          return this.output;
        });
      })
    );
  }
}
