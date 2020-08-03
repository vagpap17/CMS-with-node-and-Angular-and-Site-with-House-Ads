import { Injectable } from '@angular/core';


import{Post} from "./post.model";
import { Subject } from 'rxjs';

import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';
import{map} from 'rxjs/operators';
import { AuthService } from './auth/auth.service';


@Injectable({providedIn:'root'})
export class PostsService{
  private posts:Post[]=[];
  private postsUpdated= new Subject<{posts:Post[]}>();
  private images=[];
  private imagesForDelete=[];
  private lat;
  private lon;
  constructor(private http:HttpClient,private router:Router,private AuthService:AuthService){ }

  addImages(images:File[]){
    this.images=images
  }
  addImagesForDelete(images:File[]){
    this.imagesForDelete=images
  }


  getPosts() {
    return this.http
      .get<any>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.map(post => {
            return {
              title: post.title,
              dateAdded: post.dateAdded,
              id: post.post_id,
              description:post.description,
              price:post.price,
              addedBy:post.addedBy,
              btype:post.btype
            };
          });

        })

      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next({posts:[...this.posts]});
      });
  }

  getPost(id:string){
    return this.http.get<any
    >("http://localhost:3000/api/posts/"+id);
  }
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }
  // this.form.value.title,
  // this.form.value.description,
  // this.form.value.location,
  // this.form.value.postal,
  // this.form.value.yearb,
  // this.form.value.address,
  // this.form.value.area,
  // this.form.value.price,
  // this.form.value.adtype,
  // this.form.value.type,
  // this.form.value.bedrooms,
  // this.form.value.bathrooms,
  // this.form.value.floor


  addPost(title:string,description:string,state:string,location:string,postal:string,yearb:string,address:string,addressnum:string,area:string,price:string,adtype:string,type:string,bedrooms:string,bathrooms:string,floor:string){
    console.log(bedrooms,bathrooms)
    const Newpost=new FormData();
    this.getcords(location,address,addressnum,postal).then(()=>{
      Newpost.append("lat",this.lat)
      Newpost.append("lon",this.lon)
      Newpost.append("title",title);
      Newpost.append("description",description);
      Newpost.append("state",state);
      Newpost.append("location",location);
      Newpost.append("postal",postal);
      Newpost.append("yearb",yearb);
      Newpost.append("address",address);
      Newpost.append("addressnum",addressnum)
      Newpost.append("area",area);
      Newpost.append("btype",type);
      Newpost.append("bednum",bedrooms);
      Newpost.append("bathnum",bathrooms);
      Newpost.append("floor",floor);
      Newpost.append("price",price);
      Newpost.append("adtype",adtype);
      Newpost.append("starAd","0")
      Newpost.append("user_id",this.AuthService.getUserId())
      for(let image of this.images){
        Newpost.append('files', image);
      }
      // const Newpost ={
      //   title:title,
      //   description:description,
      //   price:price,
      //   adtype:adtype,
      //   images:this.images
      // }
      console.log(Newpost)
      this.http
      .post<{message:string,post:Post}>(
        "http://localhost:3000/api/posts",Newpost
          )
        .subscribe(responseData=>{

          this.router.navigate(["/show"])
        })
    })

  }

   getcords(location:string,address:string,addressnum:string,postal:string){
    // address="plateia eleutherias"
    var fields=address.split(" ")
    var add1=fields[0]
    var add2=fields[1]
    // postal="60100"
    // addressnum="7"
    return this.http.post<any>(
      "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"+"+add1+"+"+add2+"+"+addressnum+"+"+postal+"+&key=AIzaSyAHfKkEKS0vwsGUF3WC8MenRgkglBJZpQQ",""
    ).toPromise().then(response=>{
      console.log(response)
      console.log(response.results[0].geometry.location.lat,response.results[0].geometry.location.lng)
      this.lat=response.results[0].geometry.location.lat
      this.lon=response.results[0].geometry.location.lng
    })
  }

  updatePost(id:string,title:string,description:string,state:string,location:string,postal:string,yearb:string,address:string,addressnum:string,area:string,price:string,adtype:string,type:string,bedrooms:string,bathrooms:string,floor:string,star:string){
    const Newpost=new FormData();
    console.log(id,title)
    let pstar;
    if(star){
      pstar="1"
    }else{
      pstar="0"
    }
    this.getcords(location,address,addressnum,postal).then(()=>{
      let test={title:title,description:description,state:state,location:location,postal:postal,yearb:yearb,address:address,addressnum:addressnum
        ,area:area,btype:type,bednum:bedrooms,bathnum:bathrooms,floor:floor,price:price,adtype:adtype,starAd:pstar,lat:this.lat,lon:this.lon
      }
      this.http
      .put<{message:string,post:Post}>(
        "http://localhost:3000/api/posts/"+id,test
          )
        .subscribe(responseData=>{
          console.log(responseData)
          this.router.navigate(["/show"])
        })

    })
    // Newpost.append("title",title);
    // Newpost.append("description",description);
    // Newpost.append("state",state);
    // Newpost.append("location",location);
    // Newpost.append("postal",postal);
    // Newpost.append("yearb",yearb);
    // Newpost.append("address",address);
    // Newpost.append("addressnum",addressnum)
    // Newpost.append("area",area);
    // Newpost.append("btype",type);
    // Newpost.append("bednum",bedrooms);
    // Newpost.append("bathnum",bathrooms);
    // Newpost.append("floor",floor);
    // Newpost.append("price",price);
    // Newpost.append("adtype",adtype);

  }
  updateImages(id:string){
    const uploadFiles=new FormData();
    for(let image of this.images){
      uploadFiles.append('files', image);
    }
    for(let image of this.imagesForDelete){
      uploadFiles.append('files',image)
      if(this.imagesForDelete.length>1)
      uploadFiles.append('delete',"more")
    }

    this.http.post<{message:string}>("http://localhost:3000/api/posts/images/"+id,uploadFiles)
    .subscribe(response=>{
      this.router.navigate(["/show"])
    })
  }
  deletePost(id:number){

    this.http
    .delete<{message:string,post:Post}>(
      "http://localhost:3000/api/posts/"+id
        )
      .subscribe(responseData=>{
        for(let i=0;i<this.posts.length;i++){
          if(this.posts[i].id==id.toString()){
            var index=this.posts.indexOf(this.posts[i])
            this.posts.splice(index,1)
            this.postsUpdated.next({posts:[...this.posts]});
          }
        }
        this.router.navigate(["/show"])
      })

  }


}
