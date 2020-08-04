import {NgModule} from "@angular/core";
import {RouterModule,Routes} from "@angular/router";

import{PostListComponent}from "./Posts/post-list/post-list.component"
import{PostCreateComponent}from"./Posts/post-create/post-create.component"
import{DashboardComponent}from"./dashboard/dashboard.component"
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import{AuthGuard} from './auth/auth.guard'
import { UserListComponent } from './auth/user-list/user-list.component';
import { PostEditComponent } from './Posts/post-edit/post-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { FeedbackComponent } from './messages/feedback/feedback.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes:Routes=[
  {path:'',component:DashboardComponent},
  {path:'show',component:PostListComponent,canActivate:[AuthGuard]},
  {path:'create',component:PostCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:postId',component:PostEditComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent,canActivate:[AuthGuard]},
  {path:'users',component:UserListComponent,canActivate:[AuthGuard]},
  {path:'users/:userId',component:SignupComponent,canActivate:[AuthGuard]},
  {path:'messages',component:MessagesComponent,canActivate:[AuthGuard]},
  {path:'messages/:id',component:FeedbackComponent},
  {path:'404',component:NotFoundComponent},
  {path:'**',redirectTo:'404'}

]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule{}
