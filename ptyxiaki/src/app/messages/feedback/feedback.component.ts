import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/messages.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  mId;
  constructor(private messageService:MessagesService,private route:ActivatedRoute ) { }
  form:FormGroup
  ngOnInit(): void {
    this.form=new FormGroup({
      find:new FormControl(null,{
        validators:[Validators.required]
      }),
      like:new FormControl(null,{
        validators:[Validators.required]
      })
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      this.mId=paramMap.get("id")
      console.log(this.mId)
    })
  }

}
