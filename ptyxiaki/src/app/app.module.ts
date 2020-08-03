import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import{HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { GoogleMapsModule } from '@angular/google-maps'

import {MatRadioModule} from '@angular/material/radio'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatMenuModule} from '@angular/material/menu'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatCardModule} from '@angular/material/card'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import{MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';



import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { PostListComponent } from './Posts/post-list/post-list.component';
import { PostCreateComponent } from './Posts/post-create/post-create.component';
import {AppRoutingModule} from "./app-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { UserListComponent } from './auth/user-list/user-list.component';
import { PostEditComponent } from './Posts/post-edit/post-edit.component';
import { DialogComponent } from './dialog/dialog.component';
import { MessagesComponent } from './messages/messages.component';
import { FeedbackComponent } from './messages/feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostListComponent,
    PostCreateComponent,DashboardComponent, LoginComponent, SignupComponent, UserListComponent, PostEditComponent, DialogComponent, MessagesComponent, FeedbackComponent
  ],
  imports: [
    GoogleMapsModule,
    FormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatMenuModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatDialogModule,
    MatListModule,


  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
