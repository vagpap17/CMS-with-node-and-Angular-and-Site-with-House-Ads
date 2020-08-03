import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({providedIn:'root'})
export class MessagesService{
  private messagesA=[]
  private messagesUpdated=new Subject<any>();
  constructor(private http:HttpClient,private router:Router){}
    getMessages(id:string,privileges:string){
     var user={id:id,privileges:privileges}
      return this.http
        .get<any>("http://localhost:3000/api/messages/"+id+"/"+privileges)
        .subscribe(messages=>{
          this.messagesA=messages;
          this.messagesUpdated.next([...this.messagesA])

        })
    }
    getMessagesUpdated(){
      return this.messagesUpdated.asObservable();
    }
    saveSeen(array){
      console.log(array)
      this.http
      .post<any>("http://localhost:3000/api/messages",array)
      .subscribe(response=>{
        console.log(response)
        this.router.navigate(["/"])
      })
    }
}
