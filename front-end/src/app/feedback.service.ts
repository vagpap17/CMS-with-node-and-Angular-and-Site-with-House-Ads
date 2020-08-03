import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class feedbackService{
  feedbackList=[];

  constructor(private http:HttpClient,private router:Router){  }

  getAllFeedbacks(){

    return this.http.get<any>("http://localhost:3000/api/messages/feeds")


  }
  submitFeedback(id:number,newFeedback){

    // likeAdNum:string,wSeen:string,aRating:string,likeSiteNum:string,useAgain:string,satisfiedNum:string
    newFeedback.submit="1"
    this.http
      .put<any>(
        "http://localhost:3000/api/messages/"+id,newFeedback
          )
        .subscribe(responseData=>{

          console.log(responseData)
        })

  }

}
