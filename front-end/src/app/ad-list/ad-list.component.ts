import { Component, OnInit } from '@angular/core';
import { AdsService } from '../ad.service';
import { Subscription } from 'rxjs';

import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class adListComponent implements OnInit {
  ads=[]
  private resSalesSub:Subscription
  constructor(private adService:AdsService,private route:ActivatedRoute) { }
  mode;
  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      this.mode=paramMap.get("list")
      this.adService.getAds(paramMap.get("list"));
      this.resSalesSub=this.adService.getAdsUpdateListener()
      .subscribe(ads=>{
        this.ads=ads
      })
    })

  }

}
