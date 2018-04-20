import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { TenantAuthService } from './auth/tenant/tenant-auth.service';


import * as firebase from 'firebase';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
  title = 'Hotel Tasks';



  constructor(private authService: AuthService, private tenantAuthService: TenantAuthService, 
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon(
        'nav_before',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/nav_before_24.svg'))
      .addSvgIcon(
        'add_circle',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/ic_add_circle_black_24px.svg'))
      .addSvgIcon(
        'person_black_24',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/ic_person_black_24px.svg'))
       .addSvgIcon(
        'list_black_24',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/ic_list_black_24px.svg'));
 
        
    }
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyC87JhbrxVGMHEUd2pEnUM3jFXxUEantVE",
      authDomain: "hotel-maintenance-9564e.firebaseapp.com"
    });
  }

}
