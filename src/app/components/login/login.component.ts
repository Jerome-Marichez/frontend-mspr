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
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    // Réinitialiser les messages d'erreur
    this.errorMessage = '';
    
    // Vérification des champs
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs svp !';
      return;
    }

    const log: Connexion = {
email: this.loginEmail,
password: this.loginPassword
    }

    this.authService.connexion(log).subscribe(result => {
      if (result) {
        console.log(result);

 // Redirection vers la page d'accueil après connexion
      this.router.navigate(['/']);
        
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