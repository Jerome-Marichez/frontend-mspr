import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  loginUsername: string = '';
  loginPassword: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    // Réinitialiser les messages d'erreur
    this.errorMessage = '';
    
    // Vérification des champs
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Simulation de connexion (à remplacer par un appel API réel)
    this.isLoading = true;
    
    // Simulation d'un délai réseau
    setTimeout(() => {
      console.log('Connexion :', {
        username: this.loginUsername,
        password: this.loginPassword,
        rememberMe: this.rememberMe
      });
      
      this.isLoading = false;
      
      // Redirection vers la page d'accueil après connexion
      this.router.navigate(['/']);
    }, 1000);
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