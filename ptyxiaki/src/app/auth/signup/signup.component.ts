import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  error;
  private errorListener:Subscription;
  user;
   mode="create"
  isLoading = false;
  selected;
  userId;
  form:FormGroup
  constructor(public authService: AuthService,public route:ActivatedRoute) {}

  ngOnInit(){
    this.form=new FormGroup({
      username: new FormControl(null,{
        validators:[Validators.required]
    }),
      password: new FormControl(null,{
        validators:[Validators.required]
    }),
    privileges: new FormControl(null,{
      validators:[Validators.required]
    })
  })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has("userId")){
        this.mode="edit";
        this.userId=paramMap.get("userId")
        this.isLoading=true;
        this.authService.getUser(this.userId).then(userData=>{
          this.isLoading=false;
          this.form.setValue({
            username:userData[0].username,
            password:"a",
            privileges:userData[0].uprivileges.toString()
          })
        })
      }

      })

  }
  onSaveUser(){
    if(this.form.invalid){
      return
      }
      this.isLoading=true;
      if(this.mode==="create"){
        this.authService.createUser(
          this.form.value.username,
          this.form.value.password,
          this.form.value.privileges)
          this.errorListener=this.authService
          .getErrorListener()
          .subscribe(error=>{
            this.isLoading=false;
            this.error=error
        })
      }else{
        this.authService.updateUser(
          this.userId,
          this.form.value.username,
          this.form.value.privileges

        )
          this.errorListener=this.authService
          .getErrorListener()
          .subscribe(error=>{
            this.isLoading=false;
            this.error=error
        })
      }

  }

}
