import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';



@Injectable({providedIn:'root'})
export class AdsService{
  houseAds=[]
  shopAds=[]
  ads=[]
  starAds=[]
  constructor(private http:HttpClient,private router:Router){  }
  resultsUpdated=new Subject<any>();
  adsUpdated=new Subject<any>();
  starAdsUpdated=new Subject<any>();

  getAdsUpdateListener(){
    return this.adsUpdated.asObservable();
  }
  getStarAdsUpdateListener(){
    return this.starAdsUpdated.asObservable();
  }
  getAllAds(){

    return this.http.get<any>("http://localhost:3000/api/posts/")
   .subscribe(ads=>{
     this.ads=ads
     console.log(ads)
   })

  }
  getAds(adtype:string){
    this.http.get<any>("http://localhost:3000/api/posts/show/"+adtype)
    .subscribe(newAds=>{
      this.ads=newAds
      this.adsUpdated.next([...this.ads])
      console.log("ads",this.ads)
    })
  }
  getAdData(id:string){
    console.log(id)
    return this.http.get<any>("http://localhost:3000/api/posts/"+id)
  }

  getAdStars(){
    return this.http.get<any>("http://localhost:3000/api/posts/stars")
    .subscribe(starAds=>{
      this.starAds=starAds
      this.starAdsUpdated.next([...this.starAds])
    })
  }
  saveContact(cusName:string,cusEmail:string,cusNum:string,conAgent:number,adId:string){
    let data={
      cusName:cusName,
      cusEmail:cusEmail,
      cusNum:cusNum,
      conAgent:conAgent,
      adSelected:adId
    }
    this.http.post("http://localhost:3000/api/user/contact",data)
    .subscribe(response=>{
      console.log(response)
    })

  }

  searchFiltersHouse(filters:any,mode:boolean){
    console.log("filters",filters)
    console.log(mode)
    let houses;
    if(mode===true){
      houses=this.ads.filter(item=>item.btype==="shop")
    }else{
      houses=this.ads.filter(item=>item.btype==="apartment")
    }


    const filteredData = houses.filter( (item) => {
        if(Object.keys(filters).length===0){
          console.log("no filters")
        }else{
          for (let key in filters) {

            console.log(key)
            // console.log(key)

            // console.log(item[key])
            // console.log(item[key])
            if (item[key] === undefined) {
              return false;
            }else if(key==="state"){
              if (key !== null && item[key] !== filters[key]) {
                return false;
              }
            }else if(key==="location"){
              if (key !== null && item[key] !== filters[key]) {
                return false;
              }
            }
            else if (key=="bathnum") {
              console.log("bike bathnum")
              if (key !== null && item[key] > filters[key]) {
                  return false;
              }
            }else if (key=="bednum") {
              console.log("bike bednum")
              if (key !== null && item[key] > filters[key]) {
                  return false;
              }
            }
            else if (key==="price" && filters['price']!=0 ) {
              if (key !== null && item[key] < filters['price']['min'] && filters['price']['min']!==0) {
                console.log("bike min")
                  return false;
              }
              if (key !== null && item[key] >filters['price']['max'] && filters['price']['max']!==0) {
                console.log("bike max")
                return false;
             }

            } else if (!filters[key].includes(item[key])) {
              console.log("bike teleutaio")
              return false;
          }
          }
          return true;
        }

    });
    console.log(filteredData)
    this.houseAds=filteredData
    this.resultsUpdated.next([...this.houseAds])
    this.router.navigate(["/search"])

  }
  getSearchResults(){
    return this.houseAds
  }
  getSearchUpdateListener(){
    return this.resultsUpdated.asObservable();
  }
}
