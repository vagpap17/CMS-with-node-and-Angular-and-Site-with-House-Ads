import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';



@Injectable({providedIn:'root'})
export class AdsService{
  resultAds=[]
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
    .toPromise().then(ads=>{
     this.ads=ads
     console.log("get all ads",ads)
   })

  }
  // getAds(adtype:string){
  //   this.http.get<any>("http://localhost:3000/api/posts/show/"+adtype)
  //   .subscribe(newAds=>{
  //     this.ads=newAds
  //     this.adsUpdated.next([...this.ads])
  //     console.log("ads",this.ads)
  //   })
  // }
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

  searchFiltersHouse(filters:any){
    console.log("filters",filters)
    // console.log(mode)
    var filteredData=this.ads
    let houses=this.ads
    // if(mode===true){
    //   houses=this.ads.filter(item=>item.btype==="shop")
    // }else{
    //   houses=this.ads.filter(item=>item.btype==="apartment")
    // }


  filteredData = houses.filter( (item) => {
        if(Object.keys(filters).length===0){
          console.log("mphke 0")
          filteredData=this.ads
        }else{
          for (let key in filters) {
            // console.log(item["price"],filters[key])

            // if (item[key] === undefined) {
            //   console.log("bike undefined")
            //   return false;
             if(key==="type"){
              if (key !== null && item[key] !== filters[key]) {
                return false;
              }
            }
            else if(key==="state"){
              // console.log("bike state")
              if (key !== null && item[key] !== filters[key]) {
                return false;
              }
            }else if(key==="location"){
              if (key !== null && item[key] !== filters[key]) {
                return false;
              }
            }
            else if (key=="bathnum") {

              if (key !== null && item[key] > filters[key]) {
                  return false;
              }
            }else if (key=="bednum") {

              if (key !== null && item[key] > filters[key]) {
                  return false;
              }
            }
            else if (key=="minprice") {
              // console.log("bike min price")
              if (key !== null && item["price"] < filters[key]) {

                  return false;
              }

            } else  if (key=="maxprice") {
              // console.log("bike max price")
              if (key !== null && item["price"] > filters[key]) {

                return false;
            }
           }


            else if (!filters[key].includes(item[key])) {

              return false;
          }
          }
          return true;
        }

    });
    console.log("filtereddata",filteredData)
    this.resultAds=filteredData
    this.resultsUpdated.next([...this.resultAds])


  }
  getSearchResults(){

      return this.resultAds


  }
  getSearchUpdateListener(){
    return this.resultsUpdated.asObservable();
  }
}
