import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{


  constructor(private dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}


  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }
  proceed(event){
    this.dialogRef.close(event)
  }

}
