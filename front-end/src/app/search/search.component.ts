import { Component, OnInit, OnChanges } from '@angular/core';
import { AdsService } from '../ad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  selectedL;
  gParams;
  nfilters;
  flocations=[]
  states=[{state:"Attikis",id:1},{state:"Thessalonikis",id:2},{state:"Pierias",id:3},{state:"Chalkidikis",id:4},{state:"Imathias",id:5},{state:"Pellas",id:6},{state:"Florinas",id:7},{state:"Iwanninwn",id:8},{state:"Kilkis",id:9},{state:"Serron",id:10}];
  locations=[
  {location:"Neos Kosmos",id:1,lid:1},{location:"Monastiraki",id:1,lid:2},{location:"Dafnh",id:1,lid:3},{location:"Syntagma",id:1,lid:4},{location:"Petroupoli",id:1,lid:5}  ,{location:"Omonoia",id:1,lid:6},
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
  selected;
  ads=[]
  status:number;
  mode;
  form:FormGroup;
  searchResult:Observable<any>;
  constructor(private adService:AdsService,private route:ActivatedRoute,private router:Router) { }


  ngOnInit(): void {

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

    this.adService.getAllAds().then(()=>{
      this.route.queryParams
      .subscribe(params => {
        console.log("Params",params);
        if(params.btype==="apartment"){
          this.mode="apartment"
        }else{
          this.mode="commercial"
        }
        this.searchHouse(params)
        this.ads=this.adService.getSearchResults()
        this.status=this.ads.length
        if(params.state){
          this.citiesSelect(params.state)
        }

        Object.keys(params).forEach(key => {
          console.log(key,params[key])
          this.form.patchValue({[key]: params[key]});
          // this.form.get(key).patchValue(params[key])
          this.form.get(key).updateValueAndValidity();
          console.log(this.form.value)
        });


      })
    })

  }


  searchHouse(filters: any): void {
    console.log(filters)
    this.adService.searchFiltersHouse(filters)
  }
  citiesSelect(templocation){
    this.form.controls["location"].patchValue(null)
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
    console.log(templocation)
    let foundlocationLid;
    for(let i=0;i<this.locations.length;i++){
      if(templocation===this.locations[i].location){
        foundlocationLid=this.locations[i].lid
      }
    }
  }
  redirect(filters:any){

    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key]==="null" || filters[key]==="" ||filters[key]===null) {
        delete filters[key];
      }
    });
    console.log("FILTERS",filters)

    this.router.navigate(['search'], { queryParams: filters});
  }
  changeMode(){
    this.mode=this.form.get("btype").value
  }


}
