import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StyleService } from '../style.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menu;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private adminListener:Subscription;
  private currentUserListener:Subscription;
  isAdmin;
  currentUser:string;


  constructor(private authService: AuthService,private styleService:StyleService) {}

  ngOnInit() {
    this.styleService.getMenuData()
    this.styleService.getMenuUpdated()
    .subscribe(response=>{
      this.menu=response
    })
    this.isAdmin=this.authService.getPrivileges();
    this.adminListener=this.authService
    .getAdminListener()
    .subscribe(isAdmin=>{
      this.isAdmin=isAdmin
    })
    this.currentUser=this.authService.getCurrentUser();
    this.currentUserListener=this.authService
    .getCurrentUserListner()
    .subscribe(currentUser=>{
      this.currentUser=currentUser
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });


  }

  onLogout() {
    this.authService.logout();
    this.currentUser=""
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.currentUserListener.unsubscribe();
    this.adminListener.unsubscribe();
  }
}
