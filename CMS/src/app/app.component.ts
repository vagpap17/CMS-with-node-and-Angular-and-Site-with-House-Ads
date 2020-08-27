import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { StyleService } from './style.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService,private styleService:StyleService) {}
  menu;
  ngOnInit() {
    this.styleService.getMenuData()
    this.styleService.getMenuUpdated()
    .subscribe(response=>{
      this.menu=response


    })
    this.authService.autoAuthUser();
  }
}
