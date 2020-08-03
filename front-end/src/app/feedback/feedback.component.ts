import { Component, OnInit } from '@angular/core';
import { feedbackService } from '../feedback.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feeds=[];
  id;
  submitted=false;
  found;
  constructor(private route:ActivatedRoute,private feedService:feedbackService) { }
  form:FormGroup;
  ngOnInit(): void {

    console.log(this.submitted)

    this.form=new FormGroup({
      likeAdNum: new FormControl(null,{
        validators:[Validators.required]
    }),
    wSeen: new FormControl(null,{
        validators:[Validators.required]
    }),
    aRating: new FormControl(null,{
      validators:[Validators.required]
    }),
    likeSiteNum:new FormControl(null,{
      validators:[Validators.required]
    }),
    useAgain:new FormControl(null,{
      validators:[Validators.required]
    }),
    satisfiedNum:new FormControl(null,{
      validators:[Validators.required]
    })
  })
    this.feedService.getAllFeedbacks();

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      this.id=paramMap.get("id")
      console.log(this.id)
      this.feedService.getAllFeedbacks().subscribe(feeds=>{
        console.log(feeds)
        for(let i=0;i<feeds.length;i++){
          console.log(feeds[i].formId)
          if(feeds[i].formId==this.id){
            this.found=true;

          }else{
            this.found=false;
          }
          if(feeds[i].submit==="1"){
            this.submitted=true;
            console.log("submitted",this.submitted)
          }else{
            this.submitted=false;
          }
        }
        console.log(this.found)
      });

    })

  }
  submit(){
    console.log(this.form.value)
    this.submitted=true;
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      this.id=paramMap.get("id")
      console.log(this.id)
      this.feedService.submitFeedback(this.id,
        this.form.value
        )
    })


  }
//  this.form.value.likeAdNum,
// this.form.value.wSeen,
// this.form.value.aRating,
// this.form.value.likeSiteNum,
// this.form.value.useAgain,
// this.form.value.satisfiedNum
}
