import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Connexion } from '../../core/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginEmail: string = '';
  loginPassword: string = '';
  logintwofa: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  codeTemp: string = "";

  doubleAuth: boolean = false;

  linkQr: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnDestroy() {
    this.doubleAuth = false;
  }

  onLogin() {

    // Réinitialiser les messages d'erreur
    this.errorMessage = '';

    // Vérification des champs
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs svp !';
      return;
    } else if (window.localStorage.getItem('expired') == "true") {
      this.errorMessage = "Il vous faut un nouveau mot de passe ! délai de 6 mois dépassé"
      this.router.navigate(['/register'])

    }

    const log: Connexion = {
      
      password: this.loginPassword,
      twofa: '',
      email: this.loginEmail,
      
    }
    //login avec email + pwd ?

    this.authService.connexion(log).subscribe(result => {
      if (result) {
        console.log(result);

        this.doubleAuth = true;

        // this.linkQr = window.localstorage.getItem('qr');
        this.linkQr = "https://storage.googleapis.com/mspr-qr-code/qrcodes/1748949028816_remi_test_fr.png"
      }
    }, (error) => {
      if (error) {
        this.errorMessage = `Erreur serveur dans la connexion.`
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
        this.router.navigate(['/home'])
      }
    }, (error) => {
      if (error) {
        this.errorMessage = `Erreur dans la double authentification.`
      }
    })
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    // À implémenter : redirection vers la page de récupération de mot de passe
    console.log('Redirection vers récupération de mot de passe');
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}