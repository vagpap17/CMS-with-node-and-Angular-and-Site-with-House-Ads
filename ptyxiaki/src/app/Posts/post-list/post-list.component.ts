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
  privileges;
  search;

  isLoading=false;
  displayedColumns: string[] = ['edit','id', 'Title', 'DateAdded','Time','type','addedBy','Actions'];
  userIsAuthenticated = false;
  dataSource;

  userId:string
  private postsSub:Subscription;
  private authStatusSub: Subscription;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private postsService:PostsService,private authService:AuthService,public dialog: MatDialog) {}

  ngOnInit() {
    this.currentUser=this.authService.getCurrentUser()
    console.log(this.currentUser)
    this.privileges=this.authService.getPrivileges();
    // this.isLoading=true;
    this.postsService.getPosts();

    this.userId = this.authService.getUserId();
    this.postsSub=this.postsService
    .getPostUpdateListener()
    .subscribe((postData:{posts:Post[]})=>{

      for(let i=0;i<postData.posts.length;i++){
        var splited=postData.posts[i].dateAdded.split("T")
        postData.posts[i].dateAdded=splited[0]
        var time=splited[1].split(".")
        postData.posts[i].time=time[0]

      }
      this.dataSource = new MatTableDataSource(postData.posts);
      this.dataSource.paginator = this.paginator;

    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
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


  applyFilter(filterValue: string) {
    this.dataSource.filter = this.search ? this.search.trim().toLowerCase() : '';
  }

}


