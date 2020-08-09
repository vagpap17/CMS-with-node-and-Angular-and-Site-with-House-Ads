import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostsService } from '../post.service';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StyleService } from '../style.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lat = 51.678418;
  lng = 7.809007;
  myPosts=0;
  menu;
  pre;
  id;
  userRating;
  reviews;
  isLoading=true;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  postsSum;
  usersSum;
  customers=[];
  custSum;
  custSub:Subscription;
  usersSub:Subscription;
  postsSub:Subscription;
  menuSub:Subscription;
  currentUser;
  form:FormGroup;

  constructor(private authService:AuthService,private postService:PostsService,private styleService:StyleService,private messagesService:MessagesService) { }

  ngOnInit(): void {
// this.postService.getcords();

        this.form=new FormGroup({
      menup: new FormControl(null,{
        validators:[Validators.required]
    })
  })
  this.userRating=this.authService.getRating();
  this.reviews=this.authService.getReviews();

    this.currentUser=this.authService.getCurrentUser()
    this.id=parseInt(this.authService.getUserId())
    this.pre=this.authService.getPrivileges()
    this.messagesService.getMessages(this.id,this.pre)
    this.custSub=this.messagesService.getMessagesUpdated()
    .subscribe(data=>{
      this.customers=[]
      //console.log(data)
      for(let i=0;i<data.length;i++){
        if(data[i].seen===null){
          //console.log("bike seen")
          this.customers.push(data[i])
        }
      }
      this.custSum=this.customers.length
    })
    this.styleService.getMenuData()
    this.styleService.getMenuUpdated()
    .subscribe(response=>{
      this.menu=response

      this.form.setValue({menup:response.toString()})
    })
    this.authService.getUsers()
    this.usersSub=this.authService
    .getUserUpdateListener()
    .subscribe((userData)=>{
      this.isLoading=false;
      this.usersSum=userData.length
    })
    this.postService.getPosts()
    this.postsSub=this.postService
    .getPostUpdateListener()
    .subscribe((postData:{posts:Post[]})=>{
      for(let i=0;i<postData.posts.length;i++){

        if(postData.posts[i].addedBy==this.id){
          this.myPosts++;
        }
      }
      this.isLoading=false;
      this.postsSum=postData.posts.length
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }
  onSaveMenu(){
    this.styleService.changeMenu(
      this.form.value.menup
    );
  }

}
