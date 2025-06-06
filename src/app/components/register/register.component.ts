import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Connexion } from '../../core/login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerEmail: string = '';
  errorMessage: string = '';
  codeTemp: string = "";

  email: string = "";
  password: string = '';
  crypte: string = '';
  qr: string = '';
  createdAt: string = '';
  expired: boolean = false;
  twofa: string = "";

  doubleAuth: boolean = false;

  linkQr: string = '';
  

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() { 
    // Vérification que tous les champs sont remplis
    if (!this.registerEmail) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (!this.registerEmail.includes("@") || !this.registerEmail.includes(".")) {
      this.errorMessage = 'Veuillez renseigner une adresse mail valide';
      return;
    }

    console.log('Inscription :', {
      email: this.registerEmail
    });

    this.authService.inscription(this.registerEmail).subscribe(result => {
      if (result) {
        console.log(result);

        this.email = result.result.email;
        this.password = result.result.password;
        this.crypte = result.result.encryptedPassword;
        this.qr = result.result.qrPath;
        this.createdAt = result.result.createdAt;
        this.expired = result.result.expired;

        this.authService.generate2fa(result.result.email).subscribe(result => {
          if (result) {
            console.log(result);

            this.twofa = result.twofa;

            this.doubleAuth = true;

             // this.linkQr = window.localstorage.getItem('qr');
        this.linkQr = "https://storage.googleapis.com/mspr-qr-code/qrcodes/1748949028816_remi_test_fr.png"
            
          }
        }, (error) => {
          if (error) {
            this.errorMessage = `Erreur serveur de génération du QR Code.`
          }
        })
         
      }
    }, (error) => {
      if (error) {
        this.errorMessage = `Erreur serveur dans l'inscription.`
      }
    })
  }

  complete(pwd: string) {
    const connexion: Connexion = {
      password: pwd,
      twofa: window.localStorage.getItem('2fa')!
    }

    this.authService.connexion(connexion).subscribe(result => {
      if (result) {
         window.localStorage.setItem('email',this.email);
        window.localStorage.setItem('password',this.password);
        window.localStorage.setItem('crypte',this.crypte);
        window.localStorage.setItem('qr',this.qr);
        window.localStorage.setItem('createdAt', this.createdAt);
        window.localStorage.setItem('expired', String(this.expired));
        window.localStorage.setItem('2fa', this.twofa)

        this.router.navigate(['/home'])
      }
    }, (error) => {
      if (error) {
        this.errorMessage = 'Erreur dans la double authentification.'
      }
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
