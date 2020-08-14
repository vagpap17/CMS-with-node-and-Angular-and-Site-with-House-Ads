import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostsService } from '../post.service';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StyleService } from '../style.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit {
  myPosts=0;
  menu;
  pre;
  id;
  statisticsSub:Subscription;
  satisfy;

  userRating;
  statistics=[];
  reviews;
  isLoading=true;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  postsSum;
  usersSum;
  customers=[];
  custSum;

  ratingSub:Subscription;
  custSub:Subscription;
  usersSub:Subscription;
  postsSub:Subscription;
  menuSub:Subscription;
  currentUser;
  user
  form:FormGroup;
  map: google.maps.Map;
  ngAfterViewInit(): void{


    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 39.173900, lng: 23.344548 },
      zoom: 7
    });
  }


  constructor(private authService:AuthService,private postService:PostsService,private styleService:StyleService,private messagesService:MessagesService) { }
  ngOnInit(): void {


this.form=new FormGroup({
      menup: new FormControl(null,{
        validators:[Validators.required]
    })
  })

    this.currentUser=this.authService.getCurrentUser()

    this.id=parseInt(this.authService.getUserId())
    this.authService.getUser(this.id).then(()=>{
      this.userRating=this.authService.getRating()
      this.reviews=this.authService.getReviews()
      if(this.userRating>0.01&&this.userRating<1.60){
        this.satisfy="bad"
      }else if(this.userRating>1.61&&this.userRating<3.20){
        this.satisfy="mid"
      }else if(this.userRating>3.21&&this.userRating<5.00)
      this.satisfy="good"
    })



    this.pre=this.authService.getPrivileges()
    this.messagesService.getMessages(this.id,this.pre)
    this.custSub=this.messagesService.getMessagesUpdated()
    .subscribe(data=>{
      this.customers=[]
      //console.log(data)
      for(let i=0;i<data.length;i++){
        if(data[i].seen===null){
          //console.log("bike seen")
          this.customers.push(data[i])
        }
      }
      this.custSum=this.customers.length
    })
    this.styleService.getMenuData()
    this.styleService.getMenuUpdated()
    .subscribe(response=>{
      this.menu=response

      this.form.setValue({menup:response.toString()})
    })
    this.authService.getUsers()
    this.postService.calculateStatistics();
    this.statisticsSub=this.postService.getStatisticsUpdated().subscribe(data=>{
      this.statistics=[data]
      //console.log(this.statistics)
    });

    this.usersSub=this.authService
    .getUserUpdateListener()
    .subscribe((userData)=>{
      this.isLoading=false;
      this.usersSum=userData.length
    })
    this.postService.getPostsForMap()
    this.postsSub=this.postService
    .getPostUpdateListener()
    .subscribe(postData=>{
      //console.log(postData)
      for(let i=0;i<postData.length;i++){
        var contentString = '<b>'+postData[i].title+'</b>';

        if(this.pre=="1"){
          let lat=parseFloat(postData[i].lat)
          let lng=parseFloat(postData[i].lon)

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
            var marker = new google.maps.Marker({
              position: {lat:lat,
              lng: lng},
              map: this.map,
              title: 'Uluru (Ayers Rock)',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#E63946',
                fillOpacity: 1,
                strokeColor: '#E63946',
                strokeOpacity: 0.9,
                strokeWeight: 1,
                scale: 5
            },

              });
              google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<p style="font-weight:700">' + postData[i].title +'|' +postData[i].adtype+ '</p><br><p style="font-weight:500">'+postData[i].location+'</p><p>'+postData[i].btype+'|'+postData[i].area+'m²|'+postData[i].price+'€</p><a href="http://localhost:4200/edit/'+postData[i].post_id+'">Edit</a><br>');
                infowindow.open(this.map, this);
            });

        }
        if(postData[i].user_id==this.id){
          let lat=parseFloat(postData[i].lat)
          let lng=parseFloat(postData[i].lon)
          this.myPosts++;
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
            var marker = new google.maps.Marker({
              position: {lat:lat,
              lng: lng},
              map: this.map,
              title: 'Uluru (Ayers Rock)',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#03369e',
                fillOpacity: 1,
                strokeColor: '#03369e',
                strokeOpacity: 0.9,
                strokeWeight: 1,
                scale: 5
            },
            optimized: false,
            zIndex:99999999
              });
              google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<p style="font-weight:700">' + postData[i].title +'|' +postData[i].adtype+ '</p><br><p style="font-weight:500">'+postData[i].location+'</p><p>'+postData[i].btype+'|'+postData[i].area+'m²|'+postData[i].price+'€</p><a href="http://localhost:4200/edit/'+postData[i].post_id+'">Edit</a><br>');
                infowindow.open(this.map, this);
            });



        }



      }
      this.isLoading=false;
      this.postsSum=postData.length
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }
  onSaveMenu(){
    this.styleService.changeMenu(
      this.form.value.menup
    );
  }

}
