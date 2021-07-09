import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../models';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _url = 'http://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }

  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(this._url + `/${id}`).pipe(
      map((user) => {
        return user;
      }),
      catchError(this.errorHandler)
    );
  }

  createUser(data: IUser) {
    return this.http
      .post<IUser>(this._url, data, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(catchError(this.errorHandler));
  }

  updateUser(data: IUser) {
    return this.http
      .put<IUser>(this._url + `/${data.id}`, data, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(catchError(this.errorHandler));
  }

  deleteUser(id: number) {
    return this.http
      .delete(this._url + `/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }
}
