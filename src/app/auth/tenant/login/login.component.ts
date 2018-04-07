import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TenantAuthService } from '../tenant-auth.service';
import { Tenant } from '../../../entities/Tenant';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  redirectUrl: string;

  constructor(private tenantAuthService: TenantAuthService
    ) { }

  ngOnInit() {
  }

  onSignin(form: NgForm){
    const tenant: Tenant = { 
        company : form.value.company,
        username: form.value.username,
        id: 0,
        password: form.value.password

    };

    
    this.tenantAuthService.login(tenant);
    //  .subscribe((res) => this.userService.login(res));

    
  }

}
