import { Injectable } from '@angular/core';
import { catchError, from } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators'


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://smclub.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}


  // Making the api call for the user registration endpoint
public userRegistration(userDetails:any): Observable<any> {
  console.log(userDetails);
  return this.http.post(apiUrl + 'users', userDetails).pipe(
  catchError(this.handleError)
  );
}

//Public login
public userLogin(userDetails:any): Observable<any> {
  return this.http.post(apiUrl+"login?Username="+userDetails.Username+"&Password="+userDetails.Password, null).pipe(
    map(this.extractResponseData),
    tap(data => {
      if (data.user) {
        console.log("user", data.user);
        console.log("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      } else {
        alert("No such user");
      }
    }),
    catchError(this.handleError)
  );
}


getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//Pegar um filme! INFERNO
getOneMovie(title: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}/movies/${title}`, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//Director
getDirector(directorName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}/movies/directors/${directorName}`, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//Genre
getGenre(genreName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}/movies/genre/${genreName}`, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//User
getUser(): Observable<any> {
  const Username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .get(`${apiUrl}/users/${Username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}

//Fav movies
getFavoriteMovies(): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .get(`${apiUrl}/users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
}

//ADD Fav movies
addFavoriteMovie(movieId: string): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .post(
      `${apiUrl}/users/${username}/movies/${movieId}`,
      { FavoriteMovie: movieId },
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    )
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}

//REMOVE FAV
removeFavoriteMovie(movieId: string): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .delete(`${apiUrl}/users/${username}/movies/${movieId}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}

//EDIT USER
editUser(updatedUser: any): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .put(`${apiUrl}/users/${username}`, updatedUser, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}

//DELETEUSER
deleteUser(): Observable<any> {
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http
    .delete(`${apiUrl}/users/${username}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    })
    .pipe(
      map(this.extractResponseData), 
      map(this.extractResponseData),
      catchError(this.handleError)
      );
}


// Non-typed response extraction
private extractResponseData(res: Response | Object): any {
  const body = res;
  return body || { };
}


private handleError(error: HttpErrorResponse): any {
  if (error.error instanceof ErrorEvent) {
  console.error('Some error occurred:', error.error.message);
  } else {
  console.error(
      `Error Status code ${error.status}, ` +
      `Error body is: ${error.error}`);
  }
  return throwError(
  'Something bad happened; please try again later.');
}
}

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor() { }
}
