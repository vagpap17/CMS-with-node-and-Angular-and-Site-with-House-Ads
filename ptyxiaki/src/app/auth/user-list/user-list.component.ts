import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  search;
  currentUser;
  isLoading=false;
  displayedColumns: string[] = ['id', 'username', 'privileges','Actions','rating','ratingCount','postCount'];
  dataSource;

  private usersSub:Subscription;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private authService:AuthService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.getUsers();
    this.currentUser=this.authService.getCurrentUser();
    this.usersSub=this.authService
    .getUserUpdateListener()
    .subscribe((userData)=>{

      userData.forEach(element => {

        for(let key in element){


            if(key=="postId"){
              if(element[key]==null){
                element.postCount=0;
              }
            }

        }

      });


      //console.log(userData)
      this.isLoading=false;
      this.dataSource=new MatTableDataSource(userData);
      this.dataSource.paginator=this.paginator
      this.dataSource.sort = this.sort;

    })
  }
  onDeleteUser(id:number){
    this.authService.deleteUser(id)
    this.usersSub=this.authService
    .getUserUpdateListener()
    .subscribe((userData)=>{
      this.isLoading=false;
      this.dataSource=userData
    })
  }
  openDialog(id:number): void {
    const dialogRef = this.dialog.open(DialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.authService.deleteUser(id)
        this.usersSub=this.authService
        .getUserUpdateListener()
        .subscribe((userData)=>{
          this.isLoading=false;



        })
      }

    });
  }

  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
