import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  error:string;
  private errorListener:Subscription
  constructor(public authService: AuthService,private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.username, form.value.password);
    this.error=this.authService.getError()
    this.errorListener=this.authService
    .getErrorListener()
    .subscribe(error=>{
      this.isLoading=false;
      this.error=error
      this.router.navigate(["/login"])
    })
  }
}
