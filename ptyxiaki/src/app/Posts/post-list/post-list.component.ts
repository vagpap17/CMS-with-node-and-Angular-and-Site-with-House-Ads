import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from 'src/app/post.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {  MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  currentUser;
  currentUserId;
  privileges;
  empty=false;
  search;
  postList=[]
  isLoading=false;
  displayedColumns: string[] = ['edit','id', 'Title', 'DateAdded','Time','type','addedBy','Actions'];
  userIsAuthenticated = false;
  dataSource;

  userId:number
  private postsSub:Subscription;
  private authStatusSub: Subscription;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private postsService:PostsService,private authService:AuthService,public dialog: MatDialog) {}

  ngOnInit() {
    this.currentUser=this.authService.getCurrentUser()
    console.log(this.currentUser)
    this.privileges=this.authService.getPrivileges();
    console.log(this.privileges)
    // this.isLoading=true;
    this.postsService.getPosts();

    this.userId = parseInt(this.authService.getUserId());
    console.log(this.userId)
    this.postsSub=this.postsService
    .getPostUpdateListener()
    .subscribe(postData=>{
      console.log(postData)
      console.log(this.privileges)
      if(this.privileges==="1"){
        console.log("mphke admin")
        for(let i=0;i<postData.length;i++){

          var splited=postData[i].dateAdded.split("T")
          postData[i].dateAdded=splited[0]
          var time=splited[1].split(".")
          postData[i].time=time[0]


        }
        this.dataSource = new MatTableDataSource(postData);
        this.dataSource.paginator=this.paginator
      }else{
        for(let i=0;i<postData.length;i++){
          // if(postData.posts[i].)

          if(parseInt(postData[i].user_id)===this.userId){
            console.log("mphke")
            var splited=postData[i].dateAdded.split("T")
            postData[i].dateAdded=splited[0]
            var time=splited[1].split(".")
            postData[i].time=time[0]
            this.postList.push(postData[i])
          }


        }
        if(this.postList.length===0){
          console.log(this.empty)
          this.empty=true;
          console.log(this.empty)
        }
        console.log(this.postList)
        this.dataSource = new MatTableDataSource(this.postList);
        this.dataSource.paginator=this.paginator

      }
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = parseInt(this.authService.getUserId());
      });


  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


  openDialog(id:number): void {
    const dialogRef = this.dialog.open(DialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.postsService.deletePost(id);
          this.postsSub=this.postsService
          .getPostUpdateListener()
          .subscribe((postData:{posts:Post[]})=>{
            this.isLoading=false;
            this.dataSource.data=postData.posts
      })
      }

    });
  }


  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


