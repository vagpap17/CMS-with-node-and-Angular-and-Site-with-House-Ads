import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { map } from 'rxjs/operators';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  error:string;
  users=[];
  private rating;
  private reviews;
  private currentUser:string;
  private isAdmin:string;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  private userUpdated= new Subject<any>();
  private adminListener=new Subject<any>();
  private currentUserListener=new Subject<any>();
  private currentError=new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}
  getUsersSum(){
    return this.users
  }
  getError(){
    return this.error
  }
  getRating(){
    return this.rating;
  }
  getReviews(){
    return this.reviews;
  }
  getPrivileges(){
    return this.isAdmin

  }
  getCurrentUser(){
    return this.currentUser
  }
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getUserUpdateListener(){
    return this.userUpdated.asObservable();
  }
  getAdminListener(){
    return this.adminListener.asObservable();
  }
  getCurrentUserListner(){
    return this.currentUserListener.asObservable();
  }


  getErrorListener(){
    return this.currentError.asObservable();
  }

  createUser(username: string, password: string,uprivileges:number) {
    const authData: AuthData = { username: username, password: password ,uprivileges:uprivileges};
    this.http
      .post<any>("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        this.currentError.next(response.error)
        this.error=response.error
        if(response.error){
          this.router.navigate(['/signup'])
        }else{
          this.router.navigate(['/users'])
        }

      });
  }
  deleteUser(id:number){
    this.http.delete<any>("http://localhost:3000/api/user/"+id)
    .subscribe(response=>{
      for(let i=0;i<this.users.length;i++){
        if(this.users[i].id==id.toString()){
          var index=this.users.indexOf(this.users[i])
          this.users.splice(index,1)
          this.userUpdated.next([...this.users]);
        }
      }
      this.router.navigate(["/users"])
    })
  }
  getUser(id:string){
    return this.http.get<any>("http://localhost:3000/api/user/"+id).toPromise().then(response=>{

      if(response[0].rating!==0){
        this.rating=(response[0].rating/response[0].ratingCount).toFixed(2);
        this.reviews=response[0].ratingCount
      }else{
        this.rating=0;
        this.reviews=0;
      }


    })
  }
  updateUser(id:string,username:string,uprivileges:string){
   const upUser={
     username:username,
     uprivileges:uprivileges
   }
    this.http
    .put<any>("http://localhost:3000/api/user/"+id,upUser)
    .subscribe(response =>{
      this.currentError.next(response.error)
      this.error=response.error
      if(this.error){
        this.router.navigate(["/users",id])
      }else{
        this.router.navigate(["/users"])
      }

    })
  }
  getUsers(){

    return this.http
      .get<any>("http://localhost:3000/api/user")
      .subscribe(data => {
        for(let i=0;i<data.length;i++){
          if(data[i].rating!==0){
            data[i].rating=(data[i].rating/data[i].ratingCount).toFixed(2);
          }

          //console.log(data[i].rating)
        }
        //console.log(data)
        this.users = data
        this.userUpdated.next([...this.users]);
      });
  }

  login(username: string, password: string) {
    const authData={ username: username, password: password};
    this.http
      .post<any>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        console.log(response)
        const token = response.token;
        this.token = token;

        // //console.log(response)
        if (token) {

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.currentUser=response.user
          this.currentUserListener.next(this.currentUser)
          this.userId = response.userId;
          if(response.privileges=="1"){
            this.isAdmin="1";
            this.adminListener.next("1");
          }else{
            this.isAdmin="2";
            this.adminListener.next("2");
          }
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token,expirationDate, this.userId,response.privileges,response.user);
          this.router.navigate(["/"]);
        }else{
          this.currentError.next(response.error)
          // //console.log(response.error)
          this.error=response.error
          this.router.navigate(["/login"])
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isAdmin=authInformation.privileges
      this.token = authInformation.token;
      this.currentUser=authInformation.user;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.userId = null;
    this.isAuthenticated=false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    //console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string,expirationDate:Date ,userId: string,privileges:string,user:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("privileges",privileges)
    localStorage.setItem("user",user)

  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("privileges")
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const privileges=localStorage.getItem("privileges")
    const user=localStorage.getItem("user")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      privileges:privileges,
      user:user
    }
  }

}
