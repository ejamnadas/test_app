import { UserService } from './user.service';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from './entities/User';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TenantAuthService } from './auth/tenant/tenant-auth.service';


@Injectable()
export class AuthService{

  token: string;
  user: User;
  isLoggedIn = false;
  redirectUrl: string;

  constructor( private httpClient: HttpClient, private userService: UserService,
   private router: Router, private tenantAuthService: TenantAuthService){}

  signupUser(email: string, password: string){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(()=> {
      console.log(email);
      let user = new User();
      user.username = email;
      user.password = password;
      this.userService.addUser(user).subscribe(
       success => {
         console.log('user added to mysql')
       },
       err=> {
         console.log('unable to add user to mysql :' + err)
       }
      )
    })
      .catch(
        error => console.log(error)
      );
  }

  signinUser(email: string, password: string){
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          firebase.auth().currentUser.getToken()
            .then(
              (token: string) => this.token = token
            );
            console.log('logged in');
            console.log(JSON.stringify(firebase.auth().currentUser.email));
            this.userService.getUserByUsername(firebase.auth().currentUser.email)
              .subscribe(
                user=>
                {
                  this.user =  user;
                  console.log('results: ' + JSON.stringify(this.user));
                  this.isLoggedIn = true;
                }, 
                error => console.log('error: ' + error)
              );
              this.router.navigate(['/work-order-list']);
        }
      )
      .catch(
        error=> {
          console.log(error)
          this.isLoggedIn = false;
        }
      )
  }

  logOut(){
    firebase.auth().signOut();
    this.token = null;
    this.user = null;
    this.router.navigate(["/signin"])

  }

  getToken() {
    firebase.auth().currentUser.getToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  isAuthenticated() {
    if(this.tenantAuthService.isAuthenticated()){
      if(this.token != null){
        this.isLoggedIn = true;
      }else{
        this.isLoggedIn = false;
        this.user = null;
      }
    }else{
        this.isLoggedIn = false;
        this.user = null;
    }
    //console.log('isAuthenticated:' + this.isLoggedIn);
    return this.isLoggedIn;
  }
    
}
