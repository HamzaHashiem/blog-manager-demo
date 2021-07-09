import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IPost } from '../models';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private _url = 'http://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<IPost[]> {
    return this.http
      .get<IPost[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }

  getPostsByUser(inputUserId: number) {
    return this.http
      .get<IPost[]>(this._url + `?userId=${inputUserId}`)
      .pipe(catchError(this.errorHandler));
  }

  getPost(id: number): Observable<IPost> {
    return this.http.get<IPost>(this._url + `/${id}`).pipe(
      map((post) => {
        return post;
      }),
      catchError(this.errorHandler)
    );
  }

  createPost(data: IPost) {
    return this.http
      .post<IPost>(this._url, data, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(catchError(this.errorHandler));
  }

  updatePost(data: IPost) {
    return this.http
      .put<IPost>(this._url + `/${data.id}`, data, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(catchError(this.errorHandler));
  }

  deletePost(id: number) {
    return this.http
      .delete(this._url + `/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }
}
