import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from 'src/app/post.service';
import { mimeType } from './mime-type.validator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  selected;
  selectedL;
  adtypes="apartment"
  post:Post
  isLoading=false;
  images=[];
  uImages=[];
  status;
  form:FormGroup;
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
postals=[{postal:[11743,11744, 11745, 17234],lid:1},
{postal:[10554, 10555, 10556, 10563],lid:2},
{postal:[11631,11744, 17124, 17234, 17235, 17236, 17237],lid:3},
{postal:[10557, 10558, 10563, 10564, 10671, 10674, 10675, 10676, 10679],lid:4},
{postal:[13231, 13232],lid:5},
{postal:[10431, 10432, 10437, 10438, 10551, 10552, 10553, 10554, 10559, 10564, 10677, 10678],lid:6},
{postal:[54624, 54623, 54631],lid:7},
{postal:[54248, 54646, 55131, 55132, 55133, 55134, 55135],lid:8},
{postal:[54351, 54453, 54454, 54627, 54638,54453, 54454, 54639, 54642, 54643, 54644],lid:9},
{postal:[55236, 55536],lid:10},
{postal:[56224, 56225, 56226, 56238, 56334, 56430, 56431, 56450, 57013],lid:11},
{postal:[56224, 56225, 56429, 56430, 56431, 56436, 56437, 56533, 56535],lid:12},
{postal:[60100,60131, 60132, 60133, 60134],lid:13},
{postal:[60131, 60132, 60133, 60134],lid:14},
{postal:[60062,60150],lid:15},
{postal:[60150],lid:16},
{postal:[60063],lid:17},
{postal:[60150],lid:18},
{postal:[63075],lid:19},
{postal:[63074],lid:20},
{postal:[63200],lid:21},
{postal:[59131, 59132],lid:22},
{postal:[59200],lid:23},
{postal:[58400],lid:24},
{postal:[58200],lid:25},
{postal:[58100],lid:26},
{postal:[53200],lid:27},
{postal:[53100],lid:28},
{postal:[45221, 45222, 45332, 45333, 45444, 45445, 45500],lid:29},
{postal:[44100],lid:30},
{postal:[44200],lid:31},
{postal:[61100],lid:32},
{postal:[61200],lid:33},
{postal:[62121, 62122, 62123, 62124, 62125],lid:34},
{postal:[62300],lid:35},
{postal:[62400],lid:36},

]

  flocations=[]
  fpostals=[]
  private postId:string;
  constructor(private postsService:PostsService,
    private route:ActivatedRoute
    ) { }
  imagePreview:string;
  ngOnInit() {
    this.form=new FormGroup({
      title: new FormControl(null,{
        validators:[Validators.required,Validators.maxLength(30)]
    }),
      description: new FormControl(null,{
        validators:[Validators.required]
    }),
    state: new FormControl(null,{
      validators:[Validators.required]
    }),
    location:new FormControl(null,{
      validators:[Validators.required]
    }),
    postal: new FormControl(null,{
      validators:[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(5),Validators.minLength(5)]
    }),
    yearb: new FormControl(null,{
      validators:[Validators.required,Validators.pattern("(?:(?:19|20)[0-9]{2})")]
    }),
    address: new FormControl(null,{
      validators:[Validators.required,Validators.pattern('[a-zA-Z ]*')]
    }),
    addressnum: new FormControl(null,{
      validators:[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(3)]
    }),
    area: new FormControl(null,{
      validators:[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(5)]
    }),
    price: new FormControl(null,{
      validators:[Validators.required, Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]
    }),
    adtype: new FormControl(null,{
      validators:[Validators.required]
    }),
    type: new FormControl(null,{
      validators:[Validators.required]
    }),
    bedrooms: new FormControl(null,{
      validators:[Validators.required]
    }),
    bathrooms: new FormControl(null,{
      validators:[Validators.required]
    }),
    images:new FormControl(null,{
      validators:[Validators.required],
      asyncValidators:[mimeType]
    }),
    floor:new FormControl(null,{
      validators:[Validators.required,Validators.maxLength(1)],
      asyncValidators:[mimeType]
    })

  });
  this.route.paramMap.subscribe((paramMap:ParamMap)=>{
    if(paramMap.has("postId")){
      this.postId=paramMap.get("postId")
      this.isLoading=true;
      this.postsService.getPost(this.postId).subscribe(postData=>{
        this.isLoading=false;
        this.post={
          id:postData[0][0].id,
          title:postData[0][0].title,
          description:postData[0][0].description,
          price:postData[0][0].price,
          adtype:postData[0][0].adtype,
          dateAdded:null
        }
        this.form.setValue({
          title:this.post.title,
          description:this.post.description,
          price:this.post.price,
          adtype:this.post.adtype,
          images:null
        })



        })
     }
    })


  }



  onSavePost(){
    this.isLoading=true;
    this.status="Submitting the form"
    if(this.form.invalid){
      return
      }
      this.postsService.addImages(
        this.uImages

      )
       console.log(this.adtypes)
      if(this.adtypes==="apartment"){
        this.status="Waiting for response from google API"
      console.log("apartment")
        this.postsService.addPost(
          this.form.value.title,
          this.form.value.description,
          this.form.value.state,
          this.form.value.location,
          this.form.value.postal,
          this.form.value.yearb,
          this.form.value.address,
          this.form.value.addressnum,
          this.form.value.area,
          this.form.value.price,
          this.form.value.adtype,
          this.form.value.type,
          this.form.value.bedrooms,
          this.form.value.bathrooms,
          this.form.value.floor
        )
      }else{
        console.log("shop")

        this.postsService.addPost(

          this.form.value.title,
          this.form.value.description,
          this.form.value.state,
          this.form.value.location,
          this.form.value.postal,
          this.form.value.yearb,
          this.form.value.address,
          this.form.value.addressnum,
          this.form.value.area,
          this.form.value.price,
          this.form.value.adtype,
          this.form.value.type,
          "0",
          "0",
          this.form.value.floor
        )
      }


    }

  onImagePicked(event){
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var file=event.target.files[i];
        this.uImages.push(file);
              var reader = new FileReader();
              reader.onload = (event:any) => {
                 this.images.push(event.target.result);
                 this.form.patchValue({
                    fileSource: this.images
                 });
              }
              reader.readAsDataURL(event.target.files[i]);
      }
    }

  }
  adtype(event){
    this.adtypes=event
    if(this.adtypes!="apartment"){
      this.form.get('bedrooms').setValidators([]); // or clearValidators()
      this.form.get('bedrooms').updateValueAndValidity();
      this.form.get('bathrooms').setValidators([]); // or clearValidators()
      this.form.get('bathrooms').updateValueAndValidity();

    }else{
      this.form.get('bedrooms').setValidators([Validators.required]); // or clearValidators()
      this.form.get('bedrooms').updateValueAndValidity();
      this.form.get('bathrooms').setValidators([Validators.required]); // or clearValidators()
      this.form.get('bathrooms').updateValueAndValidity();
    }
  }
  citiesSelect(templocation){
    this.flocations=[]
    this.fpostals=[]
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
    this.fpostals=[]
    let foundlocationLid;
    for(let i=0;i<this.locations.length;i++){
      if(templocation===this.locations[i].location){
        foundlocationLid=this.locations[i].lid
      }
    }
    console.log(foundlocationLid)
    for(let i=0;i<this.postals.length;i++){
      if(this.postals[i].lid===foundlocationLid){
        for(let j=0;j<this.postals[i].postal.length;j++)
        this.fpostals.push(this.postals[i].postal[j])
      }
    }
    console.log(this.fpostals)
  }

}
