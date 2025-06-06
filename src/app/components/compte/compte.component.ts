import { Component } from '@angular/core';

@Component({
  selector: 'app-compte',
  imports: [],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss',
  standalone: true
})
export class CompteComponent {
mdp: string = "";
email: string = "";
datecreated: string = "";
linkQr: string = "";

constructor() {}

ngOnInit(): void {
  

  this.mdp = window.localStorage.getItem('password')!;
  this.email = window.localStorage.getItem('email')!;
  this.datecreated = window.localStorage.getItem('createdAt')!;
  
 // this.linkQr = "https://storage.googleapis.com/mspr-qr-code/qrcodes/"+this.datecreated+'_'+this.email.replace(/[^a-zA-Z0-9]/g, '_')+'.png';
  this.linkQr = "https://storage.googleapis.com/mspr-qr-code/qrcodes/1748949028816_remi_test_fr.png"
}
}
