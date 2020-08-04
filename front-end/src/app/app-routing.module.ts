import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdShowComponent } from './ad-show/ad-show.component';
import {adListComponent} from './ad-list/ad-list.component'
import { SearchComponent } from './search/search.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'ads/:list',component:adListComponent},
  {path:'ads/show/:id',component:AdShowComponent},
  {path:'search/:param',component:SearchComponent},
  {path:'feedback/:id',component:FeedbackComponent},
  // {path:'404',component:NotFoundComponent},
  // {path:'**',redirectTo:'404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
