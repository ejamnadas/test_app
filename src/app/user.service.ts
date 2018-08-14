import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REST_URL } from './config/api_settings';
import { MessageService } from './message.service';
import { User } from './entities/User';
import { TenantAuthService } from './auth/tenant/tenant-auth.service'; 

@Injectable()
export class UserService {
    private log(message: string): void{
        this.messageService.add(message);
    }

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.tenantAuthService.getToken(),
        })
      } 
    
      refresh() : void{
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.tenantAuthService.getToken(),
          })
        }
    } 
      
    
    constructor(private messageService: MessageService, 
        private http: HttpClient, private tenantAuthService: TenantAuthService){}

    getUserByUsername(username: string): Observable<User>{
        return this.http.get<User>( REST_URL + 'work_order_service/getUserByUsername/' + username, this.tenantAuthService.httpOptions).pipe(
            tap(user => console.log('fetched user')),
            catchError(this.handleError<User>('user retrieved'))
        );
        
    }

    addUser(user: User): Observable<User>{
        return this.http.post<User>(REST_URL + 'user_service/add',user, this.tenantAuthService.httpOptions)
            .pipe(
                tap(user=>console.log('UserService.addUser')),
                catchError(this.handleError<User>('user retrieved'))
            );
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
      
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
}