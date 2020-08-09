import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, NavigationEnd, Router } from '@angular/router';
import { AdsService } from '../ad.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-ad-show',
  templateUrl: './ad-show.component.html',
  styleUrls: ['./ad-show.component.css']
})
export class AdShowComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow

  infoContent = ''
  markers=[]
  submitted=false;
  id;
  ad=[]
  images=[]
  form:FormGroup;
  zoom = 15
  center;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  }
  constructor(private _location: Location,private route:ActivatedRoute,private adService:AdsService,private router:Router) { }
  contactUsVar=false;
  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });

    // console.log(this.submitted)
    this.form=new FormGroup({
        name: new FormControl(null,{
          validators:[Validators.required]
      }),
        email: new FormControl(null,{
          validators:[Validators.required,Validators.email]
      }),
      phone: new FormControl(null,{
        validators:[Validators.required,Validators.pattern("(?:(?:69)[0-9]{8})")]
      })
    })


    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      this.id=paramMap.get("id")
      // console.log(this.id)
      this.adService.getAdData(this.id)
      .subscribe(adData=>{
        let lat=parseFloat(adData[0][0].lat)
        let lng=parseFloat(adData[0][0].lon)
        //console.log(lat,lng)

          this.center = {
            lat: lat,
            lng: lng,
          }

          this.markers.push({
            position: {
              lat: lat,
              lng: lng,
            },
            label: {
              color: 'red',
            },

          })

        //console.log(adData[0])
        this.ad=adData[0]
        this.images=adData[1]
        //console.log(this.ad,this.images)
      })
      // this.resSalesSub=this.adService.getAdsUpdateListener()
      // .subscribe(ads=>{
      //   this.ads=ads
      // })
    })


  }
  backClicked() {
    this._location.back();
  }
  contactUs(){
    this.contactUsVar=!this.contactUsVar
    //console.log(this.contactUsVar)
  }
  onContact(agentid){
    if(this.form.invalid){
      return
      }
    //console.log(agentid)
    this.submitted=true;
    this.adService.saveContact(
      this.form.value.name,
      this.form.value.email,
      this.form.value.phone,
      agentid,
      this.id
    )
  }

  click(event: google.maps.MouseEvent) {
    //console.log(event)
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.infoWindow.open(marker)
  }

}
