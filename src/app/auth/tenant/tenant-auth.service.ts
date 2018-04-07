import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { REST_URL } from '../../config/api_settings';
import { Tenant } from '../../entities/Tenant';
import * as moment from 'moment'
import { Router } from '@angular/router';
import { MessageService } from '../../message.service';
import { AuthService } from '../../auth.service';

@Injectable()
export class TenantAuthService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken(),
    })
  } 

  refresh() : void{
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken(),
      })
    } 
  }

  constructor(private http: HttpClient, private router: Router,
    private messageService: MessageService) { }

  redirectUrl: string;

  login(tenant: Tenant){

    this.http.post(REST_URL + 'tenant_service', tenant)
    .subscribe((res) => this.setSession(res), 
      err => {
        console.log('Error Logging into company');
        this.messageService.add("Error logging into property. Check username and password and try again.");
      },
      () => this.router.navigate(['/signin']));
  }

  private setSession(authResult) {
    console.log('setSession: authResult: ' + authResult);
    console.log(JSON.stringify(authResult));
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    localStorage.setItem('company', authResult.company);
    this.refresh();
    console.log('setSession complete');
  }

  getCompany(): string{
    return localStorage.getItem("company");
  }
  
  getToken(): string{
    return localStorage.getItem("token");
  }

  logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("company");
     // this.authService.logOut();
      this.router.navigate(['/company-login']);

  }

  public isAuthenticated() {
     // console.log("Is Authenticated");
      //console.log("Moment: " + moment());
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
      return !this.isAuthenticated();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      //console.log("Expires at" + expiresAt);
      return moment(expiresAt);
  }  

}
