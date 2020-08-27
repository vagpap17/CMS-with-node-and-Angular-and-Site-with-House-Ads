import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class StyleService{
  private menu;
  private menuUpdated=new Subject<any>()

  constructor(private http: HttpClient){}
  getMenu(){
    return this.menu;
  }
  getMenuUpdated(){
    return this.menuUpdated.asObservable()
  }
  changeMenu(id:string){
    const menuData={
      svalue:id
    }

   this.http.post("http://localhost:3000/api/styles",menuData)
   .subscribe(response=>{
     this.menu=id
     this.menuUpdated.next(id)
   })

  }
  getMenuData(){
    this.http.get("http://localhost:3000/api/styles")
    .subscribe(response=>{
      this.menu=response
      this.menuUpdated.next(response)
    })
  }
}
