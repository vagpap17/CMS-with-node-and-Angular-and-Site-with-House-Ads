import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from '../messages.service';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  search;
  array=[];
  displayedColumns: string[] = ['name', 'email', 'number','agent','advertisment','called','feedback'];
  dataSource ;
  bclicked=false;
  size=false;
  form:FormGroup;
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  private messagesSub:Subscription;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private messagesService:MessagesService,private authService:AuthService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      seen: this.fb.array([])
    })
    var id=this.authService.getUserId()
    var pre=this.authService.getPrivileges()
    this.messagesService.getMessages(id,pre)
    this.messagesSub=this.messagesService.getMessagesUpdated()
    .subscribe(data=>{
      if(data.length>0){
        this.size=true;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.array = data
        this.totalSize = this.array.length;

      }else{
        this.size=false;
      }

    })
  }
  clicked(id:number,clicked:boolean){
    this.bclicked=true;
    console.log(clicked)
    const seenArray=<FormArray>this.form.controls.seen;
    if (clicked) {
      seenArray.push(new FormControl(id));
      this.array.push(id)
    } else {
      let index = seenArray.controls.findIndex(x => x.value == id)
      seenArray.removeAt(index);
      this.array.splice(index)
    }
    console.log(this.array)
  }
  onSave(){
    this.messagesService.saveSeen(this.array)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = this.search ? this.search.trim().toLowerCase() : '';
  }
}
