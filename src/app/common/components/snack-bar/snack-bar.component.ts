import { SnackBarDetails } from './../../interfaces/Snackbar';
import { SharedService } from './../../../services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  isSuccess = false;
  text = '';

  constructor(private readonly sharedService:SharedService){}

  ngOnInit(){
    this.sharedService.snackBar$.subscribe((details: SnackBarDetails)=>{
      this.isSuccess = details.isSuccess;
      this.text = details.text;
    })
  }

}
