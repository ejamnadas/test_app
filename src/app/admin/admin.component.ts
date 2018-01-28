import { Component } from '@angular/core';

@Component({
  template: `
    <h3>Admin</h3>
    <nav>
      <a routerLink="./" routerLinkActive="active"
        [routerLinkActiveOptions]="{exact: true}">Dashoard</a>
      <a routerLink="./reports" routerLinkActive="active">Reports</a>
    <nav>
    <router-outlet></router-outlet>
  `
})

export class AdminComponent {

}
