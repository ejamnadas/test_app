import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { TenantAuthService } from './auth/tenant/tenant-auth.service';


import * as firebase from 'firebase';

interface UserRoles {
  email: string;
  role: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './resources/site.css']
})

export class AppComponent {
  title = 'Mobile Hotel';



  constructor(private authService: AuthService, private tenantAuthService: TenantAuthService) {}
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyC87JhbrxVGMHEUd2pEnUM3jFXxUEantVE",
      authDomain: "hotel-maintenance-9564e.firebaseapp.com"
    });
  }

}
