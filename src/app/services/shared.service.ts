import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarDetails } from '../common/interfaces/Snackbar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private snackBarSubject: BehaviorSubject<SnackBarDetails> = new BehaviorSubject<SnackBarDetails>({ isSuccess: false , text: ''});

  snackBar$: Observable<SnackBarDetails> = this.snackBarSubject.asObservable();

  showSnackBar(snackBarDetails: SnackBarDetails): void{ 
    this.snackBarSubject.next(snackBarDetails);
  }
}
