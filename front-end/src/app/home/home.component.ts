import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { AdsService } from '../ad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() autoSearch: EventEmitter<string> = new EventEmitter<string>();

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();

  Sfilters=[];
  selected;
  selectedL;
  flocations=[]
  mode=false;
  searchText;
  stars=[]
  ads=[]
  starAdsSub:Subscription
  form:FormGroup;
  formC:FormGroup;
  constructor(private adService:AdsService,private route:ActivatedRoute,private router:Router) { }

  states=[{state:"Attikis",id:1},{state:"Thessalonikis",id:2},{state:"Pierias",id:3},{state:"Chalkidikis",id:4},{state:"Imathias",id:5},{state:"Pellas",id:6},{state:"Florinas",id:7},{state:"Iwanninwn",id:8},{state:"Kilkis",id:9},{state:"Serron",id:10}];
  locations=[
  {location:"Neos Kosmos",id:1,lid:1},{location:"Monastiraki",id:1,lid:2},{location:"Dafni",id:1,lid:3},{location:"Syntagma",id:1,lid:4},{location:"Petroupoli",id:1,lid:5}  ,{location:"Omonoia",id:1,lid:6},
  {location:"Aristotelous",id:2,lid:7},{location:"Kalamaria",id:2,lid:8},{location:"Toumpa",id:2,lid:9},{location:"Panorama",id:2,lid:10},{location:"Evosmos",id:2,lid:11}  ,{location:"Stavroupoli",id:2,lid:12},
  {location:"Katerini",id:3,lid:13},{location:"Peristasi",id:3,lid:14},{location:"Korinos",id:3,lid:15},{location:"Paralia",id:3,lid:16},{location:"Skotina",id:3,lid:17}  ,{location:"Andromachi",id:3,lid:18},
  {location:"Ierisos",id:4,lid:19},{location:"Kassandra",id:4,lid:20},{location:"Nea Moudania",id:4,lid:21},
  {location:"Veria",id:5,lid:22},{location:"Nausa",id:5,lid:23},
  {location:"Aridea",id:6,lid:24},{location:"Edesa",id:6,lid:25},{location:"Giannitsa",id:6,lid:26},
  {location:"Aminteo",id:7,lid:27},{location:"Florina",id:7,lid:28},
  {location:"Ioannina",id:8,lid:29},{location:"Konitsa",id:8,lid:30},{location:"Metsovo",id:8,lid:31},
  {location:"Kilkis",id:9,lid:32},{location:"Polukastro",id:9,lid:33},
  {location:"Serres",id:10,lid:34},{location:"Sidirokastro",id:10,lid:35},{location:"Iraklia",id:10,lid:36},
]

  ngOnInit(): void {
    let map: google.maps.Map;

    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 39.173900, lng: 23.344548 },
      zoom: 7
    });


    this.adService.getAllAds();
    this.form=new FormGroup({
      btype: new FormControl(null,{
      }),
      state: new FormControl(null,{
    }),
    location: new FormControl(null,{
    }),
    adtype: new FormControl(null,{
    }),
    minprice: new FormControl(null,{
    }),
    maxprice: new FormControl(null,{
    }),
    bednum: new FormControl(null,{
    }),
    bathnum: new FormControl(null,{
    })

  })
  this.formC=new FormGroup({
    state: new FormControl(null,{
  }),
  location: new FormControl(null,{
  }),
  adtype: new FormControl(null,{
  }),
  minprice: new FormControl(null,{
  }),
  maxprice: new FormControl(null,{
  })

})
this.adService.getAdsUpdateListener().subscribe(ads=>{

  for(let i=0;i<ads.length;i++){
    let lat=parseFloat(ads[i].lat)
    let lng=parseFloat(ads[i].lon)
    console.log(ads)
  var contentString = '<b>'+ads[i].title+'</b>';

      var infowindow = new google.maps.InfoWindow({
      content: contentString
      });

      if(ads[i].btype=="apartment"){
        console.log("bike apartment")
        var marker = new google.maps.Marker({
          position: {lat:lat,
          lng: lng},
          map: map,
          title: 'Uluru (Ayers Rock)',
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }
          });
      }else{
        var marker = new google.maps.Marker({
          position: {lat:lat,
          lng: lng},
          map: map,
          title: 'Uluru (Ayers Rock)',
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
          });
      }

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<p style="font-weight:700">' + ads[i].title +'|' +ads[i].adtype+ '</p><br><p style="font-weight:500">'+ads[i].location+'</p><p>'+ads[i].btype+'|'+ads[i].area+'m²|'+ads[i].price+'€</p><a href="http://localhost:4300/ads/show/'+ads[i].post_id+'">See more</a><br><img style="width:100px;height:100px;"src="'+ads[i].photoname+'">');
        infowindow.open(map, this);
    });

  }


})



    this.adService.getAdStars()
    this.starAdsSub=this.adService.getStarAdsUpdateListener()
    .subscribe(starAds=>{
      this.stars=starAds
    })

  }
  houseMode(){
    this.mode=false
    this.form.reset();
  }
  comMode(){
    this.mode=true;
    this.form.reset();
  }
  citiesSelect(templocation){
    this.form.controls["location"].patchValue("")
    this.flocations=[]
    let foundLocationId;
    for(let i=0;i<this.states.length;i++){
      if(templocation===this.states[i].state){
        foundLocationId=this.states[i].id
      }
    }
    for(let i=0;i<this.locations.length;i++){
      if(this.locations[i].id===foundLocationId){
        this.flocations.push(this.locations[i])
      }
    }
  }
  locationSelect(templocation){

    let foundlocationLid;
    for(let i=0;i<this.locations.length;i++){
      if(templocation===this.locations[i].location){
        foundlocationLid=this.locations[i].lid
      }
    }
  }

  searchHouse(filters: any): void {

    this.adService.searchFiltersHouse(filters)
  }

  redirect(filters:any){

    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key]==="null" || filters[key]==="" ||filters[key]===null) {
        delete filters[key];
      }
    });
    // console.log("FILTERS",filters)

    this.router.navigate(['search'], { queryParams: filters});
  }



}
