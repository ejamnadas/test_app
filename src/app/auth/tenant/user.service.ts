import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UserService {

  constructor() { }

    private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn,'second');

      localStorage.setItem('token', authResult.token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
      console.log('setSession complete');
    }
    
    login(authResult){
      this.setSession(authResult);
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    

}
