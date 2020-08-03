import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  currentUser;
  isLoading=false;
  displayedColumns: string[] = ['id', 'username', 'privileges','Actions'];
  dataSource;
  private usersSub:Subscription;
  constructor(private authService:AuthService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.getUsers();
    this.currentUser=this.authService.getCurrentUser();
    this.usersSub=this.authService
    .getUserUpdateListener()
    .subscribe((userData)=>{
      this.isLoading=false;
      this.dataSource=userData
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
          this.dataSource=userData
        })
      }

    });
  }



}
